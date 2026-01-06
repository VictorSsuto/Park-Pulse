import pandas as pd
from pathlib import Path
from forecast import load_pipeline, recursive_forecast_monthly

def main():
    pipe = load_pipeline()

    # Always resolve paths from project root
    PROJECT_ROOT = Path(__file__).resolve().parents[1]
    data_path = PROJECT_ROOT / "data" / "processed" / "modeling_dataset_monthly.csv"
    out_path = PROJECT_ROOT / "data" / "processed" / "forecast_all_parks_36m.csv"

    df = pd.read_csv(data_path)
    df["ParkName"] = df["ParkName"].astype(str).str.strip()

    parks = sorted(df["ParkName"].unique())
    print("Parks:", len(parks))

    all_forecasts = []

    for i, park in enumerate(parks, start=1):
        try:
            future = recursive_forecast_monthly(
                pipeline=pipe,
                history_df=df,
                park_name=park,
                horizon=36
            )
            all_forecasts.append(future)
            if i % 10 == 0 or i == len(parks):
                print(f"Forecasted {i}/{len(parks)}: {park}")
        except Exception as e:
            print(f"Skipping {park} due to error: {e}")

    result = pd.concat(all_forecasts, ignore_index=True)
    result.to_csv(out_path, index=False)
    print(f"\nSaved → {out_path}")
    print("Rows:", len(result))

if __name__ == "__main__":
    main()
