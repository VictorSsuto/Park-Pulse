from pathlib import Path
import pandas as pd

INPUT_DIR = Path("data/63 park")
OUTPUT_CSV = Path("data/raw/nps_recreation_visits_monthly.csv")

MONTH_MAP = {
    "JAN": 1, "FEB": 2, "MAR": 3, "APR": 4,
    "MAY": 5, "JUN": 6, "JUL": 7, "AUG": 8,
    "SEP": 9, "OCT": 10, "NOV": 11, "DEC": 12,
}
NEEDED = ["YEAR"] + list(MONTH_MAP.keys())

def normalize_cols(cols):
    return [str(c).strip().upper() for c in cols]

def pick_engine(file_path: Path) -> str | None:
    ext = file_path.suffix.lower()
    if ext == ".xlsx":
        return "openpyxl"
    if ext == ".xls":
        return "xlrd"
    return None

def find_header_row(file_path: Path, engine: str, max_scan_rows: int = 30) -> int | None:
    preview = pd.read_excel(file_path, header=None, nrows=max_scan_rows, engine=engine)
    for i in range(len(preview)):
        row = normalize_cols(preview.iloc[i].tolist())
        if "YEAR" in row and "JAN" in row and "DEC" in row:
            return i
    return None

def read_monthly_table(file_path: Path) -> pd.DataFrame:
    engine = pick_engine(file_path)
    if engine is None:
        raise ValueError(f"Unsupported file extension: {file_path.suffix}")

    # Try normal read
    df_try = pd.read_excel(file_path, engine=engine)
    df_try.columns = normalize_cols(df_try.columns)

    if all(c in df_try.columns for c in NEEDED):
        return df_try

    # Detect header row
    header_row = find_header_row(file_path, engine=engine)
    if header_row is None:
        raise ValueError(f"Could not detect header row in {file_path.name}")

    df = pd.read_excel(file_path, header=header_row, engine=engine)
    df.columns = normalize_cols(df.columns)

    missing = [c for c in NEEDED if c not in df.columns]
    if missing:
        raise ValueError(
            f"{file_path.name} header detected at row {header_row}, but missing: {missing}\n"
            f"Found: {df.columns.tolist()}"
        )
    return df

def main():
    all_parks = []
    bad_files = []

    excel_files = list(INPUT_DIR.glob("*.xlsx")) + list(INPUT_DIR.glob("*.xls"))
    if not excel_files:
        raise FileNotFoundError(f"No Excel files found in {INPUT_DIR.resolve()}")

    for file in excel_files:
        park_name = file.stem.replace("_", " ").strip()

        try:
            df = read_monthly_table(file)
        except Exception as e:
            bad_files.append((file.name, str(e)))
            continue

        df = df[NEEDED].copy()

        df_long = df.melt(
            id_vars=["YEAR"],
            var_name="MonthName",
            value_name="RecreationVisits"
        )

        df_long["Year"] = df_long["YEAR"].astype(int)
        df_long["Month"] = df_long["MonthName"].map(MONTH_MAP)
        df_long["ParkName"] = park_name

        df_long = df_long.dropna(subset=["RecreationVisits"])

        df_long["RecreationVisits"] = (
            df_long["RecreationVisits"]
            .astype(str)
            .str.replace(",", "", regex=False)
            .str.strip()
        )
        df_long = df_long[df_long["RecreationVisits"] != ""]
        df_long["RecreationVisits"] = df_long["RecreationVisits"].astype(float).astype(int)

        all_parks.append(df_long[["ParkName", "Year", "Month", "RecreationVisits"]])

    if not all_parks:
        raise RuntimeError("No valid park files were processed. Check your input files.")

    final_df = pd.concat(all_parks, ignore_index=True)
    OUTPUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    final_df.to_csv(OUTPUT_CSV, index=False)

    print(" Monthly CSV created successfully")
    print("Saved to:", OUTPUT_CSV.resolve())
    print("Rows:", len(inal_df))
    print("Parks processed:", final_df["ParkName"].nunique())

    if bad_files:
        print("\n These files were skipped (re-export them if needed):")
        for name, err in bad_files:
            print(f"- {name}: {err.splitlines()[0]}")

if __name__ == "__main__":
    main()
