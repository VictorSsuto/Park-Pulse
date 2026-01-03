from __future__ import annotations

from pathlib import Path
import pandas as pd

DATA_URL = "https://raw.githubusercontent.com/melaniewalsh/responsible-datasets-in-context/main/datasets/national-parks/US-National-Parks_RecreationVisits_1979-2024.csv"
OUT_PATH = Path("data/raw/nps_recreation_visits_1979_2024.csv")


def main() -> None:
    OUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    print(f"Downloading: {DATA_URL}")
    df = pd.read_csv(DATA_URL)

    #Validate the output 
    expected_cols = {"ParkName", "Year", "RecreationVisits"}
    missing = expected_cols - set(df.columns)
    if missing:
        raise ValueError(f"Missing expected columns: {missing}. Got columns: {list(df.columns)}")

    #Clean types 
    df["Year"] = pd.to_numeric(df["Year"], errors="coerce").astype("Int64")
    df["RecreationVisits"] = pd.to_numeric(df["RecreationVisits"], errors="coerce")

    #drops row that arent good 
    before = len(df)
    df = df.dropna(subset=["ParkName", "Year", "RecreationVisits"])
    after = len(df)
    if after != before:
        print(f"Dropped {before - after} rows with null critical fields")

    df.to_csv(OUT_PATH, index=False)
    print(f"Saved -> {OUT_PATH.resolve()}")
    print("\nPreview:")
    print(df.head(10).to_string(index=False))
    print("\nSummary:")
    print(df.describe(include="all").to_string())


if __name__ == "__main__":
    main()