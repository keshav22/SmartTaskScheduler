from fastapi import APIRouter
from services.task import get_all_tasks

router = APIRouter(prefix="/tasks", tags=["tasks"])


@router.get("/")
async def get_tasks():
    tasks = await get_all_tasks(2)
    return tasks.data
