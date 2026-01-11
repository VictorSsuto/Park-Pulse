#!/usr/bin/env python3
import csv, json, os, re

APP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
METADATA_CSV = os.path.join(APP_DIR, "data", "parks_metadata.csv")
OUT = os.path.join(APP_DIR, "public", "data", "parks_index.json")

def slug(s: str) -> str:
    s = (s or "").strip().lower()
    s = s.replace("–", "-").replace("—", "-")
    s = re.sub(r"[^a-z0-9]+", "-", s)
    s = re.sub(r"(^-|-$)", "", s)
    return s

parks = []
with open(METADATA_CSV, "r", encoding="utf-8-sig", newline="") as f:
    r = csv.DictReader(f)
    for row in r:
        name = (row.get("ParkName") or "").strip()
        if not name:
            continue
        try:
            lat = float(row["Latitude"])
            lng = float(row["Longitude"])
        except Exception:
            continue
        parks.append({"name": name, "slug": slug(name), "lat": lat, "lng": lng})

parks = sorted(parks, key=lambda p: p["name"])

os.makedirs(os.path.dirname(OUT), exist_ok=True)
with open(OUT, "w", encoding="utf-8") as f:
    json.dump(parks, f, ensure_ascii=False, indent=2)

print("✅ wrote", OUT, "parks:", len(parks))
