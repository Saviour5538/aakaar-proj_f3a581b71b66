from backend.services.auth import get_current_user_id
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database.models import Match
from database.config import SessionLocal
from backend.routes.auth import get_current_user  # Corrected import path
from uuid import UUID

router = APIRouter(prefix="/stats")

class StatsResponse(BaseModel):
    total_matches: int
    wins: int
    losses: int
    draws: int

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/", response_model=StatsResponse, operation_id="get_stats")
async def get_stats(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user_id),
):
    try:
        # Query total matches played by the user
        total_matches = db.query(Match).filter(Match.user_id == current_user).count()

        # Query wins, losses, and draws
        wins = db.query(Match).filter(Match.user_id == current_user, Match.result == "win").count()
        losses = db.query(Match).filter(Match.user_id == current_user, Match.result == "loss").count()
        draws = db.query(Match).filter(Match.user_id == current_user, Match.result == "draw").count()

        return StatsResponse(
            total_matches=total_matches,
            wins=wins,
            losses=losses,
            draws=draws,
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while fetching statistics.",
        )