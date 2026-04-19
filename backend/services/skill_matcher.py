import re
from typing import Dict, List, Tuple

ROLE_SKILLS: Dict[str, Dict[str, List[str]]] = {
    "Backend Developer": {
        "critical": ["python", "node.js", "sql", "rest api", "database design", "fastapi", "git"],
        "core": ["postgresql", "django", "docker", "redis", "authentication", "microservices", "unit testing", "linux"],
        "bonus": ["kubernetes", "grpc", "message queues", "aws", "ci/cd", "graphql"],
    },
    "Frontend Developer": {
        "critical": ["javascript", "react", "html", "css", "typescript", "state management", "responsive design"],
        "core": ["next.js", "redux", "tailwind css", "api integration", "accessibility", "testing library", "vite", "git"],
        "bonus": ["framer motion", "performance optimization", "design systems", "storybook", "seo", "pwa"],
    },
    "Full Stack Developer": {
        "critical": ["javascript", "react", "node.js", "sql", "rest api", "git", "system design"],
        "core": ["typescript", "postgresql", "docker", "authentication", "testing", "next.js", "database design", "api security"],
        "bonus": ["aws", "kubernetes", "graphql", "redis", "monitoring", "ci/cd"],
    },
    "Mobile App Developer": {
        "critical": ["react native", "flutter", "kotlin", "swift", "mobile ui", "api integration", "state management"],
        "core": ["android", "ios", "push notifications", "local storage", "firebase", "performance optimization", "testing", "git"],
        "bonus": ["offline sync", "app store deployment", "analytics sdk", "ci/cd", "security", "deep linking"],
    },
    "Data Analyst": {
        "critical": ["sql", "excel", "python", "data visualization", "power bi", "reporting", "statistics"],
        "core": ["tableau", "pandas", "data cleaning", "etl", "dashboards", "business analysis", "a/b testing", "storytelling"],
        "bonus": ["bigquery", "looker", "machine learning", "forecasting", "stakeholder management", "dbt"],
    },
    "Machine Learning Engineer": {
        "critical": ["python", "machine learning", "model training", "feature engineering", "tensorflow", "pytorch", "statistics"],
        "core": ["scikit-learn", "data pipelines", "model evaluation", "mlops", "docker", "api deployment", "sql", "git"],
        "bonus": ["kubeflow", "aws sagemaker", "vector databases", "llm", "prompt engineering", "monitoring"],
    },
    "DevOps Engineer": {
        "critical": ["docker", "kubernetes", "ci/cd", "linux", "aws", "infrastructure as code", "monitoring"],
        "core": ["terraform", "ansible", "jenkins", "github actions", "networking", "scripting", "security", "incident response"],
        "bonus": ["azure", "gcp", "helm", "service mesh", "cost optimization", "observability"],
    },
    "UI/UX Designer": {
        "critical": ["figma", "wireframing", "prototyping", "user research", "usability testing", "interaction design", "design systems"],
        "core": ["information architecture", "accessibility", "visual design", "journey mapping", "persona creation", "design tokens", "a/b testing", "collaboration"],
        "bonus": ["adobe xd", "framer", "micro-interactions", "html", "css", "analytics"],
    },
    "Cloud Engineer": {
        "critical": ["aws", "cloud architecture", "networking", "security", "linux", "infrastructure as code", "monitoring"],
        "core": ["azure", "gcp", "terraform", "kubernetes", "docker", "cost management", "automation", "identity access management"],
        "bonus": ["serverless", "disaster recovery", "sre", "observability", "ci/cd", "python"],
    },
    "Software Engineer": {
        "critical": ["data structures", "algorithms", "system design", "git", "debugging", "testing", "api design"],
        "core": ["python", "javascript", "java", "sql", "docker", "problem solving", "code review", "agile"],
        "bonus": ["cloud", "performance optimization", "microservices", "security", "devops", "mentorship"],
    },
}

SKILL_ALIASES: Dict[str, List[str]] = {
    "react": ["react.js", "reactjs"],
    "node.js": ["node", "nodejs"],
    "rest api": ["restful api", "rest apis", "api development"],
    "typescript": ["ts"],
    "tailwind css": ["tailwind"],
    "ci/cd": ["cicd", "continuous integration", "continuous delivery"],
    "machine learning": ["ml"],
    "pytorch": ["torch"],
    "power bi": ["powerbi"],
    "data visualization": ["data viz"],
    "infrastructure as code": ["iac"],
}


def _normalize_text(text: str) -> str:
    normalized = (text or "").lower()
    normalized = normalized.replace("&", " and ")
    normalized = re.sub(r"[^a-z0-9\+\#\./\-\s]", " ", normalized)
    normalized = re.sub(r"\s+", " ", normalized).strip()
    return normalized


def _skill_variants(skill: str) -> List[str]:
    return [skill, *SKILL_ALIASES.get(skill, [])]


def _contains_phrase(text: str, phrase: str) -> bool:
    escaped = re.escape(phrase)
    pattern = rf"(^|\b){escaped}(\b|$)"
    return bool(re.search(pattern, text))


def _contextual_strength(text: str, variant: str) -> float:
    strength = 0.0
    if _contains_phrase(text, variant):
        strength = max(strength, 1.0)

    contextual_patterns = [
        rf"(built|developed|implemented|designed|created|experience|worked)\s+(with|in|on|using)\s+{re.escape(variant)}",
        rf"{re.escape(variant)}\s+(application|service|system|pipeline|dashboard|api)",
        rf"(proficient|experienced)\s+(with|in)\s+{re.escape(variant)}",
    ]

    if any(re.search(pattern, text) for pattern in contextual_patterns):
        strength = max(strength, 1.0)

    # Partial phrase support for multi-token skills.
    tokens = [tok for tok in re.split(r"[ /\-]", variant) if tok]
    if len(tokens) > 1:
        hit_count = sum(1 for token in tokens if _contains_phrase(text, token))
        if hit_count:
            partial = 0.4 + (hit_count / len(tokens)) * 0.4
            strength = max(strength, min(partial, 0.85))
    return strength


def extract_skills_with_strength(resume_text: str) -> Dict[str, float]:
    text = _normalize_text(resume_text)
    catalog = set()
    for role_data in ROLE_SKILLS.values():
        catalog.update(role_data["critical"])
        catalog.update(role_data["core"])
        catalog.update(role_data["bonus"])

    skills: Dict[str, float] = {}
    for canonical in catalog:
        best = 0.0
        for variant in _skill_variants(canonical):
            best = max(best, _contextual_strength(text, _normalize_text(variant)))
        if best > 0:
            skills[canonical] = round(best, 2)
    return skills


def _estimate_experience_years(resume_text: str) -> float:
    text = _normalize_text(resume_text)
    years = []
    for match in re.findall(r"(\d+)\+?\s+years?", text):
        try:
            years.append(float(match))
        except ValueError:
            continue
    return max(years) if years else 0.0


def _score_experience(resume_text: str, selected_role: str) -> float:
    years = _estimate_experience_years(resume_text)
    target = 3.0 if selected_role in {"Backend Developer", "Frontend Developer"} else 2.5
    years_score = min(100.0, (years / target) * 100.0) if years > 0 else 45.0

    text = _normalize_text(resume_text)
    role_tokens = [tok for tok in selected_role.lower().split() if tok]
    role_hits = sum(1 for token in role_tokens if token in text)
    role_score = min(100.0, 55.0 + role_hits * 12.0)

    return round((years_score * 0.6) + (role_score * 0.4), 2)


def _score_projects(resume_text: str, matched_skills: List[str]) -> float:
    text = _normalize_text(resume_text)
    project_tokens = ["project", "developed", "implemented", "designed", "built"]
    project_hits = sum(text.count(token) for token in project_tokens)
    skill_factor = min(100.0, 40.0 + len(matched_skills) * 8.0)
    project_factor = min(100.0, 35.0 + project_hits * 6.0)
    return round((skill_factor * 0.55) + (project_factor * 0.45), 2)


def _score_keywords_context(resume_text: str, job_description: str, selected_role: str) -> float:
    resume_tokens = set(_normalize_text(resume_text).split())
    jd_tokens = set(_normalize_text(job_description or selected_role).split())
    if not jd_tokens:
        return 55.0
    overlap = len(resume_tokens & jd_tokens)
    jaccard = overlap / max(1, len(jd_tokens))
    return round(45.0 + min(55.0, jaccard * 100.0), 2)


def detect_best_role(resume_text: str) -> str | None:
    strengths = extract_skills_with_strength(resume_text)
    best_role = None
    best_score = 0.0
    for role, profile in ROLE_SKILLS.items():
        total = 0.0
        for skill in profile["critical"]:
            total += strengths.get(skill, 0.0) * 2.0
        for skill in profile["core"]:
            total += strengths.get(skill, 0.0) * 1.2
        if total > best_score:
            best_score = total
            best_role = role
    return best_role if best_score > 1.0 else None


def _resolve_role(selected_role: str | None, resume_text: str) -> str:
    if selected_role and selected_role in ROLE_SKILLS:
        return selected_role
    return detect_best_role(resume_text) or "Software Engineer"


def calculate_ats_score(
    resume_text: str,
    job_description: str,
    selected_role: str | None = None,
) -> Tuple[int, List[str], List[str], Dict[str, float]]:
    role = _resolve_role(selected_role, resume_text)
    profile = ROLE_SKILLS[role]
    strengths = extract_skills_with_strength(resume_text)

    weighted_total = 0.0
    weighted_match = 0.0
    matched: List[str] = []

    for skill in profile["critical"]:
        weighted_total += 2.0
        skill_strength = strengths.get(skill, 0.0)
        weighted_match += min(1.0, skill_strength) * 2.0
        if skill_strength >= 0.45:
            matched.append(skill)

    for skill in profile["core"]:
        weighted_total += 1.0
        skill_strength = strengths.get(skill, 0.0)
        weighted_match += min(1.0, skill_strength) * 1.0
        if skill_strength >= 0.55 and skill not in matched:
            matched.append(skill)

    skills_score = (weighted_match / max(weighted_total, 1.0)) * 100.0
    experience_score = _score_experience(resume_text, role)
    projects_score = _score_projects(resume_text, matched)
    keyword_score = _score_keywords_context(resume_text, job_description, role)

    final_score = (
        (skills_score * 0.50)
        + (experience_score * 0.20)
        + (projects_score * 0.20)
        + (keyword_score * 0.10)
    )

    final_score = max(40.0, min(90.0, final_score))

    missing_critical = [
        skill for skill in profile["critical"] if strengths.get(skill, 0.0) < 0.4
    ]

    breakdown = {
        "skills": round(skills_score, 2),
        "experience": round(experience_score, 2),
        "projects": round(projects_score, 2),
        "keywords": round(keyword_score, 2),
    }
    return int(round(final_score)), matched, missing_critical, breakdown
