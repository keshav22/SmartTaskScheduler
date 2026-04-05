import os
from dotenv import load_dotenv
from supabase import create_client, Client

ENV = os.getenv("APP_ENV", "development")
dotenv_path = f".env.{ENV}"
load_dotenv(dotenv_path)

url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("Missing Supabase environment variables")

supabase: Client = create_client(url, key)
