from datetime import datetime, timedelta
from typing import List

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from services.resume_parser import extract_text_from_pdf
from services.skill_matcher import calculate_ats_score
from services.suggestion_engine import generate_suggestions


class DashboardStats(BaseModel):
    total_resumes: int
    avg_score: float
    total_analyses: int
    system_status: str


class AnalysisResult(BaseModel):
    id: int
    resume_name: str
    job_role: str
    ats_score: int
    matched_skills: List[str]
    missing_skills: List[str]
    suggestions: str
    created_at: datetime


app = FastAPI()

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


_seed_demo_data()


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...),
    job_role: str = Form(""),
):
    """
    Analyze a resume against a job description and store the result in memory.
    """
    try:
        resume.file.seek(0)
        resume_text = extract_text_from_pdf(resume.file)

        ats_score, matched_skills, missing_skills = calculate_ats_score(
            resume_text, job_description
        )

        suggestions = generate_suggestions(
            resume_text, job_description, missing_skills
        )

        analysis_id = len(ANALYSES_MEMORY) + 1
        created_at = datetime.utcnow()

        analysis = AnalysisResult(
            id=analysis_id,
            resume_name=resume.filename or "uploaded_resume",
            job_role=job_role or "Not specified",
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions,
            created_at=created_at,
        )

        ANALYSES_MEMORY.append(analysis)

        # Shape the response for the current frontend
        return {
            "id": analysis.id,
            "ats_score": analysis.ats_score,
            "matched_skills": analysis.matched_skills,
            "missing_skills": analysis.missing_skills,
            "suggestions": analysis.suggestions,
            "created_at": analysis.created_at,
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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