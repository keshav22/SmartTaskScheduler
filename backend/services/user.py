from db.supabase import supabase


async def get_user_focus_settings(user_id):
    return (
        supabase.table("users")
        .select("""
        session_duration, break_duration
    """)
        .eq("id", user_id)
        .execute()
    )
