def generate_suggestions(resume_text, job_description, missing_skills):

    if not missing_skills:
        return (
            "The resume strongly aligns with the job description. "
            "All required technical skills are present. "
            "To further improve, consider adding measurable achievements "
            "and quantifiable results for each project."
        )

    suggestions = "The following improvements are recommended:\n\n"

    for skill in missing_skills:
        suggestions += f"- Add experience or projects demonstrating {skill}.\n"

    suggestions += (
        "\nAdditionally, include action verbs, quantify achievements, "
        "and tailor your summary section to match the job description."
    )

    return suggestions