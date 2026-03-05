from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, Query, Security
from fastapi.security import APIKeyHeader
from sqlalchemy.orm import Session
from datetime import datetime
import logging

from database import get_db
from models import Analysis
from schemas import AnalysisResponse, AnalysisUpdate
from services.resume_parser import extract_text_from_pdf
from services.skill_matcher import calculate_ats_score
from services.suggestion_engine import generate_suggestions

app = FastAPI()

# ------------------ Logging ------------------

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# ------------------ API Key Security ------------------

api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

def verify_api_key(api_key: str = Security(api_key_header)):
    if api_key != "supersecretkey":
        raise HTTPException(status_code=403, detail="Invalid API Key")
    return api_key

# ------------------ POST ------------------

@app.post("/analyze", response_model=AnalysisResponse)
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    db: Session = Depends(get_db),
    api_key: str = Security(verify_api_key)  # secure endpoint
):
    try:
        resume.file.seek(0)  # move pointer to start
        resume_text = extract_text_from_pdf(resume.file)

        # calculate ATS
        ats_score, matched_skills, missing_skills = calculate_ats_score(
            resume_text, job_description
        )

        # generate suggestions
        suggestions = generate_suggestions(
            resume_text, job_description, missing_skills
        )

        # save to database
        analysis = Analysis(
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions,
            created_at=datetime.now()
        )

        db.add(analysis)
        db.commit()
        db.refresh(analysis)

        logger.info("New analysis created")

        return analysis

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ------------------ GET ALL (Pagination) ------------------

@app.get("/analysis", response_model=list[AnalysisResponse])
def get_all_analysis(
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db)
):
    return db.query(Analysis).offset(skip).limit(limit).all()


# ------------------ GET SINGLE ------------------

@app.get("/analysis/{analysis_id}", response_model=AnalysisResponse)
def get_analysis(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return analysis


# ------------------ UPDATE ------------------

@app.put("/analysis/{analysis_id}", response_model=AnalysisResponse)
def update_analysis(
    analysis_id: int,
    data: AnalysisUpdate,
    db: Session = Depends(get_db),
    api_key: str = Security(verify_api_key)  # secure endpoint
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    analysis.ats_score = data.ats_score
    analysis.matched_skills = data.matched_skills
    analysis.missing_skills = data.missing_skills
    analysis.suggestions = data.suggestions
    analysis.updated_at = datetime.now()

    db.commit()
    db.refresh(analysis)

    logger.info(f"Analysis {analysis_id} updated")

    return analysis


# ------------------ DELETE ------------------

@app.delete("/analysis/{analysis_id}")
def delete_analysis(
    analysis_id: int,
    db: Session = Depends(get_db),
    api_key: str = Security(verify_api_key)  # secure endpoint
):
    analysis = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    db.delete(analysis)
    db.commit()

    logger.info(f"Analysis {analysis_id} deleted")

    return {"message": "Deleted successfully"}