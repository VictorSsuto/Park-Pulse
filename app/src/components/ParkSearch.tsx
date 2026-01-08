"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getParks } from "@/lib/api";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (park: string) => void;
};

export default function ParkSearch({ value, onChange, onSelect }: Props) {
  const [parks, setParks] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

 useEffect(() => {
  async function load() {
    try {
      const data = await getParks();

      // defensive check
      if (!data || !Array.isArray(data.parks)) {
        throw new Error("Invalid parks response");
      }

      const normalized = data.parks
        .map((p: string) =>
          p
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase())
        )
        .sort((a: string, b: string) => a.localeCompare(b));

      setParks(normalized);
    } catch {
      setError("Failed to load parks");
      setParks([]);
    }
  }

  load();
}, []);


  // Filter without slicing: dropdown will scroll instead
  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return parks;
    return parks.filter((p) => p.toLowerCase().includes(q));
  }, [value, parks]);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

  // Close on outside click
  useEffect(() => {
    function onDocMouseDown(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, []);

  function select(park: string) {
    onSelect(park);
    onChange(park);
    setOpen(false);
  }

  function ensureVisible(index: number) {
    const list = listRef.current;
    if (!list) return;
    const item = list.querySelector<HTMLElement>(`[data-idx="${index}"]`);
    if (!item) return;

    const itemTop = item.offsetTop;
    const itemBottom = itemTop + item.offsetHeight;
    const viewTop = list.scrollTop;
    const viewBottom = viewTop + list.clientHeight;

    if (itemTop < viewTop) list.scrollTop = itemTop;
    else if (itemBottom > viewBottom) list.scrollTop = itemBottom - list.clientHeight;
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown" || e.key === "Enter") setOpen(true);
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.min(i + 1, Math.max(filtered.length - 1, 0));
        requestAnimationFrame(() => ensureVisible(next));
        return next;
      });
      return;
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => {
        const next = Math.max(i - 1, 0);
        requestAnimationFrame(() => ensureVisible(next));
        return next;
      });
      return;
    }

    if (e.key === "Enter") {
      e.preventDefault();
      const choice = filtered[activeIndex];
      if (choice) select(choice);
    }
  }

  const showList = open && filtered.length > 0;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 800,
          color: "#4b6b57",
        }}
      >
        Choose a park
      </label>

      <input
        value={value}
        placeholder="Start typing a park name…"
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        aria-expanded={open}
        aria-autocomplete="list"
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: open ? "1px solid #b9d0bb" : "1px solid #d7e2d7",
          background: "#ffffff",
          color: "#1f3d2b",
          fontSize: 15,
          outline: "none",
          boxShadow: open ? "0 0 0 4px rgba(60, 130, 70, 0.12)" : "none",
        }}
      />

      {open && filtered.length === 0 && (
        <div style={{ marginTop: 10, fontSize: 12, color: "#6b7f71" }}>
          No parks match “{value}”
        </div>
      )}

      {showList && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 6,
            borderRadius: 14,
            background: "#ffffff",
            border: "1px solid #d7e2d7",
            boxShadow: "0 16px 40px rgba(0,0,0,0.08)",
            zIndex: 50,
            overflow: "hidden",
          }}
          // Stop Leaflet (map) from eating scroll / touch
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          {/* Scrollable list */}
          <div
            ref={listRef}
            style={{
              maxHeight: 320,
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: 6,
            }}
          >
            {filtered.map((park, idx) => (
              <button
                key={park}
                type="button"
                data-idx={idx}
                onClick={() => select(park)}
                onMouseEnter={() => setActiveIndex(idx)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: "11px 12px",
                  borderRadius: 12,
                  background: idx === activeIndex ? "#edf6ee" : "transparent",
                  border: "1px solid transparent",
                  cursor: "pointer",
                  color: "#1f3d2b",
                  fontSize: 14,
                  fontWeight: idx === activeIndex ? 800 : 650,
                }}
              >
                {park}
              </button>
            ))}
          </div>
        </div>
      )}

      {error && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#8b2c2c", fontWeight: 650 }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 10, fontSize: 12, color: "#6b7f71", fontWeight: 650 }}>
      </div>
    </div>
  );
}
