from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel, Field
import uuid
from services.encryption import encryption_service

def gen_uuid() -> str:
    return str(uuid.uuid4())

# ─── Super Security Encrypted Fields ───────────────────────────────────────
# In MongoDB, we'll handle encryption before saving and after fetching.
# These helpers will be used in routers or services.

def encrypt_field(value: str) -> Optional[str]:
    return encryption_service.encrypt(value) if value else value

def decrypt_field(value: str) -> Optional[str]:
    return encryption_service.decrypt(value) if value else value


class MongoBaseModel(BaseModel):
    id: str = Field(default_factory=gen_uuid, alias="_id")
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        populate_by_name = True
        json_encoders = {datetime: lambda v: v.isoformat()}


class Tenant(MongoBaseModel):
    name: str
    domain: Optional[str] = None


class User(MongoBaseModel):
    tenant_id: Optional[str] = None
    name: str
    email: str
    hashed_password: str
    role: str = "user" # user, admin, superadmin
    
    # 2FA fields (Stored Encrypted)
    totp_secret: Optional[str] = None
    is_2fa_enabled: bool = False
    recovery_codes: List[str] = Field(default_factory=list) # List of hashed recovery codes
    
    business_name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None # Stored Encrypted
    is_active: bool = True


class Business(MongoBaseModel):
    tenant_id: Optional[str] = None
    owner_id: str
    name: str
    category: str
    description: str
    location_name: Optional[str] = None # Stored Encrypted
    phone: str # Stored Encrypted
    lat: float
    lng: float
    status: str = "pending" # pending, approved, rejected
    image_url: Optional[str] = None
    rating: Optional[float] = None


class ActivityLog(MongoBaseModel):
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
    action: str
    severity: str = "info" # info, warning, critical
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    metadata_json: Optional[str] = None


class Webhook(MongoBaseModel):
    tenant_id: str
    url: str
    secret: Optional[str] = None
    event_types: str # Comma separated
    is_active: bool = True
