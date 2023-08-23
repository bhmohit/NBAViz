from nba_api.stats.endpoints import playercareerstats
from nba_api.stats.static import players
import pandas as pd
import numpy as np
from pmdarima import auto_arima
import statsmodels.api as sm
from statsmodels.tsa.arima.model import ARIMA


class Predict:
    def __init__(self, id):
        self.id = id

    def predict(self):
        career = playercareerstats.PlayerCareerStats(player_id=self.id)
        # pandas data frames (optional: pip install pandas)
        df = career.get_data_frames()[0]
        df_average = df.groupby('SEASON_ID')[['FG_PCT', 'FT_PCT']].mean().reset_index()
        df = df.groupby('SEASON_ID').sum().reset_index()
        replacement_mapping = dict(zip(df['FG_PCT'], df_average['FG_PCT']))
        df['FG_PCT'] = df['FG_PCT'].replace(replacement_mapping)
        replacement_mapping = dict(zip(df['FT_PCT'], df_average['FT_PCT']))
        df['FT_PCT'] = df['FT_PCT'].replace(replacement_mapping)
        df.set_index("SEASON_ID", inplace=True)
        train = df.iloc[:]
        stats_to_predict = ["GP", "PTS", "REB", "AST", "STL", "BLK", "FGA", "FGM", "FTA", "FTM", "TOV"]
        output_dict = {}
        for i in range(len(stats_to_predict)):
          fit = auto_arima(df[stats_to_predict[i]], trace=True, suppress_warnings=True)
          model = ARIMA(train[stats_to_predict[i]], order=fit.order)
          model = model.fit()
          index_future_dates = pd.date_range(start=str(int(career.get_data_frames()[0]["SEASON_ID"][len(career.get_data_frames()[0]) - 1][:4])+1), end=str(int(career.get_data_frames()[0]["SEASON_ID"][len(career.get_data_frames()[0]) - 1][:4])+1))
          pred = model.predict(start=len(train), end=len(train), typ='levels')
          pred.index = index_future_dates
          output_dict[stats_to_predict[i]] = int(pred.iloc[-1])   
        return output_dict