from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routes import (
    auth_routes,
    patient_routes,
    doctor_routes,
    admin_routes,
    receptionist_routes,
)

app = FastAPI()


# Enable CORS (required for React frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routes
app.include_router(auth_routes.router)
app.include_router(patient_routes.router)
app.include_router(doctor_routes.router)
app.include_router(admin_routes.router)
app.include_router(receptionist_routes.router)


@app.get("/")
def root():
    return {"status": "running"}