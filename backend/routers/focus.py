from typing import Optional

from fastapi import Request, APIRouter, HTTPException
from services.focus import get_focus_page_details
from utils.user import get_current_user_from_state


router = APIRouter(prefix="/focus", tags=["tasks"])


@router.get("/")
@router.get("/{task_id}")
async def get_focus(request: Request, task_id: Optional[int] = None):
    try:
        user = get_current_user_from_state(request)
        print("here")
        response = await get_focus_page_details(user["sub"], task_id)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
