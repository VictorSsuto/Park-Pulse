# ml/forecast.py
from __future__ import annotations

from pathlib import Path
import joblib
import pandas as pd

MODEL_PATH = Path(__file__).parent / "artifacts" / "monthly_model.joblib"


def compute_crowd_thresholds(
    park_hist: pd.DataFrame,
    low_q: float = 0.40,
    high_q: float = 0.70,
) -> tuple[float, float]:
    """
    Compute crowding thresholds from park-specific historical data.
    Expects a dataframe already filtered to ONE park with column `target_visits`.
    """
    s = park_hist["target_visits"].astype(float).dropna()
    if len(s) == 0:
        raise ValueError("No target_visits values available to compute thresholds.")

    low_thr = float(s.quantile(low_q))
    high_thr = float(s.quantile(high_q))
    return low_thr, high_thr


def crowd_level_from_thresholds(y: float, low_thr: float, high_thr: float) -> str:
    if y < low_thr:
        return "low"
    if y < high_thr:
        return "medium"
    return "high"

# ---------------------------------------------------------------------
# Model + feature helpers
# ---------------------------------------------------------------------

def load_pipeline():
    """Load trained sklearn Pipeline."""
    return joblib.load(MODEL_PATH)


def month_to_season(month: int) -> str:
    if month in (12, 1, 2):
        return "winter"
    if month in (3, 4, 5):
        return "spring"
    if month in (6, 7, 8):
        return "summer"
    return "fall"


def next_month(year: int, month: int) -> tuple[int, int]:
    if month == 12:
        return year + 1, 1
    return year, month + 1

# ---------------------------------------------------------------------
# Recursive forecasting
# ---------------------------------------------------------------------

def recursive_forecast_monthly(
    pipeline,
    history_df: pd.DataFrame,
    park_name: str,
    horizon: int,
    low_q: float = 0.40,
    high_q: float = 0.70,
) -> pd.DataFrame:
    """
    Recursive multi-step monthly forecast.

    Returns columns:
    - ParkName
    - Year
    - Month
    - predicted_visits
    - crowd_level
    - low_threshold
    - high_threshold
    """

    # --- Filter & clean park history ---
    hist = history_df.copy()
    hist["ParkName"] = hist["ParkName"].astype(str).str.strip()
    park_name_clean = str(park_name).strip()

    hist = hist[hist["ParkName"].str.lower() == park_name_clean.lower()]
    hist = hist.sort_values(["Year", "Month"]).reset_index(drop=True)

    if len(hist) < 12:
        raise ValueError("Need at least 12 months of history for lag_12.")

    # --- Compute crowd thresholds ONCE ---
    low_thr, high_thr = compute_crowd_thresholds(
        hist,
        low_q=low_q,
        high_q=high_q,
    )

    # --- Rolling history values (includes predictions) ---
    values = list(hist["target_visits"].astype(float).values)

    last_year = int(hist.iloc[-1]["Year"])
    last_month = int(hist.iloc[-1]["Month"])

    preds: list[dict] = []

    # --- Recursive forecast loop ---
    for _ in range(horizon):
        y, m = next_month(last_year, last_month)

        # Lag features
        lag_1 = values[-1]
        lag_3 = values[-3]
        lag_12 = values[-12]

        # Rolling means (shift(1) equivalent)
        roll_mean_3 = sum(values[-3:]) / 3
        roll_mean_6 = sum(values[-6:]) / 6

        row = {
            "ParkName": park_name_clean,
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

        preds.append(
            {
                "ParkName": park_name_clean,
                "Year": y,
                "Month": m,
                "predicted_visits": y_pred,
                "crowd_level": crowd_level_from_thresholds(y_pred, low_thr, high_thr),
            }
        )

        # recursion step
        values.append(y_pred)
        last_year, last_month = y, m

    out = pd.DataFrame(preds)
    out["low_threshold"] = low_thr
    out["high_threshold"] = high_thr
    return out
