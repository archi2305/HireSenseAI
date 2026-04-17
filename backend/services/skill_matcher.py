import re

SKILLS_DB = [
    "python",
    "java",
    "c++",
    "javascript",
    "react",
    "node",
    "fastapi",
    "django",
    "sql",
    "postgresql",
    "mongodb",
    "docker",
    "kubernetes",
    "aws",
    "git",
    "rest api",
    "html",
    "css",
    "machine learning",
    "ai",
]


def _normalize_text(text: str) -> str:
    return (text or "").lower()


def _contains_skill(text: str, skill: str) -> bool:
    # Use substring for phrase/symbol skills; boundary checks for plain tokens.
    if " " in skill or not re.fullmatch(r"[a-z0-9]+", skill):
        return skill in text
    pattern = r"\b" + re.escape(skill) + r"\b"
    return bool(re.search(pattern, text))


def extract_skills(text: str) -> list[str]:
    normalized = _normalize_text(text)
    return [skill for skill in SKILLS_DB if _contains_skill(normalized, skill)]


def calculate_ats_score(resume_text: str, job_description: str):
    required_skills = extract_skills(job_description)
    resume_skills = extract_skills(resume_text)

    matched = sorted(set(required_skills) & set(resume_skills))
    missing = sorted(set(required_skills) - set(resume_skills))

    if len(required_skills) == 0:
        score = 50
    else:
        score = int((len(matched) / len(required_skills)) * 100)

    return score, matched, missing