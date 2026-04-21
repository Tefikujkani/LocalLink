from fastapi import APIRouter, Depends, HTTPException, status
from typing import List, Optional

from database import get_db
from security import get_current_user, require_role
from services.ai_service import ai_service
from schemas import MessageResponse

router = APIRouter(prefix="/api/ai", tags=["AI Intelligence"])


@router.post("/assistant")
async def assistant_chat(
    query: str,
    business_id: Optional[str] = None,
    current_user: dict = Depends(get_current_user),
    db = Depends(get_db)
):
    """Chat with the AI Business Assistant. Context-aware based on MongoDB data."""
    context = None
    if business_id:
        biz = await db.businesses.find_one({
            "_id": business_id, 
            "owner_id": current_user.get("_id")
        })
        if biz:
            context = {
                "name": biz.get("name"),
                "category": biz.get("category"),
                "description": biz.get("description"),
                "rating": biz.get("rating")
            }

    response = await ai_service.business_assistant(query, context)
    return {"response": response}


@router.get("/fraud-analysis/{business_id}")
async def analyze_business_fraud(
    business_id: str,
    db = Depends(get_db),
    admin: dict = Depends(require_role("admin", "superadmin"))
):
    """Admin-only: Analyze a specific business using the AI Fraud Engine (MongoDB logs)."""
    biz = await db.businesses.find_one({"_id": business_id})
    if not biz:
        raise HTTPException(status_code=404, detail="Business not found")

    # Fetch recent activity logs for this business owner from MongoDB
    cursor = db.activity_logs.find({"user_id": biz.get("owner_id")}).limit(20)
    logs = await cursor.to_list(length=20)
    
    log_data = [
        {
            "action": l.get("action"), 
            "ip": l.get("ip_address"), 
            "at": l.get("created_at").isoformat() if l.get("created_at") else None
        }
        for l in logs
    ]

    analysis = await ai_service.analyze_fraud(log_data)
    return analysis
