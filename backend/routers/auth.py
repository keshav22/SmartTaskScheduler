from fastapi import Request, APIRouter, HTTPException, Response
from pydantic import BaseModel
from db.supabase import supabase

router = APIRouter(prefix="/auth", tags=["auth"])


class AuthSchema(BaseModel):
    email: str
    password: str


@router.post("/signup")
def signup(data: AuthSchema):
    try:
        response = supabase.auth.sign_up(
            {"email": data.email, "password": data.password}
        )
        if response.user is None:
            raise HTTPException(
                status_code=400, detail="User already exists or signup failed."
            )
        
        user_uuid = response.user.id 
        user_email = response.user.email
        supabase.table("users").insert({
            "id": user_uuid, 
            "email": user_email,
            "daily_free_time": 4,      # Your defaults
            "session_duration": 25,
            "break_duration": 5,
        }).execute()

        return {"message": "Signup successful! Profile and settings initialized."}
    except Exception as e:
        print(f"Detailed Signup Error: {e}")
        raise HTTPException(status_code=400, detail="Database error during signup")


@router.post("/login")
def login(data: AuthSchema, response: Response):
    try:
        res = supabase.auth.sign_in_with_password(
            {"email": data.email, "password": data.password}
        )
        response.set_cookie(
            key="sb-access-token",
            value=res.session.access_token,
            httponly=True,  # security - JS cannot steal this cookie
            secure=True,
            path="/",
            max_age=3600,  # 1 hour
            samesite="none",
        )
        return {"message": "Login Successful"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")


@router.get("/me")
async def get_current_user(request: Request):
    if hasattr(request.state, "user"):
        return {"logged_in": True, "user": request.state.user}


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="sb-access-token",
        httponly=True,
        samesite="lax",
    )
    return {"message": "Successfully logged out"}
