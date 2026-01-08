"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ParkSearch from "@/components/ParkSearch";
import HomeMap from "@/components/HomeMap";

type ParkPoint = {
  ParkName: string;
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: "low" | "medium" | "high";
  Latitude: number;
  Longitude: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE?.replace(/\/$/, "") || "http://127.0.0.1:8000";

export default function Home() {
  const router = useRouter();

  const [park, setPark] = useState("");
  const [index, setIndex] = useState(0);
  const [points, setPoints] = useState<ParkPoint[]>([]);
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(`${API_BASE}/map?index=${index}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`Map fetch failed: ${res.status}`);
        const data = await res.json();
        setPoints(data.parks ?? []);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load map data");
        setPoints([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [index]);

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background: "linear-gradient(180deg, #e7efe7 0%, #f3f7f3 60%, #ffffff 100%)",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <h1 style={{ fontSize: 54, fontWeight: 950, color: "#1f3d2b", letterSpacing: -0.8 }}>
          Park Pulse
        </h1>

        <p style={{ marginTop: 10, color: "#4b6b57", maxWidth: 900, fontSize: 18, lineHeight: 1.5 }}>
          Forecast crowding levels at U.S. National Parks. Search or click a marker to open a dedicated park page.
        </p>

        <div style={{ marginTop: 22, display: "flex", gap: 14, flexWrap: "wrap", alignItems: "end" }}>
          <ParkSearch
            value={park}
            onChange={setPark}
            onSelect={(p) => router.push(`/parks/${encodeURIComponent(p)}`)}
          />

          <div style={{ minWidth: 220 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#4b6b57", marginBottom: 8 }}>
              Forecast month index
            </div>
            <input
              type="range"
              min={0}
              max={35}
              value={index}
              onChange={(e) => setIndex(Number(e.target.value))}
              style={{ width: "100%" }}
            />
            <div style={{ fontSize: 12, color: "#6b7f71", marginTop: 6 }}>
              0 = soonest forecast • 35 = farthest
            </div>
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
            <HomeMap points={points} />
          )}
        </div>
      </div>
    </main>
  );
}
