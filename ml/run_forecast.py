import pandas as pd
import matplotlib.pyplot as plt
from forecast import load_pipeline, recursive_forecast_monthly

def main():
    pipe = load_pipeline()
    df = pd.read_csv("data/processed/modeling_dataset_monthly.csv")

    future = recursive_forecast_monthly(
        pipeline=pipe,
        history_df=df,
        park_name="Yosemite",
        horizon=36
    )

    # --- build last 24 actual points (from modeling dataset) ---
    hist = (
        df[df["ParkName"].astype(str).str.strip() == "Yosemite"]
        .sort_values(["Year", "Month"])
        .tail(24)
        .copy()
    )

    # In your file, the actual column is target_visits (after renaming in build script)
    hist["date"] = pd.to_datetime(hist["Year"].astype(str) + "-" + hist["Month"].astype(str) + "-01")
    hist = hist.rename(columns={"target_visits": "actual_visits"})

    # forecast dates
    future["date"] = pd.to_datetime(future["Year"].astype(str) + "-" + future["Month"].astype(str) + "-01")

    # --- plot ---
    plt.figure()
    plt.plot(hist["date"], hist["actual_visits"])
    plt.plot(future["date"], future["predicted_visits"])
    plt.title("Yosemite: Actual (last 24 months) vs Forecast (next 36 months)")
    plt.xlabel("Date")
    plt.ylabel("Visits")
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()

    # save
    future.to_csv("data/processed/yosemite_forecast_36m.csv", index=False)
    print("Saved -> data/processed/yosemite_forecast_36m.csv")

if __name__ == "__main__":
    main()
