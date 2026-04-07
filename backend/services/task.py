from db.supabase import supabase


async def get_all_tasks(user_id):
    return (
        supabase.table("tasks")
        .select(
            "task_id, title, description, start_time, duration, priority, deadline, status, dependencies"
        )
        .eq("user_id", user_id)
        .execute()
    )

async def create_task(user_id, task_data):
    pass