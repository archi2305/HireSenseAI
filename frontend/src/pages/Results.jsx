import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BriefcaseBusiness, Download } from "lucide-react"
import { useAnalysis } from "../context/AnalysisContext"
import { API_BASE_URL } from "../services/api"
import { fetchAnalysisById } from "../services/analysisService"

function normalizeList(value) {
  if (!value) return []
  if (Array.isArray(value)) return value.filter(Boolean)
  if (typeof value === "string") {
    return value
      .split(/\n|,/)
      .map((item) => item.trim())
      .map((item) => item.replace(/^-\s*/, ""))
      .filter(Boolean)
  }
  return []
}

export default function Results() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { analysisResult, analysisInput, uploadedResume, history, recentSearches, recordAnalysis } = useAnalysis()
  const [activeResult, setActiveResult] = useState(analysisResult)

  useEffect(() => {
    const analysisId = id ? String(id) : ""
    if (!analysisId) return

    const existing = history.find((item) => String(item.id) === analysisId)
    if (existing) {
      setActiveResult(existing)
      return
    }

    const load = async () => {
      const fetched = await fetchAnalysisById(analysisId)
      if (fetched) {
        setActiveResult(fetched)
        recordAnalysis(fetched)
      }
    }
    load()
  }, [id, history, recordAnalysis])

  const data = useMemo(() => {
    const matchedSkills = normalizeList(
      activeResult?.matched_skills || activeResult?.skills_detected || activeResult?.skills
    )
    const missingSkills = normalizeList(activeResult?.missing_skills)
    const suggestedRoles = normalizeList(activeResult?.suggested_roles)
    const improvementList = normalizeList(activeResult?.suggestions || activeResult?.improvements)

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
  }, [activeResult])

  if (!activeResult) {
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

  const atsScore = Number(activeResult?.ats_score || activeResult?.score || 0)
  const scoreBreakdown = {
    skills: Math.max(45, Math.min(98, activeResult?.score_breakdown?.skills ?? atsScore + 5)),
    experience: Math.max(40, Math.min(95, activeResult?.score_breakdown?.experience ?? atsScore - 6)),
    projects: Math.max(35, Math.min(96, activeResult?.score_breakdown?.projects ?? atsScore - 3)),
  }
  const analysisId = activeResult?.id

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
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", justifyContent: "flex-end" }}>
          {analysisId ? (
            <a className="btn btn-secondary" href={`${API_BASE_URL}/download/${analysisId}`} target="_blank" rel="noreferrer">
              <Download size={14} />
              Download PDF
            </a>
          ) : null}
          <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
            Upload Resume
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
        <div className="card card-lift" style={{ padding: 24 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
          ATS Score
        </p>
        <p
          style={{
            fontSize: 56,
            fontWeight: 900,
            lineHeight: 1,
            color: atsScore > 80 ? "var(--success)" : atsScore >= 50 ? "var(--warning)" : "var(--error)",
            margin: 0,
          }}
        >
          {atsScore}%
        </p>
        </div>

        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 14px" }}>Resume score breakdown</h3>
          {Object.entries(scoreBreakdown).map(([key, value]) => (
            <div key={key} style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 6 }}>
                <span style={{ textTransform: "capitalize", color: "var(--text-2)" }}>{key} %</span>
                <span style={{ fontWeight: 700 }}>{value}%</span>
              </div>
              <div style={{ height: 8, borderRadius: 99, background: "var(--border)", overflow: "hidden" }}>
                <div style={{ width: `${value}%`, height: "100%", background: "var(--accent)" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
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

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            Resume tips
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

      <div className="card card-lift" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>Recent searches</h3>
        <div style={{ display: "grid", gap: 8 }}>
          {recentSearches.length === 0 ? (
            <p style={{ margin: 0, color: "var(--text-2)", fontSize: 13 }}>No recent analyses yet.</p>
          ) : (
            recentSearches.map((entry) => (
              <button
                type="button"
                key={entry.id}
                className="btn btn-secondary"
                style={{ justifyContent: "space-between" }}
                onClick={() => navigate(`/results/${entry.id}`)}
              >
                <span>{entry.resume_name || "Untitled Resume"}</span>
                <span>{entry.ats_score ?? 0}%</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
