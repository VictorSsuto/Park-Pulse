#!/usr/bin/env python3
import csv
import glob
import json
import os
from collections import defaultdict
from typing import Dict, Tuple, List, Any

CANONICAL_PARK_NAMES = {
    "acadia": "Acadia",
    "american samoa": "American Samoa",
    "arches": "Arches",
    "badlands": "Badlands",
    "bigbend": "Big Bend",
    "big bend": "Big Bend",
    "biscayne": "Biscayne",
    "black canyon": "Black Canyon of the Gunnison",
    "black canyon of the gunnison": "Black Canyon of the Gunnison",
    "bryce canyon": "Bryce Canyon",
    "canyonsland": "Canyonlands",
    "canyonlands": "Canyonlands",
    "capitolreef": "Capitol Reef",
    "capitol reef": "Capitol Reef",
    "carlsbad caverns": "Carlsbad Caverns",
    "channel islands": "Channel Islands",
    "congaree": "Congaree",
    "crater lake": "Crater Lake",
    "cuyahoga valley": "Cuyahoga Valley",
    "death valley": "Death Valley",
    "denali": "Denali",
    "dry tortugas": "Dry Tortugas",
    "everglades": "Everglades",
    "gates of the arctic": "Gates of the Arctic",
    "gateway arch": "Gateway Arch",
    "glacier": "Glacier",
    "glacier bay": "Glacier Bay",
    "grand canyon": "Grand Canyon",
    "grand teton": "Grand Teton",
    "great basin": "Great Basin",
    "great sand dunes": "Great Sand Dunes",
    "great sand dunes national park": "Great Sand Dunes",
    "great smoky mountains": "Great Smoky Mountains",
    "guadalupe mountains": "Guadalupe Mountains",
    "haleakala": "Haleakalā",
    "haleakalā": "Haleakalā",
    "hawaii volcanoes": "Hawaiʻi Volcanoes",
    "hawai'i volcanoes": "Hawaiʻi Volcanoes",
    "hawaiʻi volcanoes": "Hawaiʻi Volcanoes",
    "hot springs": "Hot Springs",
    "indiana dunes": "Indiana Dunes",
    "isle royalle": "Isle Royale",
    "isle royale": "Isle Royale",
    "joshua tree": "Joshua Tree",
    "katami": "Katmai",
    "katmai": "Katmai",
    "kenai fjords": "Kenai Fjords",
    "kings canyoon": "Kings Canyon",
    "kings canyon": "Kings Canyon",
    "kobuk valley": "Kobuk Valley",
    "lake clark": "Lake Clark",
    "lassen volcanic": "Lassen Volcanic",
    "mammoth cave": "Mammoth Cave",
    "mesa verde": "Mesa Verde",
    "mount rainer": "Mount Rainier",
    "mount rainier": "Mount Rainier",
    "new river gorge": "New River Gorge",
    "north cascades": "North Cascades",
    "olympic": "Olympic",
    "petrified forest": "Petrified Forest",
    "pinnacles": "Pinnacles",
    "redwood": "Redwood",
    "rocky mountain": "Rocky Mountain",
    "saguaro": "Saguaro",
    "sequoia": "Sequoia",
    "shenandoah": "Shenandoah",
    "theodore roosevelt": "Theodore Roosevelt",
    "virgin islands": "Virgin Islands",
    "voyageurs": "Voyageurs",
    "white sands": "White Sands",
    "wind cave": "Wind Cave",
    "wrangell-st elias": "Wrangell-St. Elias",
    "wrangell-st. elias": "Wrangell-St. Elias",
    "yellowstone": "Yellowstone",
    "yosemite": "Yosemite",
    "zion": "Zion",
}

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
METADATA_CSV = os.path.join(APP_DIR, "data", "parks_metadata.csv")
FORECASTS_DIR = os.path.join(APP_DIR, "public", "data", "forecasts")
OUT_FILE = os.path.join(APP_DIR, "public", "data", "map_by_index.json")

MONTHS_TO_EXPORT = 36


def normalize_key(name: str) -> str:
    """
    Returns a canonical ParkName string (the "display" name).
    Use this consistently for BOTH metadata + forecasts.
    """
    if not name:
        return ""

    s = (
        str(name).strip()
        .lower()
        .replace("–", "-")
        .replace("—", "-")
        .replace("ʻ", "'")
        .replace("'", "'")
        .replace(""", '"')
        .replace(""", '"')
        .replace(".", "")
        .replace(",", "")
    )

    # fix common diacritics variants
    s = s.replace("haleakalā", "haleakala")
    s = s.replace("hawaiʻi", "hawai'i")

    # collapse whitespace
    s = " ".join(s.split())

    # canonical aliases
    if s in CANONICAL_PARK_NAMES:
        return CANONICAL_PARK_NAMES[s]

    # Title-case fallback (keeps words readable)
    return " ".join(w.capitalize() for w in s.split())


def load_metadata() -> Dict[str, Tuple[float, float]]:
    if not os.path.exists(METADATA_CSV):
        raise FileNotFoundError(f"Missing metadata CSV: {METADATA_CSV}")

    meta: Dict[str, Tuple[float, float]] = {}

    with open(METADATA_CSV, "r", encoding="utf-8-sig", newline="") as f:
        reader = csv.DictReader(f)
        required = {"ParkName", "Latitude", "Longitude"}
        missing_cols = required - set(reader.fieldnames or [])
        if missing_cols:
            raise ValueError(f"parks_metadata.csv missing columns: {sorted(missing_cols)}")

        for row in reader:
            park = normalize_key(row.get("ParkName", ""))
            lat = str(row.get("Latitude", "")).strip()
            lng = str(row.get("Longitude", "")).strip()
            if not park or not lat or not lng:
                continue
            try:
                meta[park] = (float(lat), float(lng))
            except ValueError:
                print(f"⚠️  Bad coordinates for {park}: lat={lat} lng={lng}")

    return meta


def load_forecasts() -> Dict[str, Dict[str, Any]]:
    if not os.path.isdir(FORECASTS_DIR):
        raise FileNotFoundError(f"Missing forecasts folder: {FORECASTS_DIR}")

    files = glob.glob(os.path.join(FORECASTS_DIR, "*.json"))
    if not files:
        raise FileNotFoundError(f"No forecast JSON files found in: {FORECASTS_DIR}")

    forecasts: Dict[str, Dict[str, Any]] = {}
    for fp in files:
        with open(fp, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except json.JSONDecodeError:
                print(f"⚠️  Invalid JSON: {fp}")
                continue

        park_raw = str(data.get("park", "")).strip()
        if not park_raw:
            park_raw = os.path.splitext(os.path.basename(fp))[0]

        park = normalize_key(park_raw)
        forecasts[park] = data

    return forecasts


def main():
    meta = load_metadata()
    forecasts = load_forecasts()

    months_map: Dict[int, List[dict]] = defaultdict(list)
    missing_meta: List[str] = []
    missing_rows = 0

    base_year = None
    base_month = None

    for park, fdata in forecasts.items():
        rows = fdata.get("forecast", [])
        if not isinstance(rows, list) or not rows:
            print(f"⚠️  No forecast rows for: {park}")
            continue

        if park not in meta:
            missing_meta.append(park)
            continue

        lat, lng = meta[park]

        first = rows[0]
        fy = int(first["Year"])
        fm = int(first["Month"])

        if base_year is None or (fy, fm) < (base_year, base_month):
            base_year, base_month = fy, fm

        for idx, r in enumerate(rows[:MONTHS_TO_EXPORT]):
            try:
                y = int(r["Year"])
                m = int(r["Month"])
                pv = float(r["predicted_visits"])
                cl = str(r["crowd_level"]).lower().strip()
                if cl not in ("low", "medium", "high"):
                    cl = "medium"
            except Exception:
                missing_rows += 1
                continue

            months_map[idx].append(
                {
                    "ParkName": park,
                    "Year": y,
                    "Month": m,
                    "predicted_visits": pv,
                    "crowd_level": cl,
                    "Latitude": lat,
                    "Longitude": lng,
                }
            )

    if base_year is None or base_month is None:
        raise RuntimeError("Could not determine baseYear/baseMonth from forecast files.")

    months_out = [{"index": i, "parks": months_map.get(i, [])} for i in range(MONTHS_TO_EXPORT)]

    out = {"baseYear": base_year, "baseMonth": base_month, "months": months_out}

    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

    print(f"✅ Wrote: {OUT_FILE}")
    print(f"   baseYear={base_year}, baseMonth={base_month}")
    print(f"   months={MONTHS_TO_EXPORT}")

    if missing_meta:
        print("\n⚠️ Missing metadata for these parks:")
        for p in sorted(set(missing_meta)):
            print(" -", p)

    if missing_rows:
        print(f"\n⚠️ Skipped {missing_rows} bad/invalid forecast rows")


if __name__ == "__main__":
    main()