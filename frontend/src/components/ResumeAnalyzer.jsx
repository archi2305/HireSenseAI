import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

export default function ResumeAnalyzer() {
  const navigate = useNavigate()

  return (
    <div className="card" style={{ padding: 20 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 800 }}>Resume Analyzer</p>
      <p style={{ margin: "0 0 12px", color: "var(--text-2)", fontSize: 13 }}>
        Analysis is centralized on the Analyzer page to avoid duplicate handlers and inconsistent API flows.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
        Upload Resume
        <ArrowRight size={14} />
      </button>
    </div>
  )
}
