# ml/forecast.py
from __future__ import annotations

from pathlib import Path
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).parent / "artifacts" / "monthly_model.joblib"

def load_pipeline():
    return joblib.load(MODEL_PATH)

def month_to_season(month: int) -> str:
    if month in [12, 1, 2]:
        return "winter"
    if month in [3, 4, 5]:
        return "spring"
    if month in [6, 7, 8]:
        return "summer"
    return "fall"

def next_month(year: int, month: int) -> tuple[int, int]:
    if month == 12:
        return year + 1, 1
    return year, month + 1

def recursive_forecast_monthly(
    pipeline,
    history_df: pd.DataFrame,
    park_name: str,
    horizon: int,
) -> pd.DataFrame:
    """
    Recursive multi-step forecast using your exact monthly modeling features.
    """

    # filter to one park and sort
    hist = history_df[history_df["ParkName"] == park_name].copy()
    hist = hist.sort_values(["Year", "Month"]).reset_index(drop=True)

    if len(hist) < 12:
        raise ValueError("Need at least 12 months of history for lag_12.")

    # We'll keep a rolling list of past values (includes predictions)
    values = list(hist["target_visits"].astype(float).values)

    last_year = int(hist.iloc[-1]["Year"])
    last_month = int(hist.iloc[-1]["Month"])

    preds = []

    for _ in range(horizon):
        y, m = next_month(last_year, last_month)

        # Lags from evolving history
        lag_1 = values[-1]
        lag_3 = values[-3]
        lag_12 = values[-12]

        # Rolling means are computed on "previous" values (shift(1)) in your build script
        # For the next month row, the "prev" series is exactly the existing values list.
        roll_mean_3 = sum(values[-3:]) / 3
        roll_mean_6 = sum(values[-6:]) / 6

        row = {
            "ParkName": park_name,
            "Year": y,
            "Month": m,
            "season": month_to_season(m),
            "lag_1": lag_1,
            "lag_3": lag_3,
            "lag_12": lag_12,
            "roll_mean_3": roll_mean_3,
            "roll_mean_6": roll_mean_6,
        }

        X_next = pd.DataFrame([row])
        y_pred = float(pipeline.predict(X_next)[0])

        preds.append({
            "ParkName": park_name,
            "Year": y,
            "Month": m,
            "predicted_visits": y_pred,
        })

        # update history for recursion
        values.append(y_pred)
        last_year, last_month = y, m

    return pd.DataFrame(preds)
