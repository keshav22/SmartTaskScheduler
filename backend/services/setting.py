from db.supabase import supabase

async def update_settings_data(type: str, data: dict, user_id: int):
    if type == "profile":
        response = (
            supabase.table("users")
            .update(data)
            .eq("id", user_id)
            .execute()
        )
        
        return response.data

    elif type == "focus":
        #Update in db
        return 1

    else:
        raise Exception("Invalid settings type")