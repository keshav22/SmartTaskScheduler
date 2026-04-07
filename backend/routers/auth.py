from fastapi import APIRouter, HTTPException, Response
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

        return {"message": "Signup successful"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


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
            max_age=3600,  # 1 hour
            samesite="lax",
        )
        return {"message": "Login Successful"}
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid email or password")
