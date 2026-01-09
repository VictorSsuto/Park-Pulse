import Image from "next/image";

export default function ModelPage() {
  const Stat = ({
    label,
    value,
    sub,
  }: {
    label: string;
    value: string;
    sub?: string;
  }) => (
    <div
      style={{
        border: "1px solid #dfe9df",
        background: "#ffffff",
        borderRadius: 16,
        padding: 14,
        boxShadow: "0 8px 24px rgba(16, 24, 40, 0.06)",
      }}
    >
      <div style={{ fontSize: 12, fontWeight: 800, color: "#1f3d2b", opacity: 0.8 }}>
        {label}
      </div>
      <div style={{ marginTop: 6, fontSize: 22, fontWeight: 950, color: "#0f2418" }}>
        {value}
      </div>
      {sub ? (
        <div style={{ marginTop: 6, fontSize: 13, color: "#1f3d2b", opacity: 0.8 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );

  const Card = ({
    title,
    children,
  }: {
    title: string;
    children: React.ReactNode;
  }) => (
    <section
      style={{
        border: "1px solid #dfe9df",
        background: "#ffffff",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 10px 28px rgba(16, 24, 40, 0.06)",
      }}
    >
      <h2
        style={{
          margin: 0,
          fontSize: 16,
          fontWeight: 950,
          color: "#0f2418",
          letterSpacing: 0.2,
        }}
      >
        {title}
      </h2>
      <div style={{ marginTop: 10, color: "#1f3d2b", lineHeight: 1.7 }}>
        {children}
      </div>
    </section>
  );

  const Pill = ({ text }: { text: string }) => (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "6px 10px",
        borderRadius: 999,
        border: "1px solid #dfe9df",
        background: "#f3f8f4",
        color: "#1f3d2b",
        fontSize: 13,
        fontWeight: 750,
      }}
    >
      {text}
    </span>
  );

  return (
    <main
      style={{
        minHeight: "calc(100vh - 60px)",
        background: "linear-gradient(180deg, #eef5ef 0%, #f7fbf7 100%)",
        padding: "28px 18px 60px",
      }}
    >
      <div style={{ maxWidth: 1050, margin: "0 auto" }}>
        {/* Header */}
        <header style={{ marginBottom: 16 }}>
          <h1
            style={{
              margin: 0,
              fontSize: 36,
              fontWeight: 950,
              color: "#0f2418",
              letterSpacing: -0.4,
            }}
          >
            Model
          </h1>
          <p
            style={{
              marginTop: 8,
              marginBottom: 0,
              maxWidth: 820,
              color: "#1f3d2b",
              opacity: 0.86,
              lineHeight: 1.7,
            }}
          >
            Park Pulse uses a <b>monthly time-series regression pipeline</b> to
            predict park visits. We engineer lag + rolling features, train a model
            on historical months, and evaluate on future months to simulate real
            forecasting.
          </p>
        </header>

        {/* Stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            gap: 12,
            marginBottom: 14,
          }}
        >
          <Stat label="Training samples" value="27,347" sub="Months across all parks" />
          <Stat label="Testing samples" value="6,703" sub="Held-out future months" />
          <Stat label="MAE" value="21,666" sub="Avg absolute error (visits)" />
          <Stat label="RMSE" value="51,582" sub="Penalizes larger errors" />
        </div>

        {/* Layout */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.2fr 0.8fr",
            gap: 14,
            alignItems: "start",
          }}
        >
          {/* Left: Graph + explanation */}
          <div style={{ display: "grid", gap: 14 }}>
            <Card title="Actual vs Predicted (Test Period)">
              <p style={{ margin: 0 }}>
                This chart compares the model’s predictions to the real observed
                monthly visits on the <b>test period</b>. A close overlap means the
                model is capturing trend + seasonality well.
              </p>

              <div
                style={{
                  marginTop: 12,
                  borderRadius: 16,
                  overflow: "hidden",
                  border: "1px solid #dfe9df",
                  background: "#f7fbf7",
                }}
              >
    <img
  src="/model/monthly_actual_vs_pred.png"
  alt="Monthly visits: actual vs predicted"
  style={{
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: 16,
  }}
/>



              </div>

              <p style={{ margin: "10px 0 0", opacity: 0.85 }}>
                Interpretation: MAE (~21.7k) is the average monthly miss in visits.
                RMSE (~51.6k) increases when the model makes a few large mistakes
                (spikes / extreme months).
              </p>
            </Card>

            <Card title="Data Science Workflow">
              <ol style={{ margin: 0, paddingLeft: 18 }}>
                <li>
                  <b>EDA:</b> distributions, missing values, outliers, and seasonal patterns
                </li>
                <li>
                  <b>Feature engineering:</b> lags (1, 3, 12) + rolling means (3, 6)
                </li>
                <li>
                  <b>Time split:</b> train on ≤ 2016, test on &gt; 2016 (no leakage)
                </li>
                <li>
                  <b>Training:</b> preprocess + model in one pipeline
                </li>
                <li>
                  <b>Evaluation:</b> MAE + RMSE + visual inspection of fit
                </li>
              </ol>
            </Card>
          </div>

          {/* Right: Model details */}
          <div style={{ display: "grid", gap: 14 }}>
            <Card title="Model & Features">
              <p style={{ margin: 0 }}>
                We use a <b>Random Forest Regressor</b> with a preprocessing pipeline:
              </p>

              <ul style={{ margin: "10px 0 0", paddingLeft: 18 }}>
                <li>
                  <b>Categorical:</b> ParkName, season → One-hot encoded
                </li>
                <li>
                  <b>Numeric:</b> Year, Month, lag_1, lag_3, lag_12, roll_mean_3, roll_mean_6
                </li>
              </ul>

              <p style={{ margin: "10px 0 0", opacity: 0.85 }}>
                This setup captures repeating seasonal patterns while letting the
                model learn non-linear relationships between recent history and future visits.
              </p>
            </Card>

            <Card title="Tools & Technologies">
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                <Pill text="Python" />
                <Pill text="Pandas / NumPy" />
                <Pill text="Scikit-learn" />
                <Pill text="Matplotlib" />
                <Pill text="Joblib" />
              </div>
            </Card>

            <Card title="Notes">
              <ul style={{ margin: 0, paddingLeft: 18 }}>
                <li>
                  The test split uses future years to mimic real-world forecasting.
                </li>
                <li>
                  Metrics are in <b>visits</b>, so they are easy to interpret.
                </li>
                <li>
                  The chart is the best quick sanity-check for bias and seasonality fit.
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
