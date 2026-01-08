"use client";

import { MapContainer, TileLayer, CircleMarker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useRouter } from "next/navigation";

type Crowd = "low" | "medium" | "high";

type ParkPoint = {
  ParkName: string;
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: Crowd;
  Latitude: number;
  Longitude: number;
};

function crowdColor(level: Crowd) {
  if (level === "low") return "#2f855a";     // green
  if (level === "medium") return "#d97706";  // amber
  return "#dc2626";                         // red
}

export default function HomeMap({ points }: { points: ParkPoint[] }) {
  const router = useRouter();

  return (
    <div
      style={{
        borderRadius: 18,
        border: "1px solid #dde6dd",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: 14,
          background: "#f1f6f1",
          borderBottom: "1px solid #e2ebe2",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ fontWeight: 900, color: "#1f3d2b" }}>
          National Parks — Crowd Forecast Map
        </div>
        <div style={{ fontSize: 12, color: "#4b6b57", fontWeight: 700 }}>
          Click a park
        </div>
      </div>

      {/* Map */}
      <div style={{ height: 420 }}>
        <MapContainer
          center={[39.5, -98.35]}   // center of continental US
          zoom={4}
          minZoom={4}
          maxZoom={7}
          scrollWheelZoom
          style={{ height: "100%", width: "100%" }}
          maxBounds={[
            [23, -126], // SW (SoCal)
            [50, -66],  // NE (Maine)
          ]}
          maxBoundsViscosity={1.0}
        >
          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          {points.map((p) => (
            <CircleMarker
              key={p.ParkName}
              center={[p.Latitude, p.Longitude]}
              radius={7}
              pathOptions={{
                color: crowdColor(p.crowd_level),
                fillColor: crowdColor(p.crowd_level),
                fillOpacity: 0.85,
                weight: 2,
              }}
              eventHandlers={{
                click: () =>
                  router.push(`/parks/${encodeURIComponent(p.ParkName)}`),
              }}
            >
              <Tooltip direction="top" offset={[0, -6]} opacity={1} sticky>
                <div style={{ fontWeight: 800 }}>{p.ParkName}</div>
                <div style={{ fontSize: 12 }}>
                  {p.Year}-{String(p.Month).padStart(2, "0")} •{" "}
                  {p.crowd_level.toUpperCase()}
                </div>
              </Tooltip>
            </CircleMarker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
