"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import L from "leaflet";
import type { Map as LeafletMap } from "leaflet";
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

type Focus = { lat: number; lng: number; zoom?: number };

function crowdColor(level: Crowd) {
  if (level === "low") return "#2f855a";
  if (level === "medium") return "#d97706";
  return "#dc2626";
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

function MapFocus({ focus }: { focus: Focus | null }) {
  const map = useMap();

  useEffect(() => {
    if (!focus) return;

    const lat = Number(focus.lat);
    const lng = Number(focus.lng);
    const z = Number.isFinite(focus.zoom) ? Number(focus.zoom) : 6;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return;

    requestAnimationFrame(() => {
      try {
        map.flyTo([lat, lng], z, {
          animate: true,
          duration: 0.9,
          easeLinearity: 0.25,
        });
      } catch {}
    });
  }, [map, focus?.lat, focus?.lng, focus?.zoom]);

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

  const [mounted, setMounted] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  //  use ref instead of whenCreated (TS-safe in react-leaflet v4+)
  const mapRef = useRef<LeafletMap | null>(null);

  useEffect(() => setMounted(true), []);

  const icons = useMemo<Record<Crowd, L.DivIcon>>(
    () => ({
      low: makeDotIcon(crowdColor("low")),
      medium: makeDotIcon(crowdColor("medium")),
      high: makeDotIcon(crowdColor("high")),
    }),
    []
  );

  const safePoints = useMemo(() => {
    return (points || []).filter((p) => {
      const lat = Number(p?.Latitude);
      const lng = Number(p?.Longitude);
      return (
        p &&
        typeof p.ParkName === "string" &&
        p.ParkName.trim().length > 0 &&
        Number.isFinite(lat) &&
        Number.isFinite(lng)
      );
    });
  }, [points]);

  //  invalidateSize AFTER map exists
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    const kick = () => {
      try {
        map.invalidateSize();
      } catch {}
    };

    const t1 = window.setTimeout(kick, 0);
    const t2 = window.setTimeout(kick, 150);

    window.addEventListener("resize", kick);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("resize", kick);
    };
  }, [mapReady]);

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
        {mounted ? (
          <MapContainer
            ref={mapRef}
            center={[39.5, -98.35]}
            zoom={3}
            minZoom={3}
            maxZoom={7}
            scrollWheelZoom
            style={{ height: "100%", width: "100%", zIndex: 0 }}
            maxBounds={[
              [-35, -180],
              [80, -50],
            ]}
            maxBoundsViscosity={1.0}
            whenReady={() => {
              setMapReady(true);
              setTimeout(() => {
                try {
                  mapRef.current?.invalidateSize();
                } catch {}
              }, 0);
            }}
          >
            <MapFocus focus={focus} />

            {mapReady && (
              <>
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
                  disableClusteringAtZoom={7}
                >
                  {safePoints.map((p) => {
                    const lat = Number(p.Latitude);
                    const lng = Number(p.Longitude);

                    return (
                      <Marker
                        key={`${p.ParkName}-${lat}-${lng}`}
                        position={[lat, lng]}
                        icon={icons[p.crowd_level]}
                        eventHandlers={{
                          click: () => router.push(`/parks/${parkSlug(p.ParkName)}`),
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
                    );
                  })}
                </MarkerClusterGroup>
              </>
            )}
          </MapContainer>
        ) : (
          <div style={{ height: "100%", width: "100%" }} />
        )}
      </div>
    </div>
  );
}
