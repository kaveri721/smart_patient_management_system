import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, r2_score
import joblib
from pathlib import Path


def generate_synthetic_data(n=2000):
    np.random.seed(42)
    queue_length = np.random.randint(0, 30, n)
    doctor_count = np.random.randint(1, 8, n)
    avg_consultation_time = np.random.uniform(8, 30, n)
    patient_priority = np.random.uniform(0, 10, n)
    time_of_day = np.random.uniform(8, 20, n)
    base_wait = (queue_length / doctor_count) * avg_consultation_time
    priority_discount = 1.0 - (patient_priority / 20.0)
    peak_factor = np.where((((time_of_day >= 9) & (time_of_day <= 11)) | ((time_of_day >= 17) & (time_of_day <= 19))), 1.2, 1.0)
    noise = np.random.normal(0, 3, n)
    wait_time = np.clip(base_wait * priority_discount * peak_factor + noise, 1, 180)
    return pd.DataFrame({
        "queue_length": queue_length,
        "doctor_count": doctor_count,
        "avg_consultation_time": avg_consultation_time,
        "patient_priority": patient_priority,
        "time_of_day": time_of_day,
        "wait_time_actual": wait_time
    })


def train_model(df):
    features = ["queue_length", "doctor_count", "avg_consultation_time", "patient_priority", "time_of_day"]
    target = "wait_time_actual"
    X = df[features].values
    y = df[target].values
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    scaler = StandardScaler()
    X_train_s = scaler.fit_transform(X_train)
    X_test_s = scaler.transform(X_test)
    model = RandomForestRegressor(n_estimators=200, max_depth=15, min_samples_split=5, min_samples_leaf=2, n_jobs=-1, random_state=42)
    model.fit(X_train_s, y_train)
    y_pred = model.predict(X_test_s)
    print("MAE:", round(mean_absolute_error(y_test, y_pred), 2))
    print("R2:", round(r2_score(y_test, y_pred), 4))
    out = Path(__file__).parent.parent / "backend"
    joblib.dump(model, out / "ml_model.joblib")
    joblib.dump(scaler, out / "ml_scaler.joblib")
    print("Model saved to", out)


if __name__ == "__main__":
    df = generate_synthetic_data(2000)
    train_model(df)
