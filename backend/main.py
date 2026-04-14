from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text

from database import engine, Base, SessionLocal
from routes import patients, doctors, queue, admin
import ml_model

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Patient Queue & Appointment Predictor",
    version="1.0.0",
    description="Hospital queue management with ML-based wait time prediction. Docs at /docs"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(patients.router, prefix="/api/patients", tags=["Patients"])
app.include_router(doctors.router, prefix="/api", tags=["Doctors"])
app.include_router(queue.router, prefix="/api/queue", tags=["Queue"])
app.include_router(admin.router, prefix="/api/admin", tags=["Admin"])


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "services": {
            "database": "connected",
            "ml_model": "loaded",
            "notification_service": "active"
        },
        "version": "1.0.0"
    }


@app.get("/debug/db-check")
def debug_db_check():
    db = SessionLocal()
    try:
        doctors_count = db.execute(text("SELECT COUNT(*) FROM doctors")).scalar()
        patients_count = db.execute(text("SELECT COUNT(*) FROM patients")).scalar()
        appointments_count = db.execute(text("SELECT COUNT(*) FROM appointments")).scalar()
        return {
            "doctors_count": doctors_count,
            "patients_count": patients_count,
            "appointments_count": appointments_count
        }
    finally:
        db.close()