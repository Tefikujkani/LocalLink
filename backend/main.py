"""
LocalLink FastAPI Backend — Next-Gen MongoDB Migration
===========================================================
Run with:  uvicorn main:app --reload --port 8000
Docs at:   http://localhost:8000/docs
"""
from fastapi import FastAPI, Request, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import time
import os
from dotenv import load_dotenv

# Security & Rate Limiting
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

from database import connect_to_mongo, close_mongo_connection
from routers import auth, businesses, users, security, ai, settings
from services.websocket_manager import ws_manager

load_dotenv()

# ─── Lifespan (MongoDB Connection) ─────────────────────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

# ─── Rate Limiter ──────────────────────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ─── App ───────────────────────────────────────────────────────────────────────
app = FastAPI(
    title="LocalLink API",
    description="Secure, AI-powered backend for the LocalLink platform (MongoDB Edition).",
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── Middleware ────────────────────────────────────────────────────────────────
raw_origins = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000")
allowed_origins = [o.strip() for o in raw_origins.split(",") if o.strip()]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(TrustedHostMiddleware, allowed_hosts=["localhost", "127.0.0.1", "*"])


# ─── Request timing & Global Logging middleware ───────────────────────────────
@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = (time.time() - start) * 1000
    response.headers["X-Process-Time"] = f"{duration:.2f}ms"
    return response


# ─── Security Hardening Middleware ───────────────────────────────────────────
@app.middleware("http")
async def add_security_headers(request: Request, call_next):
    response = await call_next(request)
    # Final Line of Defense: Security Headers
    response.headers["Content-Security-Policy"] = (
        "default-src 'self'; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
        "font-src 'self' https://fonts.gstatic.com; "
        "img-src 'self' data: https://*.amazonaws.com https://api.qrserver.com https://picsum.photos; "
        "connect-src 'self' ws: wss: http://localhost:8000 ws://localhost:8000;"
    )
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    return response


# ─── Global exception handler ─────────────────────────────────────────────────
@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    # Log the crash for debugging
    print(f"CRITICAL ERROR: {exc}")
    return JSONResponse(
        status_code=500,
        content={"detail": "An unexpected server error occurred."},
    )


# ─── Routers ──────────────────────────────────────────────────────────────────
app.include_router(auth.router)
app.include_router(businesses.router)
app.include_router(users.router)
app.include_router(security.router)
app.include_router(settings.router)
app.include_router(ai.router)


# ─── WebSockets (Real-time Notifications) ────────────────────────────────────
@app.websocket("/ws/{user_id}")
async def websocket_endpoint(websocket: WebSocket, user_id: str):
    await ws_manager.connect(websocket, user_id)
    try:
        while True:
            # Keep connection alive and wait for client heartbeat or messages
            data = await websocket.receive_text()
            # Handle incoming client commands if needed
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket, user_id)


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": "LocalLink API", "version": "2.0.0"}


@app.get("/", tags=["Health"])
def root():
    return {
        "message": "Welcome to LocalLink API 2.0 (MongoDB Powered) 🚀",
        "docs": "/docs",
        "health": "/health",
    }
