"use client";

import Link from "next/link";

type Props = {
  parks: string[];
};

/**
 * MVP "Map panel":
 * - Looks like a map section
 * - Clickable park list acts like “pins”
 * - Later: replace the inside with Mapbox/Leaflet markers using coordinates
 */
export default function ParkMap({ parks }: Props) {
  const topParks = parks.slice(0, 24); // show a subset for now

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "1.2fr 0.8fr",
        gap: 18,
        alignItems: "stretch",
      }}
    >
      {/* Map panel (placeholder) */}
      <div
        style={{
          borderRadius: 18,
          border: "1px solid #dde6dd",
          background:
            "radial-gradient(900px 500px at 20% 25%, rgba(66,153,94,0.22), transparent 60%)," +
            "radial-gradient(900px 500px at 70% 45%, rgba(14,116,144,0.16), transparent 60%)," +
            "linear-gradient(180deg, #f7fbf7 0%, #ffffff 100%)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          padding: 18,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
          <div>
            <div style={{ color: "#1f3d2b", fontWeight: 900, fontSize: 18 }}>
              Explore National Parks
            </div>
            <div style={{ color: "#4b6b57", fontSize: 13, marginTop: 6, maxWidth: 520 }}>
              Click a park on the right (pins) to open its forecast page. Next we’ll
              turn this panel into a true interactive map with markers.
            </div>
          </div>

          <div
            style={{
              alignSelf: "flex-start",
              padding: "6px 10px",
              borderRadius: 999,
              background: "#edf6ee",
              border: "1px solid #d7e2d7",
              color: "#2f5d44",
              fontWeight: 800,
              fontSize: 12,
              whiteSpace: "nowrap",
            }}
          >
            MVP Map
          </div>
        </div>

        {/* “Map silhouette” decor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.22,
            pointerEvents: "none",
            backgroundImage:
              "radial-gradient(circle at 15% 55%, #2f5d44 0 2px, transparent 3px)," +
              "radial-gradient(circle at 25% 35%, #2f5d44 0 2px, transparent 3px)," +
              "radial-gradient(circle at 35% 60%, #2f5d44 0 2px, transparent 3px)," +
              "radial-gradient(circle at 55% 45%, #2f5d44 0 2px, transparent 3px)," +
              "radial-gradient(circle at 70% 55%, #2f5d44 0 2px, transparent 3px)," +
              "radial-gradient(circle at 82% 35%, #2f5d44 0 2px, transparent 3px)",
          }}
        />

        {/* Big “US map area” placeholder */}
        <div
          style={{
            marginTop: 18,
            height: 360,
            borderRadius: 16,
            border: "1px dashed rgba(47,93,68,0.35)",
            background: "rgba(255,255,255,0.65)",
            display: "grid",
            placeItems: "center",
            color: "#4b6b57",
            fontWeight: 700,
          }}
        >
          US Map goes here (Mapbox/Leaflet next)
        </div>
      </div>

      {/* Pins list */}
      <div
        style={{
          borderRadius: 18,
          border: "1px solid #dde6dd",
          background: "#ffffff",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: 14,
            background: "#f1f6f1",
            borderBottom: "1px solid #e2ebe2",
            color: "#1f3d2b",
            fontWeight: 900,
          }}
        >
          Park pins
        </div>

        <div style={{ padding: 10, overflow: "auto" }}>
          {topParks.map((p) => (
            <Link
              key={p}
              href={`/parks/${encodeURIComponent(p)}`}
              style={{ textDecoration: "none" }}
            >
              <div
                style={{
                  padding: "10px 12px",
                  borderRadius: 12,
                  border: "1px solid #e7efe7",
                  marginBottom: 8,
                  color: "#1f3d2b",
                  fontWeight: 750,
                  background: "#fbfdfb",
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 10,
                }}
              >
                <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {p}
                </span>
                <span style={{ color: "#2f5d44" }}>→</span>
              </div>
            </Link>
          ))}
          <div style={{ padding: "8px 6px", color: "#6b7f71", fontSize: 12 }}>
            Showing {topParks.length} of {parks.length}. Search to find any park.
          </div>
        </div>
      </div>
    </section>
  );
}
