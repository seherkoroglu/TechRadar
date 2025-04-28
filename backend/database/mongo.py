from pymongo import MongoClient
from dotenv import load_dotenv
import os
from pathlib import Path

env_path = Path(__file__).resolve().parent.parent / ".env"
load_dotenv(dotenv_path=env_path)
import os

# Yüklenmediyse manuel ver
if os.getenv("SECRET_KEY") is None:
    os.environ["SECRET_KEY"] = "supersecretkey"

print(f"ENV PATH: {env_path.exists()} → {env_path}")


MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("DB_NAME")

client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_collection = db["users"]
articles = db["articles"]