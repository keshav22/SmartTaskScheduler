from datetime import datetime, timedelta
from db.supabase import supabase


def schedule_user_tasks(user_id: str):
    user_settings = (
        supabase.table("users").select("*").eq("id", user_id).single().execute().data
    )
    if not user_settings:
        return

    daily_budget = user_settings.get("daily_free_time", 4)
    budget_in_mins = daily_budget * 60

    tasks = (
        supabase.table("tasks")
        .select("*")
        .eq("user_id", user_id)
        .eq("status", "pending")
        .execute()
        .data
    )

    fixed_tasks = [t for t in tasks if t["start_time"] is not None]
    # tasks with a given start time
    floating_tasks = [t for t in tasks if t["start_time"] is None]
    # tasks without a given start time

    used_mins = sum(t["duration"] for t in fixed_tasks)
    # time that has been used up in the time that was there
    remaning_budget = budget_in_mins - used_mins

    floating_tasks.sort(
        key=lambda x: (x["deadline"] or "9999", -int(x["priority"] or 0))
    )
    # deadline first, priority then

    scheduled_for_today = []
    current_fill = 0

    for task in floating_tasks:
        if current_fill + task["duration"] <= remaning_budget:
            scheduled_for_today.append(task["task_id"])
            current_fill += task["duration"]

            supabase.table("tasks").update(
                {"status": "scheduled", "start_time": datetime.now().isoformat()}
            ).eq("task_id", task["task_id"]).execute()
        else:
            pass  # task stays pending
    return {"user_id": user_id, "scheduled_count": len(scheduled_for_today)}


def run_global_scheduler():
    users = supabase.table("users").select("id").execute().data
    results = []
    for user in users:
        res = schedule_user_tasks(user["id"])
        results.append(res)

    return results
