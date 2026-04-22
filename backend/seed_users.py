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
        # Clear existing users/businesses/tenants for a clean seed in Atlas
        await db.users.delete_many({})
        await db.businesses.delete_many({})
        await db.tenants.delete_many({})
        print("🧹 Cleared existing users, businesses and tenants for clean migration.")

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
        superadmin_id = str(uuid.uuid4())
        await db.users.insert_one({
            **base_user,
            "_id": superadmin_id,
            "name": "SuperAdmin",
            "email": "super@locallink.com",
            "hashed_password": hash_password("SuperSecret123!"),
            "role": "superadmin",
            "location": "Prishtina, HQ",
        })
        print("✅ Created Super Admin: super@locallink.com / SuperSecret123!")

        # 3. Seed Admin
        admin_id = str(uuid.uuid4())
        await db.users.insert_one({
            **base_user,
            "_id": admin_id,
            "name": "Admin Manager",
            "email": "admin@locallink.com",
            "hashed_password": hash_password("AdminSecret123!"),
            "role": "admin",
            "location": "Vushtrri, Branch",
        })
        print("✅ Created Admin: admin@locallink.com / AdminSecret123!")

        # 4. Seed Standard User
        user_id = str(uuid.uuid4())
        await db.users.insert_one({
            **base_user,
            "_id": user_id,
            "name": "Regular Partner",
            "email": "user@locallink.com",
            "hashed_password": hash_password("UserSecret123!"),
            "role": "user",
            "location": "Mitrovica, Retail",
        })
        print("✅ Created User: user@locallink.com / UserSecret123!")

        # 5. Seed businesses for Explore page (only approved are shown publicly)
        businesses = [
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Missini Sweets & Cafe", "category": "Cafe", "description": "Artisan desserts and premium coffee in the city center.", "location_name": "Rr. Adem Jashari, Vushtrri, Kosovo", "phone": "+38344111222", "lat": 42.8231, "lng": 20.9678, "status": "approved", "image_url": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg", "rating": 4.8, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "City Grill Vushtrri", "category": "Restaurant", "description": "Traditional grill dishes and fresh salads served all day.", "location_name": "Rr. Skenderbeu, Vushtrri, Kosovo", "phone": "+38349333444", "lat": 42.8239, "lng": 20.9664, "status": "approved", "image_url": "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Gentlemen Barber Shop", "category": "Barber Shop", "description": "Modern cuts, beard styling, and premium grooming products.", "location_name": "Rr. Hasan Prishtina, Vushtrri, Kosovo", "phone": "+38345555666", "lat": 42.8225, "lng": 20.9690, "status": "approved", "image_url": "https://images.pexels.com/photos/1813272/pexels-photo-1813272.jpeg", "rating": 4.9, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Vushtrri Castle Cafe", "category": "Cafe", "description": "Scenic terrace cafe near historical landmarks.", "location_name": "Kalaja e Vushtrrise, Vushtrri, Kosovo", "phone": "+38344777888", "lat": 42.8240, "lng": 20.9670, "status": "approved", "image_url": "https://images.pexels.com/photos/374885/pexels-photo-374885.jpeg", "rating": 4.7, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Sunrise Bakery", "category": "Bakery", "description": "Fresh bread and pastries baked every morning.", "location_name": "Rr. Migjeni, Vushtrri, Kosovo", "phone": "+38344101010", "lat": 42.8248, "lng": 20.9694, "status": "approved", "image_url": "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg", "rating": 4.7, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Green Garden Restaurant", "category": "Restaurant", "description": "Family restaurant with local and international cuisine.", "location_name": "Rr. Deshmoret e Kombit, Vushtrri, Kosovo", "phone": "+38345123456", "lat": 42.8252, "lng": 20.9681, "status": "approved", "image_url": "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg", "rating": 4.6, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Urban Fit Studio", "category": "Fitness", "description": "Gym and group classes with certified coaches.", "location_name": "Rr. Ilaz Kodra, Vushtrri, Kosovo", "phone": "+38345888777", "lat": 42.8219, "lng": 20.9702, "status": "approved", "image_url": "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg", "rating": 4.4, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Blue Pixel Print", "category": "Printing", "description": "Banners, cards, menus, and branding prints with fast turnaround.", "location_name": "Rr. Nene Tereza, Vushtrri, Kosovo", "phone": "+38349777111", "lat": 42.8228, "lng": 20.9658, "status": "approved", "image_url": "https://images.pexels.com/photos/590016/pexels-photo-590016.jpeg", "rating": 4.3, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "AutoFix Garage", "category": "Auto Service", "description": "Diagnostics, oil change, brakes, and general car repairs.", "location_name": "Rr. Prishtina, Vushtrri, Kosovo", "phone": "+38344121212", "lat": 42.8260, "lng": 20.9648, "status": "approved", "image_url": "https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "MediCare Dental", "category": "Dentist", "description": "General dentistry, whitening, and oral care.", "location_name": "Rr. Isa Boletini, Vushtrri, Kosovo", "phone": "+38349313131", "lat": 42.8230, "lng": 20.9700, "status": "approved", "image_url": "https://images.pexels.com/photos/3845766/pexels-photo-3845766.jpeg", "rating": 4.8, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Fresh Market Plus", "category": "Market", "description": "Daily groceries, fruits, and household essentials.", "location_name": "Rr. Ahmet Delia, Vushtrri, Kosovo", "phone": "+38345252525", "lat": 42.8221, "lng": 20.9686, "status": "approved", "image_url": "https://images.pexels.com/photos/264636/pexels-photo-264636.jpeg", "rating": 4.2, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Code Corner", "category": "Tech", "description": "Laptop service, accessories, and office tech solutions.", "location_name": "Rr. Luan Haradinaj, Vushtrri, Kosovo", "phone": "+38344454545", "lat": 42.8244, "lng": 20.9649, "status": "approved", "image_url": "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg", "rating": 4.6, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Bella Moda", "category": "Fashion", "description": "Women and men fashion collections for every season.", "location_name": "Rr. Xheladin Hana, Vushtrri, Kosovo", "phone": "+38349141414", "lat": 42.8237, "lng": 20.9711, "status": "approved", "image_url": "https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg", "rating": 4.4, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Home Deco Studio", "category": "Home Decor", "description": "Interior decor, curtains, lighting, and furnishing ideas.", "location_name": "Rr. Fahri Fazliu, Vushtrri, Kosovo", "phone": "+38344595959", "lat": 42.8256, "lng": 20.9668, "status": "approved", "image_url": "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg", "rating": 4.1, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Spark Clean", "category": "Cleaning", "description": "Home and office deep cleaning with eco-friendly products.", "location_name": "Rr. Dardania, Vushtrri, Kosovo", "phone": "+38344707070", "lat": 42.8217, "lng": 20.9671, "status": "approved", "image_url": "https://images.pexels.com/photos/4239031/pexels-photo-4239031.jpeg", "rating": 4.3, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Prime Pharmacy", "category": "Pharmacy", "description": "Medicines, supplements, and healthcare support.", "location_name": "Rr. Naim Frasheri, Vushtrri, Kosovo", "phone": "+38344393939", "lat": 42.8234, "lng": 20.9651, "status": "approved", "image_url": "https://images.pexels.com/photos/208512/pexels-photo-208512.jpeg", "rating": 4.9, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "BookNest", "category": "Bookstore", "description": "Books, school supplies, and office materials.", "location_name": "Rr. Shqiponja, Vushtrri, Kosovo", "phone": "+38344919191", "lat": 42.8249, "lng": 20.9689, "status": "approved", "image_url": "https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Fast Courier KS", "category": "Logistics", "description": "Same-day local deliveries and business shipping.", "location_name": "Rr. UCK, Vushtrri, Kosovo", "phone": "+38345222233", "lat": 42.8220, "lng": 20.9660, "status": "approved", "image_url": "https://images.pexels.com/photos/7363195/pexels-photo-7363195.jpeg", "rating": 4.2, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Kids Planet", "category": "Toys", "description": "Educational toys, games, and gifts for kids.", "location_name": "Rr. Hamit Jashari, Vushtrri, Kosovo", "phone": "+38344737373", "lat": 42.8259, "lng": 20.9701, "status": "approved", "image_url": "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg", "rating": 4.6, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Golden Events", "category": "Events", "description": "Event planning, decorations, and catering coordination.", "location_name": "Rr. Bajram Kelmendi, Vushtrri, Kosovo", "phone": "+38344666655", "lat": 42.8233, "lng": 20.9720, "status": "approved", "image_url": "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg", "rating": 4.7, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Prishtina Rooftop Bistro", "category": "Restaurant", "description": "Urban dining with panoramic city views and modern Albanian cuisine.", "location_name": "Rr. Garibaldi, Prishtine, Kosovo", "phone": "+38349101010", "lat": 42.6629, "lng": 21.1655, "status": "approved", "image_url": "https://images.pexels.com/photos/941861/pexels-photo-941861.jpeg", "rating": 4.8, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Peja Mountain Lodge Cafe", "category": "Cafe", "description": "Specialty coffee and brunch inspired by Rugova valley.", "location_name": "Rr. Mbreteresha Teute, Peje, Kosovo", "phone": "+38349555111", "lat": 42.6591, "lng": 20.2883, "status": "approved", "image_url": "https://images.pexels.com/photos/1833337/pexels-photo-1833337.jpeg", "rating": 4.7, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Prizren Artisan Bakery", "category": "Bakery", "description": "Traditional breads, burek, and handcrafted desserts daily.", "location_name": "Sheshi Shadervan, Prizren, Kosovo", "phone": "+38344440012", "lat": 42.2139, "lng": 20.7397, "status": "approved", "image_url": "https://images.pexels.com/photos/205961/pexels-photo-205961.jpeg", "rating": 4.9, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Gjakova Fit Club", "category": "Fitness", "description": "Strength, cardio, and personal training in central Gjakova.", "location_name": "Rr. Nene Tereza, Gjakove, Kosovo", "phone": "+38349567890", "lat": 42.3803, "lng": 20.4308, "status": "approved", "image_url": "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Gjilan Smart Tech", "category": "Tech", "description": "Phone and laptop repairs plus certified accessories.", "location_name": "Rr. Idriz Seferi, Gjilan, Kosovo", "phone": "+38348232323", "lat": 42.4637, "lng": 21.4691, "status": "approved", "image_url": "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg", "rating": 4.6, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Ferizaj Auto Care", "category": "Auto Service", "description": "Professional diagnostics, detailing, and tire services.", "location_name": "Rr. Driton Islami, Ferizaj, Kosovo", "phone": "+38349222999", "lat": 42.3704, "lng": 21.1553, "status": "approved", "image_url": "https://images.pexels.com/photos/3807329/pexels-photo-3807329.jpeg", "rating": 4.4, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Mitrovica Family Dental", "category": "Dentist", "description": "Preventive and cosmetic dental services for all ages.", "location_name": "Rr. Mbreti Petar, Mitrovice, Kosovo", "phone": "+38349700055", "lat": 42.8897, "lng": 20.8667, "status": "approved", "image_url": "https://images.pexels.com/photos/3779695/pexels-photo-3779695.jpeg", "rating": 4.8, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Prishtina Fresh Market", "category": "Market", "description": "Organic produce, meats, and local farm products.", "location_name": "Rr. UCK, Prishtine, Kosovo", "phone": "+38344510101", "lat": 42.6582, "lng": 21.1588, "status": "approved", "image_url": "https://images.pexels.com/photos/264537/pexels-photo-264537.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Prizren Style House", "category": "Fashion", "description": "Boutique fashion with seasonal Balkan and EU brands.", "location_name": "Rr. Remzi Ademaj, Prizren, Kosovo", "phone": "+38349121212", "lat": 42.2093, "lng": 20.7402, "status": "approved", "image_url": "https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg", "rating": 4.3, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Peja Home Vision", "category": "Home Decor", "description": "Custom curtains, lighting, and modern living-room sets.", "location_name": "Rr. Lidhja e Pejes, Peje, Kosovo", "phone": "+38344181818", "lat": 42.6576, "lng": 20.2912, "status": "approved", "image_url": "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg", "rating": 4.2, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Gjakova Clean Team", "category": "Cleaning", "description": "Reliable residential and commercial cleaning services.", "location_name": "Rr. Tirana, Gjakove, Kosovo", "phone": "+38349303030", "lat": 42.3838, "lng": 20.4253, "status": "approved", "image_url": "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg", "rating": 4.4, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Gjilan Health Pharmacy", "category": "Pharmacy", "description": "Prescription support and wellness products with expert advice.", "location_name": "Rr. Kulla e Sahatit, Gjilan, Kosovo", "phone": "+38349212121", "lat": 42.4611, "lng": 21.4668, "status": "approved", "image_url": "https://images.pexels.com/photos/139398/pharmacy-drugstore-medicines-pills-139398.jpeg", "rating": 4.7, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Ferizaj Book Corner", "category": "Bookstore", "description": "Books, gifts, and school supplies for students and families.", "location_name": "Rr. Xhevat Syla, Ferizaj, Kosovo", "phone": "+38349808080", "lat": 42.3700, "lng": 21.1535, "status": "approved", "image_url": "https://images.pexels.com/photos/590493/pexels-photo-590493.jpeg", "rating": 4.5, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Prishtina Rapid Courier", "category": "Logistics", "description": "Fast local and regional parcels with live delivery tracking.", "location_name": "Rr. Bill Clinton, Prishtine, Kosovo", "phone": "+38344757575", "lat": 42.6488, "lng": 21.1622, "status": "approved", "image_url": "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg", "rating": 4.4, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": admin_id, "name": "Prizren Toy Galaxy", "category": "Toys", "description": "Educational toys and creative games for all age groups.", "location_name": "Rr. Ismet Jashari, Prizren, Kosovo", "phone": "+38349133344", "lat": 42.2118, "lng": 20.7419, "status": "approved", "image_url": "https://images.pexels.com/photos/163036/mario-luigi-yoschi-figures-163036.jpeg", "rating": 4.6, "created_at": datetime.now(timezone.utc)},
            {"_id": str(uuid.uuid4()), "tenant_id": tenant_id, "owner_id": user_id, "name": "Peja Event Masters", "category": "Events", "description": "Weddings, business events, and full decoration packages.", "location_name": "Rr. Enver Hadri, Peje, Kosovo", "phone": "+38349474747", "lat": 42.6623, "lng": 20.2951, "status": "approved", "image_url": "https://images.pexels.com/photos/169190/pexels-photo-169190.jpeg", "rating": 4.8, "created_at": datetime.now(timezone.utc)},
        ]
        await db.businesses.insert_many(businesses)
        print(f"✅ Seeded {len(businesses)} approved businesses for Explore.")

        print("\n✨ MongoDB seeding complete. Access restored.")
        
    except Exception as e:
        print(f"❌ Error during seeding: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(seed_users())
