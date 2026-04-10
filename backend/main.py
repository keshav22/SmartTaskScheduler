import os
import jwt
import json
from fastapi import FastAPI, Request
from fastapi.security import HTTPBearer
from fastapi.responses import JSONResponse
from routers.task import router as task_router
from routers.auth import router as auth_router
from routers.setting import router as setting_router
from routers.focus import router as focus_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

ENV = os.getenv("APP_ENV", "development")
dotenv_path = f".env.{ENV}"
load_dotenv(dotenv_path)

allowed_origins = os.getenv("CORS_ALLOWED_ORIGINS", "")
origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["Origin", "Content-Type", "Authorization"],
)

security = HTTPBearer()

SUPABASE_JWT_ALGORITHM = "ES256"

raw_jwk_string = os.getenv("SUPABASE_JWK", "{}")
jwk_data = json.loads(raw_jwk_string)

if "keys" in jwk_data and len(jwk_data["keys"]) > 0:
    jwk_dict = jwk_data["keys"]
else:
    jwk_dict = jwk_data

SUPABASE_PUBLIC_KEY = jwt.PyJWK(jwk_dict[0]).key


@app.middleware("http")
async def verify_jwt_middleware(request: Request, call_next):
    if request.method == "OPTIONS":
        return await call_next(request)

    if request.url.path in ["/auth/login", "/auth/signup"]:
        return await call_next(request)

    token = request.cookies.get("sb-access-token")
    if not token:
        return JSONResponse(status_code=401, content={"detail": "Missing token"})

    print(token)
    try:
        payload = jwt.decode(
            token,
            SUPABASE_PUBLIC_KEY,
            algorithms=[SUPABASE_JWT_ALGORITHM],
            audience="authenticated",
        )
        request.state.user = payload
    except jwt.ExpiredSignatureError:
        return JSONResponse(status_code=401, content={"detail": "Token expired"})
    except jwt.InvalidTokenError:
        print("Invalid")
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})

    response = await call_next(request)
    return response


app.include_router(auth_router)
app.include_router(task_router)
app.include_router(setting_router)
app.include_router(focus_router)
