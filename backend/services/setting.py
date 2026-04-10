async def update_settings_data(type: str, data: dict):
    if type == "profile":
        response = None

        return response

    elif type == "focus":
        # Update in db

        return 1

    else:
        raise Exception("Invalid settings type")
