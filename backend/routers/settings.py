from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
import uuid
from datetime import datetime, timezone

from database import get_db
from schemas import (
    WebhookResponse, 
    WebhookCreateRequest, 
    MessageResponse
)
from security import require_role

router = APIRouter(prefix="/api/settings", tags=["System Settings"])

@router.get("/system-stats")
async def get_system_stats(
    _: dict = Depends(require_role("superadmin")),
    db = Depends(get_db)
):
    """Global system-wide statistics for SuperAdmin dashboard using MongoDB."""
    
    total_users = await db.users.count_documents({})
    total_businesses = await db.businesses.count_documents({})
    pending_moderation = await db.businesses.count_documents({"status": "pending"})
    total_logs = await db.activity_logs.count_documents({})
    total_tenants = await db.tenants.count_documents({})
    
    return {
        "totalUsers": total_users,
        "totalBusinesses": total_businesses,
        "pendingModeration": pending_moderation,
        "totalLogs": total_logs,
        "totalTenants": total_tenants,
        "databaseSize": "1.2 MB", # Mocked
        "storageUsed": "45 MB",   # Mocked
        "systemStatus": "Healthy"
    }

# ─── Webhooks ─────────────────────────────────────────────────────────────────

@router.get("/webhooks", response_model=List[WebhookResponse])
async def list_global_webhooks(
    _: dict = Depends(require_role("superadmin")),
    db = Depends(get_db)
):
    """List all configured system-wide webhooks from MongoDB."""
    cursor = db.webhooks.find()
    return await cursor.to_list(length=100)

@router.post("/webhooks", response_model=WebhookResponse)
async def create_global_webhook(
    payload: WebhookCreateRequest,
    _: dict = Depends(require_role("superadmin")),
    db = Depends(get_db)
):
    """Create a new global system webhook in MongoDB."""
    # Ensure at least one tenant exists (System tenant)
    system_tenant = await db.tenants.find_one({"name": "System"})
    if not system_tenant:
        tenant_id = str(uuid.uuid4())
        system_tenant = {
            "_id": tenant_id,
            "name": "System",
            "domain": "system.local",
            "created_at": datetime.now(timezone.utc)
        }
        await db.tenants.insert_one(system_tenant)
    else:
        tenant_id = system_tenant["_id"]
    
    webhook_id = str(uuid.uuid4())
    new_webhook = {
        "_id": webhook_id,
        "tenant_id": tenant_id,
        "url": payload.url,
        "event_types": ",".join(payload.event_types),
        "is_active": True,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.webhooks.insert_one(new_webhook)
    return new_webhook

@router.delete("/webhooks/{webhook_id}", response_model=MessageResponse)
async def delete_webhook(
    webhook_id: str,
    _: dict = Depends(require_role("superadmin")),
    db = Depends(get_db)
):
    """Delete a global webhook from MongoDB."""
    result = await db.webhooks.delete_one({"_id": webhook_id})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Webhook not found.")
    
    return {"message": "Webhook deleted successfully."}
