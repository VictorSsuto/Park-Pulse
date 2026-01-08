
export const metadata = {
  title: "About — Park Pulse",
};

export default function AboutPage() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: 32,
        background:
          "linear-gradient(180deg, #e7efe7 0%, #f3f7f3 60%, #ffffff 100%)",
      }}
    >
         <div style={{ maxWidth: 1100, margin: "0 auto", paddingTop: 24 }}></div>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <h1
          style={{
            fontSize: 44,
            fontWeight: 950,
            color: "#1f3d2b",
            letterSpacing: -0.6,
            marginTop: 0,
          }}
        >
          About Park Pulse
        </h1>

        <p style={{ marginTop: 10, fontSize: 17, color: "#4b6b57", lineHeight: 1.6 }}>
          Park Pulse helps you explore crowd forecasts across U.S. National Parks so you can plan
          trips with more confidence — whether you’re chasing quiet trails or peak-season energy.
        </p>

        <div
          style={{
            marginTop: 18,
            borderRadius: 18,
            border: "1px solid #dde6dd",
            background: "#ffffff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
            padding: 18,
          }}
        >
          <div style={{ fontWeight: 900, color: "#1f3d2b", marginBottom: 8 }}>
            What you’re seeing
          </div>

          <ul style={{ margin: 0, paddingLeft: 18, color: "#355f45", lineHeight: 1.7 }}>
            <li>
              Map markers show a predicted crowd level for the selected forecast month.
            </li>
            <li>
              Each park page provides a month-by-month forecast and thresholds used to classify crowding.
            </li>
            <li>
              Forecast horizon is limited to 36 months (3 years).
            </li>
          </ul>
        </div>

        <div style={{ marginTop: 18, color: "#6b7f71", fontSize: 13, fontWeight: 650 }}>
          🌲 Park Pulse — Developed by Victor Ssuto
        </div>
      </div>
    </main>
  );
}
