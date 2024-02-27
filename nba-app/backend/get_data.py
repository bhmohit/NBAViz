from nba_api.stats.endpoints import playercareerstats, teamyearbyyearstats
from nba_api.stats.static import players, teams
from .predict import Predict


def get_data(id, type):
    settings = {}
    if type == "team":
        settings["data"] = teamyearbyyearstats.TeamYearByYearStats(team_id=id)
        settings["name"] = teams.find_team_name_by_id(id)
        settings["final_stats"] = settings["data"].get_normalized_dict()["TeamStats"]
        settings["size"] = len(settings["final_stats"])-35
        settings["year_type"] = "YEAR"
    
    elif type == "player":
        settings["data"] = playercareerstats.PlayerCareerStats(player_id=id)
        settings["name"] = players.find_player_by_id(id)
        settings["final_stats"] = settings["data"].get_normalized_dict()["SeasonTotalsRegularSeason"]
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
        labels.append(finStats[i][settings["year_type"]])
        pts.append(finStats[i]["PTS"])
        rebs.append(finStats[i]["REB"])
        asts.append(finStats[i]["AST"])
        stls.append(finStats[i]["STL"])
        blks.append(finStats[i]["BLK"])
        effs.append((pts[i-size] + rebs[i-size] + asts[i-size] + stls[i-size] + blks[i-size] - (finStats[i]["FGA"] - finStats[i]
                    ["FGM"]) - (finStats[i]["FTA"] - finStats[i]["FTM"]) - finStats[i]["TOV"]) / finStats[i]["GP"])
    
    if len(finStats) > 1:
        predict = Predict(df=data.get_data_frames()[0], year_type=settings["year_type"])
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