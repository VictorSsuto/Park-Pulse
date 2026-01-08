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

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

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
    .replace(/[’ʻ]/g, "'")
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

        // anchor index=0 to first returned month/year
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [index]);

  // close month picker on outside click
  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (!pickerOpen) return;
      if (!popRef.current) return;
      if (!popRef.current.contains(e.target as Node)) setPickerOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [pickerOpen]);

  // Current label derived from points
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

    setFocus({
      lat: hit.Latitude,
      lng: hit.Longitude,
      zoom: 7, // tweak (6–7 feels good)
    });
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "linear-gradient(180deg, #e7efe7 0%, #f3f7f3 60%, #ffffff 100%)",
      }}
    >
       
  <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24 }}></div>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 54, fontWeight: 950, color: "#1f3d2b", letterSpacing: -0.8 }}>
          Park Pulse
        </h1>

        <p style={{ marginTop: 10, color: "#4b6b57", maxWidth: 900, fontSize: 18, lineHeight: 1.5 }}>
          Forecast crowding levels at U.S. National Parks. Search or click a marker to open a dedicated park page.
        </p>

        <div style={{ marginTop: 18, display: "flex", gap: 12, flexWrap: "wrap", alignItems: "flex-end" }}>
          <ParkSearch
            value={park}
            onChange={(v) => setPark(v)}
            onSelect={(p) => {
              setPark(p);
              zoomToSelectedPark(p); // ✅ zoom the map
            }}
          />

          {/* Month picker pill */}
          <div style={{ position: "relative" }} ref={popRef}>
            <div style={{ fontSize: 13, fontWeight: 800, color: "#4b6b57", marginBottom: 8 }}>
              Forecast month
            </div>

            <button
              type="button"
              onClick={() => setPickerOpen((v) => !v)}
              disabled={loading || baseYear == null || baseMonth == null}
              style={{
                height: 46,
                padding: "0 14px",
                borderRadius: 999,
                border: "1px solid #d7e2d7",
                background: "#ffffff",
                boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
                color: "#1f3d2b",
                fontWeight: 900,
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                gap: 10,
                minWidth: 170,
                justifyContent: "space-between",
              }}
            >
              <span>{currentLabel}</span>
              <span style={{ color: "#6b7f71", fontWeight: 900 }}>▾</span>
            </button>

            {pickerOpen && (
              <div
                style={{
                  position: "absolute",
                  top: "calc(100% + 8px)",
                  right: 0,
                  width: 280,
                  borderRadius: 16,
                  border: "1px solid #d7e2d7",
                  background: "#ffffff",
                  boxShadow: "0 18px 50px rgba(0,0,0,0.12)",
                  padding: 12,
                  zIndex: 60,
                }}
                onWheelCapture={(e) => e.stopPropagation()}
                onPointerDownCapture={(e) => e.stopPropagation()}
              >
                <div style={{ fontSize: 12, color: "#6b7f71", fontWeight: 700, marginBottom: 8 }}>
                  Choose a month and year
                </div>

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
                    // keep focus in sync when month changes:
                    if (park) setTimeout(() => zoomToSelectedPark(park), 0);
                  }}
                  style={{
                    width: "100%",
                    height: 42,
                    padding: "0 10px",
                    borderRadius: 12,
                    border: "1px solid #d7e2d7",
                    outline: "none",
                    fontWeight: 800,
                    color: "#1f3d2b",
                  }}
                />

                <div style={{ marginTop: 10, fontSize: 12, color: "#6b7f71" }}>
                  Forecasts available for the next 3 years.
                </div>
              </div>
            )}
          </div>
        </div>

        {err && (
          <div
            style={{
              marginTop: 14,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5baba",
              background: "#fff5f5",
              color: "#8b2c2c",
              fontSize: 14,
              maxWidth: 640,
            }}
          >
            {err}
          </div>
        )}

        <div style={{ marginTop: 22 }}>
          {loading ? (
            <div style={{ color: "#4b6b57" }}>Loading map…</div>
          ) : (
            <HomeMap points={points} focus={focus} />
          )}
        </div>
      </div>
      {/* Footer */}
<div
  style={{
    marginTop: 40,
    paddingTop: 20,
    borderTop: "1px solid #e2ebe2",
    textAlign: "center",
    fontSize: 13,
    color: "#6b7f71",
    fontWeight: 600,
  }}
>
  <span style={{ opacity: 0.8 }}>🌲</span> Park Pulse · Developed by Victor Ssuto
</div>

    </main>
  );
}
