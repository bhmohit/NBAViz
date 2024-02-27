import pandas as pd
from pmdarima import auto_arima
from statsmodels.tsa.arima.model import ARIMA


class Predict:
    def __init__(self, df, year_type):
        self.df = df
        self.year_type = year_type

    def predict(self):
        df = self.df
        df_average = df.groupby(self.year_type)[['FG_PCT', 'FT_PCT']].mean().reset_index()
        df = df.groupby(self.year_type).sum().reset_index()
    
        replacement_mapping = dict(zip(df['FG_PCT'], df_average['FG_PCT']))
        df['FG_PCT'] = df['FG_PCT'].replace(replacement_mapping)
    
        replacement_mapping = dict(zip(df['FT_PCT'], df_average['FT_PCT']))
        df['FT_PCT'] = df['FT_PCT'].replace(replacement_mapping)
    
        df.set_index(self.year_type, inplace=True)
    
        train = df.iloc[:]
    
        stats_to_predict = ["GP", "PTS", "REB", "AST", "STL", "BLK", "FGA", "FGM", "FTA", "FTM", "TOV"]
        output_dict = {}

        for i in range(len(stats_to_predict)):
            column_data = df[stats_to_predict[i]]
                        
            if column_data.isnull().any():
                print(f"Warning: NaN values found in {stats_to_predict[i]} column. Handle or remove them before fitting the model.")
                continue

            if len(column_data) < 3:
                print(f"Warning: Insufficient data points for {stats_to_predict[i]} column. Add more data for accurate predictions.")
                continue

            try:
                fit = auto_arima(column_data, trace=True, suppress_warnings=True)
                model = ARIMA(train[stats_to_predict[i]], order=fit.order)
                model = model.fit()
                index_future_dates = pd.date_range(start=str(int(self.df[self.year_type][len(self.df) - 1][:4])+1), end=str(int(self.df[self.year_type][len(self.df) - 1][:4])+1))
                pred = model.predict(start=len(train), end=len(train), typ='levels')
                pred.index = index_future_dates
                output_dict[stats_to_predict[i]] = int(pred.iloc[-1])
            except Exception as e:
                print(f"Error fitting model for {stats_to_predict[i]}: {e}")
                continue

        return output_dict