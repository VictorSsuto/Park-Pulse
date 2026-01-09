from pathlib import Path
import shutil

import pandas as pd
import numpy as np
import joblib
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error


DATA_PATH = Path("data/processed/modeling_dataset_monthly.csv")
ARTIFACTS_PATH = Path("ml/artifacts")


def main() -> None:
    # ------------------------------------------------------------------
    # Load dataset
    # ------------------------------------------------------------------
    df = pd.read_csv(DATA_PATH)

    # Features and target
    X = df[
        [
            "ParkName",
            "Year",
            "Month",
            "season",
            "lag_1",
            "lag_3",
            "lag_12",
            "roll_mean_3",
            "roll_mean_6",
        ]
    ]
    y = df["target_visits"]

    # ------------------------------------------------------------------
    # Time-based train-test split
    # ------------------------------------------------------------------
    train_mask = X["Year"] <= 2016
    test_mask = X["Year"] > 2016

    X_train, X_test = X[train_mask], X[test_mask]
    y_train, y_test = y[train_mask], y[test_mask]

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples:  {len(X_test)}")

    # ------------------------------------------------------------------
    # Feature preprocessing
    # ------------------------------------------------------------------
    categorical_features = ["ParkName", "season"]
    numeric_features = [
        "Year",
        "Month",
        "lag_1",
        "lag_3",
        "lag_12",
        "roll_mean_3",
        "roll_mean_6",
    ]

    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ]
    )

    # ------------------------------------------------------------------
    # Model
    # ------------------------------------------------------------------
    model = RandomForestRegressor(
        n_estimators=200,
        random_state=42,
        n_jobs=-1,
    )

    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )

    # ------------------------------------------------------------------
    # Train
    # ------------------------------------------------------------------
    pipeline.fit(X_train, y_train)

    # ------------------------------------------------------------------
    # Evaluate
    # ------------------------------------------------------------------
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print("\n=== MODEL PERFORMANCE (MONTHLY) ===")
    print(f"MAE:  {mae:,.0f} visits")
    print(f"RMSE: {rmse:,.0f} visits")

    # ------------------------------------------------------------------
    # Plot: Actual vs Predicted over time (aggregated monthly)
    # ------------------------------------------------------------------
    plot_df = X_test.copy()
    plot_df["actual"] = y_test.values
    plot_df["predicted"] = y_pred

    # Build a proper monthly date
    plot_df["date"] = pd.to_datetime(
        plot_df["Year"].astype(str) + "-" + plot_df["Month"].astype(str) + "-01"
    )

    # Aggregate across parks for a clean, readable plot
    monthly = (
        plot_df.groupby("date", as_index=False)[["actual", "predicted"]]
        .sum()
        .sort_values("date")
    )

    plt.figure(figsize=(11, 5.5))
    plt.plot(
        monthly["date"],
        monthly["actual"],
        label="Actual",
        linewidth=2.4,
    )
    plt.plot(
        monthly["date"],
        monthly["predicted"],
        label="Predicted",
        linewidth=2.4,
        linestyle="--",
    )

    plt.title(
        f"Monthly Park Visits — Actual vs Predicted (Test Period)\n"
        f"MAE = {mae:,.0f} | RMSE = {rmse:,.0f}",
        pad=14,
    )
    plt.xlabel("Year")
    plt.ylabel("Total Visits (All Parks)")
    plt.grid(True, alpha=0.25)
    plt.legend()

    ax = plt.gca()
    ax.xaxis.set_major_locator(mdates.YearLocator())
    ax.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))
    ax.xaxis.set_minor_locator(mdates.MonthLocator(bymonth=(1, 4, 7, 10)))

    plt.tight_layout()

    # Save plot to artifacts
    ARTIFACTS_PATH.mkdir(parents=True, exist_ok=True)
    plot_path = ARTIFACTS_PATH / "monthly_actual_vs_pred.png"
    plt.savefig(plot_path, dpi=220, bbox_inches="tight")
    plt.close()

    print(f"\nPlot saved to {plot_path}")

    # ------------------------------------------------------------------
    # Copy plot into Next.js public folder (for UI)
    # ------------------------------------------------------------------
    public_plot_dir = Path("public/model")
    public_plot_dir.mkdir(parents=True, exist_ok=True)
    public_plot_path = public_plot_dir / "monthly_actual_vs_pred.png"
    shutil.copyfile(plot_path, public_plot_path)

    print(f"Plot copied to {public_plot_path}")

    # ------------------------------------------------------------------
    # Save trained model
    # ------------------------------------------------------------------
    joblib.dump(pipeline, ARTIFACTS_PATH / "monthly_model.joblib")
    print("\nModel saved to ml/artifacts/monthly_model.joblib")


if __name__ == "__main__":
    main()
