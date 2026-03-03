from sqlalchemy import Column, Integer, Float, Text
from database import Base

class Analysis(Base):
    __tablename__ = "analysis"

    id = Column(Integer, primary_key=True, index=True)
    ats_score = Column(Float)
    matched_skills = Column(Text)
    missing_skills = Column(Text)
    suggestions = Column(Text)