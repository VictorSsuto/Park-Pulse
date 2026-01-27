from fastapi import FastAPI, Query, HTTPException
from pathlib import Path
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware
from functools import lru_cache

app = FastAPI()
PROJECT_ROOT = Path(__file__).resolve().parents[1]
FORECAST_PATH = PROJECT_ROOT / "ml" / "data" / "processed" / "forecast_all_parks_36m.csv"
META_PATH = PROJECT_ROOT / "ml" / "data" / "parks_metadata.csv"

@lru_cache(maxsize=1)
def load_meta_df() -> pd.DataFrame:
    if not META_PATH.exists():
        raise HTTPException(500, f"Metadata file not found: {META_PATH}")
    meta = pd.read_csv(META_PATH)
    meta["ParkName"] = meta["ParkName"].astype(str).str.strip()
    return meta

@lru_cache(maxsize=1)
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
@app.get("/map")
def map_data(index: int = Query(0, ge=0, le=35)):
    """
    Returns ONE row per park for a given forecast step (0..35),
    merged with park coordinates.

    index=0 = first forecast month for each park
    index=35 = last forecast month
    """
    fc = load_forecast_df().copy()
    meta = load_meta_df().copy()

    # sort so "index" means the same thing for every park
    fc = fc.sort_values(["ParkName", "Year", "Month"]).reset_index(drop=True)

    # take nth forecast row per park
    fc_n = fc.groupby("ParkName", as_index=False).nth(index).reset_index()

    # merge coords
    merged = fc_n.merge(meta, on="ParkName", how="left")

    # keep only what frontend needs
    out = merged[
        ["ParkName", "Year", "Month", "predicted_visits", "crowd_level", "Latitude", "Longitude"]
    ].copy()

    # convert to plain types + drop parks missing coords (if any)
    out = out.dropna(subset=["Latitude", "Longitude"])
    records = out.to_dict(orient="records")

    return {"index": index, "count": len(records), "parks": records}

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
