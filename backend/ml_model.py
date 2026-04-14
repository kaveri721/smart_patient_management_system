import numpy as np
import joblib
from pathlib import Path

MODEL_PATH = Path(__file__).parent / "ml_model.joblib"
SCALER_PATH = Path(__file__).parent / "ml_scaler.joblib"
_model = None
_scaler = None


def load_model():
    global _model, _scaler
    if MODEL_PATH.exists() and SCALER_PATH.exists():
        _model = joblib.load(MODEL_PATH)
        _scaler = joblib.load(SCALER_PATH)
        print("[ML] Model loaded from disk.")
    else:
        print("[ML] No saved model found — using heuristic fallback.")
        _model = None


def predict(queue_length, doctor_count, avg_consultation_time, patient_priority, time_of_day):
    features = np.array([[queue_length, doctor_count, avg_consultation_time, patient_priority, time_of_day]])
    if _model is not None:
        scaled = _scaler.transform(features)
        wait = float(_model.predict(scaled)[0])
        conf = "high"
    else:
        patients_per_doctor = queue_length / max(doctor_count, 1)
        wait = patients_per_doctor * avg_consultation_time
        wait *= (1.0 - (patient_priority / 20.0))
        if 9 <= time_of_day <= 11 or 17 <= time_of_day <= 19:
            wait *= 1.2
        conf = "medium"
    wait = max(1.0, round(wait, 1))
    return {"predicted_wait_time": wait, "confidence": conf, "model_version": "rf-v1.0" if _model else "heuristic-v1.0"}


load_model()
