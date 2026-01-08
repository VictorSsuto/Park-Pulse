"use client";

type Crowd = "low" | "medium" | "high";

export type ForecastRow = {
  Year: number;
  Month: number;
  predicted_visits: number;
  crowd_level: Crowd;
  low_threshold?: number;
  high_threshold?: number;
};

const MONTHS = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];


function pillStyle(level: Crowd, active: boolean) {
  const themed =
    level === "low"
      ? { bg: "#e7f4ea", border: "#7bc47f", text: "#1f5f25" }
      : level === "medium"
      ? { bg: "#fff4e1", border: "#f4b860", text: "#6a4300" }
      : { bg: "#fdeaea", border: "#e57373", text: "#7a1f1f" };

  return {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "8px 12px",
    borderRadius: 999,
    border: `1px solid ${active ? themed.border : "#d7e2d7"}`,
    background: active ? themed.bg : "#f3f7f3",          // ✅ readable inactive
    color: active ? themed.text : "#2b3a2f",            // ✅ readable inactive
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.4,
    cursor: "pointer",
    userSelect: "none",
    transition: "transform 120ms ease",
  } as React.CSSProperties;
}



export default function MonthStrip({
  rows,
  selectedIndex,
  onSelect,
}: {
  rows: ForecastRow[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}) {
  // show first 12 months (or fewer if not enough)
  const shown = rows.slice(0, 12);

  return (
    <div
      style={{
        display: "flex",
        gap: 10,
        flexWrap: "wrap",
        padding: 14,
      }}
    >
      {shown.map((r, idx) => {
        const label = `${MONTHS[r.Month - 1]} ${String(r.Year).slice(2)}`;
        const active = idx === selectedIndex;

        return (
          <button
            key={`${r.Year}-${r.Month}`}
            type="button"
            onClick={() => onSelect(idx)}
            style={pillStyle(r.crowd_level, active)}
            title={`${r.Year}-${String(r.Month).padStart(2, "0")} • ${Math.round(r.predicted_visits).toLocaleString()} visits • ${r.crowd_level}`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
