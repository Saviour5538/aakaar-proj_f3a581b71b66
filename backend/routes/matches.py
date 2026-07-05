from backend.services.auth import get_current_user_id
from typing import Optional, List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from uuid import UUID

from database.models import Match
from database.config import SessionLocal
from backend.routes.auth import get_current_user

router = APIRouter(prefix="/matches")

class MatchResponse(BaseModel):
    id: Optional[str] = None
    user_id: Optional[str] = None
    result: str
    winner: Optional[str] = None
    moves: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

async def create_match_service(db: Session, current_user):
    new_match = Match(
        user_id=current_user,
        result="pending",
        winner=None,
        moves=0,
        created_at=datetime.utcnow()
    )
    db.add(new_match)
    db.commit()
    db.refresh(new_match)
    return new_match

async def get_user_matches_service(db: Session, current_user):
    matches = db.query(Match).filter(Match.user_id == current_user).all()
    return matches

@router.post("/", response_model=MatchResponse, operation_id="create_match", status_code=status.HTTP_201_CREATED)
async def create_match(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        match = await create_match_service(db, current_user)
        return match
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))

@router.get("/", response_model=List[MatchResponse], operation_id="get_matches", status_code=status.HTTP_200_OK)
async def get_matches(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id)
):
    try:
        matches = await get_user_matches_service(db, current_user)
        return matches
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=str(e))