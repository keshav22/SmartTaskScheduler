from fastapi import Request, APIRouter, HTTPException
from services.setting import update_settings_data
from utils.user import get_current_user_from_state

router = APIRouter()


@router.patch("/settings")
async def update_settings(request: Request, task_data: dict):
    try:
        user_id = get_current_user_from_state(request)["sub"]
        print("User ID:", user_id)
        result = await update_settings_data(
            user_id, task_data["data"]
        )  # user_id required too
        print("Updated succe3ssfully:", result)
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
