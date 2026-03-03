from openai import OpenAI

def generate_suggestions(resume_text, job_description, missing_skills, api_key):
    client = OpenAI(api_key=api_key)

    prompt = f"""
    You are an ATS optimization assistant.

    Resume Content:
    {resume_text}

    Job Description:
    {job_description}

    Missing Skills:
    {', '.join(missing_skills)}

    Provide:
    1. Specific resume improvement suggestions
    2. Keywords that should be added
    3. Short summary of overall fit
    """

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a professional resume reviewer."},
            {"role": "user", "content": prompt}
        ]
    )

    return response.choices[0].message.content