from fastapi import APIRouter, Depends, HTTPException, status
from typing import List

from database import get_db
from schemas import UserResponse, UserUpdateRequest, UserRoleUpdateRequest, MessageResponse
from security import get_current_user, require_role

router = APIRouter(prefix="/api/users", tags=["Users"])


@router.get("", response_model=List[UserResponse])
async def list_users(
    _: dict = Depends(require_role("superadmin")),
    db = Depends(get_db),
):
    """Admin-only: list all registered users using MongoDB."""
    cursor = db.users.find().sort("created_at", -1)
    return await cursor.to_list(length=100)


@router.get("/{user_id}", response_model=UserResponse)
async def get_user(
    user_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Retrieve a user by ID. Only the user themselves or admins can do this."""
    if current_user.get("_id") != user_id and current_user.get("role") not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="Access forbidden.")

    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    return user


@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: str,
    payload: UserUpdateRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Update profile fields. Users can only update their own profile."""
    if current_user.get("_id") != user_id and current_user.get("role") not in ("admin", "superadmin"):
        raise HTTPException(status_code=403, detail="Access forbidden.")

    # Check if user exists
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")

    update_data = payload.model_dump(exclude_unset=True)
    if not update_data:
        return user

    await db.users.update_one({"_id": user_id}, {"$set": update_data})
    
    # Return updated user
    updated_user = await db.users.find_one({"_id": user_id})
    return updated_user


@router.patch("/{user_id}/role", response_model=UserResponse)
async def update_user_role(
    user_id: str,
    payload: UserRoleUpdateRequest,
    current_user: dict = Depends(require_role("superadmin")),
    db = Depends(get_db),
):
    """Superadmin-only: change a user's role."""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    
    if user.get("_id") == current_user.get("_id"):
        raise HTTPException(status_code=400, detail="You cannot change your own role.")

    await db.users.update_one({"_id": user_id}, {"$set": {"role": payload.role}})
    
    updated_user = await db.users.find_one({"_id": user_id})
    return updated_user


@router.delete("/{user_id}", response_model=MessageResponse)
async def deactivate_user(
    user_id: str,
    _: dict = Depends(require_role("admin", "superadmin")),
    db = Depends(get_db),
):
    """Admin-only: soft-delete (deactivate) a user account."""
    result = await db.users.update_one({"_id": user_id}, {"$set": {"is_active": False}})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found.")
    
    return {"message": "User account has been deactivated."}
