from pathlib import Path
import pandas as pd
import numpy as np
import joblib

from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error

DATA_PATH = Path("data/processed/modeling_dataset_monthly.csv")
ARTIFACTS_PATH = Path("ml/artifacts")


def main() -> None:
    # Load dataset
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

    # Time-based train-test split
    train_mask = X["Year"] <= 2016
    test_mask = X["Year"] > 2016

    X_train, X_test = X[train_mask], X[test_mask]
    y_train, y_test = y[train_mask], y[test_mask]

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples:  {len(X_test)}")

    # Feature preprocessing
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

    # Model
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

    # Train
    pipeline.fit(X_train, y_train)

    # Evaluate
    y_pred = pipeline.predict(X_test)
    mae = mean_absolute_error(y_test, y_pred)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print("\n=== MODEL PERFORMANCE (MONTHLY) ===")
    print(f"MAE:  {mae:,.0f} visits")
    print(f"RMSE: {rmse:,.0f} visits")

    # Save model
    ARTIFACTS_PATH.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, ARTIFACTS_PATH / "monthly_model.joblib")

    print("\nModel saved to ml/artifacts/monthly_model.joblib")


if __name__ == "__main__":
    main()
