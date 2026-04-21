from fastapi import APIRouter, Depends, HTTPException, status, Request
from datetime import timedelta
import uuid

from database import get_db
from schemas import RegisterRequest, LoginRequest, TokenResponse, UserResponse, MessageResponse
from security import hash_password, verify_password, create_access_token, get_current_user
from services.activity_log import log_activity

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(request: Request, payload: RegisterRequest, db = Depends(get_db)):
    """Register a new user. Emails must be unique and stored in MongoDB."""
    existing = await db.users.find_one({"email": payload.email})
    if existing:
        await log_activity(
            db, "REGISTRATION_FAILED", 
            metadata={"email": payload.email, "reason": "email_exists"},
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="An account with this email already exists.",
        )

    user_id = str(uuid.uuid4())
    new_user_doc = {
        "_id": user_id,
        "name": payload.name,
        "email": payload.email,
        "hashed_password": hash_password(payload.password),
        "role": "user",
        "is_active": True,
        "is_2fa_enabled": False,
        "business_name": payload.business_name,
        "category": payload.category,
        "location": payload.location, # Note: Should be encrypted in a real scenario
        "created_at": None # Will be set by schema or here
    }
    
    await db.users.insert_one(new_user_doc)
    
    await log_activity(
        db, "REGISTRATION_SUCCESS", 
        user_id=user_id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    # Return as UserResponse (aliases handle _id -> id)
    return new_user_doc


@router.post("/login", response_model=TokenResponse)
async def login(request: Request, payload: LoginRequest, db = Depends(get_db)):
    """Authenticate a user using MongoDB. Supports 2FA redirection."""
    user = await db.users.find_one({"email": payload.email})

    # Always verify password to prevent timing attacks
    password_ok = verify_password(payload.password, user["hashed_password"]) if user else False

    if not user or not password_ok:
        await log_activity(
            db, "LOGIN_FAILED", 
            severity="warning",
            metadata={"email": payload.email},
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent")
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.get("is_active", True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Your account has been deactivated.",
        )

    user_id = user["_id"]

    # ─── Next-Gen 2FA Logic ───────────────────────────────
    if user.get("is_2fa_enabled"):
        temp_token = create_access_token(
            data={"sub": user_id, "role": user["role"], "2fa_verified": False},
            expires_delta=timedelta(minutes=5)
        )
        await log_activity(
            db, "2FA_CHALLENGE_ISSUED", 
            user_id=user_id,
            ip_address=request.client.host
        )
        return {
            "access_token": "", 
            "token_type": "bearer", 
            "two_factor_required": True,
            "temp_token": temp_token
        }

    # ─── Standard Login ──────────────────────────────────
    token = create_access_token(data={"sub": user_id, "role": user["role"], "2fa_verified": True})
    
    await log_activity(
        db, "LOGIN_SUCCESS", 
        user_id=user_id,
        ip_address=request.client.host,
        user_agent=request.headers.get("user-agent")
    )
    
    return {"access_token": token, "token_type": "bearer", "two_factor_required": False}


@router.get("/me", response_model=UserResponse)
async def get_me(current_user = Depends(get_current_user)):
    """Return the currently authenticated user's profile."""
    # current_user is already a dict from find_one in security.py
    return current_user


@router.post("/logout", response_model=MessageResponse)
async def logout(current_user = Depends(get_current_user), db = Depends(get_db)):
    """Stateless logout with activity record."""
    await log_activity(db, "LOGOUT", user_id=current_user["_id"])
    return {"message": "Logged out successfully."}
