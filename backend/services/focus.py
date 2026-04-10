from services.user import get_user_focus_settings
from services.task import get_task, get_all_tasks


async def get_focus_page_details(user_id, task_id):
    current_task = None
    next_task = None
    total_tasks = None

    if task_id:
        resp = await get_task(user_id, task_id)
        current_task = resp.data[0]

    response = await get_all_tasks(user_id)

    tasks = response.data
    total_tasks = len(tasks)

    if not current_task and len(tasks) > 0:
        current_task = tasks[0]

    if len(tasks) > 1:
        if tasks[0]["task_id"] != task_id:  # type: ignore
            next_task = tasks[0]
        else:
            next_task = tasks[1]

    user_setting_resp = await get_user_focus_settings(user_id)
    user_setting = user_setting_resp.data[0]

    return {
        "current_task": current_task,
        "next_task": next_task,
        "user_setting": user_setting,
        "total_tasks": total_tasks,
    }
