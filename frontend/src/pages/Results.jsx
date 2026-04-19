import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import { ArrowRight, CheckCircle2, AlertTriangle, Sparkles, BriefcaseBusiness, Download, FilePenLine, RefreshCw, Clipboard, FileSearch, MessageSquareQuote } from "lucide-react"
import toast from "react-hot-toast"
import { useAnalysis } from "../context/AnalysisContext"
import { API_BASE_URL } from "../services/api"
import {
  fetchAnalysisById,
  improveBullet,
  generateCoverLetter,
  recalculateScore,
  generateInterviewQuestions,
  runAtsFormatCheck,
  improveResumeOneClick,
} from "../services/analysisService"

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

const ROLE_OPTIONS = [
  "Backend Developer",
  "Frontend Developer",
  "Full Stack Developer",
  "Mobile App Developer",
  "Data Analyst",
  "Machine Learning Engineer",
  "DevOps Engineer",
  "UI/UX Designer",
  "Cloud Engineer",
  "Software Engineer",
]

export default function Results() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { analysisResult, analysisInput, uploadedResume, history, recentSearches, recordAnalysis } = useAnalysis()
  const [activeResult, setActiveResult] = useState(analysisResult)
  const [smartSuggestions, setSmartSuggestions] = useState([])
  const [improvingIndex, setImprovingIndex] = useState(-1)
  const [coverLetter, setCoverLetter] = useState("")
  const [coverLoading, setCoverLoading] = useState(false)
  const [coverTone, setCoverTone] = useState("formal")
  const [coverParagraphs, setCoverParagraphs] = useState(5)
  const [selectedRole, setSelectedRole] = useState("")
  const [recalcLoading, setRecalcLoading] = useState(false)
  const [interviewQuestions, setInterviewQuestions] = useState(null)
  const [interviewLoading, setInterviewLoading] = useState(false)
  const [atsFormatResult, setAtsFormatResult] = useState(null)
  const [formatLoading, setFormatLoading] = useState(false)
  const [improvedResumePack, setImprovedResumePack] = useState(null)
  const [improveResumeLoading, setImproveResumeLoading] = useState(false)

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

  useEffect(() => {
    if (!activeResult) {
      setSmartSuggestions([])
      return
    }
    setSelectedRole(activeResult?.job_role || analysisInput.role || "Software Engineer")
    const fromApi = Array.isArray(activeResult.ai_suggestions) ? activeResult.ai_suggestions : []
    if (fromApi.length > 0) {
      const unique = fromApi.filter(
        (item, idx, arr) =>
          arr.findIndex((other) => `${other?.original}|${other?.improved}` === `${item?.original}|${item?.improved}`) === idx
      )
      setSmartSuggestions(unique.slice(0, 1))
      return
    }
    const fallbackTips = normalizeList(activeResult?.suggestions).slice(0, 3).map((item) => ({
      original: item.replace(/^Add\s+/i, "Built "),
      improved: `${item}. Demonstrated measurable impact with a 20% performance gain.`,
      tips: ["Add measurable results", "Use action verbs", "Mention tools used"],
    }))
    setSmartSuggestions(fallbackTips)
  }, [activeResult])

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
    formatting: Math.max(35, Math.min(96, activeResult?.score_breakdown?.formatting ?? atsScore - 4)),
  }
  const analysisId = activeResult?.id

  const handleImproveBullet = async (index) => {
    const target = smartSuggestions[index]
    if (!target) return
    setImprovingIndex(index)
    const improved = await improveBullet({
      bullet: target.original,
      context: analysisInput.role || activeResult?.job_role || "software engineering",
    })
    setSmartSuggestions((prev) =>
      prev.map((item, idx) => (idx === index ? { ...item, ...improved } : item))
    )
    setImprovingIndex(-1)
    toast.success("Bullet improved")
  }

  const handleGenerateCoverLetter = async () => {
    setCoverLoading(true)
    const result = await generateCoverLetter({
      resumeId: analysisId,
      role: analysisInput.role || activeResult?.job_role,
      jobDescription: analysisInput.jobDescription,
      matchedSkills: data.matchedSkills,
      highlights: data.improvementList,
      tone: coverTone,
      paragraphs: coverParagraphs,
    })
    setCoverLetter(result.cover_letter || "")
    setCoverLoading(false)
    toast.success("Cover letter generated")
  }

  const handleRoleRecalculate = async () => {
    if (!analysisId || !selectedRole) return
    setRecalcLoading(true)
    const result = await recalculateScore({
      analysisId,
      role: selectedRole,
      jobDescription: analysisInput.jobDescription,
    })
    setRecalcLoading(false)
    if (!result) {
      toast.error("Unable to recalculate score")
      return
    }
    const merged = { ...activeResult, ...result, id: analysisId }
    setActiveResult(merged)
    recordAnalysis(merged)
    toast.success("Score recalculated")
  }

  const handleGenerateInterviewQuestions = async () => {
    if (!analysisId) return
    setInterviewLoading(true)
    const result = await generateInterviewQuestions({ analysisId, role: selectedRole })
    setInterviewLoading(false)
    setInterviewQuestions(result)
  }

  const handleAtsFormatCheck = async () => {
    if (!analysisId) return
    setFormatLoading(true)
    const result = await runAtsFormatCheck({ analysisId, role: selectedRole })
    setFormatLoading(false)
    setAtsFormatResult(result)
  }

  const handleImproveResumeOneClick = async () => {
    if (!analysisId) return
    setImproveResumeLoading(true)
    const result = await improveResumeOneClick({ analysisId, role: selectedRole })
    setImproveResumeLoading(false)
    setImprovedResumePack(result)
  }

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
          <select
            className="input"
            style={{ minWidth: 190 }}
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
          >
            {ROLE_OPTIONS.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
          <button className="btn btn-secondary" onClick={handleRoleRecalculate} disabled={recalcLoading}>
            <RefreshCw size={14} />
            {recalcLoading ? "Updating..." : "Role Switch Recalculate"}
          </button>
          {analysisId ? (
            <a className="btn btn-secondary" href={`${API_BASE_URL}/download/${analysisId}`} target="_blank" rel="noreferrer">
              <Download size={14} />
              Download PDF
            </a>
          ) : null}
          <button className="btn btn-secondary" onClick={handleGenerateCoverLetter} disabled={coverLoading}>
            <FilePenLine size={14} />
            {coverLoading ? "Generating..." : "Generate Cover Letter"}
          </button>
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

      <div className="card card-lift" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>Job Description Match</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
          <div className="card" style={{ padding: 12 }}>
            <p style={{ margin: 0, fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Match %</p>
            <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900 }}>{activeResult?.jd_match?.match_percent ?? Math.max(45, atsScore - 5)}%</p>
          </div>
          <div className="card" style={{ padding: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Matched keywords</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)" }}>
              {(activeResult?.jd_match?.matched_keywords || data.matchedSkills).slice(0, 8).join(", ") || "No match data"}
            </p>
          </div>
          <div className="card" style={{ padding: 12 }}>
            <p style={{ margin: "0 0 6px", fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Missing keywords</p>
            <p style={{ margin: 0, fontSize: 13, color: "var(--error)" }}>
              {(activeResult?.jd_match?.missing_keywords || data.missingSkills).slice(0, 8).join(", ") || "No critical gaps"}
            </p>
          </div>
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
            <FileSearch size={15} style={{ color: "var(--accent)" }} />
            Resume Parser View
          </h3>
          <p style={{ margin: 0, fontSize: 12, color: "var(--text-2)" }}>Name: {activeResult?.parsed_sections?.name || "Candidate"}</p>
          <p style={{ margin: "8px 0 0", fontSize: 12, color: "var(--text-2)" }}>
            Experience: {activeResult?.parsed_sections?.experience_extracted || "Not extracted"}
          </p>
          <p style={{ margin: "8px 0 4px", fontSize: 12, color: "var(--text-2)" }}>Skills extracted:</p>
          <p style={{ margin: 0, fontSize: 13 }}>{(activeResult?.parsed_sections?.skills_extracted || data.matchedSkills).slice(0, 10).join(", ") || "No skills extracted"}</p>
          <p style={{ margin: "8px 0 4px", fontSize: 12, color: "var(--text-2)" }}>Projects extracted:</p>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 4 }}>
            {(activeResult?.parsed_sections?.projects_extracted || []).slice(0, 3).map((project) => (
              <li key={project} style={{ fontSize: 12, color: "var(--text-2)" }}>{project}</li>
            ))}
          </ul>
        </div>

        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <MessageSquareQuote size={15} style={{ color: "var(--accent)" }} />
            Interview Question Generator
          </h3>
          <button className="btn btn-secondary" onClick={handleGenerateInterviewQuestions} disabled={interviewLoading}>
            {interviewLoading ? "Generating..." : "Generate Questions"}
          </button>
          {interviewQuestions ? (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {["hr", "technical", "project_based"].map((group) => (
                <div key={group}>
                  <p style={{ margin: "0 0 4px", fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>{group.replace("_", " ")}</p>
                  <ul style={{ margin: 0, paddingLeft: 16, display: "grid", gap: 4 }}>
                    {(interviewQuestions[group] || []).map((q) => (
                      <li key={q} style={{ fontSize: 12, color: "var(--text-2)" }}>{q}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>ATS Format Checker</h3>
          <button className="btn btn-secondary" onClick={handleAtsFormatCheck} disabled={formatLoading}>
            {formatLoading ? "Checking..." : "Run ATS Format Check"}
          </button>
          {atsFormatResult ? (
            <ul style={{ margin: "10px 0 0", paddingLeft: 16, display: "grid", gap: 4 }}>
              {(atsFormatResult.issues || []).length === 0 ? (
                <li style={{ fontSize: 12, color: "var(--success)" }}>No major ATS format issues detected.</li>
              ) : (
                (atsFormatResult.issues || []).map((issue) => (
                  <li key={issue} style={{ fontSize: 12, color: "var(--text-2)" }}>{issue}</li>
                ))
              )}
            </ul>
          ) : null}
        </div>

        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px" }}>One-Click Resume Improver</h3>
          <button className="btn btn-secondary" onClick={handleImproveResumeOneClick} disabled={improveResumeLoading}>
            {improveResumeLoading ? "Improving..." : "Improve my resume"}
          </button>
          {improvedResumePack?.improved_bullets?.length ? (
            <div style={{ marginTop: 10, display: "grid", gap: 8 }}>
              {improvedResumePack.improved_bullets.slice(0, 3).map((bullet) => (
                <p key={bullet} style={{ margin: 0, fontSize: 12, color: "var(--text-2)" }}>- {bullet}</p>
              ))}
              <a
                className="btn btn-secondary"
                href={`data:text/plain;charset=utf-8,${encodeURIComponent((improvedResumePack.improved_bullets || []).join("\n"))}`}
                download={`improved-resume-${analysisId || "draft"}.txt`}
              >
                <Download size={14} />
                Download improved resume
              </a>
            </div>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16 }}>
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <Sparkles size={15} style={{ color: "var(--accent)" }} />
            AI Suggestions (Before vs After)
          </h3>
          <div style={{ display: "grid", gap: 10 }}>
            {smartSuggestions.length === 0 ? (
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: 13 }}>No suggestions yet.</p>
            ) : (
              smartSuggestions.map((item, idx) => (
                <div key={`${item.original}-${idx}`} className="card" style={{ padding: 12 }}>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>Before</p>
                  <p style={{ margin: "2px 0 8px", fontSize: 13 }}>{item.original}</p>
                  <p style={{ margin: 0, fontSize: 11, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".06em" }}>After</p>
                  <p style={{ margin: "2px 0 8px", fontSize: 13, color: "var(--success)", fontWeight: 600 }}>{item.improved}</p>
                  <ul style={{ margin: "0 0 8px", paddingLeft: 16, display: "grid", gap: 4 }}>
                    {(item.tips || []).map((tip) => (
                      <li key={tip} style={{ fontSize: 12, color: "var(--text-2)" }}>{tip}</li>
                    ))}
                  </ul>
                  <button
                    className="btn btn-secondary"
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => handleImproveBullet(idx)}
                    disabled={improvingIndex === idx}
                  >
                    {improvingIndex === idx ? "Improving..." : "Improve this bullet"}
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

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

      <div className="card card-lift" style={{ padding: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
          <FilePenLine size={15} style={{ color: "var(--accent)" }} />
          Cover Letter Options
        </h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--text-2)" }}>
            Tone
            <select className="input" value={coverTone} onChange={(e) => setCoverTone(e.target.value)}>
              <option value="formal">Formal</option>
              <option value="confident">Confident</option>
            </select>
          </label>
          <label style={{ display: "grid", gap: 6, fontSize: 12, color: "var(--text-2)" }}>
            Paragraphs
            <select className="input" value={coverParagraphs} onChange={(e) => setCoverParagraphs(Number(e.target.value))}>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
          </label>
        </div>
        <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button className="btn btn-primary" onClick={handleGenerateCoverLetter} disabled={coverLoading}>
            {coverLoading ? "Generating..." : "Generate Cover Letter"}
          </button>
          <button
            className="btn btn-secondary"
            onClick={async () => {
              const suggestionsText = data.improvementList.join("\n")
              await navigator.clipboard.writeText(suggestionsText)
              toast.success("Suggestions copied")
            }}
          >
            <Clipboard size={14} />
            Copy suggestions
          </button>
          {coverLetter ? (
            <button
              className="btn btn-secondary"
              onClick={async () => {
                await navigator.clipboard.writeText(coverLetter)
                toast.success("Cover letter copied")
              }}
            >
              Copy
            </button>
          ) : null}
          {coverLetter ? (
            <a
              className="btn btn-secondary"
              href={`data:text/plain;charset=utf-8,${encodeURIComponent(coverLetter)}`}
              download={`cover-letter-${analysisId || "draft"}.txt`}
            >
              <Download size={14} />
              Download Cover Letter
            </a>
          ) : null}
        </div>
      </div>

      {coverLetter ? (
        <div className="card card-lift" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 14, fontWeight: 800, margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8 }}>
            <FilePenLine size={15} style={{ color: "var(--accent)" }} />
            Generated Cover Letter
          </h3>
          <pre style={{ margin: 0, whiteSpace: "pre-wrap", fontFamily: "inherit", lineHeight: 1.6, color: "var(--text-2)" }}>
            {coverLetter}
          </pre>
        </div>
      ) : null}
    </div>
  )
}
