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

    # Define technical skills we care about
    SKILLS = [
        "python",
        "sql",
        "docker",
        "fastapi",
        "aws",
        "git",
        "rest"
    ]

    resume_text = resume_text.lower()
    job_description = job_description.lower()

    matched_skills = []
    missing_skills = []

    # Check only real technical skills
    for skill in SKILLS:
        if skill in job_description:
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