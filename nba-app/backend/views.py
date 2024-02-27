import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from nba_api.stats.static import players, teams
from .get_data import get_player_data, get_team_data
import random


def player_list(request, id):
    try:
        r = redis.Redis(host="redis", port=6379)

        if r.exists(id):
            statsDict = pickle.loads(r.get(id))
            return JsonResponse(statsDict, safe=False)
        else:
            statsDict = get_player_data(id)
            r.set(id, pickle.dumps(statsDict, protocol=0))
            return JsonResponse(statsDict, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        return JsonResponse({"error": "Failed to connect to Redis"}, status=500)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": str(e)}, status=500)

def team_list(request, id):
    try:
        r = redis.Redis(host="redis", port=6379)

        if r.exists(id):
            statsDict = pickle.loads(r.get(id))
            return JsonResponse(statsDict, safe=False)
        else:
            statsDict = get_team_data(id)
            r.set(id, pickle.dumps(statsDict, protocol=0))
            return JsonResponse(statsDict, safe=False)

    except redis.ConnectionError as e:
        # Handle Redis connection error
        return JsonResponse({"error": "Failed to connect to Redis"}, status=500)

    except Exception as e:
        # Handle other exceptions
        return JsonResponse({"error": str(e)}, status=500)

def home_page_player_data(request):
    active_players = players.get_active_players()
    ret_list = []
    for i in range(10):
        player = active_players[random.randint(0,len(active_players)-1)]
        obj = {"id": player['id'], "full_name": player['full_name']}
        ret_list.append(obj)
    return JsonResponse(ret_list, safe=False)

def home_page_team_data(request):
    active_teams = teams.get_teams()
    ret_list = []
    for i in range(5):
        team = active_teams[random.randint(0, len(active_teams) - 1)]
        obj = {"id": team['id'], "full_name": team['full_name']}
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