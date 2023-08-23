import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from nba_api.stats.static import players
from .get_data import get_data
import random


def player_list(request, id):
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    if r.exists(id):
        return JsonResponse(pickle.loads(str.encode(r.get(id))), safe=False)
    else:
        statsDict = get_data(id)
        r.set(id, pickle.dumps(statsDict, protocol=0))
        return JsonResponse(statsDict, safe=False)


def home_page_data(request):
    all_active = players.get_players()
    ret_list = []
    for i in range(10):
        player = all_active[random.randint(0,len(all_active)-1)]
        obj = {"id": player['id'], "full_name": player['full_name']}
        ret_list.append(obj)
    return JsonResponse(ret_list, safe=False)