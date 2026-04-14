from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, extract
from datetime import date
from database import get_db
from models import Patient, Doctor, Appointment

router = APIRouter()


@router.get("/analytics/dashboard")
def analytics_dashboard(db: Session = Depends(get_db)):
    today = date.today()
    total_today = db.query(func.count(Appointment.appointment_id)).filter(func.date(Appointment.created_at) == today).scalar() or 0
    avg_wait = db.query(func.avg(Appointment.predicted_wait_time)).filter(func.date(Appointment.created_at) == today).scalar() or 0.0
    active_queue = db.query(func.count(Appointment.appointment_id)).filter(Appointment.status.in_(["confirmed", "pending"])).scalar() or 0
    completed = db.query(func.count(Appointment.appointment_id)).filter(Appointment.status == "completed", func.date(Appointment.created_at) == today).scalar() or 0
    doctors = db.query(Doctor).all()
    utilization = []
    for doc in doctors:
        pts_today = db.query(func.count(Appointment.appointment_id)).filter(Appointment.doctor_id == doc.doctor_id, func.date(Appointment.created_at) == today).scalar() or 0
        rate = min(100.0, (pts_today / max(doc.available_slots or 1, 1)) * 100)
        utilization.append({
            "doctor_id": doc.doctor_id,
            "doctor_name": doc.name,
            "specialization": doc.specialization,
            "patients_today": pts_today,
            "utilization_rate": round(rate, 1),
            "avg_consultation_time": doc.consultation_duration_mins
        })
    hourly = []
    for h in range(8, 20):
        cnt = db.query(func.count(Appointment.appointment_id)).filter(func.date(Appointment.created_at) == today, extract("hour", Appointment.created_at) == h).scalar() or 0
        avg_w = db.query(func.avg(Appointment.predicted_wait_time)).filter(func.date(Appointment.created_at) == today, extract("hour", Appointment.created_at) == h).scalar() or 0.0
        hourly.append({"hour": h, "patient_count": cnt, "avg_wait_time": round(float(avg_w), 1)})
    return {
        "total_patients_today": total_today,
        "avg_waiting_time": round(float(avg_wait), 1),
        "active_queue_length": active_queue,
        "completed_consultations": completed,
        "doctor_utilization": utilization,
        "hourly_load": hourly
    }


@router.get("/patients")
def admin_list_patients(db: Session = Depends(get_db)):
    patients = db.query(Patient).order_by(Patient.created_at.desc()).all()
    return {"total": len(patients), "patients": patients}


@router.get("/queue/monitoring")
def queue_monitoring(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    result = []
    for doc in doctors:
        waiting = db.query(func.count(Appointment.appointment_id)).filter(Appointment.doctor_id == doc.doctor_id, Appointment.status.in_(["confirmed", "pending"])).scalar() or 0
        in_prog = db.query(func.count(Appointment.appointment_id)).filter(Appointment.doctor_id == doc.doctor_id, Appointment.status == "in_progress").scalar() or 0
        result.append({
            "doctor_id": doc.doctor_id,
            "doctor_name": doc.name,
            "specialization": doc.specialization,
            "is_available": doc.is_available,
            "available_slots": doc.available_slots,
            "waiting_count": waiting,
            "in_progress": in_prog
        })
    return {"doctors": result, "timestamp": today.isoformat() if (today := date.today()) else ""}
