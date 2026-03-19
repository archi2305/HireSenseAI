import json
import os

SKILLS_FILE = os.path.join(os.path.dirname(__file__), "skills.json")

def load_skills():
    with open(SKILLS_FILE, "r") as f:
        return json.load(f)

def extract_skills(text):
    skills = load_skills()
    text = text.lower()
    found = []

    for skill in skills:
        if skill in text:
            found.append(skill)

    return found

def calculate_ats_score(resume_text, job_description):

    # Extended standard tech stack dictionary
    SKILLS = [
        "python", "sql", "docker", "fastapi", "aws", "git", "rest", "api",
        "javascript", "react", "node", "typescript", "java", "c++", "linux",
        "kubernetes", "azure", "gcp", "machine learning", "mongodb",
        "postgresql", "html", "css", "agile"
    ]

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    matched_skills = []
    missing_skills = []

    # If the job description is short/generic, establish a baseline score by extracting all known skills
    is_generic_jd = "comprehensive" in job_description or "general tech" in job_description or len(job_description.split()) < 10

    required_skills = [s for s in SKILLS if s in job_description]
    
    if is_generic_jd or not required_skills:
        for skill in SKILLS:
            if skill in resume_text:
                matched_skills.append(skill)
        
        # Calculate a baseline generic score: 5 solid technical skills guarantees a 100% baseline for a blank JD
        ats_score = min(100, len(matched_skills) * 20)
        return ats_score, matched_skills, []
    
    # Strict matching mode for when a true Job Description is provided
    for skill in required_skills:
        if skill in resume_text:
            matched_skills.append(skill)
        else:
            missing_skills.append(skill)

    total_required = len(matched_skills) + len(missing_skills)

    if total_required == 0:
        ats_score = 0
    else:
        ats_score = int((len(matched_skills) / total_required) * 100)

    return ats_score, matched_skills, missing_skills