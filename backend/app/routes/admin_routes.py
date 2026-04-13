from fastapi import APIRouter, Depends
from ..dependencies import require_role

router = APIRouter()


@router.post("/doctor/add")
def add(user=Depends(require_role("admin"))):

    return {"message": "doctor added"}


@router.get("/analytics/wait-times")
def analytics(user=Depends(require_role("admin"))):

    return {"avg_wait_time": 20}