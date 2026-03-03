from fastapi import FastAPI, UploadFile, File, Form
from services.resume_parser import extract_text_from_pdf
from services.skill_matcher import extract_skills, calculate_ats_score
from services.suggestion_engine import generate_suggestions

app = FastAPI(title="HireSense AI API")


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

    return {
        "ats_score": ats_score,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills,
        "suggestions": suggestions
    }