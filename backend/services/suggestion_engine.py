def _dedupe_skills(missing_skills):
    unique_missing = []
    seen = set()
    for skill in missing_skills:
        value = (skill or "").strip().lower()
        if value and value not in seen:
            seen.add(value)
            unique_missing.append(value)
    return unique_missing


def generate_suggestions(missing_skills):
    unique_missing = _dedupe_skills(missing_skills)
    return [f"Add projects using {skill}" for skill in unique_missing[:5]]


def improve_bullet_line(bullet: str, context: str = ""):
    raw = (bullet or "").strip().strip(".")
    if not raw:
        return "Delivered high-impact work with measurable business outcomes."

    verb_map = {
        "built": "Developed",
        "made": "Designed",
        "worked": "Collaborated",
        "helped": "Enabled",
        "created": "Architected",
    }

    first_word = raw.split(" ")[0].lower()
    action_verb = verb_map.get(first_word, "Delivered")
    role_hint = (context or "").strip() or "production workflows"

    return f"{action_verb} {raw.lower()} using {role_hint}, improving efficiency by 30%."


def generate_smart_suggestions(missing_skills, role: str = ""):
    unique_missing = _dedupe_skills(missing_skills)
    role_context = role or "resume"
    targets = unique_missing[:3] if unique_missing else ["impact", "collaboration", "tooling"]
    structured = []

    for skill in targets:
        original = f"Built {skill} related feature"
        improved = improve_bullet_line(original, context=role_context)
        structured.append(
            {
                "original": original,
                "improved": improved,
                "tips": [
                    "Add measurable results",
                    "Use action verbs",
                    f"Mention tools used for {skill}",
                ],
            }
        )

    return structured