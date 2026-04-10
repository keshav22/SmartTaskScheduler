from datetime import datetime, timedelta, time
from db.supabase import supabase

PRIORITY_MAP = {"high": 3, "medium": 2, "low": 1}


def schedule_for_next_day(user_id: str):
    # we are at day i, have to schedule for day i+1
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)

    # fetch user data & tasks
    user = supabase.table("users").select("*").eq("id", user_id).single().execute().data
    # all the tasks that the user has - not just tmrw
    all_tasks = (
        supabase.table("tasks").select("*").eq("user_id", user_id).execute().data
    )

    if not user:
        return {"error": "No user or tasks found"}

    if not all_tasks:
        return {"no tasks to schedule"}

    daily_budget_mins = user.get("daily_free_time", 4) * 60
    fixed_tmrw = []
    floating_pool = []
    # tasks that are either completed or have been scheduled for sometime until today
    satisfied_task_ids = set()

    for t in all_tasks:
        start_time_str = t.get("start_time")
        if t.get("status") == "DONE" or (
            start_time_str and datetime.fromisoformat(start_time_str).date() <= today
        ):
            satisfied_task_ids.add(t["task_id"])
            continue

        if start_time_str:
            st_dt = datetime.fromisoformat(start_time_str)
            if st_dt.date() == tomorrow:
                # if the task has a start time for tmrw - add to fixed_tmrw
                fixed_tmrw.append(t)

        else:
            # if the task hasnt been completed in the past or hasnt been scheduled for tmrw
            floating_pool.append(t)

    fixed_time_used = sum(t.get("duration", 0) for t in fixed_tmrw)
    remaining_time = daily_budget_mins - fixed_time_used

    num_scheduled_tmrw = 0
    # start scheduling at 9am
    current_time_pointer = datetime.combine(tomorrow, time(9, 0))

    # sort the fixed tasks to avoid collisions
    fixed_tmrw.sort(key=lambda x: x["start_time"])

    while floating_pool and remaining_time > 0:
        # filtering for tasks whose dependencies are satisfied
        ready_tasks = [
            t
            for t in floating_pool
            if not t.get("dependencies")
            or all(dep in satisfied_task_ids for dep in t["dependencies"])
        ]

        if not ready_tasks:
            break  # cycles or no more tasks can be unlocked

        # sort by deadline
        ready_tasks.sort(
            key=lambda x: (
                datetime.fromisoformat(x["deadline"])
                if x["deadline"]
                else datetime(9999, 12, 31),
                -PRIORITY_MAP.get(x.get("priority", "low").lower(), 1),
            )
        )

        task_to_schedule = ready_tasks[0]
        duration = task_to_schedule.get("duration")

        if duration <= remaining_time:
            for fixed in fixed_tmrw:
                f_start = datetime.fromisoformat(fixed["start_time"])
                f_end = f_start + timedelta(minutes=fixed.get("duration", 0))

                # checking for overlaps
                if (
                    current_time_pointer < f_end
                    and (current_time_pointer + timedelta(minutes=duration)) > f_start
                ):
                    current_time_pointer = f_end

            supabase.table("tasks").update(
                {"start_time": current_time_pointer.isoformat(), "status": "scheduled"}
            ).eq("task_id", task_to_schedule["task_id"]).execute()

            satisfied_task_ids.add(task_to_schedule["task_id"])
            floating_pool.remove(task_to_schedule)
            remaining_time -= duration
            current_time_pointer += timedelta(minutes=duration)
            num_scheduled_tmrw += 1
        else:
            # cant schedule it
            floating_pool.remove(task_to_schedule)

    return {
        "user": user_id,
        "scheduled_for_tomorrow": num_scheduled_tmrw,
        "remaining_time_mins": remaining_time,
    }
