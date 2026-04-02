from fastapi import FastAPI
from routers.task import router as task_router

app = FastAPI()

# Todo add authentication layer to check token of jwt expiration etc before going to controllers

app.include_router(task_router)
