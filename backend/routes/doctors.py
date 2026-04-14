from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import Optional

from database import get_db
from models import Doctor, Appointment
from schemas import DoctorResponse, DoctorAvailabilityUpdate

router = APIRouter()


@router.get("/doctors")
def get_doctors(db: Session = Depends(get_db)):
    doctors = db.query(Doctor).all()
    return [
        {
            "doctor_id": d.doctor_id,
            "name": d.name,
            "specialization": d.specialization,
            "available_slots": d.available_slots,
            "consultation_duration_mins": d.consultation_duration_mins,
            "is_available": d.is_available
        }
        for d in doctors
    ]


@router.get("/doctors/filter", response_model=list[DoctorResponse])
def list_doctors(
    available_only: bool = Query(False),
    specialization: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Doctor)

    if available_only:
        query = query.filter(
            Doctor.is_available == True,
            Doctor.available_slots > 0
        )

    if specialization:
        query = query.filter(
            Doctor.specialization.ilike(f"%{specialization}%")
        )

    return query.all()


@router.patch("/doctors/{doctor_id}/availability", response_model=DoctorResponse)
def update_availability(
    doctor_id: int,
    update: DoctorAvailabilityUpdate,
    db: Session = Depends(get_db)
):
    doctor = db.query(Doctor).filter(Doctor.doctor_id == doctor_id).first()

    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found.")

    doctor.is_available = update.is_available

    if update.available_slots is not None:
        doctor.available_slots = update.available_slots

    db.commit()
    db.refresh(doctor)
    return doctor


@router.get("/doctors/{doctor_id}/schedule")
def get_doctor_schedule(doctor_id: int, db: Session = Depends(get_db)):
    appointments = db.query(Appointment).filter(
        Appointment.doctor_id == doctor_id
    ).order_by(Appointment.token_number.asc()).all()

    return {
        "doctor_id": doctor_id,
        "appointments": appointments,
        "total": len(appointments)
    }