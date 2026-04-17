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
    "tensorflow",
    "pandas",
    "excel",
    "power bi",
    "flutter",
    "react native",
    "kotlin",
    "swift",
    "ci/cd",
    "azure",
    "gcp",
    "cybersecurity",
    "figma",
    "ui",
    "ux",
]

ROLE_SKILLS = {
    "Frontend Developer": ["javascript", "react", "html", "css"],
    "Backend Developer": ["python", "java", "node", "sql", "api"],
    "Full Stack Developer": ["javascript", "react", "node", "sql", "api"],
    "Mobile App Developer": ["flutter", "react native", "kotlin", "swift"],
    "Android Developer": ["kotlin", "java", "api"],
    "iOS Developer": ["swift", "api"],
    "Software Engineer": ["python", "javascript", "sql", "api", "git"],
    "Data Analyst": ["sql", "excel", "python", "power bi"],
    "Machine Learning Engineer": ["python", "machine learning", "tensorflow", "pandas"],
    "AI Engineer": ["python", "ai", "machine learning", "tensorflow"],
    "DevOps Engineer": ["docker", "kubernetes", "aws", "ci/cd"],
    "Cloud Engineer": ["aws", "azure", "gcp"],
    "Cybersecurity Analyst": ["python", "sql", "aws", "git", "cybersecurity"],
    "UI/UX Designer": ["figma", "html", "css", "ui", "ux"],
}


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
    return [skill.lower() for skill in SKILLS_DB if _contains_skill(normalized, skill)]


def _dedupe_preserve_order(items: list[str]) -> list[str]:
    seen = set()
    out = []
    for item in items:
        value = (item or "").strip().lower()
        if not value or value in seen:
            continue
        seen.add(value)
        out.append(value)
    return out


def _required_skills_for_role_or_jd(job_description: str, selected_role: str | None) -> list[str]:
    if selected_role in ROLE_SKILLS:
        return _dedupe_preserve_order(ROLE_SKILLS[selected_role])
    return _dedupe_preserve_order(extract_skills(job_description))


def detect_best_role(resume_text: str) -> str | None:
    resume_skill_set = set(extract_skills(resume_text))
    best_role = None
    best_count = 0

    for role, role_skills in ROLE_SKILLS.items():
        overlap_count = len(resume_skill_set & set(_dedupe_preserve_order(role_skills)))
        if overlap_count > best_count:
            best_count = overlap_count
            best_role = role

    return best_role if best_count > 0 else None


def calculate_ats_score(resume_text: str, job_description: str, selected_role: str | None = None):
    resume_skills = _dedupe_preserve_order(extract_skills(resume_text))
    required_skills = _required_skills_for_role_or_jd(job_description, selected_role)

    resume_skill_set = set(resume_skills)
    matched = [skill for skill in required_skills if skill in resume_skill_set]
    missing = [skill for skill in required_skills if skill not in resume_skill_set]

    if len(required_skills) == 0:
        score = 50
    else:
        score = int((len(matched) / len(required_skills)) * 100)

    return score, matched, missing