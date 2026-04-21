from typing import Optional, Any
import json
from datetime import datetime, timezone
import uuid

# Note: We import models to use for structure, but Motor works with dicts.
# We'll use the gen_uuid from before.

def gen_uuid() -> str:
    return str(uuid.uuid4())

async def log_activity(
    db, # Motor database object
    action: str,
    user_id: Optional[str] = None,
    tenant_id: Optional[str] = None,
    severity: str = "info",
    ip_address: Optional[str] = None,
    user_agent: Optional[str] = None,
    metadata: Optional[Any] = None,
):
    """
    Utility to record an audit log entry in MongoDB.
    """
    meta_str = json.dumps(metadata) if metadata else None
    
    log_entry = {
        "_id": gen_uuid(),
        "user_id": user_id,
        "tenant_id": tenant_id,
        "action": action,
        "severity": severity,
        "ip_address": ip_address,
        "user_agent": user_agent,
        "metadata_json": meta_str,
        "created_at": datetime.now(timezone.utc)
    }
    
    await db.activity_logs.insert_one(log_entry)
    return log_entry


def check_suspicious_behavior(action: str, metadata: dict) -> str:
    """
    Rule-based suspicious behavior detection.
    """
    if action == "LOGIN_FAILED":
        return "warning"
    return "info"
