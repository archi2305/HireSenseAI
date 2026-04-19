import re
from typing import Dict, List

ROLE_ACTION_TEMPLATES: Dict[str, List[str]] = {
    "Backend Developer": [
        "Add a backend project using {skill} + REST API with latency and throughput metrics.",
        "Show a production reliability achievement (uptime, error-rate reduction, or response-time gains).",
        "Mention API design decisions, authentication strategy, and database modeling choices.",
    ],
    "Frontend Developer": [
        "Add a UI project with {skill} and report performance outcomes (LCP/CLS/TTI).",
        "Highlight accessibility improvements and design-system consistency in shipped features.",
        "Quantify user impact (conversion, retention, or engagement lift) from your UI changes.",
    ],
    "Full Stack Developer": [
        "Show an end-to-end project using {skill} with frontend, API, and database integration.",
        "Quantify delivery impact: feature lead time, deployment frequency, or defect reduction.",
        "Include architecture tradeoffs and scaling decisions for real traffic conditions.",
    ],
    "Mobile App Developer": [
        "Add a mobile app case using {skill} with crash-rate or startup-time improvements.",
        "Mention offline behavior, API sync strategy, and release quality metrics.",
        "Show app store outcomes such as rating growth or retention improvements.",
    ],
    "Data Analyst": [
        "Add an analysis project with {skill} that drove a measurable business decision.",
        "Show dashboard adoption metrics and the KPI movement after your recommendations.",
        "Include data quality checks and validation process to improve trust in reporting.",
    ],
    "Machine Learning Engineer": [
        "Add an ML project with {skill} including baseline vs final model metrics.",
        "Mention feature engineering choices and model monitoring in production.",
        "Quantify model impact on business KPIs (cost reduction, conversion lift, churn drop).",
    ],
    "DevOps Engineer": [
        "Show a {skill} implementation tied to deployment speed or incident reduction.",
        "Include reliability metrics such as MTTR, change failure rate, and uptime gains.",
        "Highlight infrastructure automation and security hardening outcomes.",
    ],
    "UI/UX Designer": [
        "Add a {skill} case study with usability test results and user-behavior impact.",
        "Show process clarity: research insights, wireframes, prototypes, and iteration outcomes.",
        "Quantify design impact through conversion, task completion, or satisfaction metrics.",
    ],
}


def _dedupe_skills(skills):
    out = []
    seen = set()
    for item in skills or []:
        value = (item or "").strip().lower()
        if value and value not in seen:
            seen.add(value)
            out.append(value)
    return out


def _clean_bullets(text: str) -> List[str]:
    if not text:
        return []
    lines = [line.strip() for line in text.splitlines() if line.strip()]
    bullets = []
    for line in lines:
        stripped = re.sub(r"^[\-\*\u2022]\s*", "", line).strip()
        if len(stripped.split()) >= 4:
            bullets.append(stripped)
    return bullets[:5]


def improve_bullet_line(bullet: str, context: str = ""):
    raw = (bullet or "").strip().strip(".")
    if not raw:
        return "Led cross-functional delivery that improved measurable business outcomes by 25%."

    cleaned = re.sub(r"^(built|developed|created|worked on|implemented)\s+", "", raw, flags=re.I)
    context_hint = (context or "production systems").strip()
    return (
        f"Developed {cleaned} using {context_hint}, reducing cycle time by 25% and improving quality outcomes."
    )


def generate_suggestions(missing_skills, role: str = "", score_breakdown: Dict[str, float] | None = None):
    deduped = _dedupe_skills(missing_skills)
    role_key = role if role in ROLE_ACTION_TEMPLATES else "Full Stack Developer"
    templates = ROLE_ACTION_TEMPLATES[role_key]

    if deduped:
        dynamic_skill = deduped[0]
    else:
        dynamic_skill = "relevant stack technologies"

    suggestions = [templates[0].format(skill=dynamic_skill), templates[1], templates[2]]

    if score_breakdown:
        weakest = min(score_breakdown, key=lambda key: score_breakdown[key])
        suggestions.append(
            f"Strengthen the {weakest} section with quantified achievements to improve ATS relevance."
        )
    return suggestions[:5]


def generate_smart_suggestions(missing_skills, role: str = "", resume_text: str = ""):
    deduped = _dedupe_skills(missing_skills)
    seed_bullets = _clean_bullets(resume_text)
    if not seed_bullets:
        fallback_skill = deduped[0] if deduped else "production systems"
        seed_bullets = [f"Built {fallback_skill} solution"]

    selected = seed_bullets[:3]
    smart = []
    for idx, bullet in enumerate(selected):
        tip_skill = deduped[idx] if idx < len(deduped) else "relevant tooling"
        smart.append(
            {
                "original": bullet,
                "improved": improve_bullet_line(bullet, context=role or tip_skill),
                "tips": [
                    "Add measurable results",
                    "Use action verbs",
                    f"Mention tools used for {tip_skill}",
                ],
            }
        )
    return smart
