#Exploratory Data Analysis (EDA) for NPS Recreation Visits Dataset
from pathlib import Path
import pandas as pd

DATA_PATH = Path(__file__).resolve().parent / "data" / "raw" / "nps_recreation_visits_1979_2024.csv"


def main() -> None:
    # Load data
    df = pd.read_csv(DATA_PATH)

    print("=== BASIC INFO ===")
    print(df.info())

    print("\n=== SAMPLE ROWS ===")
    print(df.head(10).to_string(index=False))

    print("\n=== NUMERIC SUMMARY ===")
    print(df[["Year", "RecreationVisits"]].describe().to_string())
    #Total number of unique park
    print("\n=== PARK COUNTS ===")
    print(f"Number of parks: {df['ParkName'].nunique()}")
    
    #When to when is the data being used 
    print("\n=== YEAR RANGE ===")
    print(df["Year"].min(), "→", df["Year"].max())

    print("\n=== TOP 10 MOST VISITED PARKS (ALL TIME) ===")
    top_parks = (
        df.groupby("ParkName")["RecreationVisits"]
        .sum()
        .sort_values(ascending=False)
        .head(10)
    )
    print(top_parks.to_string())


if __name__ == "__main__":
    main()
