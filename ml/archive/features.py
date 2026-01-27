import pandas as pd 


def add_time_features(df):
    df["month"] = df["date"].dt.month
    df["day_of_year"] = df["date"].dt.year
    return df

def add_lag_features(df, target="occupancy"):
    df = df.sort_values("date")

    for lag in [1, 2, 3, 12]:
        df[f"lag_{lag}"]=df[target].shift(lag)

        df["roll_mean_3"] = df[target].rolling(3).mean()
        df["roll_mean_6"] = df[target].rolling(6).mean()

    return df

