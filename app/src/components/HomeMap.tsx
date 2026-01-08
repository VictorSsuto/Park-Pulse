"use client";

import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

import L from "leaflet";
import { useEffect, useMemo } from "react";
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

type Focus = {
  lat: number;
  lng: number;
  zoom?: number;
};

function crowdColor(level: Crowd) {
  if (level === "low") return "#2f855a";
  if (level === "medium") return "#d97706";
  return "#dc2626";
}

function makeDotIcon(color: string) {
  const size = 14;
  return L.divIcon({
    className: "",
    html: `
      <div style="
        width:${size}px;height:${size}px;
        border-radius:999px;
        background:${color};
        border:2px solid ${color};
        box-shadow:0 4px 10px rgba(0,0,0,0.18);
        opacity:0.9;
      "></div>
    `,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
  });
}

/** Small helper component to imperatively control the map */
function MapFocus({ focus }: { focus: Focus | null }) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;
    const z = focus.zoom ?? 6;

    map.flyTo([focus.lat, focus.lng], z, {
      duration: 0.9,
      easeLinearity: 0.25,
    });
  }, [focus, map]);

  return null;
}

export default function HomeMap({
  points,
  focus,
}: {
  points: ParkPoint[];
  focus: Focus | null;
}) {
  const router = useRouter();

  const icons = useMemo<Record<Crowd, L.DivIcon>>(() => {
    return {
      low: makeDotIcon(crowdColor("low")),
      medium: makeDotIcon(crowdColor("medium")),
      high: makeDotIcon(crowdColor("high")),
    };
  }, []);

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
      <div style={{ height: 420, position: "relative", zIndex: 0 }}>
        <MapContainer
          center={[39.5, -98.35]}
          zoom={3}
          minZoom={3}
          maxZoom={7}
          scrollWheelZoom
          style={{ height: "100%", width: "100%", zIndex: 0 }}
          maxBounds={[
                 [-35, -180], // ✅ include American Samoa
                [80, -50],
          ]}
          maxBoundsViscosity={1.0}
        >
          <MapFocus focus={focus} />

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />

          <MarkerClusterGroup
            chunkedLoading
            zoomToBoundsOnClick
            spiderfyOnMaxZoom
            showCoverageOnHover={false}
            maxClusterRadius={44}
             spiderLegPolylineOptions={{ weight: 1.2, opacity: 0.35 }}
            disableClusteringAtZoom={7}   // ✅ at max zoom, show individual parks
          >
            {points.map((p) => (
              <Marker
                key={`${p.ParkName}-${p.Latitude}-${p.Longitude}`}
                position={[p.Latitude, p.Longitude]}
                icon={icons[p.crowd_level]}
                eventHandlers={{
                  click: () => router.push(`/parks/${encodeURIComponent(p.ParkName)}`),
                }}
              >
                <Tooltip direction="top" offset={[0, -6]} opacity={1} sticky>
                  <div style={{ fontWeight: 800 }}>{p.ParkName}</div>
                  <div style={{ fontSize: 12 }}>
                    {p.Year}-{String(p.Month).padStart(2, "0")} •{" "}
                    {p.crowd_level.toUpperCase()}
                  </div>
                </Tooltip>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  );
}
