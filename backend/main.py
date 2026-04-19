from datetime import datetime, timedelta, timezone
from typing import List
import logging
import re

from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

import shutil
import uuid
import os
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from dotenv import load_dotenv

# Load environment variables explicitly from backend/.env
BASE_DIR = os.path.dirname(__file__)
DOTENV_PATH = os.path.join(BASE_DIR, ".env")
load_dotenv(DOTENV_PATH, override=True)

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
)
logger = logging.getLogger("hiresense-backend")

GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID")
GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET")

logger.info("Environment loaded from %s", DOTENV_PATH)
logger.info("Google OAuth configured: %s", bool(GOOGLE_CLIENT_ID))
logger.info("GitHub OAuth configured: %s", bool(GITHUB_CLIENT_ID))

try:
    from services.skill_matcher import (
        calculate_ats_score,
        calculate_job_description_match,
        detect_best_role,
        extract_resume_sections,
        generate_interview_questions,
    )
    from services.suggestion_engine import (
        generate_suggestions,
        generate_smart_suggestions,
        improve_bullet_line,
    )
    from services.resume_parser import extract_text_from_pdf, extract_text_from_file
except ImportError:
    from backend.services.skill_matcher import (
        calculate_ats_score,
        calculate_job_description_match,
        detect_best_role,
        extract_resume_sections,
        generate_interview_questions,
    )
    from backend.services.suggestion_engine import (
        generate_suggestions,
        generate_smart_suggestions,
        improve_bullet_line,
    )
    from backend.services.resume_parser import extract_text_from_pdf, extract_text_from_file

ROLE_JD_TEMPLATES = {
    "frontend developer": "Frontend Developer role requiring javascript, react, html, css, git, rest api.",
    "backend developer": "Backend Developer role requiring python, fastapi, sql, postgresql, docker, git, rest api.",
    "full stack developer": "Full Stack Developer role requiring javascript, react, node, python, sql, docker, git.",
    "software engineer": "Software Engineer role requiring python, java, sql, git, docker, rest api.",
    "data analyst": "Data Analyst role requiring sql, python, postgresql, machine learning, git.",
    "machine learning engineer": "Machine Learning Engineer role requiring python, machine learning, ai, sql, docker, aws.",
    "devops engineer": "DevOps Engineer role requiring docker, kubernetes, aws, git, python, rest api.",
    "cloud engineer": "Cloud Engineer role requiring aws, docker, kubernetes, python, git, rest api.",
    "mobile app developer": "Mobile App Developer role requiring javascript, react, api integration, git.",
}


def _default_job_description(role: str) -> str:
    role_key = (role or "").strip().lower()
    if role_key in ROLE_JD_TEMPLATES:
        return ROLE_JD_TEMPLATES[role_key]
    return (
        "General Software Engineer role requiring python, javascript, sql, git, rest api, "
        "docker, and solid software engineering fundamentals."
    )

try:
    from database import engine
    import models
    from routes import auth, oauth, password, profile, settings
except ImportError:
    from backend.database import engine
    import backend.models as models
    from backend.routes import auth, oauth, password, profile, settings

try:
    models.Base.metadata.create_all(bind=engine)
    logger.info("Database tables ensured")
except Exception as exc:
    logger.exception("Database initialization error: %s", exc)


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
    suggestions: List[str]
    created_at: datetime
    file_path: Optional[str] = None


class BulletImproveRequest(BaseModel):
    bullet: str
    context: Optional[str] = None


class ChatRequest(BaseModel):
    message: str
    history: Optional[List[str]] = None
    role: Optional[str] = None
    resume_id: Optional[int] = None


class CoverLetterRequest(BaseModel):
    role: Optional[str] = None
    job_description: Optional[str] = None
    resume_id: Optional[int] = None
    matched_skills: Optional[List[str]] = None
    highlights: Optional[List[str]] = None
    tone: Optional[str] = "formal"
    paragraphs: Optional[int] = 5


class RecalculateRequest(BaseModel):
    analysis_id: int
    role: Optional[str] = None
    job_description: Optional[str] = None


class InterviewQuestionRequest(BaseModel):
    analysis_id: Optional[int] = None
    role: Optional[str] = None
    resume_text: Optional[str] = None


from starlette.middleware.sessions import SessionMiddleware

app = FastAPI(title="HireSense Backend")

# OAuth Requires Session Middleware
app.add_middleware(
    SessionMiddleware, 
    secret_key=os.environ.get("SESSION_SECRET", "super-secret-default")
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def _is_truthy(value: str | None) -> bool:
    return (value or "").strip().lower() in {"1", "true", "yes", "on"}

DISABLE_OAUTH = _is_truthy(os.getenv("DISABLE_OAUTH", "true"))
if DISABLE_OAUTH:
    logger.warning("OAuth routes are temporarily disabled (DISABLE_OAUTH=true)")

def _safe_include_router(router, prefix: str, tags: list[str], name: str):
    try:
        app.include_router(router, prefix=prefix, tags=tags)
        logger.info("Router loaded: %s", name)
    except Exception as exc:
        logger.exception("Failed to load router '%s': %s", name, exc)

_safe_include_router(auth.router, prefix="/api/auth", tags=["auth"], name="auth")
if not DISABLE_OAUTH:
    _safe_include_router(oauth.router, prefix="/auth", tags=["oauth"], name="oauth")
_safe_include_router(password.router, prefix="/api/auth", tags=["password"], name="password")
_safe_include_router(profile.router, prefix="/api", tags=["profile"], name="profile")
_safe_include_router(settings.router, prefix="/api/settings", tags=["settings"], name="settings")

@app.get("/health")
def health_check():
    return {"status": "OK"}


@app.get("/")
def root():
    return {
        "message": "HireSense backend is running",
        "health": "/health",
        "docs": "/docs",
    }

@app.on_event("startup")
def startup_diagnostics():
    logger.info("Backend startup checks beginning")
    try:
        with engine.connect() as conn:
            conn.exec_driver_sql("SELECT 1")
        logger.info("Database connection test passed")
    except Exception as exc:
        logger.exception("Database connection test failed: %s", exc)
    try:
        logger.info(
            "Startup summary | DISABLE_OAUTH=%s | FRONTEND_URL=%s | DATABASE_URL_SET=%s",
            DISABLE_OAUTH,
            os.getenv("FRONTEND_URL", ""),
            bool(os.getenv("DATABASE_URL")),
        )
    except Exception as exc:
        logger.exception("Unexpected startup logging failure: %s", exc)
    try:
        discovered_routes: list[str] = []
        for route in app.routes:
            path = getattr(route, "path", "")
            methods = sorted(list(getattr(route, "methods", []) or []))
            if path:
                discovered_routes.append(f"{','.join(methods) or 'N/A'} {path}")
        logger.info("Registered routes (%d):", len(discovered_routes))
        for route_line in sorted(discovered_routes):
            logger.info("  %s", route_line)
    except Exception as exc:
        logger.exception("Failed to log registered routes: %s", exc)

os.makedirs("uploads/avatars", exist_ok=True)
app.mount("/avatars", StaticFiles(directory="uploads/avatars"), name="avatars")

from fastapi import Depends
from sqlalchemy.orm import Session
try:
    from database import get_db, SessionLocal
    from models import ResumeAnalysis, User
except ImportError:
    from backend.database import get_db, SessionLocal
    from backend.models import ResumeAnalysis, User
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
    selected_role = role or job_role
    effective_role = selected_role or "Not specified"
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
        if not selected_role:
            detected_role = detect_best_role(resume_text)
            if detected_role:
                effective_role = detected_role

        jd = job_description or _default_job_description(effective_role)
        parsed_sections = extract_resume_sections(resume_text)
        jd_match = calculate_job_description_match(
            resume_text,
            jd,
            selected_role=effective_role if effective_role != "Not specified" else None,
        )
        
        ats_score, matched_skills, missing_skills, score_breakdown = calculate_ats_score(
            resume_text,
            jd,
            selected_role=effective_role if effective_role != "Not specified" else None,
        )
        suggestions = generate_suggestions(
            missing_skills, role=effective_role, score_breakdown=score_breakdown
        )
        ai_suggestions = generate_smart_suggestions(
            missing_skills, role=effective_role, resume_text=resume_text
        )
        suggestions_text = "\n".join(f"- {item}" for item in suggestions)

        db_analysis = ResumeAnalysis(
            resume_name=uploaded_file.filename or "uploaded_resume",
            job_role=effective_role,
            ats_score=ats_score,
            matched_skills=matched_skills,
            missing_skills=missing_skills,
            suggestions=suggestions_text,
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
            "suggestions": suggestions,
            "ai_suggestions": ai_suggestions,
            "score_breakdown": score_breakdown,
            "jd_match": jd_match,
            "parsed_sections": parsed_sections,
            "suggestions_text": db_analysis.suggestions,
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
    
    for resume in resumes:
        file_ext = os.path.splitext(resume.filename)[1]
        unique_filename = f"{uuid.uuid4().hex}{file_ext}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(resume.file, buffer)
            
        try:
            resume_text = extract_text_from_pdf(file_path)
            effective_role = job_role or detect_best_role(resume_text) or "Not specified"
            effective_jd = job_description or _default_job_description(effective_role)
            ats_score, matched_skills, missing_skills, score_breakdown = calculate_ats_score(
                resume_text,
                effective_jd,
                selected_role=effective_role if effective_role != "Not specified" else None,
            )
            suggestions = generate_suggestions(
                missing_skills, role=effective_role, score_breakdown=score_breakdown
            )
            suggestions_text = "\n".join(f"- {item}" for item in suggestions)
            
            db_analysis = ResumeAnalysis(
                resume_name=resume.filename or "uploaded_resume",
                job_role=effective_role,
                ats_score=ats_score,
                matched_skills=matched_skills,
                missing_skills=missing_skills,
                suggestions=suggestions_text,
                file_path=file_path,
                created_at=datetime.utcnow()
            )
            db.add(db_analysis)
            db.commit()
            db.refresh(db_analysis)
            
            results.append(
                {
                    "filename": resume.filename,
                    "status": "success",
                    "id": db_analysis.id,
                    "score_breakdown": score_breakdown,
                }
            )
        except Exception as e:
            if os.path.exists(file_path): os.remove(file_path)
            results.append({"filename": resume.filename, "status": "error", "message": str(e)})
            
    return {"processed": len(results), "results": results}


@app.post("/api/improve-bullet")
def improve_bullet(payload: BulletImproveRequest):
    improved = improve_bullet_line(payload.bullet, payload.context or "")
    return {
        "original": payload.bullet,
        "improved": improved,
        "tips": [
            "Add measurable results",
            "Use action verbs",
            "Mention tools and scope",
        ],
    }


@app.post("/chat")
def chat_assistant(payload: ChatRequest):
    message = (payload.message or "").strip()
    lower = message.lower()
    history = [h.strip().lower() for h in (payload.history or []) if (h or "").strip()]
    role_context = payload.role or ""
    analysis = None
    if payload.resume_id:
        db = SessionLocal()
        try:
            analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.resume_id).first()
            if analysis and not role_context:
                role_context = analysis.job_role or ""
        except Exception:
            analysis = None
        finally:
            db.close()

    if not lower:
        return {"reply": "Do you want help with keywords, ATS score, improvement steps, bullet rewrites, or cover letter drafting?"}

    roles = {
        "backend": "Backend Developer",
        "frontend": "Frontend Developer",
        "full stack": "Full Stack Developer",
        "mobile": "Mobile App Developer",
        "data analyst": "Data Analyst",
        "ml": "Machine Learning Engineer",
        "machine learning": "Machine Learning Engineer",
        "devops": "DevOps Engineer",
        "ui/ux": "UI/UX Designer",
        "ui ux": "UI/UX Designer",
        "cloud": "Cloud Engineer",
    }

    role_keywords = {
        "Backend Developer": {
            "Languages": ["Python", "Java", "Node.js", "Go"],
            "Frameworks": ["FastAPI", "Django", "Spring Boot", "Express"],
            "Databases": ["PostgreSQL", "MySQL", "MongoDB", "Redis"],
            "Tools": ["Docker", "Git", "AWS", "CI/CD"],
            "Concepts": ["REST API", "Microservices", "System Design", "Authentication"],
        },
        "Frontend Developer": {
            "Languages": ["JavaScript", "TypeScript", "HTML", "CSS"],
            "Frameworks": ["React", "Next.js", "Vue", "Redux"],
            "Tools": ["Vite", "Tailwind CSS", "Jest", "Storybook"],
            "Concepts": ["Responsive Design", "Accessibility", "Performance", "State Management"],
        },
        "Data Analyst": {
            "Languages": ["SQL", "Python", "R"],
            "Tools": ["Power BI", "Tableau", "Excel", "Looker"],
            "Concepts": ["Data Cleaning", "A/B Testing", "Dashboarding", "Business Storytelling"],
        },
    }

    def detect_role(text: str) -> Optional[str]:
        for key, value in roles.items():
            if key in text:
                return value
        return None

    def pick_variant(options: List[str], seed: str) -> str:
        if not options:
            return ""
        index = abs(hash(seed)) % len(options)
        return options[index]

    def avoid_repeat(reply: str, fallback_options: List[str]) -> str:
        if reply.lower() not in history:
            return reply
        return pick_variant(fallback_options, f"{message}|{len(history)}")

    greeting_tokens = {"hi", "hello", "hey", "hii", "yo"}
    if lower in greeting_tokens:
        reply = "Hi! I can help with your resume analysis. What do you want to work on right now?"
        return {"reply": avoid_repeat(reply, ["Hello! Tell me what you need: ATS score clarity, keywords, bullet rewrite, or improvements."])}

    if "what does this app do" in lower or "what this app do" in lower or "what can this app do" in lower:
        reply = (
            "This app analyzes your resume, calculates an ATS score, detects matched and missing skills, "
            "shows role-based improvement suggestions, and can generate a tailored cover letter."
        )
        return {"reply": avoid_repeat(reply, ["It parses your resume, scores ATS readiness, highlights gaps, and helps you improve bullets and cover letters."])}

    if "keyword" in lower or "keywords" in lower:
        role = detect_role(lower)
        if not role:
            return {"reply": "Which role should I optimize keywords for? Backend, Frontend, Full Stack, Mobile, Data Analyst, ML, DevOps, UI/UX, or Cloud?"}
        dataset = role_keywords.get(role)
        if not dataset:
            return {"reply": f"{role} keywords:\n- Core Skills: API design, Git, testing, cloud deployment\n- Impact Terms: optimized, delivered, reduced latency, improved reliability"}
        blocks = [f"{role} Keywords:"]
        for section, items in dataset.items():
            blocks.append(f"- {section}: {', '.join(items)}")
        reply = "\n".join(blocks)
        return {"reply": avoid_repeat(reply, ["Use 8-12 role-matching keywords naturally in summary, skills, and 2 project bullets."])}

    if "ats" in lower or ("score" in lower and "resume" in lower):
        reply = (
            "A safe ATS target is 70–80%.\n"
            "- Below 60%: high rejection risk\n"
            "- 70–80%: competitive shortlist range\n"
            "- 85%+: strong profile for screening"
        )
        return {"reply": avoid_repeat(reply, ["Aim for 75%+ by improving missing critical skills, quantified bullets, and JD keyword alignment."])}

    if "improve" in lower or "better" in lower:
        role = detect_role(lower)
        if not role and role_context:
            role = role_context
        role_hint = f" for {role}" if role else ""
        reply = (
            f"Action plan{role_hint}:\n"
            "1) Add 2–3 measurable achievements (%, $, time saved)\n"
            "2) Add one role-specific project with stack + impact\n"
            "3) Rewrite bullets using action verb + scope + result\n"
            "4) Add missing critical tools directly from the JD"
        )
        return {"reply": avoid_repeat(reply, ["Share one bullet, and I will rewrite it into a high-impact ATS-friendly version."])}

    if "skill" in lower or "skills" in lower:
        if analysis and analysis.missing_skills:
            targeted = ", ".join((analysis.missing_skills or [])[:6])
            return {"reply": f"Based on your latest resume, prioritize these missing skills: {targeted}. Add each one to a project bullet with measurable impact."}
        reply = (
            "Prioritize skills in this order:\n"
            "- Must-have: role-critical stack (top 6 from JD)\n"
            "- Job-relevant tools: deployment/testing/analytics tools\n"
            "- Proof layer: add each skill inside a project bullet with outcome"
        )
        return {"reply": avoid_repeat(reply, ["Send your target role and I will give a precise missing-skills checklist."])}

    if "bullet" in lower:
        reply = "Use this formula: Action Verb + What You Built + Tech Stack + Measurable Result. Example: 'Developed a FastAPI service with PostgreSQL that reduced response time by 35%.'"
        return {"reply": avoid_repeat(reply, ["Paste a weak bullet and I’ll provide 3 stronger rewrites with different tones."])}

    if "cover letter" in lower:
        reply = "The cover letter feature uses your resume + target role + optional job description to generate a professional, ATS-friendly draft you can copy or download."
        return {"reply": avoid_repeat(reply, ["If you share role + JD, I can draft a ready-to-send cover letter now."])}

    if "summary" in lower:
        reply = "Write a 2–3 line summary: years of experience, core stack, and one quantified outcome. Example: 'Backend engineer with 4 years of Python/FastAPI experience, improved API latency by 38% and scaled services to 1M+ requests/day.'"
        return {"reply": avoid_repeat(reply, ["Want a summary rewrite? Paste your current summary."])}

    return {"reply": "Do you want help with keywords, ATS score, improvement steps, bullet rewrites, or cover letter drafting?"}


@app.post("/api/generate-cover-letter")
def generate_cover_letter(payload: CoverLetterRequest, db: Session = Depends(get_db)):
    role = (payload.role or "Software Engineer").strip()
    job_description = (payload.job_description or "").strip()
    matched_skills = payload.matched_skills or []
    highlights = payload.highlights or []
    tone = (payload.tone or "formal").strip().lower()
    paragraphs = max(3, min(5, int(payload.paragraphs or 5)))

    if payload.resume_id:
        analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.resume_id).first()
        if analysis:
            role = analysis.job_role or role
            matched_skills = matched_skills or (analysis.matched_skills or [])
            if not highlights and analysis.suggestions:
                highlights = [
                    line.strip().lstrip("-").strip()
                    for line in analysis.suggestions.splitlines()
                    if line.strip()
                ][:3]

    top_skills = ", ".join(matched_skills[:5]) if matched_skills else "problem solving, collaboration, and delivery"
    jd_focus = (
        "Your job description emphasizes impact, ownership, and role-aligned execution."
        if not job_description
        else f"The posted requirements highlight: {job_description[:240]}."
    )
    achievement_line = highlights[0] if highlights else "I consistently deliver measurable outcomes and maintain high engineering quality."

    intro_line = (
        f"I am writing to express my interest in the {role} position."
        if tone == "formal"
        else f"I am excited to apply for the {role} role."
    )

    parts = [
        "Dear Hiring Manager,",
        (
            f"{intro_line} I am excited about the opportunity to contribute to your team "
            "by combining technical execution with business-focused outcomes."
        ),
        (
            f"My recent experience aligns closely with this role, especially across {top_skills}. "
            "I have delivered production-grade work that improves reliability, performance, and user value through pragmatic architecture and iterative delivery."
        ),
        (
            f"{achievement_line} In prior projects, I focused on clear ownership, cross-functional collaboration, "
            "and measurable improvements that supported both product and engineering goals."
        ),
        (
            f"{jd_focus} I am confident that my background and execution mindset would make me a strong addition to your organization."
        ),
        "Thank you for your time and consideration. I would welcome the opportunity to discuss how I can contribute to your team.",
        "Sincerely,\nCandidate",
    ]

    body = parts[: paragraphs + 2]  # greeting + selected paragraphs + close
    letter = "\n\n".join(body)

    return {"cover_letter": letter}


@app.post("/api/recalculate-score")
def recalculate_score(payload: RecalculateRequest, db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if not analysis.file_path or not os.path.exists(analysis.file_path):
        raise HTTPException(status_code=404, detail="Original resume file not found")

    resume_text = extract_text_from_file(analysis.file_path, analysis.resume_name or "")
    target_role = payload.role or analysis.job_role or "Software Engineer"
    effective_jd = payload.job_description or _default_job_description(target_role)

    score, matched, missing, breakdown = calculate_ats_score(
        resume_text, effective_jd, selected_role=target_role
    )
    jd_match = calculate_job_description_match(
        resume_text, effective_jd, selected_role=target_role
    )
    suggestions = generate_suggestions(missing, role=target_role, score_breakdown=breakdown)
    ai_suggestions = generate_smart_suggestions(
        missing, role=target_role, resume_text=resume_text
    )

    analysis.job_role = target_role
    analysis.ats_score = score
    analysis.matched_skills = matched
    analysis.missing_skills = missing
    analysis.suggestions = "\n".join(f"- {item}" for item in suggestions)
    db.commit()
    db.refresh(analysis)

    return {
        "id": analysis.id,
        "job_role": analysis.job_role,
        "ats_score": analysis.ats_score,
        "matched_skills": analysis.matched_skills,
        "missing_skills": analysis.missing_skills,
        "score_breakdown": breakdown,
        "jd_match": jd_match,
        "suggestions": suggestions,
        "ai_suggestions": ai_suggestions,
    }


@app.post("/api/interview-questions")
def interview_questions(payload: InterviewQuestionRequest, db: Session = Depends(get_db)):
    resume_text = (payload.resume_text or "").strip()
    role = (payload.role or "").strip() or "Software Engineer"

    if payload.analysis_id:
        analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.analysis_id).first()
        if analysis:
            if not payload.role:
                role = analysis.job_role or role
            if analysis.file_path and os.path.exists(analysis.file_path):
                resume_text = extract_text_from_file(analysis.file_path, analysis.resume_name or "")

    if not resume_text:
        return {
            "hr": ["Tell me about yourself and your most relevant experience."],
            "technical": [f"What core skills are required for a {role} role?"],
            "project_based": ["Describe a project where you improved a measurable KPI."],
        }

    return generate_interview_questions(resume_text, role)


@app.post("/api/ats-format-check")
def ats_format_check(payload: RecalculateRequest, db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if not analysis.file_path or not os.path.exists(analysis.file_path):
        raise HTTPException(status_code=404, detail="Original resume file not found")

    resume_text = extract_text_from_file(analysis.file_path, analysis.resume_name or "")
    parsed = extract_resume_sections(resume_text)
    checks = parsed.get("ats_format_check", {})
    issues = []
    if not checks.get("has_summary"):
        issues.append("Add a short summary/profile section at the top.")
    if not checks.get("has_experience"):
        issues.append("Add a clear Experience section with timeline and outcomes.")
    if not checks.get("has_projects"):
        issues.append("Add a Projects section with measurable results.")
    if not checks.get("has_skills"):
        issues.append("Add a dedicated Skills section with role-relevant tools.")
    if not checks.get("has_education"):
        issues.append("Add an Education section for ATS completeness.")

    return {"checks": checks, "issues": issues}


@app.post("/api/improve-resume")
def improve_resume(payload: RecalculateRequest, db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == payload.analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")
    if not analysis.file_path or not os.path.exists(analysis.file_path):
        raise HTTPException(status_code=404, detail="Original resume file not found")

    resume_text = extract_text_from_file(analysis.file_path, analysis.resume_name or "")
    bullets = [
        line.strip().lstrip("-•* ").strip()
        for line in resume_text.splitlines()
        if line.strip()
        and len(line.split()) >= 4
        and "@" not in line
        and "linkedin" not in line.lower()
        and "github" not in line.lower()
        and not line.lower().strip().startswith(("location:", "languages:", "skills:", "education:"))
        and not re.search(r"\+?\d[\d\s\-\(\)]{7,}", line)
    ][:5]
    improved = [improve_bullet_line(bullet, payload.role or analysis.job_role) for bullet in bullets]
    return {"original_bullets": bullets, "improved_bullets": improved}


@app.get("/api/global-search")
def global_search(q: str = "", db: Session = Depends(get_db)):
    query = (q or "").strip().lower()
    if not query:
        return {"resumes": [], "skills": [], "roles": []}

    analyses = db.query(ResumeAnalysis).order_by(ResumeAnalysis.created_at.desc()).all()
    resumes = []
    roles = set()
    skills = set()

    for item in analyses:
        if query in (item.resume_name or "").lower() or query in (item.job_role or "").lower():
            resumes.append(
                {"id": item.id, "resume_name": item.resume_name, "job_role": item.job_role, "ats_score": item.ats_score}
            )
        if query in (item.job_role or "").lower():
            roles.add(item.job_role)
        for skill in item.matched_skills or []:
            if query in skill.lower():
                skills.add(skill)

    return {"resumes": resumes[:20], "skills": sorted(skills)[:20], "roles": sorted([r for r in roles if r])[:20]}


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
@app.get("/analysis")
@app.get("/resumes")
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


@app.get("/analyses/{analysis_id}")
def get_analysis_by_id(analysis_id: int, db: Session = Depends(get_db)):
    analysis = db.query(ResumeAnalysis).filter(ResumeAnalysis.id == analysis_id).first()
    if not analysis:
        raise HTTPException(status_code=404, detail="Analysis not found")

    suggestions = []
    raw_suggestions = analysis.suggestions or ""
    for line in raw_suggestions.split("\n"):
        cleaned = line.strip().lstrip("-").strip()
        if cleaned:
            suggestions.append(cleaned)

    resume_text = ""
    if analysis.file_path and os.path.exists(analysis.file_path):
        resume_text = extract_text_from_file(analysis.file_path, analysis.resume_name or "")

    if resume_text:
        score, matched, missing, score_breakdown = calculate_ats_score(
            resume_text,
            _default_job_description(analysis.job_role or "Software Engineer"),
            selected_role=analysis.job_role or "Software Engineer",
        )
        jd_match = calculate_job_description_match(
            resume_text,
            _default_job_description(analysis.job_role or "Software Engineer"),
            selected_role=analysis.job_role or "Software Engineer",
        )
        parsed_sections = extract_resume_sections(resume_text)
        ai_suggestions = generate_smart_suggestions(
            missing,
            role=analysis.job_role or "Software Engineer",
            resume_text=resume_text,
        )
        matched_skills = matched
        missing_skills = missing
        ats_score = score
    else:
        score_breakdown = {
            "skills": max(40.0, min(95.0, float(analysis.ats_score or 0))),
            "experience": max(35.0, min(92.0, float(analysis.ats_score or 0) - 4)),
            "projects": max(35.0, min(92.0, float(analysis.ats_score or 0) - 2)),
            "formatting": max(35.0, min(92.0, float(analysis.ats_score or 0) - 5)),
        }
        jd_match = {"match_percent": int(analysis.ats_score or 0), "matched_keywords": [], "missing_keywords": [], "suggestions": []}
        parsed_sections = {"name": "Candidate", "skills_extracted": analysis.matched_skills or [], "experience_extracted": "", "projects_extracted": []}
        ai_suggestions = generate_smart_suggestions(
            analysis.missing_skills or [],
            role=analysis.job_role or "Software Engineer",
            resume_text="\n".join(suggestions),
        )
        matched_skills = analysis.matched_skills or []
        missing_skills = analysis.missing_skills or []
        ats_score = analysis.ats_score

    return {
        "id": analysis.id,
        "resume_name": analysis.resume_name,
        "job_role": analysis.job_role,
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions,
        "ai_suggestions": ai_suggestions,
        "score_breakdown": score_breakdown,
        "jd_match": jd_match,
        "parsed_sections": parsed_sections,
        "created_at": analysis.created_at.isoformat() if analysis.created_at else None,
    }


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