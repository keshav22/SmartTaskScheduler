from db.supabase import supabase


async def update_settings_data(user_id, task_data: dict):
    print(task_data)
    res = supabase.table("users").update(task_data).eq("id", user_id).execute()

    return res
