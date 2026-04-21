from pydantic import BaseModel, EmailStr, Field, ConfigDict, AliasChoices
from typing import Optional, Literal, List, Any
from datetime import datetime


# ─── Configuration ─────────────────────────────────────────────────────────────

def to_camel(string: str) -> str:
    return "".join(word.capitalize() if i > 0 else word for i, word in enumerate(string.split("_")))

common_config = ConfigDict(
    from_attributes=True,
    alias_generator=to_camel,
    populate_by_name=True
)

# ─── Auth ──────────────────────────────────────────────────────────────────────

class RegisterRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    name: str = Field(..., min_length=2, max_length=120)
    email: EmailStr
    password: str = Field(..., min_length=8, max_length=128)
    business_name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None


class LoginRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    model_config = common_config
    access_token: str
    token_type: str = "bearer"
    two_factor_required: bool = False
    temp_token: Optional[str] = None


class TOTPVerifyRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    token: str
    temp_token: Optional[str] = None


class TOTPSetupResponse(BaseModel):
    model_config = common_config
    secret: str
    uri: str


# ─── User ──────────────────────────────────────────────────────────────────────

class UserResponse(BaseModel):
    model_config = common_config

    id: str = Field(..., validation_alias=AliasChoices('id', '_id'))
    tenant_id: Optional[str] = None
    name: str
    email: EmailStr
    role: Literal["user", "admin", "superadmin"]
    is_2fa_enabled: bool = Field(default=False, validation_alias=AliasChoices('is_2fa_enabled', 'is2faEnabled'))
    business_name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None
    is_active: bool = True
    created_at: Optional[datetime] = None


class UserUpdateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    name: Optional[str] = Field(None, min_length=2, max_length=120)
    business_name: Optional[str] = None
    category: Optional[str] = None
    location: Optional[str] = None


class UserRoleUpdateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    role: Literal["user", "admin", "superadmin"]


# ─── Business ──────────────────────────────────────────────────────────────────

class BusinessCreateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    name: str = Field(..., min_length=2, max_length=200)
    category: str = Field(..., min_length=2, max_length=100)
    description: str = Field(..., min_length=10)
    phone: str = Field(..., min_length=7, max_length=30)
    lat: float = Field(..., ge=-90.0, le=90.0)
    lng: float = Field(..., ge=-180.0, le=180.0)
    location_name: Optional[str] = None
    image_url: Optional[str] = None


class BusinessStatusUpdateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    status: Literal["pending", "approved", "rejected"]


class BusinessOwnerResponse(BaseModel):
    model_config = common_config
    id: str
    name: str
    email: EmailStr


class BusinessResponse(BaseModel):
    model_config = common_config

    id: str
    tenant_id: Optional[str] = None
    owner_id: str
    name: str
    category: str
    description: str
    phone: str
    location_name: Optional[str] = None
    lat: float
    lng: float
    status: Literal["pending", "approved", "rejected"]
    image_url: Optional[str] = None
    rating: Optional[float] = None
    created_at: datetime
    owner: Optional[BusinessOwnerResponse] = None


# ─── Activity Logs ────────────────────────────────────────────────────────────

class ActivityLogResponse(BaseModel):
    model_config = common_config

    id: str
    tenant_id: Optional[str] = None
    user_id: Optional[str] = None
    action: str
    severity: str
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None
    metadata_json: Optional[str] = None
    created_at: datetime


# ─── Webhooks ─────────────────────────────────────────────────────────────────

class WebhookCreateRequest(BaseModel):
    model_config = ConfigDict(alias_generator=to_camel, populate_by_name=True)
    url: str = Field(..., min_length=10, max_length=500)
    event_types: List[str]


class WebhookResponse(BaseModel):
    model_config = common_config

    id: str
    tenant_id: str
    url: str
    event_types: str # Back-end stores as CSV
    is_active: bool
    created_at: datetime


# ─── Generic ───────────────────────────────────────────────────────────────────

class MessageResponse(BaseModel):
    model_config = common_config
    message: str
