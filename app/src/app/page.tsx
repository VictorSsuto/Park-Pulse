"use client";

import { useEffect, useState } from "react";
import { getParks } from "@/lib/api";

export default function Home() {
  const [parks, setParks] = useState<string[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const data = await getParks();
        setParks(data);
      } catch (e: any) {
        setError(e?.message ?? "Error loading parks");
      }
    })();
  }, []);

  return (
    <main style={{ padding: 24 }}>
      <h1 style={{ fontSize: 36, fontWeight: 700 }}>Park Pulse</h1>
      <p style={{ marginTop: 8, color: "#555" }}>Frontend ↔ Backend test</p>

      {error && (
        <div style={{ marginTop: 16, padding: 12, border: "1px solid #fca5a5", background: "#fef2f2", color: "#991b1b" }}>
          {error}
        </div>
      )}

      <div style={{ marginTop: 20, padding: 16, border: "1px solid #ddd", borderRadius: 12, background: "white" }}>
        <h2 style={{ fontWeight: 600, marginBottom: 10 }}>Parks from API</h2>
        <ul>
          {parks.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>
      </div>
    </main>
  );
}
