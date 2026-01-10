"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { getParks } from "@/lib/api";

type Props = {
  value: string;
  onChange: (v: string) => void;
  onSelect: (park: string) => void;
};

function titleCase(s: string) {
  return s
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

export default function ParkSearch({ value, onChange, onSelect }: Props) {
  const [parks, setParks] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getParks();
        if (!data || !Array.isArray(data.parks)) throw new Error("Invalid parks response");

        const normalized = data.parks
          .map((p: string) => titleCase(p.trim()))
          .filter(Boolean)
          .sort((a: string, b: string) => a.localeCompare(b));

        if (!alive) return;
        setParks(normalized);
      } catch {
        if (!alive) return;
        setError("Failed to load parks");
        setParks([]);
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, []);

  const filtered = useMemo(() => {
    const q = value.trim().toLowerCase();
    if (!q) return parks; // IMPORTANT: empty query = show all parks
    return parks.filter((p) => p.toLowerCase().includes(q));
  }, [value, parks]);

  // Render a sane amount but keep scroll
  const visible = useMemo(() => filtered.slice(0, 200), [filtered]);

  useEffect(() => {
    setActiveIndex(0);
  }, [value]);

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
        const next = Math.min(i + 1, Math.max(visible.length - 1, 0));
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
      const choice = visible[activeIndex];
      if (choice) select(choice);
    }
  }

  // IMPORTANT: dropdown panel appears whenever open, even if loading/error/no results
  const showPanel = open;

  const showNoMatches =
    !loading && !error && value.trim().length > 0 && visible.length === 0;

  return (
    <div ref={wrapperRef} style={{ position: "relative", width: "100%" }}>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontSize: 14,
          fontWeight: 800,
          color: "#374151",
        }}
      >
        Search parks
      </label>

      <div style={{ position: "relative" }}>
        {/* Search Icon */}
        <div
          style={{
            position: "absolute",
            left: 16,
            top: "50%",
            transform: "translateY(-50%)",
            color: "#6B7280",
            pointerEvents: "none",
          }}
        >
          <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        <input
          value={value}
          placeholder={loading ? "Loading parks…" : "Try 'Yosemite' or 'Yellowstone'..."}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-expanded={open}
          aria-autocomplete="list"
          autoComplete="off"
          spellCheck={false}
          style={{
            width: "100%",
            height: 48,
            paddingLeft: 48,
            paddingRight: value ? 48 : 16,
            borderRadius: 9999,
            border: open ? "1.5px solid #10B981" : "1.5px solid #E5E7EB",
            background: "#ffffff",
            color: "#111827",
            caretColor: "#10B981",
            fontSize: 15,
            fontWeight: 650,
            outline: "none",
            boxShadow: open
              ? "0 10px 15px -3px rgba(0, 0, 0, 0.10), 0 0 0 4px rgba(16, 185, 129, 0.12)"
              : "0 6px 10px -6px rgba(0, 0, 0, 0.18)",
            transition: "all 0.2s",
          }}
        />

        {/* Clear Button */}
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(true);
            }}
            style={{
              position: "absolute",
              right: 16,
              top: "50%",
              transform: "translateY(-50%)",
              width: 32,
              height: 32,
              borderRadius: 9999,
              border: "none",
              background: "transparent",
              color: "#6B7280",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "#F3F4F6";
              e.currentTarget.style.color = "#111827";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "#6B7280";
            }}
            aria-label="Clear search"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Autofill fix */}
        <style jsx>{`
          input:-webkit-autofill,
          input:-webkit-autofill:hover,
          input:-webkit-autofill:focus {
            -webkit-text-fill-color: #111827;
            -webkit-box-shadow: 0 0 0px 1000px #ffffff inset;
            transition: background-color 5000s ease-in-out 0s;
          }
        `}</style>
      </div>

      {/* Dropdown */}
      {showPanel && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 8,
            borderRadius: 16,
            background: "#ffffff",
            border: "1px solid #E5E7EB",
            boxShadow:
              "0 20px 25px -5px rgba(0, 0, 0, 0.10), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            zIndex: 50,
            overflow: "hidden",
          }}
          onWheelCapture={(e) => e.stopPropagation()}
          onTouchMoveCapture={(e) => e.stopPropagation()}
          onPointerDownCapture={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div
            style={{
              padding: "12px 16px",
              background: "linear-gradient(to right, #D1FAE5, #A7F3D0)",
              borderBottom: "1px solid #E5E7EB",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span
              style={{
                fontSize: 12,
                fontWeight: 800,
                color: "#065F46",
                textTransform: "uppercase",
                letterSpacing: "0.05em",
              }}
            >
              {value.trim() ? "Matches" : "All parks"}
            </span>
            <span style={{ fontSize: 12, fontWeight: 800, color: "#065F46" }}>
              {loading ? "Loading…" : error ? "Error" : `${filtered.length}`}
            </span>
          </div>

          {/* Body */}
          <div
            ref={listRef}
            style={{
              maxHeight: 320,
              overflowY: "auto",
              overscrollBehavior: "contain",
              padding: 8,
            }}
          >
            {loading && (
              <div style={{ padding: 12, fontSize: 14, color: "#374151", fontWeight: 600 }}>
                Fetching parks list…
              </div>
            )}

            {!loading && error && (
              <div style={{ padding: 12, fontSize: 14, color: "#991B1B", fontWeight: 700 }}>
                {error}
              </div>
            )}

            {showNoMatches && (
              <div style={{ padding: 12, fontSize: 14, color: "#6B7280" }}>
                No parks match "{value}"
              </div>
            )}

            {!loading && !error && visible.length > 0 && (
              <>
                {visible.map((park, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={`${park}-${idx}`}
                      type="button"
                      data-idx={idx}
                      onClick={() => select(park)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      style={{
                        width: "100%",
                        textAlign: "left",
                        padding: "12px",
                        borderRadius: 12,
                        background: isActive
                          ? "linear-gradient(to right, #D1FAE5, #A7F3D0)"
                          : "transparent",
                        border: isActive ? "2px solid #10B981" : "2px solid transparent",
                        cursor: "pointer",
                        color: "#111827",
                        fontSize: 14,
                        fontWeight: isActive ? 800 : 600,
                        transition: "all 0.15s",
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                      }}
                    >
                      <div
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 9999,
                          background: isActive ? "#10B981" : "#D1D5DB",
                          flexShrink: 0,
                          transition: "all 0.15s",
                        }}
                      />
                      <span
                        style={{
                          flex: 1,
                          minWidth: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {park}
                      </span>
                    </button>
                  );
                })}
              </>
            )}
          </div>

          {/* Footer */}
          <div
            style={{
              padding: "10px 16px",
              background: "#F9FAFB",
              borderTop: "1px solid #E5E7EB",
              fontSize: 11,
              color: "#6B7280",
              textAlign: "center",
            }}
          >
            Use ↑ ↓ to navigate, Enter to select, Esc to close
          </div>
        </div>
      )}
    </div>
  );
}
