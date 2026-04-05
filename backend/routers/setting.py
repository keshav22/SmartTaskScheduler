from fastapi import APIRouter, HTTPException
from services.setting import update_settings_data

router = APIRouter()


@router.patch("/settings/{type}")
async def update_settings(type: str, data: dict):
    try:
        result = await update_settings_data(type, data)  # user_id required too
        return {"success": True, "data": result}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
