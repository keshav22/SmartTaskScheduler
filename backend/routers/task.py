from fastapi import APIRouter
from services.task import get_all_tasks, create_task, edit_task, get_task

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/")
async def get_tasks():
    tasks = await get_all_tasks(2)
    return tasks.data


@router.post("/")
async def add_task(task_data: dict):
    response = await create_task(2, task_data)
    return response


@router.patch("/{task_id}")
async def update_task(task_id: int, task_data: dict):
    response = await edit_task(2, task_id, task_data)
    return response


@router.get("/{task_id}")
async def get_task(task_id: int):
    pass
