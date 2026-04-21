from fastapi import APIRouter, Depends, HTTPException, status, Request
from typing import List, Optional
import secrets
import string

from database import get_db
from schemas import TOTPSetupResponse, TOTPVerifyRequest, MessageResponse, TokenResponse
from security import (
    get_current_user, 
    generate_totp_secret, 
    get_totp_uri, 
    verify_totp_token, 
    create_access_token,
    decode_access_token,
    verify_password,
    hash_password # Using same argon2 logic for recovery codes
)
from services.activity_log import log_activity
from services.encryption import encryption_service

router = APIRouter(prefix="/api/security", tags=["Security"])

def generate_recovery_codes(count: int = 10) -> List[str]:
    """Generate human-readable recovery codes."""
    codes = []
    for _ in range(count):
        code = "".join(secrets.choice(string.digits) for _ in range(12))
        # Format as XXXX-XXXX-XXXX
        formatted = f"{code[:4]}-{code[4:8]}-{code[8:12]}"
        codes.append(formatted)
    return codes


@router.post("/2fa/setup", response_model=TOTPSetupResponse)
async def setup_2fa(
    current_user: dict = Depends(get_current_user), 
    db = Depends(get_db)
):
    """Generate a new TOTP secret for scanning. Encrypted at rest."""
    if current_user.get("is_2fa_enabled"):
        raise HTTPException(status_code=400, detail="2FA is already enabled.")

    secret = generate_totp_secret()
    
    # Store encrypted secret temporarily or in a pending field
    # For simplicity, we update the user document
    encrypted_secret = encryption_service.encrypt(secret)
    await db.users.update_one(
        {"_id": current_user["_id"]}, 
        {"$set": {"totp_secret": encrypted_secret}}
    )

    uri = get_totp_uri(secret, current_user["email"])
    await log_activity(db, "2FA_SETUP_INITIATED", user_id=current_user["_id"])
    
    return {"secret": secret, "uri": uri}


@router.post("/2fa/enable")
async def enable_2fa(
    payload: TOTPVerifyRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Verify the first TOTP token and generate recovery codes."""
    encrypted_secret = current_user.get("totp_secret")
    if not encrypted_secret:
        raise HTTPException(status_code=400, detail="MUST call /2fa/setup first.")

    # Decrypt secret for verification
    try:
        secret = encryption_service.decrypt(encrypted_secret)
    except Exception:
        raise HTTPException(status_code=500, detail="Security decryption failure.")

    isValid = verify_totp_token(secret, payload.token)
    if not isValid:
        raise HTTPException(status_code=400, detail="Invalid verification code.")

    # Generate recovery codes (store hashed versions)
    raw_codes = generate_recovery_codes()
    hashed_codes = [hash_password(c) for c in raw_codes]

    await db.users.update_one(
        {"_id": current_user["_id"]}, 
        {"$set": {
            "is_2fa_enabled": True,
            "recovery_codes": hashed_codes
        }}
    )

    await log_activity(db, "2FA_ENABLED", user_id=current_user["_id"], severity="warning")
    
    return {
        "message": "Two-factor authentication enabled successfully.",
        "recovery_codes": raw_codes
    }


@router.post("/2fa/verify", response_model=TokenResponse)
async def verify_2fa_challenge(
    request: Request,
    payload: TOTPVerifyRequest,
    db = Depends(get_db)
):
    """
    Verify 2FA token or recovery code during login flow.
    """
    if not payload.temp_token:
        raise HTTPException(status_code=400, detail="Temporary challenge token required.")

    try:
        data = decode_access_token(payload.temp_token)
        user_id = data.get("sub")
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired challenge token.")

    user = await db.users.find_one({"_id": user_id})
    if not user or not user.get("is_2fa_enabled"):
        raise HTTPException(status_code=400, detail="2FA not applicable.")

    # 1. Attempt TOTP verification
    encrypted_secret = user.get("totp_secret")
    secret = encryption_service.decrypt(encrypted_secret)
    
    is_totp_valid = verify_totp_token(secret, payload.token)
    
    # 2. Attempt Recovery Code verification (if token looks like a recovery code)
    is_recovery_valid = False
    if not is_totp_valid and "-" in payload.token:
        recovery_codes = user.get("recovery_codes", [])
        for i, hashed in enumerate(recovery_codes):
            if verify_password(payload.token, hashed):
                is_recovery_valid = True
                # Remove used recovery code (Burn after use)
                recovery_codes.pop(i)
                await db.users.update_one({"_id": user_id}, {"$set": {"recovery_codes": recovery_codes}})
                break

    if not is_totp_valid and not is_recovery_valid:
        await log_activity(
            db, "2FA_VERIFY_FAILED", 
            user_id=user["_id"], 
            severity="warning",
            ip_address=request.client.host
        )
        raise HTTPException(status_code=400, detail="Invalid code.")

    # Issue final verified token
    token = create_access_token(data={"sub": user["_id"], "role": user["role"], "2fa_verified": True})
    
    action = "2FA_VERIFY_SUCCESS_RECOVERY" if is_recovery_valid else "2FA_VERIFY_SUCCESS"
    await log_activity(db, action, user_id=user["_id"], ip_address=request.client.host)
    
    return {"access_token": token, "token_type": "bearer", "two_factor_required": False}


@router.post("/2fa/disable")
async def disable_2fa(
    payload: TOTPVerifyRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Disable 2FA. Requires valid TOTP verification code for security."""
    encrypted_secret = current_user.get("totp_secret")
    if not encrypted_secret:
         raise HTTPException(status_code=400, detail="2FA is not enabled.")

    secret = encryption_service.decrypt(encrypted_secret)
    isValid = verify_totp_token(secret, payload.token)
    
    if not isValid:
        raise HTTPException(status_code=400, detail="Invalid verification code to disable 2FA.")

    await db.users.update_one(
        {"_id": current_user["_id"]}, 
        {"$set": {
            "is_2fa_enabled": False,
            "totp_secret": None,
            "recovery_codes": []
        }}
    )

    await log_activity(db, "2FA_DISABLED", user_id=current_user["_id"], severity="critical")
    return {"message": "Two-factor authentication disabled."}
