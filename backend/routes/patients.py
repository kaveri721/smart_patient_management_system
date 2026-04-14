from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime
from database import get_db
from models import Patient, Appointment, Doctor, Notification
from schemas import PatientCreate, PatientResponse, AppointmentCreate, AppointmentResponse
import ml_model

router = APIRouter()


@router.post("/register", response_model=PatientResponse, status_code=201)
def register_patient(patient: PatientCreate, db: Session = Depends(get_db)):
    existing = db.query(Patient).filter(Patient.phone == patient.phone).first()
    if existing:
        raise HTTPException(status_code=409, detail="Phone number already registered.")
    db_patient = Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient


@router.post("/appointments/book", response_model=AppointmentResponse, status_code=201)
def book_appointment(appt: AppointmentCreate, db: Session = Depends(get_db)):
    patient = db.query(Patient).filter(Patient.patient_id == appt.patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found.")
    doctor = db.query(Doctor).filter(Doctor.doctor_id == appt.doctor_id, Doctor.is_available == True).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found or unavailable.")
    queue_count = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.doctor_id == appt.doctor_id,
        Appointment.status.in_(["pending", "confirmed", "in_progress"])
    ).scalar() or 0
    token_number = queue_count + 1
    now = datetime.now()
    prediction = ml_model.predict(queue_count, 1, float(doctor.consultation_duration_mins), float(patient.priority_score), now.hour + now.minute / 60)
    db_appt = Appointment(
        patient_id=appt.patient_id,
        doctor_id=appt.doctor_id,
        token_number=token_number,
        predicted_wait_time=prediction["predicted_wait_time"],
        status="confirmed",
        appointment_date=appt.appointment_date
    )
    db.add(db_appt)
    doctor.available_slots = max(0, doctor.available_slots - 1)
    notif = Notification(patient_id=appt.patient_id, message=f"Appointment confirmed with {doctor.name}. Token #{token_number}. Estimated wait: {prediction['predicted_wait_time']} minutes.")
    db.add(notif)
    db.commit()
    db.refresh(db_appt)
    return db_appt


@router.get("/{patient_id}/queue-status")
def get_queue_status(patient_id: int, db: Session = Depends(get_db)):
    appt = db.query(Appointment).filter(Appointment.patient_id == patient_id, Appointment.status.in_(["confirmed", "pending"])).order_by(Appointment.created_at.desc()).first()
    if not appt:
        raise HTTPException(status_code=404, detail="No active appointment found.")
    ahead = db.query(func.count(Appointment.appointment_id)).filter(
        Appointment.doctor_id == appt.doctor_id,
        Appointment.token_number < appt.token_number,
        Appointment.status.in_(["confirmed", "pending"])
    ).scalar() or 0
    return {
        "patient_id": patient_id,
        "appointment_id": appt.appointment_id,
        "token_number": appt.token_number,
        "queue_position": ahead + 1,
        "patients_ahead": ahead,
        "predicted_wait_time": appt.predicted_wait_time,
        "status": appt.status,
        "doctor_id": appt.doctor_id
    }
