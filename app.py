import streamlit as st
from resume_parser import extract_text_from_pdf
from skill_matcher import extract_skills, calculate_ats_score
from ai_suggestions import generate_suggestions


# Page setup
st.set_page_config(
    page_title="HireSense AI - Resume Analyzer",
    layout="centered"
)

st.title("HireSense AI - Resume Analyzer")
st.write("Upload a resume and compare it with a job description.")


# Inputs
uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])
job_description = st.text_area("Paste Job Description Here")


if st.button("Analyze Resume"):

    if uploaded_file is None:
        st.warning("Please upload a resume file.")
        st.stop()

    if job_description.strip() == "":
        st.warning("Please paste a job description.")
        st.stop()

    # Extract text and skills
    resume_text = extract_text_from_pdf(uploaded_file)
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    # Calculate score
    ats_score, matched_skills = calculate_ats_score(resume_skills, jd_skills)
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Score display
    st.subheader("ATS Compatibility Score")
    st.progress(int(ats_score))
    st.write(f"Match Percentage: {ats_score}%")

    # Interpretation
    st.subheader("Compatibility Interpretation")
    if ats_score >= 80:
        st.success("High compatibility with job requirements.")
    elif ats_score >= 50:
        st.warning("Moderate compatibility. Some skills may need improvement.")
    else:
        st.error("Low compatibility. Significant skill gaps detected.")

    # Metrics
    st.subheader("Skill Metrics")
    st.write(f"Total Required Skills: {len(jd_skills)}")
    st.write(f"Matched Skills: {len(matched_skills)}")
    st.write(f"Missing Skills: {len(missing_skills)}")

    # Skill breakdown
    col1, col2 = st.columns(2)

    with col1:
        st.subheader("Matched Skills")
        if matched_skills:
            for skill in sorted(matched_skills):
                st.markdown(f"- {skill}")
        else:
            st.write("No matching skills found.")

    with col2:
        st.subheader("Missing Skills")
        if missing_skills:
            for skill in sorted(missing_skills):
                st.markdown(f"- {skill}")
        else:
            st.write("No missing skills.")

    # Suggestions
    st.subheader("Resume Improvement Suggestions")
    with st.spinner("Generating suggestions..."):
        suggestions = generate_suggestions(
            resume_text,
            job_description,
            missing_skills
        )

    st.write(suggestions)