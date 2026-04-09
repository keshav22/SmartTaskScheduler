from fastapi import Request, APIRouter, HTTPException
from utils.user import get_current_user_from_state
from services.task import get_all_tasks, create_task, edit_task, delete_task
from pydantic import BaseModel

router = APIRouter(prefix="/tasks", tags=["tasks"])


class DeletePayload(BaseModel):
    ids: list[str]


@router.get("/")
async def get_tasks(request: Request):
    user = get_current_user_from_state(request)
    tasks = await get_all_tasks(user["sub"])
    return tasks.data


@router.post("/add")
async def add_task(request: Request, task_data: dict):
    user = get_current_user_from_state(request)
    response = await create_task(user["sub"], task_data)
    return response


@router.patch("/edit/{task_id}")
async def update_task(request: Request, task_id: int, task_data: dict):
    user = get_current_user_from_state(request)
    response = await edit_task(user["sub"], task_id, task_data)
    return response


@router.delete("/delete")
async def delete_tasks(request: Request, payload: DeletePayload):
    try:
        user = get_current_user_from_state(request)
        response = await delete_task(user["sub"], payload.ids)
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
