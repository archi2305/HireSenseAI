from sqlalchemy import Column, Integer, Text, JSON, DateTime
from sqlalchemy.sql import func
from database import Base


class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    ats_score = Column(Integer)
    matched_skills = Column(JSON)
    missing_skills = Column(JSON)
    suggestions = Column(Text)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())