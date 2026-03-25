import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, UploadCloud, FileType } from "lucide-react"
import DragDropUpload from "./DragDropUpload"
import ATSResultCard from "./ATSResultCard"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ROLE_TEMPLATES = {
  "Software Engineer": "We are looking for a Software Engineer with strong skills in Python, SQL, data structures, and algorithms.",
  "Backend Developer": "We need a Backend Developer experienced with building REST APIs, databases, and frameworks.",
  "Data Scientist": "Looking for a Data Scientist with expertise in Python, machine learning, Pandas, and data visualization.",
  "AI Engineer": "AI Engineer role focusing on deep learning, model deployment, and MLOps.",
  "Frontend Developer": "Frontend Developer with React, modern CSS, and component-driven UI experience.",
  "DevOps Engineer": "DevOps Engineer with experience in CI/CD, Docker, Kubernetes, and cloud platforms.",
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
    if (template) setJobDescription(template)
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
      const uploadToast = toast.loading("Analyzing resume...")
      
      const res = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (e) => setUploadProgress(Math.round((e.loaded * 100) / e.total))
      })
      
      setResult(res.data)
      toast.success("Analysis complete!", { id: uploadToast })
      onAnalysisCompleted?.({ ...res.data, job_role: jobRole, date: res.data.created_at })
    } catch (error) {
      toast.dismiss()
      toast.error("Failed to analyze resume.")
    } finally {
      setLoading(false)
      setTimeout(() => setUploadProgress(0), 1000)
    }
  }

  return (
    <div className="flex flex-col gap-6 max-w-6xl mx-auto w-full pt-4">
      <div className="flex items-center gap-3 mb-2">
        <h1 className="text-xl font-semibold text-theme-text tracking-tight">Parse & Analyze</h1>
      </div>

      <div className="bg-theme-bg border border-theme-border rounded-md shadow-sm p-5 flex flex-col gap-6">
        
        {/* Horizontal Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-[12px] font-medium text-theme-textSecondary mb-1.5 uppercase tracking-wider">Target Role</label>
              <select
                className="w-full border border-theme-border rounded-md px-3 py-2 text-[13px] bg-theme-sidebar focus:border-theme-accent focus:outline-none transition-all duration-150 text-theme-text"
                value={jobRole}
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <option value="">Select a typical role...</option>
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[12px] font-medium text-theme-textSecondary mb-1.5 uppercase tracking-wider">Job Description</label>
              <textarea
                rows={6}
                className="w-full border border-theme-border rounded-md px-3 py-2 text-[13px] bg-theme-sidebar focus:border-theme-accent focus:outline-none transition-all duration-150 resize-none text-theme-text"
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the job description..."
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 h-full">
            <label className="block text-[12px] font-medium text-theme-textSecondary mb-1.5 uppercase tracking-wider">Resume Upload</label>
            <div className="flex-1 min-h-[160px] relative rounded-md border border-dashed border-theme-border bg-theme-sidebar/50 hover:bg-theme-sidebar transition-all duration-150 flex flex-col items-center justify-center p-6 text-center group">
              <input 
                type="file" 
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                onChange={(e) => setFile(e.target.files?.[0])}
                accept=".pdf,.doc,.docx" 
              />
              <UploadCloud className="w-8 h-8 text-theme-textSecondary mb-3 group-hover:text-theme-text transition-colors duration-150" />
              <p className="text-[13px] text-theme-text font-medium">Click or drag resume here</p>
              <p className="text-[11px] text-theme-textSecondary mt-1">PDF, DOC, DOCX up to 10MB</p>
              
              {file && (
                <div className="absolute inset-x-2 bottom-2 bg-theme-bg border border-theme-border rounded p-2 flex items-center justify-between z-20 pointer-events-none">
                  <div className="flex items-center gap-2 truncate">
                    <FileType className="w-4 h-4 text-theme-accent" />
                    <span className="text-[12px] text-theme-text truncate font-medium">{file.name}</span>
                  </div>
                  {loading && <span className="text-[10px] text-theme-textSecondary">{uploadProgress}%</span>}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-theme-border">
          <button
            onClick={handleAnalyze}
            disabled={loading || !file || !jobDescription}
            className="px-4 py-1.5 bg-theme-text text-theme-bg text-[13px] font-semibold rounded-md hover:bg-gray-200 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {loading ? <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Analyzing</> : "Analyze Document"}
          </button>
        </div>
      </div>

      {result && (
        <div className="animate-fade-in mt-4">
          <ATSResultCard result={result} />
        </div>
      )}
    </div>
  )
}

export default ResumeAnalyzer
