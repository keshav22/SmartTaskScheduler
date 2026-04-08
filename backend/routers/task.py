from fastapi import APIRouter, HTTPException
from services.task import get_all_tasks, create_task, delete_task
from pydantic import BaseModel

router = APIRouter(prefix="/tasks", tags=["tasks"])


class DeletePayload(BaseModel):
    ids: list[str]


@router.get("/")
async def get_tasks():
    tasks = await get_all_tasks(2)
    return tasks.data


@router.post("/add")
async def add_task(task_data: dict):
    response = await create_task(2, task_data)
    return response


@router.delete("/delete")
async def delete_tasks(payload: DeletePayload):
    try:
        response = await delete_task(2, payload.ids)
        return {"success": True, "data": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
