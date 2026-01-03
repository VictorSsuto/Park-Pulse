from pathlib import Path
import pandas as pd

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error
import joblib
import numpy as np


DATA_PATH = Path("data/processed/modeling_dataset.csv")
ARTIFACTS_PATH = Path("ml/artifacts")


def main() -> None:
    #load dataset
    df = pd.read_csv(DATA_PATH)

    #Features and target
    X = df[["ParkName", "Region", "Year"]]
    y = df["target_visits"]

    #Train-test split (time-based)
    train_mask = X["Year"] <= 2016
    test_mask = X["Year"] > 2016
    X_train, X_test = X[train_mask], X[test_mask]
    y_train, y_test = y[train_mask], y[test_mask]

    print(f"Training samples: {len(X_train)}")
    print(f"Testing samples:  {len(X_test)}")

    #feature preprocessing
    categorical_features = ["ParkName", "Region"]
    numeric_features = ["Year"]
    # Converting text into numbers
    preprocessor = ColumnTransformer(
        transformers=[
            ("cat", OneHotEncoder(handle_unknown="ignore"), categorical_features),
            ("num", "passthrough", numeric_features),
        ]
    )

    #Baseline Model 
    model = RandomForestRegressor(
        n_estimators=100, 
        random_state=42,
        n_jobs = -1,
        )
     # Full pipeline: preprocessing + model
    pipeline = Pipeline(
        steps=[
            ("preprocessor", preprocessor),
            ("model", model),
        ]
    )
    #Train the model
    pipeline.fit(X_train, y_train)

    #Evaluate the model
    y_pred = pipeline.predict(X_test)
    #Mean absolute error
    mae = mean_absolute_error(y_test, y_pred)
    #Root mean squared error
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))

    print("\n=== MODEL PERFORMANCE ===")
    print(f"MAE:  {mae:,.0f} visits")
    print(f"RMSE: {rmse:,.0f} visits")

    #  Save model
    
    ARTIFACTS_PATH.mkdir(parents=True, exist_ok=True)
    joblib.dump(pipeline, ARTIFACTS_PATH / "baseline_model.joblib")

    print("\nModel saved to ml/artifacts/baseline_model.joblib")


if __name__ == "__main__":
    main()