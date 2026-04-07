from datetime import datetime, timedelta, timezone
from typing import List

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.skill_matcher import calculate_ats_score
from services.suggestion_engine import generate_suggestions
from services.resume_parser import extract_text_from_pdf, extract_text_from_file

import shutil
import uuid
import os
from fastapi.responses import FileResponse, JSONResponse

from database import engine
import models
from routes import auth, oauth, password, profile, settings
from fastapi.staticfiles import StaticFiles

from dotenv import load_dotenv
import os

load_dotenv()

models.Base.metadata.create_all(bind=engine)


class DashboardStats(BaseModel):
    total_resumes: int
    avg_score: float
    total_analyses: int
    system_status: str


from typing import List, Optional

class AnalysisResult(BaseModel):
    id: int
    resume_name: str
    job_role: str
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: str
    created_at: datetime
    file_path: Optional[str] = None


from starlette.middleware.sessions import SessionMiddleware

app = FastAPI()

# OAuth Requires Session Middleware
app.add_middleware(
    SessionMiddleware, 
    secret_key=os.environ.get("SESSION_SECRET", "super-secret-default")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(oauth.router, prefix="/auth", tags=["oauth"])
app.include_router(password.router, prefix="/api/auth", tags=["password"])
app.include_router(profile.router, prefix="/api", tags=["profile"])
app.include_router(settings.router, prefix="/api/settings", tags=["settings"])

os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

from fastapi import Depends
from sqlalchemy.orm import Session
from database import get_db
from models import ResumeAnalysis, User
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sqlalchemy import or_

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/analyze")
@app.post("/analyze-resume")
@app.post("/upload-resume")
@app.post("/api/analyze")
@app.post("/api/analyze-resume")
async def upload_resume(
    file: UploadFile = File(None),
    resume: UploadFile = File(None),
    role: str = Form(""),
    job_description: str = Form(""),
    job_role: str = Form(""),
    db: Session = Depends(get_db)
):
    uploaded_file = file or resume
    effective_role = role or job_role or "Not specified"
    print(
        f"[upload] analyze request received: filename={getattr(uploaded_file, 'filename', None)} "
        f"role={effective_role}"
    )

    if uploaded_file is None:
        raise HTTPException(
            status_code=400,
            detail={"code": "NO_FILE_SELECTED", "message": "No file selected."},
        )

    allowed_extensions = {".pdf", ".docx"}
    file_ext = os.path.splitext((uploaded_file.filename or "").lower())[1]
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=400,
            detail={
                "code": "INVALID_FILE_FORMAT",
                "message": "Invalid file format. Please upload PDF or DOCX.",
            },
        )

    if not uploaded_file.filename:
        raise HTTPException(
            status_code=400,
            detail={"code": "NO_FILE_SELECTED", "message": "No file selected."},
        )

    file_ext = os.path.splitext(uploaded_file.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(uploaded_file.file, buffer)

    max_size_bytes = 10 * 1024 * 1024
    file_size = os.path.getsize(file_path)
    print(
        f"[upload] file debug: exists={os.path.exists(file_path)} "
        f"name={uploaded_file.filename} size={file_size}"
    )
    if os.path.getsize(file_path) > max_size_bytes:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=400,
            detail={"code": "FILE_TOO_LARGE", "message": "File exceeds 10MB limit."},
        )
        
    try:
        resume_text = extract_text_from_file(file_path, uploaded_file.filename)
        parsing_warning = None
        if not resume_text.strip():
            # Some valid PDFs (image/scanned/exported variants) may not yield text extraction.
            # Continue analysis with empty text instead of failing upload.
            parsing_warning = (
                "Resume text could not be extracted fully. Results may be less accurate."
            )
        jd = job_description or "Provide a comprehensive matching score based on standard industry skills."
        
        ats_score, matched_skills, missing_skills = calculate_ats_score(resume_text, jd)
        suggestions = generate_suggestions(resume_text, jd, missing_skills)

        db_analysis = ResumeAnalysis(
            resume_name=uploaded_file.filename or "uploaded_resume",
            job_role=effective_role,
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions,
            file_path=file_path,
            created_at=datetime.utcnow()
        )
        db.add(db_analysis)
        db.commit()
        db.refresh(db_analysis)

        return {
            "message": "success",
            "id": db_analysis.id,
            "ats_score": db_analysis.ats_score,
            "matched_skills": db_analysis.matched_skills,
            "missing_skills": db_analysis.missing_skills,
            "suggestions": db_analysis.suggestions,
            "created_at": db_analysis.created_at,
            "warning": parsing_warning,
        }

    except HTTPException:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise
    except Exception as e:
        print(f"[upload] analyze failed: {e}")
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(
            status_code=500,
            detail={"code": "SERVER_ERROR", "message": "Server not responding."},
        )


@app.post("/bulk-upload")
async def bulk_upload(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(""),
    job_role: str = Form(""),
    db: Session = Depends(get_db)
):
    results = []
    jd = job_description or "General tech role requiring modern skills"
    
    for resume in resumes:
        file_ext = os.path.splitext(resume.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
            
        try:
            resume_text = extract_text_from_pdf(file_path)
            ats_score, matched_skills, missing_skills = calculate_ats_score(resume_text, jd)
            suggestions = generate_suggestions(resume_text, jd, missing_skills)
            
            db_analysis = ResumeAnalysis(
                resume_name=resume.filename or "uploaded_resume",
                job_role=job_role or "Not specified",
                ats_score=ats_score,
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                suggestions=suggestions,
                file_path=file_path,
                created_at=datetime.utcnow()
            )
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            
            results.append({"filename": resume.filename, "status": "success", "id": db_analysis.id})
        except Exception as e:
            if os.path.exists(file_path): os.remove(file_path)
            results.append({"filename": resume.filename, "status": "error", "message": str(e)})
            
    return {"processed": len(results), "results": results}


@app.delete("/candidate/{candidate_id}")
def delete_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    file_path = candidate.file_path
    if file_path and os.path.exists(file_path):
        os.remove(file_path)
        
    db.delete(candidate)
    db.commit()
    return {"ok": True, "message": "Candidate deleted successfully"}


@app.get("/download/{candidate_id}")
def download_candidate(candidate_id: int, db: Session = Depends(get_db)):
    candidate = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == candidate_id).first()
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    file_path = candidate.file_path
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file not found on server")
        
    return FileResponse(path=file_path, filename=candidate.resume_name, media_type='application/octet-stream')


@app.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(db: Session = Depends(get_db)):
    total = db.query(ResumeAnalysis).count()
    if total == 0:
        avg_score = 0.0
    else:
        scores = [a.ats_score for a in db.query(ResumeAnalysis.ats_score).all()]
        avg_score = sum(scores) / total

    return DashboardStats(
        total_resumes=total,
        avg_score=round(avg_score, 2),
        total_analyses=total,
        system_status="Active",
    )


@app.get("/analyses")
def list_analyses(db: Session = Depends(get_db)):
    analyses = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).all()
    results = [
        {
            "id": a.id,
            "resume_name": a.resume_name,
            "job_role": a.job_role,
            "ats_score": a.ats_score,
            "date": a.created_at.isoformat() if a.created_at else None,
        }
        for a in analyses
    ]
    return results


@app.get("/score-history")
def get_score_history(db: Session = Depends(get_db)):
    analyses = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.asc()).all()
    return [
        {"name": f"Run {idx + 1}", "score": a.ats_score}
        for idx, a in enumerate(analyses)
    ]


@app.get("/section-scores")
def get_section_scores(db: Session = Depends(get_db)):
    latest = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).first()
    base_score = latest.ats_score if latest else 60

    return [
        {"name": "Experience", "score": max(0, min(100, base_score + 5))},
        {"name": "Skills", "score": max(0, min(100, base_score + 10))},
        {"name": "Education", "score": max(0, min(100, base_score - 5))},
        {"name": "Projects", "score": max(0, min(100, base_score - 10))},
    ]


@app.get("/recent-analyses")
def recent_analyses(db: Session = Depends(get_db)):
    return list_analyses(db)


@app.get("/analytics/overview")
def analytics_overview(db: Session = Depends(get_db)):
    total = db.query(ResumeAnalysis).count()
    if total == 0:
        avg_score = 0.0
        good_matches = 0
    else:
        scores = [a.ats_score for a in db.query(ResumeAnalysis.ats_score).all()]
        avg_score = sum(scores) / total
        good_matches = db.query(ResumeAnalysis).filter(ResumeAnalysis.ats_score >= 80).count()
    
    return {
        "total_resumes": total,
        "avg_score": round(avg_score, 2),
        "recent_matches": good_matches
    }


@app.get("/analytics/skills")
def analytics_skills(db: Session = Depends(get_db)):
    skill_counts = {}
    analyses = db.query(ResumeAnalysis.matched_skills).all()
    for row in analyses:
        skills = row[0] or []
        for skill in skills:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
            
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    return [{"name": k.title(), "count": v} for k, v in sorted_skills]


@app.get("/analytics/scores")
def analytics_scores(db: Session = Depends(get_db)):
    ranges = {"0-50": 0, "50-80": 0, "80+": 0}
    scores = db.query(ResumeAnalysis.ats_score).all()
    for row in scores:
        score = row[0]
        if score <= 50: ranges["0-50"] += 1
        elif score <= 80: ranges["50-80"] += 1
        else: ranges["80+"] += 1
    return [{"name": k, "value": v} for k, v in ranges.items()]


@app.get("/analytics/trend")
def analytics_trend(db: Session = Depends(get_db)):
    counts_by_date = {}
    analyses = db.query(ResumeAnalysis.created_at).all()
    for row in analyses:
        if row[0]:
            date_str = row[0].strftime("%Y-%m-%d")
            counts_by_date[date_str] = counts_by_date.get(date_str, 0) + 1
            
    sorted_dates = sorted(counts_by_date.items(), key=lambda x: x[0])
    return [{"date": k, "count": v} for k, v in sorted_dates]


@app.get("/candidates")
def list_candidates(
    search: Optional[str] = None,
    skills: Optional[str] = None,
    min_score: Optional[int] = None,
    max_score: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ResumeAnalysis)
    
    if search:
        search_lower = f"%{search.lower()}%"
        query = query.filter(
            or_(
                ResumeAnalysis.resume_name.ilike(search_lower),
                ResumeAnalysis.job_role.ilike(search_lower)
            )
        )
        
    if min_score is not None:
        query = query.filter(ResumeAnalysis.ats_score >= min_score)
    if max_score is not None:
        query = query.filter(ResumeAnalysis.ats_score <= max_score)
        
    analyses = query.all()
    
    if skills:
        skill_list = [s.strip().lower() for s in skills.split(",")]
        # Filter python-side for JSON contains depending on schema limits
        filtered = []
        for a in analyses:
            candidate_skills = [sk.lower() for sk in (a.matched_skills or [])]
            if any(s in candidate_skills for s in skill_list):
                filtered.append(a)
        analyses = filtered

    out = []
    for a in analyses:
        out.append({
            "id": a.id,
            "name": a.resume_name.replace(".pdf", "").replace("_", " ").title(),
            "role": a.job_role,
            "ats_score": a.ats_score,
            "skills": a.matched_skills or [],
            "missing_skills": a.missing_skills or [],
            "suggestions": a.suggestions,
            "status": "High Match" if a.ats_score >= 80 else ("Good Match" if a.ats_score >= 60 else "Low Match"),
            "date": a.created_at.isoformat() if a.created_at else None
        })
    return out


@app.post("/candidates/match")
def match_candidates(job_description: str = Form(...), db: Session = Depends(get_db)):
    """
    Uses scikit-learn TF-IDF to calculate Cosine Similarity specifically against the candidates
    present in the DB against the requested Job Description.
    """
    analyses = db.query(ResumeAnalysis).all()
    results = []
    
    # Pre-parse vectors if needed or rely on base ATS score + JD keyword boosting
    for a in analyses:
        match_score = a.ats_score
        
        # We can implement a fast text-check if we dynamically extract their PDF 
        # But to be robust and performant, we boost the database's pre-computed
        # score mathematically using TF-IDF logic mapped across their explicit skills!
        
        if job_description and a.matched_skills:
            try:
                candidate_skills_str = " ".join(a.matched_skills)
                vectorizer = TfidfVectorizer(stop_words='english')
                tfidf_matrix = vectorizer.fit_transform([job_description.lower(), candidate_skills_str])
                
                # Semantic relevance between the JD and the candidate's known skills
                similarity = cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0]
                
                # Blend the ATS score (70%) with the JD similarity semantic score (30%)
                semantic_boost = int(similarity * 100)
                match_score = min(100, int((match_score * 0.7) + (semantic_boost * 0.3)))
                
            except Exception:
                pass
                
        results.append({
            "id": a.id,
            "name": a.resume_name.replace(".pdf", "").replace("_", " ").title(),
            "role": a.job_role,
            "match_percentage": match_score,
            "skills": a.matched_skills or []
        })
        
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results