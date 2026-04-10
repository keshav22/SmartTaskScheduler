from db.supabase import supabase


async def get_all_tasks(user_id):
    return (
        supabase.table("tasks")
        .select("""
        task_id, title, description, start_time, duration, 
        priority, deadline, status, dependencies
    """)
        .eq("user_id", user_id)
        .eq("status", "NOT STARTED")
        .order("start_time", desc=False)
        .execute()
    )


async def get_task(user_id, task_id):
    return (
        supabase.table("tasks")
        .select("""
        task_id, title, description, start_time, duration, 
        priority, deadline, status, dependencies
    """)
        .eq("user_id", user_id)
        .eq("task_id", task_id)
        .execute()
    )


async def create_task(user_id, task_data):
    data = {**task_data, "user_id": user_id, "status": "NOT STARTED"}

    res = supabase.table("tasks").insert(data).execute()
    return res


async def edit_task(user_id, task_id, task_data):
    res = (
        supabase.table("tasks")
        .update(task_data)
        .eq("task_id", task_id)
        .eq("user_id", user_id)
        .execute()
    )

    return res


async def delete_task(user_id, ids):
    task_ids = [int(i) for i in ids]

    res = (
        supabase.table("tasks")
        .delete()
        .in_("task_id", task_ids)
        .eq("user_id", user_id)
        .execute()
    )

    return res


async def mark_task_done(user_id, task_id):
    return (
        supabase.table("tasks")
        .update({"status": "DONE"})
        .eq("user_id", user_id)
        .eq("task_id", task_id)
        .execute()
    )
