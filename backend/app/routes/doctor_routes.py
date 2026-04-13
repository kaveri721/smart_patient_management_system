from fastapi import APIRouter, Depends
from ..dependencies import require_role

router = APIRouter()


@router.get("/doctor/appointments/today")
def today(user=Depends(require_role("doctor"))):

    return {"appointments": []}


@router.post("/doctor/update-consultation")
def update(user=Depends(require_role("doctor"))):

    return {"status": "updated"}