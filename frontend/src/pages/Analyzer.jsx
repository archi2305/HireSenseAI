import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { UploadCloud, Sparkles, ArrowRight } from "lucide-react"
import toast from "react-hot-toast"
import { motion } from "framer-motion"
import { useAnalysis } from "../context/AnalysisContext"
import { analyzeResume } from "../services/analysisService"
import AnalyzerLoadingSteps from "../components/AnalyzerLoadingSteps"

const ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Android Developer",
  "iOS Developer",
  "Software Engineer",
  "Data Analyst",
  "Machine Learning Engineer",
  "AI Engineer",
  "DevOps Engineer",
  "Cloud Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
]

export default function Analyzer() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const [loadingStep, setLoadingStep] = useState(0)
  const [file, setFile] = useState(null)
  const { analysisInput, setAnalysisInput, recordAnalysis, setUploadedResume } = useAnalysis()

  useEffect(() => {
    if (!loading) {
      setLoadingStep(0)
      return
    }
    const timers = [700, 1400, 2100].map((ms, idx) =>
      setTimeout(() => {
        setLoadingStep(idx + 1)
      }, ms)
    )
    return () => {
      timers.forEach((timer) => clearTimeout(timer))
    }
  }, [loading])

  const onSubmit = async (event) => {
    event.preventDefault()
    if (!file) {
      toast.error("Please upload a resume")
      return
    }
    if (!analysisInput.role.trim()) {
      toast.error("Please select a role")
      return
    }
    if (analysisInput.jobDescription.trim() && analysisInput.jobDescription.trim().length < 30) {
      toast.error("Job description should be at least 30 characters")
      return
    }

    setLoading(true)
    try {
      const fileName = file.name.toLowerCase()
      const isSupported = fileName.endsWith(".pdf") || fileName.endsWith(".docx")
      if (!isSupported) {
        throw new Error("Only PDF or DOCX files are supported")
      }

      const data = await analyzeResume({
        file,
        role: analysisInput.role,
        jobDescription: analysisInput.jobDescription,
      })

      setUploadedResume({
        name: file.name,
        type: file.type,
        size: file.size,
      })
      recordAnalysis(data)

      if (data?.isMock) {
        toast("API unavailable. Showing fallback analysis.", { icon: "ℹ️" })
      } else {
        toast.success("Resume analyzed successfully")
      }

      navigate(`/results/${data.id}`)
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
          Upload your resume, choose a target role, and optionally add a job description for sharper matching.
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

        <div>
          <label style={{ display: "block", fontSize: 12, fontWeight: 700, color: "var(--text-2)", marginBottom: 8 }}>
            Job Description (Optional)
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
            disabled={loading || !file}
          >
            {loading ? (
              <>
                <motion.span
                  className="inline-block"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,.35)", borderTopColor: "#fff", borderRadius: "50%" }}
                />
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

      {loading ? (
        <div style={{ marginTop: 18 }}>
          <AnalyzerLoadingSteps currentStep={loadingStep} />
        </div>
      ) : null}
    </div>
  )
}
