import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGODB_URL = os.getenv("MONGODB_URL", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "locallink")

class Database:
    client: AsyncIOMotorClient = None
    db = None

db_instance = Database()

async def connect_to_mongo():
    db_instance.client = AsyncIOMotorClient(MONGODB_URL)
    db_instance.db = db_instance.client[DATABASE_NAME]
    print(f"Connected to MongoDB at {MONGODB_URL}")

async def close_mongo_connection():
    if db_instance.client:
        db_instance.client.close()
        print("MongoDB connection closed")

# Dependency for FastAPI
async def get_db():
    if db_instance.db is None:
        await connect_to_mongo()
    return db_instance.db
