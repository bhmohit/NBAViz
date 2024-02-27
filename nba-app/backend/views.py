import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from nba_api.stats.static import players, teams
from .get_data import get_data
import random


def data_list(request, type, id):
    if type != "team" and type != "player":
        raise Exception
    try:
        r = redis.Redis(host="localhost", port=6379)
        if r.exists(id):
            statsDict = pickle.loads(r.get(id))
            return JsonResponse(statsDict, safe=False)
        else:
            statsDict = get_data(id, type)
            r.set(id, pickle.dumps(statsDict, protocol=0))
            return JsonResponse(statsDict, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        statsDict = get_data(id, type)
        return JsonResponse(statsDict, safe=False)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": str(e)}, status=500)

def home_page_data(request, type):
    if type != 'team' and type != 'player':
        return JsonResponse({"error": "eee"}, status=500)
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