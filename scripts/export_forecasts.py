# scripts/export_forecasts.py
import json
import os
import re
import sys
import urllib.request
from urllib.parse import quote
from urllib.error import URLError, HTTPError

API_BASE = os.getenv("PARKPULSE_API_BASE", "http://127.0.0.1:8000").rstrip("/")
OUT_BASE = "app/public/data"
FORECAST_DIR = os.path.join(OUT_BASE, "forecasts")

def slugify(name: str) -> str:
    name = name.strip().lower()
    name = name.replace("&", "and")
    name = re.sub(r"[^a-z0-9]+", "-", name)
    name = re.sub(r"(^-|-$)", "", name)
    return name

def fetch_json(url: str):
    print(f"➡️  fetching {url}")
    try:
        with urllib.request.urlopen(url, timeout=20) as r:
            raw = r.read().decode("utf-8")
            return json.loads(raw)
    except HTTPError as e:
        body = e.read().decode("utf-8", errors="replace") if hasattr(e, "read") else ""
        print(f"❌ HTTPError {e.code} for {url}\n{body}\n")
        raise
    except URLError as e:
        print(f"❌ URLError for {url}: {e}\n")
        raise

def main():
    print("🚀 export_forecasts.py started")
    print(f"API_BASE = {API_BASE}")

    os.makedirs(FORECAST_DIR, exist_ok=True)

    # 1) parks list
    try:
        parks_payload = fetch_json(f"{API_BASE}/parks")
    except Exception:
        print("❗ Could not reach the API. Make sure FastAPI is running, e.g.:")
        print("   uvicorn main:app --reload")
        sys.exit(1)

    parks = parks_payload.get("parks", [])
    if not parks:
        print("❌ No parks returned from /parks. Aborting.")
        sys.exit(1)

    # save parks.json
    parks_path = os.path.join(OUT_BASE, "parks.json")
    os.makedirs(OUT_BASE, exist_ok=True)
    with open(parks_path, "w", encoding="utf-8") as f:
        json.dump(parks_payload, f, ensure_ascii=False)

    print(f"✅ wrote {parks_path} ({len(parks)} parks)")

    # 2) forecasts
    for i, park in enumerate(parks, start=1):
        slug = slugify(park)
        url = f"{API_BASE}/forecast?park={quote(park)}&months=36"

        try:
            data = fetch_json(url)
        except Exception:
            print(f"❌ Failed fetching forecast for park='{park}'. Stopping.")
            sys.exit(1)

        out_path = os.path.join(FORECAST_DIR, f"{slug}.json")
        with open(out_path, "w", encoding="utf-8") as f:
            json.dump(data, f, ensure_ascii=False)

        print(f"✅ [{i}/{len(parks)}] {park} → {out_path}")

    print("\n🎉 All forecasts exported successfully.")
    print(f"Output folder: {FORECAST_DIR}")

if __name__ == "__main__":
    main()
