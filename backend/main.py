import os
from datetime import datetime
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import ValidationError
from fastapi.responses import JSONResponse
from backend.routes.auth import router as auth_router
from backend.routes.matches import router as matches_router
from backend.routes.stats import router as stats_router

# Initialize FastAPI app
app = FastAPI(
    title="TicTacToe API",
    description="API for TicTacToe game backend",
    version="1.0.0"
)

# Configure CORS middleware
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router, prefix="/api")
app.include_router(matches_router, prefix="/api")
app.include_router(stats_router, prefix="/api")

# Global exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(ValidationError)
async def validation_exception_handler(request: Request, exc: ValidationError):
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "ok", "timestamp": datetime.utcnow().isoformat()}

# Lifespan context manager for startup/shutdown
@app.on_event("startup")
async def startup_event():
    from database.config import engine as _aakaar_engine
    from database.models import Base as _AakaarBase
    _AakaarBase.metadata.create_all(bind=_aakaar_engine)

@app.on_event("shutdown")
async def shutdown_event():
    pass