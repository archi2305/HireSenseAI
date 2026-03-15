from pydantic import BaseModel, Field
from datetime import datetime
from typing import List

class AnalysisResponse(BaseModel):
    id: int
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: str
    created_at: datetime | None
    updated_at: datetime | None

    class Config:
        from_attributes = True


class AnalysisUpdate(BaseModel):
    ats_score: int = Field(..., ge=0, le=100)
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: str

    