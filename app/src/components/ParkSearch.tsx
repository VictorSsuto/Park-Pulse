"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

export type ParkIndexItem = {
  name: string;
  slug: string;
  lat: number;
  lng: number;
};

type Props = {
  value: string;
  onChange: (v: string) => void;
  /** Canonical selection (slug) */
  onSelect: (slug: string) => void;
  /** Optional: full park object (for map zoom) */
  onSelectPark?: (park: ParkIndexItem) => void;
};

export default function ParkSearch({ value, onChange, onSelect, onSelectPark }: Props) {
  const [parks, setParks] = useState<ParkIndexItem[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const wrapperRef = useRef<HTMLDivElement | null>(null);

  // Load parks from parks_index.json
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch("/data/parks_index.json", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load parks_index.json");

        const arr = (await res.json()) as ParkIndexItem[];
        if (!alive) return;

        const normalized = (Array.isArray(arr) ? arr : [])
          .map((p) => ({
            name: String((p as any)?.name ?? "").trim(),
            slug: String((p as any)?.slug ?? "").trim(),
            lat: Number((p as any)?.lat),
            lng: Number((p as any)?.lng),
          }))
          .filter((p) => p.name && p.slug && Number.isFinite(p.lat) && Number.isFinite(p.lng))
          .sort((a, b) => a.name.localeCompare(b.name));

        setParks(normalized);
      } catch {
        if (!alive) return;
        setError("Failed to load parks");
        setParks([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, []);

  // Close on outside click
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  useEffect(() => setActiveIndex(0), [value]);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return parks;
    return parks.filter((p) => p.name.toLowerCase().includes(q) || p.slug.toLowerCase().includes(q));
  }, [value, parks]);

  const visible = useMemo(() => filtered.slice(0, 80), [filtered]);

  function selectPark(park: ParkIndexItem) {
    onChange(park.name); // keep nice label
    onSelectPark?.(park);
    onSelect(park.slug); // ALWAYS set canonical slug too (important)
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      setOpen(true);
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, visible.length - 1));
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const choice = visible[activeIndex];
      if (choice) selectPark(choice);
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      {/* Input */}
      <div className="relative">
        <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔎</span>
        <input
          value={value}
          placeholder={loading ? "Loading parks…" : "Search parks…"}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          className="w-full h-12 rounded-full pl-11 pr-11 border border-gray-200 bg-white text-gray-900 placeholder:text-gray-400 font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(true);
            }}
            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-gray-100 text-gray-500"
            aria-label="Clear"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 mt-2 rounded-2xl border border-gray-200 bg-white shadow-2xl z-50 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-emerald-50 border-b border-emerald-100">
            <div className="text-xs font-black tracking-wider text-emerald-900 uppercase">Matches</div>
            <div className="text-xs font-bold text-emerald-900/70">{visible.length}</div>
          </div>

          {/* Body */}
          <div className="max-h-80 overflow-y-auto p-2">
            {loading && <div className="p-3 text-sm text-gray-700">Loading…</div>}
            {error && <div className="p-3 text-sm text-red-600">{error}</div>}

            {!loading && !error && visible.length === 0 && (
              <div className="p-3 text-sm text-gray-600">No parks found.</div>
            )}

            {!loading &&
              !error &&
              visible.map((park, idx) => {
                const active = idx === activeIndex;
                return (
                  <button
                    key={park.slug}
                    type="button"
                    onClick={() => selectPark(park)}
                    onMouseEnter={() => setActiveIndex(idx)}
                    className={[
                      "w-full text-left px-4 py-3 rounded-xl transition",
                      "border border-transparent",
                      active
                        ? "bg-emerald-100 border-emerald-200 text-gray-900"
                        : "hover:bg-gray-50 text-gray-900",
                    ].join(" ")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-gray-900 truncate">{park.name}</div>
                        <div className="text-xs text-gray-500 truncate">{park.slug}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-gray-100 text-xs text-gray-500">
            Use ↑ ↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
