from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, JSON

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    fullname = Column(String)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # --- Profile Enhancement Columns --- #
    company = Column(String, nullable=True)
    job_role = Column(String, nullable=True)
    bio = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True)
    
    # Tags
    preferred_roles = Column(JSON, default=list)
    preferred_skills = Column(JSON, default=list)
    
    # Notifications
    email_alerts = Column(Boolean, default=True)
    weekly_reports = Column(Boolean, default=False)
    resume_match_alerts = Column(Boolean, default=True)
    
    # Settings & Integrations
    openai_api_key = Column(String, nullable=True)
    dark_mode = Column(Boolean, default=False)
    accent_color = Column(String, default="pastelBlue")

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    resume_name = Column(String)
    job_role = Column(String)
    ats_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)