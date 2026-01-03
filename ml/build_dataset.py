from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split

RAW_DATA_PATH = Path("data/raw/nps_recreation_visits_1979_2024.csv")
OUT_DATA_PATH = Path("data/processed/modeling_dataset.csv")


def main() -> None:
    # Load raw data
    df = pd.read_csv(RAW_DATA_PATH)

    # Keep only columns we want for the first model
    df = df[["ParkName", "Region", "Year", "RecreationVisits"]].copy()

    # Sort by time (VERY IMPORTANT for time-based ML)
    df = df.sort_values(["Year"])

    # Rename target for clarity
    df = df.rename(columns={"RecreationVisits": "target_visits"})

    # Drop rows with missing values (defensive)
    df = df.dropna()

    # Save processed dataset
    OUT_DATA_PATH.parent.mkdir(parents=True, exist_ok=True)
    df.to_csv(OUT_DATA_PATH, index=False)

    print("Modeling dataset created.")
    print(f"Saved to: {OUT_DATA_PATH.resolve()}")
    print("\nPreview:")
    print(df.head(10).to_string(index=False))
    print("\nShape:", df.shape)


if __name__ == "__main__":
    main()
