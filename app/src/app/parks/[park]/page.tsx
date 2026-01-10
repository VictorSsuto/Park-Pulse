"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getForecast } from "@/lib/api";

type Crowd = "low" | "medium" | "high" | string;

type ForecastRow = {
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: Crowd;
  low_threshold?: number;
  high_threshold?: number;
};

type ForecastResponse = {
  park: string;
  months: number;
  forecast: ForecastRow[];
};

const PARK_QUOTES: Record<string, string> = {
  Acadia: "Where mountains greet the Atlantic at dawn.",
  "American Samoa": "Where rainforest and reef breathe as one.",
  Arches: "Stone arches sculpted by wind and patience.",
  Badlands: "A land carved by time, wild and uncompromising.",
  "Big Bend": "Vast desert silence beneath endless skies.",
  Biscayne: "Beneath the waves, a hidden wilderness thrives.",
  "Black Canyon of the Gunnison": "Where darkness plunges into breathtaking depth.",
  "Bryce Canyon": "A cathedral of stone carved in light.",
  Canyonlands: "An untamed maze etched by rivers and time.",
  "Capitol Reef": "Desert cliffs folded like a sleeping earth.",
  "Carlsbad Caverns": "A silent kingdom hidden beneath the desert.",
  "Channel Islands": "Wild isles shaped by wind and sea.",
  Congaree: "Ancient forests rising from quiet floodwaters.",
  "Crater Lake": "An impossibly blue mirror of volcanic fire.",
  "Cuyahoga Valley": "Nature reclaiming the rhythm of the land.",
  "Death Valley": "Extreme beauty forged in relentless heat.",
  Denali: "Where the great mountain rules the horizon.",
  "Dry Tortugas": "History and sea meeting at the edge of the Gulf.",
  Everglades: "A slow-moving river of grass and life.",
  "Gates of the Arctic": "Pure wilderness, untouched and uncompromising.",
  "Gateway Arch": "A monument to movement, expansion, and possibility.",
  Glacier: "Ancient ice and alpine silence.",
  "Glacier Bay": "Where ice meets ocean in quiet grandeur.",
  "Grand Canyon": "Vast, timeless, and humbling beyond words.",
  "Grand Teton": "Sharp peaks rising from tranquil valleys.",
  "Great Basin": "Ancient bristlecones beneath star-filled skies.",
  "Great Sand Dunes": "Mountains of sand shaped by wind and wonder.",
  "Great Smoky Mountains": "Mist, mountains, and endless forest breath.",
  "Guadalupe Mountains": "Desert peaks standing firm against time.",
  Haleakala: "A sun-born summit above the clouds.",
  "Hawai'i Volcanoes": "Where the earth creates itself anew.",
  "Hot Springs": "Where healing waters rise from the earth.",
  "Indiana Dunes": "Shifting sands along a freshwater sea.",
  "Isle Royale": "Isolation shaped by water and wilderness.",
  "Joshua Tree": "Where desert and dream converge.",
  Katmai: "Wild rivers, brown bears, and raw power.",
  "Kenai Fjords": "Ice-carved coastlines alive with motion.",
  "Kings Canyon": "Deep valleys guarded by towering stone.",
  "Kobuk Valley": "Endless dunes beneath Arctic skies.",
  "Lake Clark": "Untamed beauty where land and water collide.",
  "Lassen Volcanic": "A restless landscape shaped by fire.",
  "Mammoth Cave": "The world's longest story written underground.",
  "Mesa Verde": "Stone homes whispering stories of the past.",
  "Mount Rainier": "A solitary giant crowned in snow.",
  "New River Gorge": "Ancient river, enduring stone, endless adventure.",
  "North Cascades": "Rugged peaks lost in clouds and quiet.",
  Olympic: "Many worlds woven into one wilderness.",
  "Petrified Forest": "Ancient trees frozen in time and color.",
  Pinnacles: "Volcanic spires alive with motion.",
  Redwood: "Cathedrals of forest rising toward the sky.",
  "Rocky Mountain": "High passes where earth meets sky.",
  Saguaro: "Sentinels of the desert standing tall.",
  Sequoia: "Home to giants older than memory.",
  Shenandoah: "Rolling mountains wrapped in quiet beauty.",
  "Theodore Roosevelt": "Wild lands that shaped a conservation legacy.",
  "Virgin Islands": "Turquoise waters framing tropical serenity.",
  Voyageurs: "A maze of water, sky, and silence.",
  "White Sands": "Dunes of light under an open sky.",
  "Wind Cave": "Hidden patterns beneath the prairie.",
  "Wrangell-St. Elias": "Immensity untouched by human scale.",
  Yellowstone: "Where the earth breathes fire and steam.",
  Yosemite: "Where granite giants sleep beneath endless skies.",
  Zion: "Towering cliffs and quiet reverence in every canyon.",
};

function normalizeParkKey(name: string) {
  return name
    .trim()
    .replace(/[–—]/g, "-")
    .replace(/['ʻ]/g, "'")
    .replace("Haleakalā", "Haleakala")
    .replace("Hawaiʻi", "Hawai'i")
    .replace(/\s+/g, " ");
}

function badgeStyle(level: Crowd) {
  const v = String(level).toLowerCase();
  if (v === "low")
    return {
      bg: "#D1FAE5",
      fg: "#065F46",
      border: "#A7F3D0",
      label: "LOW",
      dotBg: "#10B981",
    };
  if (v === "medium")
    return {
      bg: "#FEF3C7",
      fg: "#92400E",
      border: "#FCD34D",
      label: "MEDIUM",
      dotBg: "#F59E0B",
    };
  return {
    bg: "#FEE2E2",
    fg: "#991B1B",
    border: "#FCA5A5",
    label: "HIGH",
    dotBg: "#EF4444",
  };
}

function fmtMonth(y: number, m: number) {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[m - 1]} ${y}`;
}

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}

export default function ParkPage() {
  const router = useRouter();
  const params = useParams<{ park: string }>();

  const park = useMemo(() => decodeURIComponent(params?.park ?? "").trim(), [params?.park]);

  const quote = useMemo(() => {
    const key = normalizeParkKey(park);
    return PARK_QUOTES[key] ?? "A place of wonder shaped by nature.";
  }, [park]);

  const [months, setMonths] = useState(36);
  const [raw, setRaw] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!park) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        // Loads from /public/data/forecasts/<park>.json via your lib function
        const json = (await getForecast(park)) as ForecastResponse;

        if (!cancelled) setRaw(json);
      } catch (e: any) {
        if (!cancelled) {
          setErr(e?.message ?? "Failed to load forecast");
          setRaw(null);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [park]);

  const data = useMemo<ForecastResponse | null>(() => {
    if (!raw) return null;
    return {
      ...raw,
      months,
      forecast: Array.isArray(raw.forecast) ? raw.forecast.slice(0, months) : [],
    };
  }, [raw, months]);

  const summary = useMemo(() => {
    const rows = data?.forecast ?? [];
    if (!rows.length) return null;

    const counts = rows.reduce(
      (acc, r) => {
        const k = String(r.crowd_level).toLowerCase() as "low" | "medium" | "high";
        if (k === "low" || k === "medium" || k === "high") acc[k] += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 }
    );

    return { counts };
  }, [data]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30"></div>

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          {/* Back Button */}
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 mb-6 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-sm font-bold">Back to Map</span>
          </button>

          <h1 className="text-5xl md:text-6xl font-black mb-4 leading-tight">{park}</h1>

          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl leading-relaxed italic">"{quote}"</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Error Display */}
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="font-bold text-red-900 mb-1">Error Loading Forecast</div>
                <div className="text-red-700">{err}</div>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600 font-semibold">Loading forecast data...</p>
          </div>
        )}

        {/* Summary Cards */}
        {!loading && summary && (
          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="text-sm font-bold text-gray-600 mb-2">Forecast Period</div>
              <div className="text-4xl font-black text-gray-900 mb-1">{data?.forecast.length || 0}</div>
              <div className="text-sm text-gray-600">months ahead</div>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl p-6 shadow-lg border border-emerald-100">
              <div className="text-sm font-bold text-emerald-900 mb-2">Low Crowd</div>
              <div className="text-4xl font-black text-emerald-900 mb-1">{summary.counts.low}</div>
              <div className="text-sm text-emerald-700">quieter months</div>
            </div>

            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 rounded-2xl p-6 shadow-lg border border-amber-100">
              <div className="text-sm font-bold text-amber-900 mb-2">Medium Crowd</div>
              <div className="text-4xl font-black text-amber-900 mb-1">{summary.counts.medium}</div>
              <div className="text-sm text-amber-700">moderate months</div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-6 shadow-lg border border-red-100">
              <div className="text-sm font-bold text-red-900 mb-2">High Crowd</div>
              <div className="text-4xl font-black text-red-900 mb-1">{summary.counts.high}</div>
              <div className="text-sm text-red-700">busy months</div>
            </div>
          </div>
        )}

        {/* Forecast Table */}
        {!loading && data?.forecast?.length ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">Forecast Details</h2>
                <p className="text-sm text-gray-600 mt-1">Monthly predictions based on historical patterns</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-700">Period:</label>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="px-4 py-2 rounded-full border-2 border-emerald-200 bg-white font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent cursor-pointer"
                >
                  <option value={12}>12 months</option>
                  <option value={24}>24 months</option>
                  <option value={36}>36 months</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Month
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Predicted Visits
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-black text-gray-600 uppercase tracking-wider">
                      Crowd Level
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {data.forecast.map((row, idx) => {
                    const badge = badgeStyle(row.crowd_level);
                    return (
                      <tr key={`${row.Year}-${row.Month}-${idx}`} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                            <span className="font-bold text-gray-900">{fmtMonth(row.Year, row.Month)}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-gray-900">{fmtInt(row.predicted_visits)}</span>
                          <span className="text-sm text-gray-500 ml-2">visitors</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm"
                            style={{
                              background: badge.bg,
                              color: badge.fg,
                              border: `2px solid ${badge.border}`,
                            }}
                          >
                            <span className="w-2 h-2 rounded-full" style={{ background: badge.dotBg }} />
                            {badge.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        ) : null}

        {/* No Data Message */}
        {!loading && !err && (!data?.forecast || data.forecast.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                />
              </svg>
            </div>
            <p className="text-gray-600 font-semibold">No forecast data available for this park</p>
          </div>
        )}
      </div>
    </main>
  );
}
