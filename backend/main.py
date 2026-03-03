from database import SessionLocal
from models import Analysis
from database import engine
from models import Base
from fastapi import FastAPI, UploadFile, File, Form
from services.resume_parser import extract_text_from_pdf
from services.skill_matcher import extract_skills, calculate_ats_score
from services.suggestion_engine import generate_suggestions

app = FastAPI(title="HireSense AI API")
Base.metadata.create_all(bind=engine)


@app.get("/")
def root():
    return {"message": "HireSense AI Backend Running"}


@app.post("/analyze")
async def analyze_resume(
    resume: UploadFile = File(...),
    job_description: str = Form(...)
):

    resume_text = extract_text_from_pdf(resume.file)

    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    ats_score, matched_skills = calculate_ats_score(resume_skills, jd_skills)
    missing_skills = list(set(jd_skills) - set(resume_skills))

    suggestions = generate_suggestions(
        resume_text,
        job_description,
        missing_skills
    )

   

    db = SessionLocal()

    new_record = Analysis(
        ats_score=ats_score,
        matched_skills=matched_skills,
        missing_skills=missing_skills,
        suggestions=suggestions
)

    db.add(new_record)
    db.commit()
    db.refresh(new_record)
    db.close()

    # -------- DATABASE SAVE ENDS HERE --------

    return {
        "analysis_id": new_record.id,
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }

@app.get("/analysis/{analysis_id}")
def get_analysis(analysis_id: int):

    db = SessionLocal()

    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    db.close()

    if not record:
        raise HTTPException(status_code=404, detail="Analysis not found")

    return {
        "id": record.id,
        "ats_score": record.ats_score,
        "matched_skills": record.matched_skills,
        "missing_skills": record.missing_skills,
        "suggestions": record.suggestions
    }
@app.get("/analyses")
def get_all_analyses():

    db = SessionLocal()

    records = db.query(Analysis).all()

    db.close()

    results = []

    for record in records:
        results.append({
            "id": record.id,
            "ats_score": record.ats_score,
            "matched_skills": record.matched_skills,
            "missing_skills": record.missing_skills,
            "suggestions": record.suggestions
        })

    return results


@app.delete("/analysis/{analysis_id}")
def delete_analysis(analysis_id: int):

    db = SessionLocal()

    record = db.query(Analysis).filter(Analysis.id == analysis_id).first()

    if not record:
        db.close()
        return {"error": "Analysis not found"}

    db.delete(record)
    db.commit()
    db.close()

    return {"message": f"Analysis {analysis_id} deleted successfully"}