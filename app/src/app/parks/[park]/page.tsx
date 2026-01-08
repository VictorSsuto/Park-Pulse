"use client";

import { useParams } from "next/navigation";

export default function ParkPage() {
  const params = useParams<{ park: string }>();

  return (
    <main style={{ padding: 32 }}>
      <h1>Park page</h1>
      <p>Park param:</p>
      <pre>{params.park}</pre>
    </main>
  );
}
