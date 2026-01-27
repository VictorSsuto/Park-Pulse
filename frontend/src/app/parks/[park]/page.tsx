"use client";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getForecast, parkSlug } from "@/lib/api";
import { PARK_QUOTES_BY_SLUG } from "@/lib/parkQuotes";
import { PARK_STATE_BY_SLUG } from "@/lib/parkStates";

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
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[m - 1]} ${y}`;
}

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}

export default function ParkPage() {
  const router = useRouter();
  const params = useParams<{ park: string }>();

  const parkParam = useMemo(
    () => String(params?.park ?? "").trim(),
    [params?.park]
  );
  const decoded = useMemo(() => decodeURIComponent(parkParam), [parkParam]);
  const slug = useMemo(() => parkSlug(decoded), [decoded]);

  //  assumes you renamed all images to lowercase .jpg
  const heroSrc = useMemo(() => `/parks-hero/${slug}.jpg`, [slug]);

  const [months, setMonths] = useState(36);
  const [raw, setRaw] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!slug) return;

    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setErr("");
        const json = await getForecast(slug);
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
  }, [slug]);

  const data = useMemo(() => {
    if (!raw) return null;
    return {
      ...raw,
      months,
      forecast: Array.isArray(raw.forecast) ? raw.forecast.slice(0, months) : [],
    };
  }, [raw, months]);

  const displayParkName = raw?.park || decoded;

  const quote = useMemo(() => {
    return PARK_QUOTES_BY_SLUG[slug] ?? "Find your next park adventure.";
  }, [slug]);

  const state = useMemo(() => {
    return PARK_STATE_BY_SLUG[slug] ?? "";
  }, [slug]);

  return (
    <main className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero (image background) */}
      <div className="relative overflow-hidden text-white">
        {/* Background image */}
        <div className="absolute inset-0">
          <Image
            src={heroSrc}
            alt={`${displayParkName} hero`}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/35 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative max-w-6xl mx-auto px-6 py-16">
          <button
            onClick={() => router.push("/")}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 mb-6 transition-colors"
          >
            <span className="text-sm font-bold">← Back to Map</span>
          </button>

          <h1 className="text-5xl md:text-6xl font-black mb-2 leading-tight drop-shadow-sm">
            {displayParkName}
          </h1>

          {/*  state under park name */}
          {state && (
            <p className="text-white/80 font-semibold tracking-wide uppercase mb-3">
              {state}
            </p>
          )}

          {/*  slogan */}
          <p className="text-white/90 drop-shadow-sm text-lg md:text-xl max-w-2xl">
            {quote}
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {err && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 mb-6">
            <div className="font-bold text-red-900 mb-1">
              Error Loading Forecast
            </div>
            <div className="text-red-700">{err}</div>
          </div>
        )}

        {loading && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <div className="inline-block w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4" />
            <p className="text-gray-600 font-semibold">
              Loading forecast data...
            </p>
          </div>
        )}

        {!loading && data?.forecast?.length ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-gray-900">
                  Forecast Details
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Monthly predictions
                </p>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm font-bold text-gray-700">
                  Period:
                </label>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  className="px-4 py-2 rounded-full border-2 border-emerald-200 bg-white font-bold text-gray-900"
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
                      <tr
                        key={`${row.Year}-${row.Month}-${idx}`}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap font-bold text-gray-900">
                          {fmtMonth(row.Year, row.Month)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-lg font-bold text-gray-900">
                            {fmtInt(row.predicted_visits)}
                          </span>
                          <span className="text-sm text-gray-500 ml-2">
                            visitors
                          </span>
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
                            <span
                              className="w-2 h-2 rounded-full"
                              style={{ background: badge.dotBg }}
                            />
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

        {!loading && !err && (!data?.forecast || data.forecast.length === 0) && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-12 text-center">
            <p className="text-gray-600 font-semibold">
              No forecast data available for this park
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
