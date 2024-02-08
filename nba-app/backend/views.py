import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from nba_api.stats.static import players
from .get_data import get_data
import random


def player_list(request, id):
    try:
        r = redis.Redis(host="redis", port=6379)

        if r.exists(id):
            statsDict = pickle.loads(r.get(id))
            return JsonResponse(statsDict, safe=False)
        else:
            statsDict = get_data(id)
            r.set(id, pickle.dumps(statsDict, protocol=0))
            return JsonResponse(statsDict, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        return JsonResponse({"error": "Failed to connect to Redis"}, status=500)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": str(e)}, status=500)

    return HttpResponseNotFound()

def home_page_data(request):
    all_active = players.get_active_players()
    ret_list = []
    for i in range(10):
        player = all_active[random.randint(0,len(all_active)-1)]
        obj = {"id": player['id'], "full_name": player['full_name']}
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