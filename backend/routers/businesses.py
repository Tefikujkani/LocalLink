from fastapi import APIRouter, Depends, HTTPException, status, Query
from typing import List, Optional
import time
import uuid
from datetime import datetime, timezone

from database import get_db
from schemas import (
    BusinessCreateRequest,
    BusinessStatusUpdateRequest,
    BusinessResponse,
    MessageResponse,
)
from security import get_current_user, require_role

from services.s3_service import s3_service

router = APIRouter(prefix="/api/businesses", tags=["Businesses"])


@router.get("/upload-url")
async def get_upload_url(
    file_name: str,
    content_type: str,
    current_user: dict = Depends(get_current_user)
):
    """Generate a presigned S3 URL for business image upload."""
    user_id = current_user.get("_id")
    # Generate a unique key
    file_key = f"businesses/{user_id}/{int(time.time())}-{file_name}"
    url = await s3_service.get_upload_url(file_key, content_type)
    
    if not url:
        # Fallback for local development
        return {"url": f"http://localhost:8000/api/mock-upload", "key": file_key, "is_mock": True}
        
    return {"url": url, "key": file_key, "is_mock": False}


@router.post("/mock-upload")
async def mock_upload():
    return {"status": "success", "message": "Mock upload successful"}


@router.get("", response_model=List[BusinessResponse])
async def list_businesses(
    status: Optional[str] = Query(None, description="Filter by status: pending|approved|rejected"),
    category: Optional[str] = Query(None),
    db = Depends(get_db),
):
    """
    Public endpoint – list all approved businesses using MongoDB.
    """
    filter_query = {}
    if status:
        filter_query["status"] = status
    else:
        filter_query["status"] = "approved"
    
    if category:
        filter_query["category"] = category
        
    cursor = db.businesses.find(filter_query).sort("created_at", -1)
    return await cursor.to_list(length=100)


@router.get("/mine", response_model=List[BusinessResponse])
async def my_businesses(
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Return businesses owned by the currently authenticated user."""
    user_id = current_user.get("_id")
    cursor = db.businesses.find({"owner_id": user_id}).sort("created_at", -1)
    return await cursor.to_list(length=50)


@router.get("/pending", response_model=List[BusinessResponse])
async def pending_businesses(
    _: dict = Depends(require_role("admin", "superadmin")),
    db = Depends(get_db),
):
    """Admin-only: return all businesses awaiting approval."""
    cursor = db.businesses.find({"status": "pending"})
    return await cursor.to_list(length=100)


@router.get("/{business_id}", response_model=BusinessResponse)
async def get_business(business_id: str, db = Depends(get_db)):
    biz = await db.businesses.find_one({"_id": business_id})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")
    return biz


@router.post("", response_model=BusinessResponse, status_code=status.HTTP_201_CREATED)
async def create_business(
    payload: BusinessCreateRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Authenticated users can submit a new business (starts as 'pending')."""
    biz_id = str(uuid.uuid4())
    new_biz_doc = {
        "_id": biz_id,
        "owner_id": current_user.get("_id"),
        "name": payload.name,
        "category": payload.category,
        "description": payload.description,
        "phone": payload.phone,
        "location_name": payload.location_name,
        "lat": payload.lat,
        "lng": payload.lng,
        "image_url": payload.image_url,
        "status": "pending",
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.businesses.insert_one(new_biz_doc)
    return new_biz_doc


@router.put("/{business_id}/status", response_model=BusinessResponse)
async def update_business_status(
    business_id: str,
    payload: BusinessStatusUpdateRequest,
    _: dict = Depends(require_role("admin", "superadmin")),
    db = Depends(get_db),
):
    """Admin-only: approve or reject a business listing."""
    result = await db.businesses.update_one(
        {"_id": business_id}, 
        {"$set": {"status": payload.status}}
    )
    
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Business not found.")
        
    updated_biz = await db.businesses.find_one({"_id": business_id})
    return updated_biz


@router.put("/{business_id}", response_model=BusinessResponse)
async def update_business(
    business_id: str,
    payload: BusinessCreateRequest,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Owners can update their business details. Updates trigger a re-review status."""
    biz = await db.businesses.find_one({"_id": business_id})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")

    if biz.get("owner_id") != current_user.get("_id") and current_user.get("role") != "superadmin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this business.")

    update_doc = {
        "name": payload.name,
        "category": payload.category,
        "description": payload.description,
        "phone": payload.phone,
        "location_name": payload.location_name,
        "lat": payload.lat,
        "lng": payload.lng,
        "image_url": payload.image_url,
        "status": "pending" # Reset status for review
    }

    await db.businesses.update_one({"_id": business_id}, {"$set": update_doc})
    return await db.businesses.find_one({"_id": business_id})


@router.delete("/{business_id}", response_model=MessageResponse)
async def delete_business(
    business_id: str,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db),
):
    """Owners can delete their own listing. Admins can delete any listing."""
    biz = await db.businesses.find_one({"_id": business_id})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found.")

    is_owner = biz.get("owner_id") == current_user.get("_id")
    is_admin = current_user.get("role") in ("admin", "superadmin")

    if not is_owner and not is_admin:
        raise HTTPException(status_code=403, detail="You do not have permission to delete this business.")

    await db.businesses.delete_one({"_id": business_id})
    return {"message": "Business deleted successfully."}
