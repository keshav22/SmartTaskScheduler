from fastapi import Request, HTTPException, status


def get_current_user_from_state(request: Request):
    """
    Extract the decoded JWT payload from request.state.user
    Raises HTTPException if not found.
    """
    user = getattr(request.state, "user", None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="User not authenticated"
        )
    return user
