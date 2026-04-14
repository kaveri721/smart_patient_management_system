from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class PatientCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    age: int = Field(..., ge=0, le=120)
    phone: str = Field(..., min_length=10, max_length=15)
    symptoms: Optional[str] = None
    priority_score: Optional[float] = Field(1.0, ge=0.0, le=10.0)


class PatientResponse(BaseModel):
    patient_id: int
    name: str
    age: int
    phone: str
    symptoms: Optional[str]
    priority_score: float
    created_at: datetime
    class Config:
        orm_mode = True


class DoctorResponse(BaseModel):
    doctor_id: int
    name: str
    specialization: str
    available_slots: int
    consultation_duration_mins: int
    is_available: bool
    class Config:
        orm_mode = True


class DoctorAvailabilityUpdate(BaseModel):
    is_available: bool
    available_slots: Optional[int] = Field(None, ge=0, le=50)


class AppointmentCreate(BaseModel):
    patient_id: int
    doctor_id: int
    appointment_date: Optional[datetime] = None


class AppointmentResponse(BaseModel):
    appointment_id: int
    patient_id: int
    doctor_id: int
    token_number: int
    predicted_wait_time: Optional[float]
    status: str
    appointment_date: Optional[datetime]
    created_at: datetime
    class Config:
        orm_mode = True


class WaitTimePrediction(BaseModel):
    queue_length: int
    doctor_count: int
    avg_consultation_time: float
    patient_priority: float
    time_of_day: float


class WaitTimePredictionResponse(BaseModel):
    predicted_wait_time: float
    confidence: str
    model_version: str
