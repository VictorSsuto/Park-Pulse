"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import ParkSearch from "@/components/ParkSearch";
import { getMapByIndex, type MapByIndex, type MapParkPoint } from "@/lib/api";

type Focus = { lat: number; lng: number; zoom?: number };
const DEFAULT_FOCUS: Focus = { lat: 39.5, lng: -98.35, zoom: 5 };

const HomeMap = dynamic(() => import("@/components/HomeMap"), { ssr: false });

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}
function ymToSerial(year: number, month1to12: number) {
  return year * 12 + (month1to12 - 1);
}
function parkSlug(input: string): string {
  return String(input ?? "")
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/['ʻ’]/g, "")
    .replace(/[.]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function Home() {
  const router = useRouter();

  const [park, setPark] = useState("");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [index, setIndex] = useState(0);

  const [data, setData] = useState<MapByIndex | null>(null);
  const [points, setPoints] = useState<MapParkPoint[]>([]);
  const [focus, setFocus] = useState<Focus | null>(null);

  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  const [pickerOpen, setPickerOpen] = useState(false);
  const popRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const d = await getMapByIndex();
        if (!alive) return;
        setData(d);
        setPoints(d.months?.[0]?.parks ?? []);
      } catch (e: any) {
        if (!alive) return;
        setErr(e?.message ?? "Failed to load map data");
        setData(null);
        setPoints([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  useEffect(() => {
    if (!data) return;
    setPoints(data.months?.[index]?.parks ?? []);
  }, [data, index]);

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
    if (!data) return "Pick month";
    const base = new Date(data.baseYear, data.baseMonth - 1, 1);
    base.setMonth(base.getMonth() + index);
    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    return `${MONTHS[m - 1]} ${y}`;
  }, [data, index]);

  const currentMonthValue = useMemo(() => {
    if (!data) return "";
    const base = new Date(data.baseYear, data.baseMonth - 1, 1);
    base.setMonth(base.getMonth() + index);
    const y = base.getFullYear();
    const m = base.getMonth() + 1;
    return `${y}-${String(m).padStart(2, "0")}`;
  }, [data, index]);

  const minMonthValue = useMemo(() => {
    if (!data) return "";
    return `${data.baseYear}-${String(data.baseMonth).padStart(2, "0")}`;
  }, [data]);

  const maxMonthValue = useMemo(() => {
    if (!data) return "";
    const maxSerial = ymToSerial(data.baseYear, data.baseMonth) + 35;
    const maxYear = Math.floor(maxSerial / 12);
    const maxMonth = (maxSerial % 12) + 1;
    return `${maxYear}-${String(maxMonth).padStart(2, "0")}`;
  }, [data]);

  function setIndexFromYearMonth(year: number, month1to12: number) {
    if (!data) return;
    const base = ymToSerial(data.baseYear, data.baseMonth);
    const chosen = ymToSerial(year, month1to12);
    setIndex(clamp(chosen - base, 0, 35));
  }

  function zoomToSelectedParkByPoints(nameOrSlug: string) {
    const sel = parkSlug(nameOrSlug);
    const hit = points.find((p) => parkSlug(p.ParkName) === sel);
    if (!hit) return;
    setFocus({ lat: hit.Latitude, lng: hit.Longitude, zoom: 7 });
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 text-white">
        <div className="absolute inset-0 opacity-30 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjA1IiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')]" />
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

     {/* Controls */}
<div className="max-w-6xl mx-auto px-6 -mt-8 relative z-10">
  <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8">
    {/* ✅ align top */}
    <div className="flex flex-col md:flex-row md:items-start gap-6">
      {/* LEFT: Search */}
      <div className="flex-1">
        {/* ✅ spacer so both columns have same top label height */}
        <div className="text-sm font-bold text-transparent mb-2">Forecast month</div>

       <ParkSearch
  value={park}
  onChange={(v) => {
    setPark(v);

    // ✅ Clear selection → reset map to default view
    if (v.trim() === "") {
      setSelectedSlug(null);
      setFocus(DEFAULT_FOCUS);
    }
  }}
  onSelect={(slugOrName) => {
    const slug = parkSlug(slugOrName);
    setSelectedSlug(slug);
    zoomToSelectedParkByPoints(slug);
  }}
  onSelectPark={(p) => {
    setPark(p.name);
    setSelectedSlug(p.slug);
    setFocus({ lat: p.lat, lng: p.lng, zoom: 7 });
  }}
/>

      </div>

      {/* RIGHT: Month picker */}
      <div className="relative w-full md:w-64 shrink-0" ref={popRef}>
        <div className="text-sm font-bold text-gray-600 mb-2">Forecast month</div>

        <button
          type="button"
          onClick={() => setPickerOpen((v) => !v)}
          disabled={loading || !data}
          className="h-12 px-6 rounded-full border border-gray-200 bg-white shadow-lg hover:shadow-xl transition-shadow disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-between w-full font-bold text-gray-900"
        >
          <span>{currentLabel}</span>
          <span className="text-gray-500">▾</span>
        </button>

        {pickerOpen && data && (
          <div className="absolute top-full mt-2 right-0 w-72 rounded-2xl border border-gray-200 bg-white shadow-2xl p-6 z-50">
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

                setTimeout(() => {
                  if (focus) return;
                  if (selectedSlug) zoomToSelectedParkByPoints(selectedSlug);
                  else if (park) zoomToSelectedParkByPoints(park);
                }, 0);
              }}
              className="w-full h-12 px-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent font-bold text-gray-900"
            />

            <div className="mt-4 text-sm text-gray-500 bg-emerald-50 rounded-lg p-3 border border-emerald-100">
              Forecasts available for the next 3 years
            </div>
          </div>
        )}
      </div>
    </div>

    {/* Info cards */}
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


      {/* Error */}
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

      {/* Map */}
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
              <HomeMap points={points as any} focus={focus} />
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
