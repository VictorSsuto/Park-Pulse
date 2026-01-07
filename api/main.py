from fastapi import FastAPI, Query, HTTPException
from pathlib import Path
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

PROJECT_ROOT = Path(__file__).resolve().parents[1]
FORECAST_PATH = PROJECT_ROOT / "data" / "processed" / "forecast_all_parks_36m.csv"

def load_forecast_df() -> pd.DataFrame:
    if not FORECAST_PATH.exists():
        raise HTTPException(500, f"Forecast file not found: {FORECAST_PATH}")
    df = pd.read_csv(FORECAST_PATH)
    df["ParkName"] = df["ParkName"].astype(str).str.strip()
    return df

@app.get("/parks")
def parks():
    df = load_forecast_df()
    parks = sorted(df["ParkName"].unique().tolist())
    return {"count": len(parks), "parks": parks}

@app.get("/forecast")
def forecast(
    park: str = Query(...),
    months: int = Query(36, ge=1, le=120),
):
    df = load_forecast_df()

    park_clean = park.strip()
    park_df = df[df["ParkName"].str.lower() == park_clean.lower()].copy()

    if park_df.empty:
        raise HTTPException(404, f"Unknown park '{park}'. Try /parks")

    park_df = park_df.sort_values(["Year", "Month"]).head(months)

    records = park_df[
        ["Year", "Month", "predicted_visits", "crowd_level", "low_threshold", "high_threshold"]
    ].to_dict(orient="records")

    return {"park": park_clean, "months": months, "forecast": records}

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
