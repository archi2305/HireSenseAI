from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.skill_matcher import calculate_ats_score
from services.suggestion_engine import generate_suggestions
from services.resume_parser import extract_text_from_pdf

import shutil
import uuid
import os
from fastapi.responses import FileResponse, JSONResponse

from database import engine
import models
from routes import auth, oauth, password

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

# Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5173",
        "http://localhost:5173",
        "*",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(oauth.router, prefix="/auth", tags=["oauth"])
app.include_router(password.router, prefix="/api/auth", tags=["password"])

# In-memory store for analyses (used when no DB is configured)
ANALYSES_MEMORY: List[AnalysisResult] = []


def _seed_demo_data() -> None:
    """
    Seed a few demo analyses so the dashboard is not empty on first run.
    This keeps the app functional even before any real uploads.
    """
    if ANALYSES_MEMORY:
        return

    now = datetime.utcnow()

    samples = [
        AnalysisResult(
            id=1,
            resume_name="resume_ml_engineer.pdf",
            job_role="ML Engineer",
            ats_score=78,
            matched_skills=["python", "sql", "git"],
            missing_skills=["docker", "aws"],
            suggestions="Good alignment with ML role. Consider adding Docker and AWS experience.",
            created_at=now - timedelta(days=2),
        ),
        AnalysisResult(
            id=2,
            resume_name="resume_backend.pdf",
            job_role="Backend Engineer",
            ats_score=85,
            matched_skills=["python", "fastapi", "rest", "git"],
            missing_skills=["aws"],
            suggestions="Strong backend profile. Add more detail on cloud deployments (AWS).",
            created_at=now - timedelta(days=1),
        ),
        AnalysisResult(
            id=3,
            resume_name="resume_data_analyst.pdf",
            job_role="Data Analyst",
            ats_score=70,
            matched_skills=["python", "sql"],
            missing_skills=["aws"],
            suggestions="Highlight data visualization tools and cloud skills to improve fit.",
            created_at=now,
        ),
    ]

    ANALYSES_MEMORY.extend(samples)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

def _seed_demo_data() -> None:
    """
    Seed a few demo analyses so the dashboard is not empty on first run.
    This keeps the app functional even before any real uploads.
    """
    if ANALYSES_MEMORY:
        return

    now = datetime.utcnow()

    samples = [
        AnalysisResult(
            id=1,
            resume_name="resume_ml_engineer.pdf",
            job_role="ML Engineer",
            ats_score=78,
            matched_skills=["python", "sql", "git"],
            missing_skills=["docker", "aws"],
            suggestions="Good alignment with ML role. Consider adding Docker and AWS experience.",
            created_at=now - timedelta(days=2),
            file_path=os.path.join(UPLOAD_DIR, "resume_ml_engineer.pdf")
        ),
        AnalysisResult(
            id=2,
            resume_name="resume_backend.pdf",
            job_role="Backend Engineer",
            ats_score=85,
            matched_skills=["python", "fastapi", "rest", "git"],
            missing_skills=["aws"],
            suggestions="Strong backend profile. Add more detail on cloud deployments (AWS).",
            created_at=now - timedelta(days=1),
            file_path=os.path.join(UPLOAD_DIR, "resume_backend.pdf")
        ),
        AnalysisResult(
            id=3,
            resume_name="resume_data_analyst.pdf",
            job_role="Data Analyst",
            ats_score=70,  
            matched_skills=["python", "sql"],
            missing_skills=["aws"],
            suggestions="Highlight data visualization tools and cloud skills to improve fit.",
            created_at=now,
            file_path=os.path.join(UPLOAD_DIR, "resume_data_analyst.pdf")
        ),
    ]

    ANALYSES_MEMORY.extend(samples)
    
    # Create valid dummy PDFs on disk so download works for seeded data without throwing 404
    for s in samples:
        try:
            if not os.path.exists(s.file_path):
                # We can write a tiny valid pseudo-PDF to prevent errors from purely empty bytes if a system tries opening it.
                with open(s.file_path, "wb") as f:
                    f.write(b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] >>\nendobj\nxref\n0 4\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \ntrailer\n<< /Size 4 /Root 1 0 R >>\nstartxref\n198\n%%EOF\n")
        except Exception:
            pass

_seed_demo_data()

@app.post("/analyze")
@app.post("/upload-resume")
async def upload_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(""),
    job_role: str = Form(""),
):
    file_ext = os.path.splitext(resume.filename)[1]
    unique_filename = f"{uuid.uuid4().hex}{file_ext}"
    file_path = os.path.join(UPLOAD_DIR, unique_filename)
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(resume.file, buffer)
        
    try:
        resume.file.seek(0)
        resume_text = extract_text_from_pdf(resume.file)
        jd = job_description or "Provide a comprehensive matching score based on standard industry skills."
        ats_score, matched_skills, missing_skills = calculate_ats_score(resume_text, jd)
        suggestions = generate_suggestions(resume_text, jd, missing_skills)

        analysis = AnalysisResult(
            id=len(ANALYSES_MEMORY) + 1,
            resume_name=resume.filename or "uploaded_resume",
            job_role=job_role or "Not specified",
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions,
            created_at=datetime.now(timezone.utc),
            file_path=file_path
        )
        ANALYSES_MEMORY.append(analysis)

        return {
            "id": analysis.id,
            "ats_score": analysis.ats_score,
            "matched_skills": analysis.matched_skills,
            "missing_skills": analysis.missing_skills,
            "suggestions": analysis.suggestions,
            "created_at": analysis.created_at,
        }

    except Exception as e:
        if os.path.exists(file_path):
            os.remove(file_path)
        raise HTTPException(status_code=500, detail=str(e))

from typing import List

@app.post("/bulk-upload")
async def bulk_upload(
    resumes: List[UploadFile] = File(...),
    job_description: str = Form(""),
    job_role: str = Form(""),
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
            analysis = AnalysisResult(
                id=len(ANALYSES_MEMORY) + 1,
                resume_name=resume.filename or "uploaded_resume",
                job_role=job_role or "Not specified",
                ats_score=ats_score,
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                suggestions=suggestions,
                created_at=datetime.now(timezone.utc),
                file_path=file_path
            )
            ANALYSES_MEMORY.append(analysis)
            results.append({"filename": resume.filename, "status": "success", "id": analysis.id})
        except Exception as e:
            if os.path.exists(file_path): os.remove(file_path)
            results.append({"filename": resume.filename, "status": "error", "message": str(e)})
            
    return {"processed": len(results), "results": results}

@app.delete("/candidate/{candidate_id}")
def delete_candidate(candidate_id: int):
    global ANALYSES_MEMORY
    candidate = next((a for a in ANALYSES_MEMORY if a.id == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    ANALYSES_MEMORY = [a for a in ANALYSES_MEMORY if a.id != candidate_id]
    
    file_path = getattr(candidate, "file_path", None)
    if file_path and os.path.exists(file_path):
        os.remove(file_path)
        
    return {"ok": True, "message": "Candidate deleted successfully"}

@app.get("/download/{candidate_id}")
def download_candidate(candidate_id: int):
    candidate = next((a for a in ANALYSES_MEMORY if a.id == candidate_id), None)
    if not candidate:
        raise HTTPException(status_code=404, detail="Candidate not found")
        
    file_path = getattr(candidate, "file_path", None)
    if not file_path or not os.path.exists(file_path):
        raise HTTPException(status_code=404, detail="Resume file not found on server")
        
    return FileResponse(path=file_path, filename=candidate.resume_name, media_type='application/octet-stream')


@app.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats():
    """
    Return summary statistics for the dashboard based on in-memory analyses.
    """
    total = len(ANALYSES_MEMORY)
    if total == 0:
        avg_score = 0.0
    else:
        avg_score = sum(a.ats_score for a in ANALYSES_MEMORY) / total

    return DashboardStats(
        total_resumes=total,
        avg_score=round(avg_score, 2),
        total_analyses=total,
        system_status="Active",
    )


@app.get("/analyses")
def list_analyses():
    """
    Return recent analyses in a simplified shape for the dashboard and history.
    """
    results = []
    for a in sorted(ANALYSES_MEMORY, key=lambda x: x.created_at, reverse=True):
        results.append(
            {
                "id": a.id,
                "resume_name": a.resume_name,
                "job_role": a.job_role,
                "ats_score": a.ats_score,
                "date": a.created_at.isoformat(),
            }
        )
    return results


@app.get("/score-history")
def get_score_history():
    """
    Simple score history derived from analyses; falls back to empty list.
    """
    if not ANALYSES_MEMORY:
        return []

    history = []
    for idx, a in enumerate(
        sorted(ANALYSES_MEMORY, key=lambda x: x.created_at)
    ):
        history.append(
            {
                "name": f"Run {idx + 1}",
                "score": a.ats_score,
            }
        )
    return history


@app.get("/section-scores")
def get_section_scores():
    """
    Placeholder section scores so charts have real API data.
    Currently derived from overall ATS score.
    """
    if not ANALYSES_MEMORY:
        base_score = 60
    else:
        base_score = ANALYSES_MEMORY[-1].ats_score

    # Distribute around the base score for a simple breakdown
    return [
        {"name": "Experience", "score": max(0, min(100, base_score + 5))},
        {"name": "Skills", "score": max(0, min(100, base_score + 10))},
        {"name": "Education", "score": max(0, min(100, base_score - 5))},
        {"name": "Projects", "score": max(0, min(100, base_score - 10))},
    ]


@app.get("/recent-analyses")
def recent_analyses():
    """
    Backwards-compatible alias for /analyses if needed.
    """
    return list_analyses()

@app.get("/analytics/overview")
def analytics_overview():
    total = len(ANALYSES_MEMORY)
    if total == 0:
        avg_score = 0.0
    else:
        avg_score = sum(a.ats_score for a in ANALYSES_MEMORY) / total
    return {
        "total_resumes": total,
        "avg_score": round(avg_score, 2),
        "recent_matches": len([a for a in ANALYSES_MEMORY if a.ats_score >= 80])
    }

@app.get("/analytics/skills")
def analytics_skills():
    skill_counts = {}
    for a in ANALYSES_MEMORY:
        for skill in a.matched_skills:
            skill_counts[skill] = skill_counts.get(skill, 0) + 1
    # Sort and return top 5
    sorted_skills = sorted(skill_counts.items(), key=lambda x: x[1], reverse=True)[:5]
    return [{"name": k.title(), "count": v} for k, v in sorted_skills]

@app.get("/analytics/scores")
def analytics_scores():
    ranges = {"0-50": 0, "50-80": 0, "80+": 0}
    for a in ANALYSES_MEMORY:
        if a.ats_score <= 50:
            ranges["0-50"] += 1
        elif a.ats_score <= 80:
            ranges["50-80"] += 1
        else:
            ranges["80+"] += 1
    return [{"name": k, "value": v} for k, v in ranges.items()]

@app.get("/analytics/trend")
def analytics_trend():
    # Return count of resumes by date
    counts_by_date = {}
    for a in ANALYSES_MEMORY:
        date_str = a.created_at.strftime("%Y-%m-%d")
        counts_by_date[date_str] = counts_by_date.get(date_str, 0) + 1
    
    # Sort by date
    sorted_dates = sorted(counts_by_date.items(), key=lambda x: x[0])
    return [{"date": k, "count": v} for k, v in sorted_dates]

from typing import Optional

@app.get("/candidates")
def list_candidates(
    search: Optional[str] = None,
    skills: Optional[str] = None,
    min_score: Optional[int] = None,
    max_score: Optional[int] = None
):
    results = ANALYSES_MEMORY
    if search:
        search_lower = search.lower()
        results = [
            r for r in results 
            if search_lower in r.resume_name.lower() 
            or search_lower in r.job_role.lower()
            or any(search_lower in mk.lower() for mk in r.matched_skills)
        ]
    if min_score is not None:
        results = [r for r in results if r.ats_score >= min_score]
        
    if max_score is not None:
        results = [r for r in results if r.ats_score <= max_score]
        
    if skills:
        skill_list = [s.strip().lower() for s in skills.split(",")]
        # Match if candidate has ANY of the requested skills
        results = [r for r in results if any(s.lower() in [mk.lower() for mk in r.matched_skills] for s in skill_list)]
        
    out = []
    for a in results:
        out.append({
            "id": a.id,
            "name": a.resume_name.replace(".pdf", "").replace("_", " ").title(),
            "role": a.job_role,
            "ats_score": a.ats_score,
            "skills": a.matched_skills,
            "missing_skills": a.missing_skills,
            "suggestions": a.suggestions,
            "status": "High Match" if a.ats_score >= 80 else ("Good Match" if a.ats_score >= 60 else "Low Match"),
            "date": a.created_at.isoformat()
        })
    return out

@app.post("/candidates/match")
def match_candidates(job_description: str = Form(...)):
    jd_lower = job_description.lower()
    results = []
    for a in ANALYSES_MEMORY:
        match_score = a.ats_score
        if a.job_role.lower() in jd_lower:
            match_score = min(100, match_score + 10)
        
        results.append({
            "id": a.id,
            "name": a.resume_name.replace(".pdf", "").replace("_", " ").title(),
            "role": a.job_role,
            "match_percentage": match_score,
            "skills": a.matched_skills
        })
        
    results.sort(key=lambda x: x["match_percentage"], reverse=True)
    return results