from pydantic import BaseModel


class UserCreate(BaseModel):
    name: str
    email: str
    password: str
    role: str
    phone: str


class LoginSchema(BaseModel):
    email: str
    password: str


class AppointmentCreate(BaseModel):
    doctor_id: int
    severity: int
    age: int