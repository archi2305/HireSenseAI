import { useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UploadCloud, Sparkles, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import { API_BASE_URL } from "../services/api"
import { useAnalysis } from "../context/AnalysisContext"

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Software Engineer",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Mobile App Developer",
]

export default function Analyzer() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const { analysisInput, setAnalysisInput, setAnalysisResult, setUploadedResume } = useAnalysis()

  const onSubmit = async (event) => {
    event.preventDefault()
    const hasFile = Boolean(file)
    const hasJobDescription = Boolean(analysisInput.jobDescription.trim())

    if (!hasFile && !hasJobDescription) {
      toast.error("Upload a resume or provide a job description")
      return
    }
    if (!analysisInput.role.trim()) {
      toast.error("Please select a role")
      return
    }

    setLoading(true)
    try {
      if (hasFile) {
        const fileName = file.name.toLowerCase()
        const isSupported = fileName.endsWith(".pdf") || fileName.endsWith(".docx")
        if (!isSupported) {
          throw new Error("Only PDF or DOCX files are supported")
        }

        const formData = new FormData()
        formData.append("file", file)
        formData.append("role", analysisInput.role)
        formData.append("job_description", analysisInput.jobDescription)

        const response = await fetch(`${API_BASE_URL}/api/analyze`, {
          method: "POST",
          body: formData,
        })
        const data = await response.json().catch(() => ({}))
        if (!response.ok) {
          throw new Error(data?.detail || "Analysis failed")
        }

        setUploadedResume({
          name: file.name,
          type: file.type,
          size: file.size,
        })
        setAnalysisResult(data)
        toast.success("Resume analyzed successfully")
        navigate("/results")
        return
      }

      const matchFormData = new FormData()
      matchFormData.append("job_description", analysisInput.jobDescription)
      const matchResponse = await fetch(`${API_BASE_URL}/candidates/match`, {
        method: "POST",
        body: matchFormData,
      })
      const matchData = await matchResponse.json().catch(() => [])
      if (!matchResponse.ok) {
        throw new Error("Match analysis failed")
      }
      setAnalysisResult({ match_results: matchData })
      toast.success("Match rate analysis completed")
      navigate("/analytics")
    } catch (error) {
      toast.error(error.message || "Unable to analyze resume")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1180, margin: "0 auto" }}>
      <div className="card" style={{ padding: 28, marginBottom: 22 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 8 }}>
          Resume Analyzer
        </p>
        <h1 style={{ fontSize: 30, fontWeight: 900, color: "var(--text)", margin: 0 }}>
          Upload and analyze ATS fit
        </h1>
        <p style={{ marginTop: 10, color: "var(--text-2)", fontSize: 14 }}>
          Upload Resume runs ATS analysis. Job Description-only runs Match Rate analysis.
        </p>
      </div>

      <form className="card" style={{ padding: 24, display: "grid", gap: 18 }} onSubmit={onSubmit}>
        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>
            Resume Upload
          </label>
          <button
            type="button"
            className="btn btn-secondary"
            style={{ width: "100%", justifyContent: "center", padding: "14px 16px", borderStyle: "dashed" }}
            onClick={() => fileInputRef.current?.click()}
          >
            <UploadCloud size={16} />
            {file ? file.name : "Choose PDF or DOCX"}
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.docx"
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>
            Target Role
          </label>
          <select
            className="input"
            value={analysisInput.role}
            onChange={(e) => setAnalysisInput((prev) => ({ ...prev, role: e.target.value }))}
          >
            <option value="">Select role</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          <span style={{ fontSize: 11, color: "var(--text-2)", fontWeight: 700, letterSpacing: ".08em" }}>
            OR
          </span>
          <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>
            Job Description
          </label>
          <textarea
            className="input"
            rows={10}
            placeholder="Paste job description and requirements..."
            value={analysisInput.jobDescription}
            onChange={(e) =>
              setAnalysisInput((prev) => ({
                ...prev,
                jobDescription: e.target.value,
              }))
            }
          />
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading || (!file && !analysisInput.jobDescription.trim())}
          >
            {loading ? (
              <>
                <span className="animate-spin" style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block" }} />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles size={15} />
                Analyze Resume
                <ArrowRight size={15} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
