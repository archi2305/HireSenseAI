import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2 } from "lucide-react"
import DragDropUpload from "./DragDropUpload"
import ATSResultCard from "./ATSResultCard"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ROLE_TEMPLATES = {
  "Software Engineer":
    "We are looking for a Software Engineer with strong skills in Python, SQL, data structures, and algorithms.",
  "Backend Developer":
    "We need a Backend Developer experienced with building REST APIs, databases, and frameworks like FastAPI or Django.",
  "Data Scientist":
    "Looking for a Data Scientist with expertise in Python, machine learning, Pandas, and data visualization.",
  "AI Engineer":
    "AI Engineer role focusing on deep learning, model deployment, and MLOps.",
  "Frontend Developer":
    "Frontend Developer with React, modern CSS, and component-driven UI experience.",
  "DevOps Engineer":
    "DevOps Engineer with experience in CI/CD, Docker, Kubernetes, and cloud platforms.",
}

const ROLE_OPTIONS = Object.keys(ROLE_TEMPLATES)

function ResumeAnalyzer({ onAnalysisCompleted }) {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleRoleChange = (role) => {
    setJobRole(role)
    const template = ROLE_TEMPLATES[role]
    if (template) {
      setJobDescription(template)
    }
  }

  const handleAnalyze = async () => {
    if (!file || !jobDescription) {
      toast.error("Please add a resume file and job description.")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("job_description", jobDescription)
    formData.append("job_role", jobRole)

    try {
      setLoading(true)
      setUploadProgress(0)
      const uploadToast = toast.loading("Analyzing resume...")
      
      const res = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          setUploadProgress(percentCompleted)
        }
      })
      
      setResult(res.data)
      toast.success("Analysis complete!", { id: uploadToast })

      onAnalysisCompleted?.({
        ...res.data,
        job_role: jobRole,
        date: res.data.created_at,
      })
    } catch (error) {
      console.error("Failed to analyze resume", error)
      toast.dismiss()
      toast.error("Failed to analyze resume. Ensure backend is running.")
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return (
    <section className="bg-cardBg rounded-2xl shadow-md p-6 md:p-8">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
        <div className="flex-1">
          <h2 className="text-xl font-semibold text-slate-900 mb-1">
            Resume Analyzer
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Upload your resume, select a role, and we&apos;ll compute an ATS score and highlight missing skills.
          </p>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Target Role
            </label>
            <select
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-dashboardBg focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={jobRole}
              onChange={(e) => handleRoleChange(e.target.value)}
            >
              <option value="">Select a role...</option>
              {ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Resume
            </label>
            <DragDropUpload onFileSelected={setFile} />
            {file && (
              <div className="mt-3">
                <p className="text-xs text-slate-600 mb-2 truncate">
                  Selected: <span className="font-medium text-slate-800">{file.name}</span>
                </p>
                {loading && (
                  <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-pastelBlue h-1.5 rounded-full transition-all duration-300 ease-out"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Job Description
          </label>
          <textarea
            rows={8}
            className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-dashboardBg focus:outline-none focus:ring-2 focus:ring-pastelBlue"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste or edit the job description for this role..."
          />

          <button
            type="button"
            onClick={handleAnalyze}
            disabled={loading}
            className="mt-4 w-full md:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-slate-900 bg-gradient-to-r from-mint to-pastelBlue shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 disabled:opacity-70 disabled:hover:translate-y-0 disabled:cursor-not-allowed"
          >
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analyzing...</> : "Analyze Resume"}
          </button>
        </div>
      </div>

      <ATSResultCard result={result} />
    </section>
  )
}

export default ResumeAnalyzer

