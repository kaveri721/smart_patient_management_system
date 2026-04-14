from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from database import get_db
from models import Appointment, Doctor, Patient
from schemas import WaitTimePrediction, WaitTimePredictionResponse
import ml_model

router = APIRouter()


@router.get("/status")
def get_queue_status(db: Session = Depends(get_db)):
    queue_length = db.query(func.count(Appointment.appointment_id)).filter(Appointment.status.in_(["confirmed", "pending"])).scalar() or 0
    active_doctors = db.query(func.count(Doctor.doctor_id)).filter(Doctor.is_available == True).scalar() or 1
    priority_patients = db.query(func.count(Appointment.appointment_id)).join(Patient).filter(Appointment.status.in_(["confirmed", "pending"]), Patient.priority_score >= 7.0).scalar() or 0
    avg_consult = db.query(func.avg(Doctor.consultation_duration_mins)).filter(Doctor.is_available == True).scalar() or 15.0
    prediction = ml_model.predict(queue_length, active_doctors, float(avg_consult), 5.0, datetime.now().hour + datetime.now().minute / 60)
    max_token = db.query(func.max(Appointment.token_number)).filter(Appointment.status.in_(["confirmed", "pending"])).scalar() or 0
    return {
        "queue_length": queue_length,
        "active_doctors": active_doctors,
        "predicted_wait_time": prediction["predicted_wait_time"],
        "priority_patients": priority_patients,
        "next_token": max_token + 1
    }


@router.post("/predict-wait", response_model=WaitTimePredictionResponse)
def predict_wait_time(data: WaitTimePrediction):
    result = ml_model.predict(data.queue_length, data.doctor_count, data.avg_consultation_time, data.patient_priority, data.time_of_day)
    return WaitTimePredictionResponse(**result)
