import requests
import pickle
import base64
import os
from dotenv import load_dotenv
from .predict import Predict

def get_live_data():
    body = {"type": "live"}
    response = requests.post(os.getenv('DATA_URL'), json=body)
    if response.status_code >= 500:
        raise Exception
    return pickle.loads(base64.b64decode(response.content))


def get_data(type, id):
    body = {"type": type, "id": id}
    response = requests.post(os.getenv('DATA_URL'), json=body)
    settings = pickle.loads(base64.b64decode(response.content))
    
    if type == "team":
        settings["size"] = len(settings["final_stats"])-35
        settings["year_type"] = "YEAR"
    
    elif type == "player":
        settings["size"] = 0
        settings["year_type"] = "SEASON_ID"
    
    data = settings["data"]
    size = settings["size"]
    finStats = settings["final_stats"]
    
    labels = []
    pts = []
    rebs = []
    asts = []
    stls = []
    blks = []
    effs = []
    
    for i in range(size, len(finStats)):
        if len(labels) != 0 and finStats[i][settings["year_type"]] == labels[-1]:
            pts[-1] += finStats[i]["PTS"]
            rebs[-1] += finStats[i]["REB"]
            asts[-1] += finStats[i]["AST"]
            stls[-1] += finStats[i]["STL"]
            blks[-1] += finStats[i]["BLK"]
            efficiency = (finStats[i]["PTS"] + finStats[i]["REB"] + finStats[i]["AST"] + finStats[i]["STL"] + finStats[i]["BLK"]
                        - (finStats[i]["FGA"] - finStats[i]["FGM"]) - (finStats[i]["FTA"] - finStats[i]["FTM"]) - finStats[i]["TOV"]) / finStats[i]["GP"]
            effs[-1] = round((effs[-1] + efficiency) / 2)
        else:
            labels.append(finStats[i][settings["year_type"]])
            pts.append(finStats[i]["PTS"])
            rebs.append(finStats[i]["REB"])
            asts.append(finStats[i]["AST"])
            stls.append(finStats[i]["STL"])
            blks.append(finStats[i]["BLK"])
            efficiency = (pts[-1] + rebs[-1] + asts[-1] + stls[-1] + blks[-1]
                        - (finStats[i]["FGA"] - finStats[i]["FGM"]) - (finStats[i]["FTA"] - finStats[i]["FTM"]) - finStats[i]["TOV"]) / finStats[i]["GP"]
            effs.append(efficiency)    
    if len(finStats) > 1:
        predict = Predict(df=data, year_type=settings["year_type"])
        predictions = predict.predict()
        pts.append(predictions["PTS"])
        rebs.append(predictions["REB"])
        asts.append(predictions["AST"])
        stls.append(predictions["STL"])
        blks.append(predictions["BLK"])
        effs.append((pts[-1] + rebs[-1] + asts[-1] + stls[-1] + blks[-1] - (predictions["FGA"] - predictions
                                                                            ["FGM"]) - (predictions["FTA"] - predictions["FTM"]) - predictions["TOV"]) / predictions["GP"])
        labels.append(str((int(labels[-1][:4])+1)) +
                      "-"+str((int(labels[-1][5:])+1))+"(P)")
    
    finStatsDict = {"PTS": pts, "REB": rebs, "AST": asts,
                    "STL": stls, "BLK": blks, "EFF": effs, "NAME": settings["name"]["full_name"], "LABELS": labels}
    
    statsDict = {"data": finStatsDict}
    return statsDict