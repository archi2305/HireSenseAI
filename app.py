from ai_suggestions import generate_suggestions
import os

import streamlit as st
from resume_parser import extract_text_from_pdf
from skill_matcher import extract_skills, calculate_ats_score


# Page configuration
st.set_page_config(
    page_title="HireSense AI - Resume Analyzer",
    layout="centered"
)

st.title("HireSense AI - Resume Analyzer")
st.write("Upload your resume and compare it with a job description to calculate ATS compatibility.")


# User Inputs
uploaded_file = st.file_uploader("Upload Resume (PDF)", type=["pdf"])
job_description = st.text_area("Paste Job Description Here")


# Main Action
if st.button("Analyze Resume"):

    if uploaded_file is None:
        st.warning("Please upload a resume file.")
        st.stop()

    if job_description.strip() == "":
        st.warning("Please paste a job description.")
        st.stop()

    # Extract resume text
    resume_text = extract_text_from_pdf(uploaded_file)

    # Extract skills
    resume_skills = extract_skills(resume_text)
    jd_skills = extract_skills(job_description)

    # Calculate ATS score
    ats_score, matched_skills = calculate_ats_score(resume_skills, jd_skills)
    missing_skills = list(set(jd_skills) - set(resume_skills))

    # Display Results
    st.subheader("ATS Compatibility Score")
    st.progress(int(ats_score))
    st.write(f"Match Percentage: {ats_score}%")

    st.subheader("Matched Skills")
    if matched_skills:
        for skill in sorted(matched_skills):
            st.markdown(f"- {skill}")
    else:
        st.write("No matching skills found.")

    st.subheader("Missing Skills")
    if missing_skills:
        for skill in sorted(missing_skills):
            st.markdown(f"- {skill}")
    else:
        st.write("No missing skills. Resume fully matches job description.")

    st.subheader("AI Resume Improvement Suggestions")

    with st.spinner("Generating suggestions..."):
        suggestions = generate_suggestions(
            resume_text,
            job_description,
            missing_skills
    )

    st.write(suggestions)