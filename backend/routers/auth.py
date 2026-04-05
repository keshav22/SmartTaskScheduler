from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from db.supabase import supabase

router = APIRouter(prefix="/auth", tags=["auth"])

class AuthSchema(BaseModel):
    email: str
    password: str

@router.post("/signup")
def signup(data: AuthSchema):
    try:
        response = supabase.auth.sign_up({
            "email": data.email,
            "password": data.password
        })
        return {"message": "Signup successful", "user": response.user}
    
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/login")
def login(data: AuthSchema, response: Response): # Add response here
    try:
        res = supabase.auth.sign_in_with_password({"email": data.email, "password": data.password})
        
        # Set a cookie so the Frontend Proxy can see it
        response.set_cookie(
            key="sb-access-token", 
            value=res.session.access_token,
            httponly=True
        )
        return {"message": "Logged in"}
    except Exception as e:
        raise HTTPException(status_code=401, detail="Invalid credentials")