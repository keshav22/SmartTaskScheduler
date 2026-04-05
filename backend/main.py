import os
from fastapi import FastAPI
from routers.task import router as task_router
from routers.setting import router as setting_router
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
    allow_methods=["*"],
    allow_headers=["*"],
)

# Todo add authentication layer to check token of jwt expiration etc before going to controllers

app.include_router(task_router)
app.include_router(setting_router)
