import json

def load_skills():
    with open("skills.json", "r") as f:
        return json.load(f)

def extract_skills(text):
    skills = load_skills()
    text = text.lower()
    found = []

    for skill in skills:
        if skill in text:
            found.append(skill)

    return found

def calculate_ats_score(resume_skills, jd_skills):
    matched = list(set(resume_skills) & set(jd_skills))

    if len(jd_skills) == 0:
        return 0, matched

    score = (len(matched) / len(jd_skills)) * 100

    return round(score, 2), matched