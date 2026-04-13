from fastapi import APIRouter, Depends
from ..dependencies import require_role

router = APIRouter()


@router.post("/walkin/register")
def walkin(user=Depends(require_role("receptionist"))):

    return {"token": 12}


@router.put("/queue/update")
def update(user=Depends(require_role("receptionist"))):

    return {"queue": "updated"}