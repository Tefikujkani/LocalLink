import asyncio
import uuid
import os
from datetime import datetime, timezone
from motor.motor_asyncio import AsyncIOMotorClient
from security import hash_password
from dotenv import load_dotenv

load_dotenv()

MONGODB_URL = os.getenv("MONGODB_URL")
DATABASE_NAME = os.getenv("DATABASE_NAME", "localLink")

async def seed_users():
    print(f"🚀 Seeding LocalLink Users to MongoDB Atlas ({DATABASE_NAME})...")
    
    if not MONGODB_URL:
        print("❌ Error: MONGODB_URL not found in .env")
        return

    client = AsyncIOMotorClient(MONGODB_URL)
    db = client[DATABASE_NAME]
    
    try:
        # Clear existing users for a clean seed in Atlas
        await db.users.delete_many({})
        await db.tenants.delete_many({})
        print("🧹 Cleared existing users and tenants for clean migration.")

        # 1. Ensure a default Tenant exists
        tenant_id = str(uuid.uuid4())
        default_tenant = {
            "_id": tenant_id,
            "name": "Main Hub",
            "domain": "locallink.com",
            "created_at": datetime.now(timezone.utc)
        }
        await db.tenants.insert_one(default_tenant)
        print(f"✅ Created Default Tenant: {tenant_id}")

        # Common fields for all seeded users
        base_user = {
            "tenant_id": tenant_id,
            "is_active": True,
            "is_2fa_enabled": False,
            "created_at": datetime.now(timezone.utc)
        }

        # 2. Seed Super Admin
        await db.users.insert_one({
            **base_user,
            "_id": str(uuid.uuid4()),
            "name": "SuperAdmin",
            "email": "super@locallink.com",
            "hashed_password": hash_password("SuperSecret123!"),
            "role": "superadmin",
            "location": "Prishtina, HQ",
        })
        print("✅ Created Super Admin: super@locallink.com / SuperSecret123!")

        # 3. Seed Admin
        await db.users.insert_one({
            **base_user,
            "_id": str(uuid.uuid4()),
            "name": "Admin Manager",
            "email": "admin@locallink.com",
            "hashed_password": hash_password("AdminSecret123!"),
            "role": "admin",
            "location": "Vushtrri, Branch",
        })
        print("✅ Created Admin: admin@locallink.com / AdminSecret123!")

        # 4. Seed Standard User
        await db.users.insert_one({
            **base_user,
            "_id": str(uuid.uuid4()),
            "name": "Regular Partner",
            "email": "user@locallink.com",
            "hashed_password": hash_password("UserSecret123!"),
            "role": "user",
            "location": "Mitrovica, Retail",
        })
        print("✅ Created User: user@locallink.com / UserSecret123!")

        print("\n✨ MongoDB seeding complete. Access restored.")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
