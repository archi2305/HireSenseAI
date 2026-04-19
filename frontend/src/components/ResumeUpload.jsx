import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"

function ResumeUpload() {
  const navigate = useNavigate()

  return (
    <div className="card" style={{ padding: 20 }}>
      <p style={{ margin: "0 0 8px", fontWeight: 800 }}>Resume Upload</p>
      <p style={{ margin: "0 0 12px", color: "var(--text-2)", fontSize: 13 }}>
        Upload handling has been consolidated into one production flow on the Analyzer page.
      </p>
      <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
        Upload Resume
        <ArrowRight size={14} />
      </button>
    </div>
  )
}

export default ResumeUpload
