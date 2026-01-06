from pathlib import Path
import pandas as pd

RAW_DATA_PATH = Path("data/raw/nps_recreation_visits_monthly.csv")
OUT_DATA_PATH = Path("data/processed/modeling_dataset_monthly.csv")

def month_to_season(month: int) -> str:
    if month in [12, 1, 2]:
        return "winter"
    if month in [3, 4, 5]:
        return "spring"
    if month in [6, 7, 8]:
        return "summer"
    return "fall"

def main() -> None:
    df = pd.read_csv(RAW_DATA_PATH)

    # Sort per park & time
    df = df.sort_values(["ParkName", "Year", "Month"])

    # Time features
    df["season"] = df["Month"].astype(int).apply(month_to_season)

    # Lag features per park
    group = df.groupby("ParkName")["RecreationVisits"]

    df["lag_1"] = group.shift(1)
    df["lag_3"] = group.shift(3)
    df["lag_12"] = group.shift(12)

    # Rolling features (shift to avoid leakage)
    prev = group.shift(1)
    df["roll_mean_3"] = (
        prev.groupby(df["ParkName"]).rolling(3).mean()
        .reset_index(level=0, drop=True)
    )
    df["roll_mean_6"] = (
        prev.groupby(df["ParkName"]).rolling(6).mean()
        .reset_index(level=0, drop=True)
    )

    # Rename target
    df = df.rename(columns={"RecreationVisits": "target_visits"})

    # Drop rows without enough history
    df = df.dropna()

    OUT_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT_DATA_PATH, index=False)

    print(" Monthly modeling dataset created")
    print("Saved to:", OUT_DATA_PATH.resolve())
    print("Rows:", len(df))
    print(df.head(5).to_string(index=False))

if __name__ == "__main__":
    main()
