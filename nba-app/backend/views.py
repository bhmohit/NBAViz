import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from nba_api.stats.static import players, teams
from .get_data import get_data, get_live_data
import random

def live_data(request):
    try:
        live_array = None
        r = redis.Redis(host="redis", port=6379)
        if r.exists("live"):
            live_array = pickle.loads(r.get("live"))
        else:
            live_array = get_live_data()
            expiry = 24 * 60 * 60
            if live_array[-1]:
                expiry = 600
            r.set("live", pickle.dumps(live_array, protocol=0), ex=expiry)
        r.close()
        live_array.pop()
        return JsonResponse(live_array, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        live_array = get_live_data()
        return JsonResponse(live_array, safe=False)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": str(e)}, status=500)
    
def data_list(request, type, id):
    if type == "team" or type == "player":
        try:
            statsDict = None
            r = redis.Redis(host="redis", port=6379)
            if r.exists("{}:{}".format(type, id)):
                statsDict = pickle.loads(r.get("{}:{}".format(type, id)))
            else:
                statsDict = get_data(type, id)
                r.set("{}:{}".format(type, id), pickle.dumps(statsDict, protocol=0))
            r.close()    
            return JsonResponse(statsDict, safe=False)
        
        except redis.ConnectionError as e:
            # Handle Redis connection error
            statsDict = get_data(type, id)
            return JsonResponse(statsDict, safe=False)

        except Exception as e:
            # Handle other exceptions
            return JsonResponse({"error": str(e)}, status=500)
    return JsonResponse({"error": str(e)}, status=500)

def home_page_data(request, type):
    if type == 'team' or type == 'player':
        data = (players.get_active_players(), teams.get_teams())[type == "team"]
        size = (10, 5)[type == "team"]
        ret_list = []
        for i in range(size):
            entity = data[random.randint(0,len(data)-1)]
            obj = {"id": entity['id'], "full_name": entity['full_name']}
            ret_list.append(obj)
        return JsonResponse(ret_list, safe=False)

def search_page_data(request, name):
    active_players_matching_name = players.find_players_by_full_name(name)
    ret_list = []
    for i in range(len(active_players_matching_name)):
        player = active_players_matching_name[i]
        obj = {"id": player['id'], "full_name": player['full_name']}
        ret_list.append(obj)
    return JsonResponse(ret_list, safe=False)