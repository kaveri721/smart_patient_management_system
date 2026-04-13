from fastapi import APIRouter, Depends

from ..dependencies import require_role
from ..prediction import predict
from ..priority import calculate_priority

router = APIRouter()


@router.post("/appointments/book")
def book_appointment(
    doctor_id: int,
    severity: int,
    age: int,
    user=Depends(require_role("patient"))
):

    priority = calculate_priority(severity, 10, age)

    wait_time = predict(5, 10, 2)

    return {
        "priority_score": priority,
        "predicted_wait_time": wait_time
    }


@router.get("/queue/status")
def queue_status(user=Depends(require_role("patient"))):

    return {"position": 3}