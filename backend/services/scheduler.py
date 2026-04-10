from datetime import datetime, timedelta, time
from db.supabase import supabase
import json

PRIORITY_MAP = {"high": 3, "medium": 2, "low": 1}


def parse_to_naive(dt_str: str):
    """Safely converts any ISO string to a naive datetime object."""
    if not dt_str:
        return None
    try:
        # fromisoformat handles the Z and +00:00,
        # .replace(tzinfo=None) strips the 'aware' part.
        return datetime.fromisoformat(dt_str).replace(tzinfo=None)
    except (ValueError, TypeError):
        return None


def schedule_for_next_day(user_id: str):
    today = datetime.now().date()
    tomorrow = today + timedelta(days=1)

    # 1. Fetch Data
    user_req = supabase.table("users").select("*").eq("id", user_id).single().execute()
    user = user_req.data
    tasks_req = supabase.table("tasks").select("*").eq("user_id", user_id).execute()
    all_tasks = tasks_req.data

    if not user:
        return {"error": "User not found"}
    if not all_tasks or len(all_tasks) == 0:
        return {"user": user_id, "status": "no tasks"}

    # 2. Setup
    daily_budget_mins = user.get("daily_free_time", 4) * 60
    fixed_tmrw = []
    floating_pool = []
    satisfied_task_ids = set()

    print(f"\n--- Processing User: {user_id} ---")

    # 3. Categorize
    for t in all_tasks:
        # Convert ID to string for reliable lookup
        tid = str(t["task_id"])
        start_time_str = t.get("start_time")
        status = str(t.get("status", "")).upper()

        # If it's finished, it clears dependencies
        if status in ["DONE", "COMPLETED"]:
            satisfied_task_ids.add(tid)
            continue

        if start_time_str:
            st_dt = parse_to_naive(start_time_str)
            if st_dt.date() == tomorrow:
                fixed_tmrw.append(t)
                satisfied_task_ids.add(tid)
            else:
                # Scheduled for another day -> counts as satisfied for tmrw
                satisfied_task_ids.add(tid)
        else:
            floating_pool.append(t)

    # 4. Math & Sorting
    fixed_time_used = sum(t.get("duration", 0) for t in fixed_tmrw)
    remaining_time = daily_budget_mins - fixed_time_used
    current_time_pointer = datetime.combine(tomorrow, time(9, 0))
    fixed_tmrw.sort(key=lambda x: x["start_time"])

    num_scheduled = 0

    # 5. The Scheduling Loop
    while floating_pool and remaining_time > 0:
        # CHECK: Are dependencies satisfied? (Using String comparison)
        ready_tasks = []
        for t in floating_pool:
            raw_deps = t.get("dependencies")
            deps = []

            # 1. Handle the "TEXT" type conversion
            if raw_deps and isinstance(raw_deps, str):
                try:
                    # Convert "[34, 35]" string -> [34, 35] list
                    deps = json.loads(raw_deps)
                except json.JSONDecodeError:
                    # If it's just a single ID or malformed, handle it
                    deps = []
            elif isinstance(raw_deps, list):
                deps = raw_deps

            # 2. Check if Ready
            if not deps or len(deps) == 0:
                ready_tasks.append(t)
            elif all(str(d) in satisfied_task_ids for d in deps):
                ready_tasks.append(t)

        # Sort: Deadline first, then Priority
        ready_tasks.sort(
            key=lambda x: (
                parse_to_naive(x.get("deadline")) or datetime(9999, 12, 31),
                -PRIORITY_MAP.get(str(x.get("priority", "low")).lower(), 1),
            )
        )

        task = ready_tasks[0]
        duration = task.get("duration") or 0

        if duration <= remaining_time:
            # Handle collisions with fixed tasks
            collision = True
            while collision:
                collision = False
                for fixed in fixed_tmrw:
                    f_start = parse_to_naive(fixed.get("start_time"))
                    f_end = f_start + timedelta(minutes=fixed.get("duration", 0))
                    if (
                        current_time_pointer < f_end
                        and (current_time_pointer + timedelta(minutes=duration))
                        > f_start
                    ):
                        current_time_pointer = f_end
                        collision = True

            # Final check to stay within the target date
            if current_time_pointer.date() == tomorrow:
                print(
                    f"DEBUG: Scheduling Task {task['task_id']} at {current_time_pointer}"
                )
                supabase.table("tasks").update(
                    {
                        "start_time": current_time_pointer.isoformat(),
                        "status": "scheduled",
                    }
                ).eq("task_id", task["task_id"]).execute()

                satisfied_task_ids.add(str(task["task_id"]))
                floating_pool.remove(task)
                remaining_time -= duration
                current_time_pointer += timedelta(minutes=duration)
                num_scheduled += 1
            else:
                floating_pool.remove(task)  # Out of time
        else:
            floating_pool.remove(task)  # Too long

    return {
        "user": user_id,
        "scheduled_for_tomorrow": num_scheduled,
        "remaining_time_mins": remaining_time,
    }


# def schedule_for_next_day(user_id: str):
#     # we are at day i, have to schedule for day i+1
#     today = datetime.now().date()
#     tomorrow = today + timedelta(days=1)

#     # fetch user data & tasks
#     user = supabase.table("users").select("*").eq("id", user_id).single().execute().data
#     # all the tasks that the user has - not just tmrw
#     all_tasks = (
#         supabase.table("tasks").select("*").eq("user_id", user_id).execute().data
#     )

#     if not user:
#         return {"error": "No user or tasks found"}

#     if not all_tasks:
#         return {"no tasks to schedule"}

#     daily_budget_mins = user.get("daily_free_time", 4) * 60
#     fixed_tmrw = []
#     floating_pool = []
#     # tasks that are either completed or have been scheduled for sometime until today
#     satisfied_task_ids = set()

#     for t in all_tasks:
#         tid = t["task_id"]
#         start_time_str = t.get("start_time")

#         if t.get("status") == "DONE" or (
#             start_time_str and datetime.fromisoformat(start_time_str).date() <= today
#         ):
#             satisfied_task_ids.add(t["task_id"])
#             continue

#         if start_time_str:
#             st_dt = datetime.fromisoformat(start_time_str)
#             if st_dt.date() == tomorrow:
#                 print(f"DEBUG: Task {tid} is FIXED for tomorrow.")
#                 # if the task has a start time for tmrw - add to fixed_tmrw
#                 fixed_tmrw.append(t)
#             # regardless of when it is scheduled, if it is
#             satisfied_task_ids.add(tid)
#         else:
#             # if the task hasnt been completed in the past or hasnt been scheduled for tmrw
#             print(f"DEBUG: Task {tid} is FLOATING.")
#             floating_pool.append(t)

#     fixed_time_used = sum(t.get("duration", 0) for t in fixed_tmrw)
#     remaining_time = daily_budget_mins - fixed_time_used

#     num_scheduled_tmrw = 0
#     # start scheduling at 9am
#     current_time_pointer = datetime.combine(tomorrow, time(9, 0))

#     # sort the fixed tasks to avoid collisions
#     fixed_tmrw.sort(key=lambda x: x["start_time"])

#     while floating_pool and remaining_time > 0:
#         # filtering for tasks whose dependencies are satisfied
#         ready_tasks = [
#             t
#             for t in floating_pool
#             if not t.get("dependencies")
#             or all(dep in satisfied_task_ids for dep in t["dependencies"])
#         ]

#         if not ready_tasks:
#             break  # cycles or no more tasks can be unlocked

#         # sort by deadline
#         ready_tasks.sort(
#             key=lambda x: (
#                 datetime.fromisoformat(x["deadline"])
#                 if x["deadline"]
#                 else datetime(9999, 12, 31),
#                 -PRIORITY_MAP.get(x.get("priority", "low").lower(), 1),
#             )
#         )

#         task_to_schedule = ready_tasks[0]
#         duration = task_to_schedule.get("duration")

#         if duration <= remaining_time:
#             for fixed in fixed_tmrw:
#                 f_start = datetime.fromisoformat(fixed["start_time"])
#                 f_end = f_start + timedelta(minutes=fixed.get("duration", 0))

#                 # checking for overlaps
#                 if (
#                     current_time_pointer < f_end
#                     and (current_time_pointer + timedelta(minutes=duration)) > f_start
#                 ):
#                     current_time_pointer = f_end

#             supabase.table("tasks").update(
#                 {"start_time": current_time_pointer.isoformat(), "status": "scheduled"}
#             ).eq("task_id", task_to_schedule["task_id"]).execute()

#             satisfied_task_ids.add(task_to_schedule["task_id"])
#             floating_pool.remove(task_to_schedule)
#             remaining_time -= duration
#             current_time_pointer += timedelta(minutes=duration)
#             num_scheduled_tmrw += 1
#         else:
#             # cant schedule it
#             floating_pool.remove(task_to_schedule)

#     return {
#         "user": user_id,
#         "scheduled_for_tomorrow": num_scheduled_tmrw,
#         "remaining_time_mins": remaining_time,
#     }


def run_scheduler_midnight():
    users_res = supabase.table("users").select("id").execute()
    user_list = users_res.data

    results = []
    for user in user_list:
        try:
            res = schedule_for_next_day(user["id"])
            results.append(res)
        except Exception as e:
            print(f"Error for user {user['id']}: {e}")

    return results
