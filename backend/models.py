from sqlalchemy import Column, Integer, String, Float, DateTime
from database import Base
from datetime import datetime

class ResumeAnalysis(Base):
    __tablename__ = "resume_analysis"

    id = Column(Integer, primary_key=True, index=True)
    resume_name = Column(String)
    job_role = Column(String)
    ats_score = Column(Float)
    created_at = Column(DateTime, default=datetime.utcnow)