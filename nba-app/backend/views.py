import redis
import pickle
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
            expiry = 600
            if live_array[-1] == "false":
                expiry = 5 * 60 * 60
            live_array.pop()
            r.set("live", pickle.dumps(live_array, protocol=0), ex=expiry)
        r.close()
        return JsonResponse(live_array, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        live_array = get_live_data()
        live_array.pop()
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

def compare_data(request, type, id1, id2):
    """Compare two players or teams"""
    if type == "team" or type == "player":
        try:
            r = redis.Redis(host="redis", port=6379)
            
            # Get data for first entity
            data1 = None
            if r.exists("{}:{}".format(type, id1)):
                data1 = pickle.loads(r.get("{}:{}".format(type, id1)))
            else:
                data1 = get_data(type, id1)
                r.set("{}:{}".format(type, id1), pickle.dumps(data1, protocol=0))
            
            # Get data for second entity
            data2 = None
            if r.exists("{}:{}".format(type, id2)):
                data2 = pickle.loads(r.get("{}:{}".format(type, id2)))
            else:
                data2 = get_data(type, id2)
                r.set("{}:{}".format(type, id2), pickle.dumps(data2, protocol=0))
            
            r.close()
            
            comparison_data = {
                "entity1": data1,
                "entity2": data2
            }
            
            return JsonResponse(comparison_data, safe=False)
        
        except redis.ConnectionError as e:
            # Handle Redis connection error
            data1 = get_data(type, id1)
            data2 = get_data(type, id2)
            comparison_data = {
                "entity1": data1,
                "entity2": data2
            }
            return JsonResponse(comparison_data, safe=False)
        
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
    
    return JsonResponse({"error": "Invalid type"}, status=400)

def all_players(request):
    """Get all active players for comparison dropdown"""
    try:
        all_players_list = players.get_active_players()
        ret_list = []
        for player in all_players_list:
            obj = {"id": player['id'], "full_name": player['full_name']}
            ret_list.append(obj)
        return JsonResponse(ret_list, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def all_teams(request):
    """Get all teams for comparison dropdown"""
    try:
        all_teams_list = teams.get_teams()
        ret_list = []
        for team in all_teams_list:
            obj = {"id": team['id'], "full_name": team['full_name']}
            ret_list.append(obj)
        return JsonResponse(ret_list, safe=False)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
