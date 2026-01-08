"use client";

import { useEffect, useState } from "react";
import { getParks } from "@/lib/api";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (park: string) => void;
};

export default function ParkSearch({ value, onChange, onSelect }: Props) {
  const [parks, setParks] = useState<string[]>([]);
  const [filtered, setFiltered] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const data = await getParks();

        // ✅ defensive check
        if (!data || !Array.isArray(data.parks)) {
          throw new Error("Invalid parks response");
        }

        setParks(data.parks);
      } catch {
        setError("Failed to load parks");
        setParks([]); // ✅ always fallback to array
      }
    }

    load();
  }, []);

  useEffect(() => {
    const q = value.toLowerCase();
    setFiltered(
      parks.filter((p) => p.toLowerCase().includes(q)).slice(0, 10)
    );
    setActiveIndex(0);
  }, [value, parks]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    }

    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    }

    if (e.key === "Enter" && filtered[activeIndex]) {
      select(filtered[activeIndex]);
    }
  }

  function select(park: string) {
    onSelect(park);
    onChange(park);
    setOpen(false);
  }

  return (
    <div style={{ position: "relative", maxWidth: 520 }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 13,
          fontWeight: 600,
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
        style={{
          width: "100%",
          padding: "14px 16px",
          borderRadius: 14,
          border: "1px solid #d7e2d7",
          background: "#ffffff",
          color: "#1f3d2b",
          fontSize: 15,
          outline: "none",
        }}
      />

      {open && filtered.length > 0 && (
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
            zIndex: 20,
            overflow: "hidden",
          }}
        >
          {filtered.map((park, idx) => (
            <button
              key={park}
              onClick={() => select(park)}
              onMouseEnter={() => setActiveIndex(idx)}
              style={{
                width: "100%",
                textAlign: "left",
                padding: "12px 16px",
                background: idx === activeIndex ? "#edf6ee" : "transparent",
                border: "none",
                cursor: "pointer",
                color: "#1f3d2b",
                fontSize: 14,
              }}
            >
              {park}
            </button>
          ))}
        </div>
      )}

      {error && (
        <div style={{ marginTop: 6, fontSize: 12, color: "#8b2c2c" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 8, fontSize: 12, color: "#6b7f71" }}>
        {parks?.length ?? 0} parks loaded
      </div>
    </div>
  );
}
