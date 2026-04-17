import { useMemo } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BriefcaseBusiness } from "lucide-react"
import { useAnalysis } from "../context/AnalysisContext"

function normalizeList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

export default function Results() {
  const navigate = useNavigate()
  const { analysisResult, analysisInput, uploadedResume } = useAnalysis()

  const data = useMemo(() => {
    const matchedSkills = normalizeList(
      analysisResult?.matched_skills || analysisResult?.skills_detected || analysisResult?.skills
    )
    const missingSkills = normalizeList(analysisResult?.missing_skills)
    const suggestedRoles = normalizeList(analysisResult?.suggested_roles)
    const improvementList = normalizeList(analysisResult?.improvements)

    if (improvementList.length > 0) return { matchedSkills, missingSkills, suggestedRoles, improvementList }

    return {
      matchedSkills,
      missingSkills,
      suggestedRoles,
      improvementList:
        missingSkills.length > 0
          ? missingSkills.map((skill) => `Add stronger evidence of ${skill}`)
          : ["Highlight measurable achievements and project impact"],
    }
  }, [analysisResult])

  if (!analysisResult) {
    return (
      <div style={{ padding: "32px 40px", maxWidth: 980, margin: "0 auto" }}>
        <div className="card" style={{ padding: 28, textAlign: "center" }}>
          <p style={{ fontSize: 14, color: "var(--text-2)" }}>No analysis available yet.</p>
          <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
            Upload Resume
          </button>
        </div>
      </div>
    )
  }

  const atsScore = Number(analysisResult?.ats_score || analysisResult?.score || 0)

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1240, margin: "0 auto", display: "grid", gap: 18 }}>
      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
            Analysis Results
          </p>
          <h1 style={{ fontSize: 28, fontWeight: 900, margin: 0 }}>Resume Match Outcome</h1>
          <p style={{ fontSize: 13, color: "var(--text-2)", marginTop: 8 }}>
            {uploadedResume?.name ? `${uploadedResume.name} · ` : ""}
            {analysisInput.role || "General"} role
          </p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/analyzer")}>
          New Extraction
          <ArrowRight size={14} />
        </button>
      </div>

      <div className="card card-lift" style={{ padding: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
          ATS Score
        </p>
        <p style={{ fontSize: 56, fontWeight: 900, lineHeight: 1, color: atsScore >= 80 ? "var(--success)" : "var(--warning)", margin: 0 }}>
          {atsScore}%
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <CheckCircle2 size={15} style={{ color: "var(--success)" }} />
            Skills detected
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.matchedSkills.length > 0 ? data.matchedSkills.map((skill) => (
              <span key={skill} className="badge" style={{ color: "var(--success)" }}>
                {skill}
              </span>
            )) : <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>No explicit skills detected</p>}
          </div>
        </div>

        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <AlertTriangle size={15} style={{ color: "var(--error)" }} />
            Missing skills
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.missingSkills.length > 0 ? data.missingSkills.map((skill) => (
              <span key={skill} className="badge" style={{ color: "var(--error)" }}>
                {skill}
              </span>
            )) : <p style={{ fontSize: 13, color: "var(--text-2)", margin: 0 }}>No critical missing skills</p>}
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 16 }}>
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            Improvements
          </h3>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
            {data.improvementList.map((item) => (
              <li key={item} style={{ fontSize: 13, color: "var(--text-2)" }}>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <BriefcaseBusiness size={15} style={{ color: "var(--accent)" }} />
            Suggested roles
          </h3>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {(data.suggestedRoles.length > 0 ? data.suggestedRoles : [analysisInput.role || "Generalist"]).map((role) => (
              <span key={role} className="badge" style={{ color: "var(--accent)" }}>
                {role}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 14 }}>
            <Link to="/history" className="btn btn-secondary" style={{ textDecoration: "none" }}>
              View All
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
