"""
seed.py — Run once to populate the database with initial demo data.
Usage: python seed.py
"""
from database import SessionLocal, engine, Base
from models import User, Business
from security import hash_password
import uuid

Base.metadata.create_all(bind=engine)

SEED_PASSWORD = "Admin1234!"

USERS = [
    {
        "id": "seed-superadmin-001",
        "name": "Super Admin",
        "email": "super@locallink.io",
        "hashed_password": hash_password(SEED_PASSWORD),
        "role": "superadmin",
        "is_active": True,
    },
    {
        "id": "seed-admin-001",
        "name": "Admin Jane",
        "email": "admin@locallink.io",
        "hashed_password": hash_password(SEED_PASSWORD),
        "role": "admin",
        "is_active": True,
    },
    {
        "id": "seed-user-001",
        "name": "User Bob",
        "email": "user@locallink.io",
        "hashed_password": hash_password(SEED_PASSWORD),
        "role": "user",
        "is_active": True,
        "business_name": "Missini Sweets & Cafe",
        "category": "Café",
        "location": "Vushtrri, Kosovo",
    },
    {
        "id": "seed-user-002",
        "name": "User Alice",
        "email": "alice@locallink.io",
        "hashed_password": hash_password(SEED_PASSWORD),
        "role": "user",
        "is_active": True,
    },
]

BUSINESSES = [
    {
        "id": "seed-biz-001",
        "owner_id": "seed-user-001",
        "name": "Missini Sweets & Cafe",
        "category": "Café",
        "description": "The most famous sweets and coffee spot in the heart of Vushtrri.",
        "location_name": "Rr. Adem Jashari, Vushtrri, Kosovo",
        "phone": "+38344111222",
        "lat": 42.8231,
        "lng": 20.9678,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/missini/800/600",
        "rating": 4.8,
    },
    {
        "id": "seed-biz-002",
        "owner_id": "seed-user-001",
        "name": "City Grill Vushtrri",
        "category": "Restaurant",
        "description": "Authentic grilled specialties and the best traditional food in town.",
        "location_name": "Rr. Skenderbeu, Vushtrri, Kosovo",
        "phone": "+38349333444",
        "lat": 42.8239,
        "lng": 20.9664,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/citygrill/800/600",
        "rating": 4.5,
    },
    {
        "id": "seed-biz-003",
        "owner_id": "seed-user-002",
        "name": "Gentlemen's Barber Shop",
        "category": "Barber Shop",
        "description": "Premium grooming and hair styling for the modern man of Vushtrri.",
        "location_name": "Rr. Hasan Prishtina, Vushtrri, Kosovo",
        "phone": "+38345555666",
        "lat": 42.8225,
        "lng": 20.9690,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/barber/800/600",
        "rating": 4.9,
    },
    {
        "id": "seed-biz-004",
        "owner_id": "seed-user-002",
        "name": "Vushtrri Castle Café",
        "category": "Café",
        "description": "Enjoy your coffee with a view of the historic Vushtrri Castle.",
        "location_name": "Kalaja e Vushtrrise, Vushtrri, Kosovo",
        "phone": "+38344777888",
        "lat": 42.8240,
        "lng": 20.9670,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/castle/800/600",
        "rating": 4.7,
    },
    {
        "id": "seed-biz-005",
        "owner_id": "seed-user-001",
        "name": "Tech Hub Vushtrri",
        "category": "Tech",
        "description": "Co-working space and technology services for the local community.",
        "location_name": "Zona Qender, Vushtrri, Kosovo",
        "phone": "+38344999000",
        "lat": 42.8245,
        "lng": 20.9655,
        "status": "pending",
        "image_url": "https://picsum.photos/seed/techhub/800/600",
        "rating": None,
    },
    {
        "id": "seed-biz-006",
        "owner_id": "seed-user-002",
        "name": "Green Garden Restaurant",
        "category": "Restaurant",
        "description": "Family-friendly restaurant with fresh local ingredients and weekend live music.",
        "location_name": "Rr. Deshmoret e Kombit, Vushtrri, Kosovo",
        "phone": "+38345123456",
        "lat": 42.8252,
        "lng": 20.9681,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/greengarden/800/600",
        "rating": 4.6,
    },
    {
        "id": "seed-biz-007",
        "owner_id": "seed-user-001",
        "name": "Urban Fit Studio",
        "category": "Fitness",
        "description": "Modern fitness studio with personal training, yoga, and group classes.",
        "location_name": "Rr. Ilaz Kodra, Vushtrri, Kosovo",
        "phone": "+38345888777",
        "lat": 42.8219,
        "lng": 20.9702,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/urbanfit/800/600",
        "rating": 4.4,
    },
    {
        "id": "seed-biz-008",
        "owner_id": "seed-user-002",
        "name": "Blue Pixel Print",
        "category": "Printing",
        "description": "Fast print shop for business cards, banners, and custom marketing materials.",
        "location_name": "Rr. Nene Tereza, Vushtrri, Kosovo",
        "phone": "+38349777111",
        "lat": 42.8228,
        "lng": 20.9658,
        "status": "pending",
        "image_url": "https://picsum.photos/seed/bluepixel/800/600",
        "rating": None,
    },
    {
        "id": "seed-biz-009",
        "owner_id": "seed-user-001",
        "name": "Sunrise Bakery",
        "category": "Bakery",
        "description": "Daily fresh bread, pastries, and cakes made with traditional recipes.",
        "location_name": "Rr. Migjeni, Vushtrri, Kosovo",
        "phone": "+38344101010",
        "lat": 42.8248,
        "lng": 20.9694,
        "status": "approved",
        "image_url": "https://picsum.photos/seed/sunrisebakery/800/600",
        "rating": 4.7,
    },
]


def seed():
    db = SessionLocal()
    try:
        # Check if already seeded
        if db.query(User).count() > 0:
            print("⚠️  Database already has data. Skipping seed to prevent duplicates.")
            print("   To re-seed, delete the 'locallink.db' file and run again.")
            return

        print("🌱 Seeding users...")
        for u in USERS:
            db.add(User(**u))
        db.commit()

        print("🌱 Seeding businesses...")
        for b in BUSINESSES:
            db.add(Business(**b))
        db.commit()

        print("\n✅ Seed complete!")
        print(f"\n📋 Demo Credentials (password: {SEED_PASSWORD})")
        print("   🔴 Superadmin : super@locallink.io")
        print("   🟠 Admin      : admin@locallink.io")
        print("   🟢 User       : user@locallink.io")
        print("   🟢 User       : alice@locallink.io")

    except Exception as e:
        db.rollback()
        print(f"❌ Seed failed: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
