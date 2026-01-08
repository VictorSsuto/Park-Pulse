"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
type Crowd = "low" | "medium" | "high";

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

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://127.0.0.1:8000";

/** 63 park quotes (poetic subtitle) */
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
  "Mammoth Cave": "The world’s longest story written underground.",
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
    .replace(/[’ʻ]/g, "'")
    .replace("Haleakalā", "Haleakala")
    .replace("Hawaiʻi", "Hawai'i")
    .replace(/\s+/g, " ");
}

function badgeStyle(level: Crowd) {
  if (level === "low")
    return { bg: "#e7f6ee", fg: "#1f6a3a", border: "#bfe8cf", label: "LOW" };
  if (level === "medium")
    return { bg: "#fff4e5", fg: "#8a4b00", border: "#ffd8a8", label: "MEDIUM" };
  return { bg: "#ffe9ea", fg: "#8b1d23", border: "#ffb3b7", label: "HIGH" };
}

function fmtMonth(y: number, m: number) {
  return `${y}-${String(m).padStart(2, "0")}`;
}

function fmtInt(n: number) {
  return Math.round(n).toLocaleString();
}

export default function ParkPage() {
  const router = useRouter();
  const params = useParams<{ park: string }>();

  const park = useMemo(
    () => decodeURIComponent(params?.park ?? "").trim(),
    [params?.park]
  );

  const quote = useMemo(() => {
    const key = normalizeParkKey(park);
    return PARK_QUOTES[key] ?? "A place of wonder shaped by nature.";
  }, [park]);

  const [months, setMonths] = useState(36);
  const [data, setData] = useState<ForecastResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    if (!park) return;

    (async () => {
      try {
        setLoading(true);
        setErr("");

        const url = `${API_BASE}/forecast?park=${encodeURIComponent(
          park
        )}&months=${months}`;

        const res = await fetch(url, { cache: "no-store" });
        if (!res.ok) {
          const msg = await res.text();
          throw new Error(`Forecast fetch failed (${res.status}): ${msg}`);
        }

        const json = (await res.json()) as ForecastResponse;
        setData(json);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load forecast");
        setData(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [park, months]);

  const summary = useMemo(() => {
    const rows = data?.forecast ?? [];
    if (!rows.length) return null;

    const counts = rows.reduce(
      (acc, r) => {
        acc[r.crowd_level] += 1;
        return acc;
      },
      { low: 0, medium: 0, high: 0 } as Record<Crowd, number>
    );

    const thresholds = {
      low: rows[0].low_threshold,
      high: rows[0].high_threshold,
    };

    return { counts, thresholds };
  }, [data]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "linear-gradient(180deg, #e7efe7 0%, #f3f7f3 60%, #ffffff 100%)",
      }}
    >
          <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24 }}></div>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Top bar (now only back + title/quote) */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
           

            <h1
              style={{
                marginTop: 10,
                fontSize: 44,
                fontWeight: 950,
                color: "#1f3d2b",
                letterSpacing: -0.6,
              }}
            >
              {park}
            </h1>

            <div
              style={{
                marginTop: 8,
                color: "#4b6b57",
                fontSize: 16,
                fontWeight: 500,
                fontStyle: "italic",
                maxWidth: 760,
              }}
            >
              “{quote}”
            </div>

            <div style={{ marginTop: 14, height: 1, background: "#e2ebe2", maxWidth: 680 }} />

           
          </div>
        </div>

        {/* Status */}
        {err && (
          <div
            style={{
              marginTop: 18,
              padding: 12,
              borderRadius: 12,
              border: "1px solid #e5baba",
              background: "#fff5f5",
              color: "#8b2c2c",
              fontSize: 14,
            }}
          >
            {err}
          </div>
        )}

        {loading && (
          <div style={{ marginTop: 18, color: "#4b6b57", fontWeight: 700 }}>
            Loading forecast…
          </div>
        )}

        {/* Summary chips */}
        {!loading && summary && (
          <div style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}>
            {(["low", "medium", "high"] as Crowd[]).map((lvl) => {
              const b = badgeStyle(lvl);
              return (
                <div
                  key={lvl}
                  style={{
                    padding: "10px 12px",
                    borderRadius: 14,
                    border: `1px solid ${b.border}`,
                    background: b.bg,
                    color: b.fg,
                    fontWeight: 900,
                    fontSize: 13,
                  }}
                >
                  {b.label}: {summary.counts[lvl]} months
                </div>
              );
            })}
          </div>
        )}

        {/* Tableau-style table */}
        {!loading && data?.forecast?.length ? (
          <div
            style={{
              marginTop: 18,
              borderRadius: 18,
              overflow: "hidden",
              border: "1px solid #dde6dd",
              background: "white",
              boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            }}
          >
            {/* Header row WITH months selector on the right */}
            <div
              style={{
                padding: 14,
                background: "#f1f6f1",
                borderBottom: "1px solid #e2ebe2",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
              }}
            >
              <div style={{ fontWeight: 950, color: "#1f3d2b" }}>Forecast Tableau</div>

              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 800, color: "#4b6b57" }}>
                  Months
                </div>
                <select
                  value={months}
                  onChange={(e) => setMonths(Number(e.target.value))}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 12,
                    border: "1px solid #d4e3d6",
                    background: "#ffffff",
                    fontWeight: 800,
                    color: "#1f3d2b",
                    cursor: "pointer",
                  }}
                >
                  <option value={12}>12</option>
                  <option value={24}>24</option>
                  <option value={36}>36</option>
                </select>
              </div>
            </div>

            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ textAlign: "left", fontSize: 12, color: "#4b6b57" }}>
                    <th style={{ padding: "12px 14px" }}>Month</th>
                    <th style={{ padding: "12px 14px" }}>Predicted visits</th>
                    <th style={{ padding: "12px 14px" }}>Crowding</th>
                  </tr>
                </thead>

                <tbody>
                  {data.forecast.map((r, idx) => {
                    const b = badgeStyle(r.crowd_level);
                    const zebra = idx % 2 === 0 ? "#ffffff" : "#fafcf9";

                    return (
                      <tr key={`${r.Year}-${r.Month}-${idx}`} style={{ background: zebra }}>
                        <td style={{ padding: "12px 14px", fontWeight: 800, color: "#1f3d2b" }}>
                          {fmtMonth(r.Year, r.Month)}
                        </td>

                        <td style={{ padding: "12px 14px", color: "#1f3d2b", fontWeight: 700 }}>
                          {fmtInt(r.predicted_visits)}
                        </td>

                        <td style={{ padding: "12px 14px" }}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              gap: 8,
                              padding: "7px 10px",
                              borderRadius: 999,
                              border: `1px solid ${b.border}`,
                              background: b.bg,
                              color: b.fg,
                              fontWeight: 950,
                              fontSize: 12,
                              letterSpacing: 0.4,
                            }}
                          >
                            <span
                              style={{
                                width: 10,
                                height: 10,
                                borderRadius: 999,
                                background: b.fg,
                                display: "inline-block",
                              }}
                            />
                            {b.label}
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
          <div style={{ marginTop: 18, color: "#4b6b57" }}>No forecast rows returned.</div>
        )}
      </div>
      <div
  style={{
    marginTop: 48,
    padding: "18px 0 6px",
    textAlign: "center",
    fontSize: 13,
    color: "#6b7f71",
    fontWeight: 650,
  }}
>
  <span style={{ opacity: 0.8 }}>🌲</span> Park Pulse · Developed by Victor Ssuto
</div>

    </main>
  );
}
