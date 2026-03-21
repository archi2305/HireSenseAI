from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
import shutil
import os
import uuid
from typing import List, Optional

from database import get_db
import models
from routes.auth import get_current_user
from pydantic import BaseModel
from datetime import datetime, timezone

router = APIRouter(prefix="/profile", tags=["profile"])

class ProfileUpdate(BaseModel):
    fullname: Optional[str] = None
    company: Optional[str] = None
    job_role: Optional[str] = None
    bio: Optional[str] = None
    preferred_roles: Optional[List[str]] = None
    preferred_skills: Optional[List[str]] = None
    email_alerts: Optional[bool] = None
    weekly_reports: Optional[bool] = None

@router.get("/me")
def get_profile(current_user: models.User = Depends(get_current_user)):
    return {
        "fullname": current_user.fullname,
        "email": current_user.email,
        "company": current_user.company,
        "job_role": current_user.job_role,
        "bio": current_user.bio,
        "avatar_url": current_user.avatar_url,
        "preferred_roles": current_user.preferred_roles if current_user.preferred_roles else [],
        "preferred_skills": current_user.preferred_skills if current_user.preferred_skills else [],
        "email_alerts": current_user.email_alerts if current_user.email_alerts is not None else True,
        "weekly_reports": current_user.weekly_reports if current_user.weekly_reports is not None else False
    }

@router.put("/me")
def update_profile(profile_data: ProfileUpdate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    data_dict = profile_data.dict(exclude_unset=True)
    
    for key, value in data_dict.items():
        setattr(current_user, key, value)
        
    db.commit()
    db.refresh(current_user)
    
    return {"message": "Profile updated successfully"}

UPLOAD_DIR = "uploads/avatars"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/avatar")
def upload_avatar(file: UploadFile = File(...), db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if not file.filename:
        raise HTTPException(status_code=400, detail="No file provided")
    
    file_ext = os.path.splitext(file.filename)[1]
    unique_filename = f"{uuid.uuid4()}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    url_path = f"/avatars/{unique_filename}"
    current_user.avatar_url = url_path
    db.commit()
    db.refresh(current_user)
    
    return {"avatar_url": url_path}

@router.get("/activity")
def get_activity(current_user: models.User = Depends(get_current_user)):
    # Mocking activity since the current resume analysis engine is transient memory-based
    return {
        "total_analyzed": 14,
        "reports_generated": 5,
        "last_login": datetime.now(timezone.utc).isoformat()
    }
