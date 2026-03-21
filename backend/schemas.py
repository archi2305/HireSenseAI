from pydantic import BaseModel, Field, EmailStr
from datetime import datetime
from typing import List

class UserCreate(BaseModel):
    fullname: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    fullname: str
    email: EmailStr
    avatar_url: str | None = None
    created_at: datetime

    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: str | None = None

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

    