import redis
import pickle
from .serializer import PlayerSerializer
from django.http import JsonResponse
from .models import Player
from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
from .predict import Predict


def player_list(request, id):
    r = redis.Redis(host='localhost', port=6379, decode_responses=True)
    if r.exists(id):
        return JsonResponse(pickle.loads(str.encode(r.get(id))), safe=False)
    else:
        career = playercareerstats.PlayerCareerStats(player_id=id)
        predict = Predict(id=id)
        finStats = career.get_normalized_dict()
        finStats = finStats["SeasonTotalsRegularSeason"]
        predictions = predict.predict()
        labels = []
        pts = []
        rebs = []
        asts = []
        stls = []
        blks = []
        name = players.find_player_by_id(id)
        effs = []
        for i in range(len(finStats)):
            labels.append(finStats[i]["SEASON_ID"])
            pts.append(finStats[i]["PTS"])
            rebs.append(finStats[i]["REB"])
            asts.append(finStats[i]["AST"])
            stls.append(finStats[i]["STL"])
            blks.append(finStats[i]["BLK"])
            effs.append((pts[i] + rebs[i] + asts[i] + stls[i] + blks[i] - (finStats[i]["FGA"] - finStats[i]
                        ["FGM"]) - (finStats[i]["FTA"] - finStats[i]["FTM"]) - finStats[i]["TOV"]) / finStats[i]["GP"])
        pts.append(predictions["PTS"])
        rebs.append(predictions["REB"])
        asts.append(predictions["AST"])
        stls.append(predictions["STL"])
        blks.append(predictions["BLK"])
        effs.append((pts[-1] + rebs[-1] + asts[-1] + stls[-1] + blks[-1] - (predictions["FGA"] - predictions
                        ["FGM"]) - (predictions["FTA"] - predictions["FTM"]) - predictions["TOV"]) / predictions["GP"])
        labels.append(str((int(labels[-1][:4])+1))+"-"+str((int(labels[-1][5:])+1))+"(P)")
        finStatsDict = {"PTS": pts, "REB": rebs, "AST": asts,
                        "STL": stls, "BLK": blks, "EFF": effs, "NAME": name["full_name"], "LABELS": labels}
        statsDict = {"data": finStatsDict}
        print(statsDict)
        r.set(id, pickle.dumps(statsDict, protocol=0))
        return JsonResponse(statsDict, safe=False)
