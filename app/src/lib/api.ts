// app/src/lib/api.ts

export type Crowd = "low" | "medium" | "high";

export type ForecastRow = {
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: Crowd;
  low_threshold?: number;
  high_threshold?: number;
};

export type ForecastResponse = {
  park: string;
  months: number;
  forecast: ForecastRow[];
};

export async function getParks(): Promise<{ parks: string[] }> {
  // Static file served from /public/data/parks.json
  const res = await fetch("/data/parks.json", { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to load parks.json (${res.status})`);
  return res.json();
}

function normalizeFileName(park: string) {
  // Must match your forecast filenames in /public/data/forecasts/
  // Example: "Wrangell-St. Elias" -> "wrangell-st-elias"
  return park
    .trim()
    .toLowerCase()
    .replace(/[’ʻ]/g, "'")
    .replace(/['"]/g, "")
    .replace(/&/g, "and")
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export async function getForecast(park: string, months = 36): Promise<ForecastResponse> {
  // Static per-park forecast file
  const file = normalizeFileName(park);
  const res = await fetch(`/data/forecasts/${file}.json`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Missing forecast file for "${park}" -> ${file}.json`);
  const json = await res.json();

  // If your stored JSON already includes months/park/forecast, keep it.
  // If not, adapt here.
  const forecast = Array.isArray(json.forecast) ? json.forecast : (Array.isArray(json) ? json : []);
  return {
    park: json.park ?? park,
    months: json.months ?? months,
    forecast: forecast.slice(0, months),
  };
}
