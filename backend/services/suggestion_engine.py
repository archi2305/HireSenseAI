def generate_suggestions(missing_skills):
    suggestions = []

    for skill in list(missing_skills)[:5]:
        suggestions.append(f"Add projects or experience related to {skill}.")

    # Add practical generic ATS improvements.
    suggestions.extend(
        [
            "Include measurable achievements in each recent role.",
            "Use stronger action verbs for impact-focused bullets.",
            "Improve project descriptions with tools, scale, and outcomes.",
        ]
    )

    # Keep 3-5 suggestions for concise UI.
    return suggestions[:5]