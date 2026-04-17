def generate_suggestions(missing_skills):
    unique_missing = []
    seen = set()
    for skill in missing_skills:
        value = (skill or "").strip().lower()
        if value and value not in seen:
            seen.add(value)
            unique_missing.append(value)
    return [f"Add projects using {skill}" for skill in unique_missing[:5]]