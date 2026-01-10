"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import ParkSearch from "@/components/ParkSearch";

type ParkPoint = {
  ParkName: string;
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: "low" | "medium" | "high";
  Latitude: number;
  Longitude: number;
};

type Focus = { lat: number; lng: number; zoom?: number };

const HomeMap = dynamic(() => import("@/components/HomeMap"), { ssr: false });

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://127.0.0.1:8000";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function ymToSerial(year: number, month1to12: number) {
  return year * 12 + (month1to12 - 1);
}

function normalizeParkName(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/['ʻ]/g, "'")
    .replace(/\s+/g, " ");
}

export default function Home() {
  const [park, setPark] = useState("");
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState<ParkPoint[]>([]);
  const [focus, setFocus] = useState<Focus | null>(null);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [baseYear, setBaseYear] = useState<number | null>(null);
  const [baseMonth, setBaseMonth] = useState<number | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API_BASE}/map?index=${index}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Map fetch failed: ${res.status}`);

        const data = await res.json();
        const parks: ParkPoint[] = data.parks ?? [];
        setPoints(parks);

        if (baseYear == null && baseMonth == null && parks.length > 0) {
          setBaseYear(parks[0].Year);
          setBaseMonth(parks[0].Month);
        }
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load map data");
        setPoints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [index, baseYear, baseMonth]);

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!pickerOpen) return;
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  const currentLabel = useMemo(() => {
    if (!points.length) return "Pick month";
    const y = points[0].Year;
    const m = clamp(points[0].Month, 1, 12);
    return `${MONTHS[m - 1]} ${y}`;
  }, [points]);

  const currentMonthValue = useMemo(() => {
    if (!points.length) return "";
    const y = points[0].Year;
    const m = clamp(points[0].Month, 1, 12);
    return `${y}-${String(m).padStart(2, "0")}`;
  }, [points]);

  const minMonthValue = useMemo(() => {
    if (baseYear == null || baseMonth == null) return "";
    return `${baseYear}-${String(baseMonth).padStart(2, "0")}`;
  }, [baseYear, baseMonth]);

  const maxMonthValue = useMemo(() => {
    if (baseYear == null || baseMonth == null) return "";
    const maxSerial = ymToSerial(baseYear, baseMonth) + 35;
    const maxYear = Math.floor(maxSerial / 12);
    const maxMonth = (maxSerial % 12) + 1;
    return `${maxYear}-${String(maxMonth).padStart(2, "0")}`;
  }, [baseYear, baseMonth]);

  function setIndexFromYearMonth(year: number, month1to12: number) {
    if (baseYear == null || baseMonth == null) return;
    const base = ymToSerial(baseYear, baseMonth);
    const chosen = ymToSerial(year, month1to12);
    setIndex(clamp(chosen - base, 0, 35));
  }

  function zoomToSelectedPark(selected: string) {
    const sel = normalizeParkName(selected);
    const hit = points.find((p) => normalizeParkName(p.ParkName) === sel);
    if (!hit) return;

    setFocus({ lat: hit.Latitude, lng: hit.Longitude, zoom: 7 });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-30" />

        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 mb-6">
            <span className="text-sm font-bold">🌲 Park Pulse</span>
            <span className="text-white/60">•</span>
            <span className="text-sm">Real-time Park Forecasting</span>
          </div>

          <h1 className="text-5xl md:text-6xl font-black mb-6 leading-tight">
            Plan Your Perfect Park Visit
          </h1>

          <p className="text-xl md:text-2xl text-emerald-100 max-w-3xl leading-relaxed">
            Forecast crowding levels at U.S. National Parks. Search or click a marker to explore detailed predictions.
          </p>
        </div>
      </div>

      {/* Controls Section */}
      <div className="max-w-6xl mx-auto px-6 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            {/* Park Search */}
            <div className="w-full">
              <ParkSearch
                value={park}
                onChange={(v) => setPark(v)}
                onSelect={(p) => {
                  setPark(p);
                  zoomToSelectedPark(p);
                }}
              />
            </div>

            {/* Month Picker */}
            <div className="relative w-full" ref={popRef}>
              <div className="text-sm font-bold text-gray-600 mb-2">Forecast month</div>

              <button
                type="button"
                onClick={() => setPickerOpen((v) => !v)}
                disabled={loading || baseYear == null || baseMonth == null}
                className="h-12 px-6 rounded-full border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between w-full font-bold text-gray-900"
              >
                <span>{currentLabel}</span>
                <span className="text-gray-500">▾</span>
              </button>

              {pickerOpen && (
                <div
                  className="absolute top-full mt-2 right-0 w-full md:w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl p-6 z-50"
                  onWheelCapture={(e) => e.stopPropagation()}
                  onPointerDownCapture={(e) => e.stopPropagation()}
                >
                  <div className="text-sm font-bold text-gray-600 mb-3">Choose a month and year</div>

                  <input
                    type="month"
                    value={currentMonthValue}
                    min={minMonthValue}
                    max={maxMonthValue}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (!v) return;
                      const [yy, mm] = v.split("-").map(Number);
                      if (!yy || !mm) return;
                      setIndexFromYearMonth(yy, mm);
                      setPickerOpen(false);
                      if (park) setTimeout(() => zoomToSelectedPark(park), 0);
                    }}
                    className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bold text-gray-900"
                  />

                  <div className="mt-4 text-sm text-gray-500 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
                    📅 Forecasts available for the next 3 years
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
              <div className="text-emerald-900 font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">🗺️</span>
                <span>Interactive Map</span>
              </div>
              <p className="text-sm text-gray-700">Click any park marker to view detailed forecasts</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
              <div className="text-blue-900 font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <span>AI Predictions</span>
              </div>
              <p className="text-sm text-gray-700">Machine learning models trained on historical data</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100">
              <div className="text-purple-900 font-bold mb-1 flex items-center gap-2">
                <span className="text-2xl">🎯</span>
                <span>Plan Ahead</span>
              </div>
              <p className="text-sm text-gray-700">Find the best time to visit your favorite parks</p>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {err && (
        <div className="max-w-6xl mx-auto px-6 mt-6">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <div className="font-bold text-red-900 mb-1">Error Loading Data</div>
                <div className="text-red-700">{err}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Map Section */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          {loading ? (
            <div className="h-96 flex items-center justify-center">
              <div className="text-center">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-500 border-t-transparent" />
                <div className="mt-4 text-gray-600 font-semibold">Loading map data...</div>
              </div>
            </div>
          ) : (
            <div className="relative">
              <HomeMap points={points} focus={focus} />
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="text-lg font-bold text-gray-900 mb-4">Crowd Level Legend</div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-green-500" />
              <div>
                <div className="font-bold text-gray-900">Low</div>
                <div className="text-sm text-gray-600">Quieter than usual</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-yellow-500" />
              <div>
                <div className="font-bold text-gray-900">Medium</div>
                <div className="text-sm text-gray-600">Moderate crowds</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-red-500" />
              <div>
                <div className="font-bold text-gray-900">High</div>
                <div className="text-sm text-gray-600">Expect busy conditions</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
