const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export async function getParks(): Promise<{ count: number; parks: string[] }> {
  const res = await fetch(`${API_BASE}/parks`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET /parks failed: ${res.status}`);
  }
  return res.json();
}

export async function getForecast(park: string, months = 36) {
  const url = new URL(`${API_BASE}/forecast`);
  url.searchParams.set("park", park);
  url.searchParams.set("months", String(months));

  const res = await fetch(url.toString(), { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`GET /forecast failed: ${res.status}`);
  }
  return res.json();
}
