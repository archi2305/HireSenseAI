def generate_suggestions(resume_text, job_description, missing_skills):

    suggestions = ""

    if missing_skills:
        suggestions += "Skill Gap Analysis:\n"
        for skill in missing_skills:
            suggestions += f"- Consider adding practical experience with {skill}.\n"
        suggestions += "\n"

    suggestions += "Resume Optimization Tips:\n"
    suggestions += "- Use measurable achievements (e.g., improved performance by 30%).\n"
    suggestions += "- Use action verbs such as designed, implemented, optimized.\n"
    suggestions += "- Align summary section with job description keywords.\n"
    suggestions += "- Highlight impact rather than responsibilities.\n"

    return suggestions