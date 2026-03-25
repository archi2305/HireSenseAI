import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search, Filter, Download, ChevronRight, X,
  Mail, MapPin, Calendar, Star, Zap, Brain
} from "lucide-react"
import { useDashboard } from "../context/DashboardContext"

/* ────────────────────────────────────────────
   SLIDE-IN CANDIDATE DETAIL PANEL
   ──────────────────────────────────────────── */
function CandidatePanel({ candidate, onClose }) {
  const score = candidate.score ?? candidate.ats_score ?? 0
  const skills = candidate.skills
    ? (Array.isArray(candidate.skills) ? candidate.skills : candidate.skills.split(",").map(s => s.trim()))
    : []

  return (
    <AnimatePresence>
      {candidate && (
        <>
          {/* Overlay */}
          <motion.div
            className="panel-overlay"
            initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
            onClick={onClose}
          />
          {/* Panel */}
          <motion.div
            className="slide-panel"
            initial={{ x:"100%" }} animate={{ x:0 }} exit={{ x:"100%" }}
            transition={{ type:"spring", damping:28, stiffness:280 }}
          >
            {/* Header */}
            <div style={{ padding:"24px 28px", borderBottom:"1px solid var(--border)", background:"var(--bg)", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                <div style={{
                  width:48, height:48, borderRadius:14, background:"var(--accent)",
                  color:"#fff", display:"flex", alignItems:"center", justifyContent:"center",
                  fontSize:20, fontWeight:900
                }}>
                  {(candidate.name || "?").charAt(0).toUpperCase()}
                </div>
                <div>
                  <p style={{ fontWeight:800, fontSize:16, color:"var(--text)", margin:0 }}>{candidate.name}</p>
                  <p style={{ fontSize:12, color:"var(--text-2)", margin:0 }}>{candidate.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                style={{ background:"var(--bg)", border:"1px solid var(--border)", borderRadius:10, padding:8, cursor:"pointer", display:"flex" }}
              >
                <X size={16} style={{ color:"var(--text-2)" }} />
              </button>
            </div>

            {/* Score ring */}
            <div style={{ padding:"28px", textAlign:"center", borderBottom:"1px solid var(--border)" }}>
              <div style={{ position:"relative", width:120, height:120, margin:"0 auto 16px" }}>
                <svg viewBox="0 0 120 120" style={{ transform:"rotate(-90deg)" }}>
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--border)" strokeWidth="10" />
                  <motion.circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={score >= 85 ? "#10b981" : score >= 60 ? "#f59e0b" : "#ef4444"}
                    strokeWidth="10" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 50 }}
                    animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - score / 100) }}
                    transition={{ duration: 1.2, ease:"easeOut" }}
                  />
                </svg>
                <div style={{ position:"absolute", inset:0, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center" }}>
                  <span style={{ fontSize:26, fontWeight:900, color:"var(--text)" }}>{score}%</span>
                  <span style={{ fontSize:10, color:"var(--text-2)", fontWeight:700 }}>ATS Score</span>
                </div>
              </div>
              <p style={{ fontSize:12, color:"var(--text-2)" }}>
                {score >= 85 ? "🔥 Excellent match" : score >= 60 ? "⚡ Good match" : "📝 Needs review"}
              </p>
            </div>

            {/* Info fields */}
            <div style={{ padding:"20px 28px" }}>
              {[
                { icon: Mail,     label:"Email",    value: candidate.email },
                { icon: MapPin,   label:"Role",     value: candidate.role ?? candidate.job_role },
                { icon: Calendar, label:"Applied",  value: candidate.created_at ? new Date(candidate.created_at).toLocaleDateString() : "N/A" },
              ].map((field, i) => {
                const Icon = field.icon
                return (
                  <div key={i} style={{ display:"flex", alignItems:"center", gap:12, padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                    <Icon size={14} style={{ color:"var(--accent)", flexShrink:0 }} />
                    <div>
                      <p style={{ fontSize:10, fontWeight:700, color:"var(--text-2)", textTransform:"uppercase", letterSpacing:".06em", margin:0 }}>{field.label}</p>
                      <p style={{ fontSize:13, fontWeight:600, color:"var(--text)", margin:0 }}>{field.value ?? "—"}</p>
                    </div>
                  </div>
                )
              })}

              {skills.length > 0 && (
                <div style={{ marginTop:20 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"var(--text-2)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:10 }}>Skills</p>
                  <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                    {skills.map((s, i) => (
                      <span key={i} style={{
                        background:"rgba(99,102,241,.1)", color:"var(--accent)",
                        borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700,
                        border:"1px solid rgba(99,102,241,.2)"
                      }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {candidate.summary && (
                <div style={{ marginTop:20 }}>
                  <p style={{ fontSize:11, fontWeight:700, color:"var(--text-2)", textTransform:"uppercase", letterSpacing:".08em", marginBottom:8 }}>AI Summary</p>
                  <p style={{ fontSize:13, color:"var(--text)", lineHeight:1.7, background:"var(--bg)", borderRadius:10, padding:14 }}>
                    {candidate.summary}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

/* ────────────────────────────────────────────
   MAIN CANDIDATE TABLE
   ──────────────────────────────────────────── */
export default function CandidateTable({ limit, hideFilters }) {
  const { candidates: ctx, loading } = useDashboard()
  const [localSearch, setLocalSearch] = useState("")
  const [selected, setSelected] = useState(null)

  // Apply limit then local search for client-side filtering
  const base = limit ? ctx.slice(0, limit) : ctx
  const display = localSearch
    ? base.filter(c =>
        [c.name, c.email, c.role, c.job_role].some(f =>
          f && f.toLowerCase().includes(localSearch.toLowerCase())
        )
      )
    : base

  const scoreColor = s => s >= 85 ? "#10b981" : s >= 60 ? "#f59e0b" : "#ef4444"

  return (
    <div style={{ position:"relative" }}>
      {/* Local filter row */}
      {!hideFilters && (
        <div style={{ display:"flex", gap:12, padding:"16px 24px", borderBottom:"1px solid var(--border)", alignItems:"center" }}>
          <div style={{ position:"relative", flex:1 }}>
            <Search size={14} style={{ position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:"var(--text-2)" }} />
            <input
              className="input"
              style={{ paddingLeft:32, background:"var(--bg)", fontSize:13 }}
              placeholder="Filter candidates…"
              value={localSearch}
              onChange={e => setLocalSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-secondary" style={{ fontSize:12, padding:"7px 14px", whiteSpace:"nowrap" }}>
            <Filter size={13} /> Filters
          </button>
          <button className="btn btn-secondary" style={{ fontSize:12, padding:"7px 14px", whiteSpace:"nowrap" }}>
            <Download size={13} /> Export
          </button>
        </div>
      )}

      {/* Table */}
      <div style={{ overflowX:"auto", minHeight:280 }}>
        {loading && display.length === 0 ? (
          /* Skeleton */
          <div style={{ padding:24 }}>
            {[...Array(5)].map((_, i) => (
              <div key={i} style={{ display:"flex", gap:16, marginBottom:16 }}>
                <div className="skeleton" style={{ width:40, height:40, borderRadius:10, flexShrink:0 }} />
                <div style={{ flex:1 }}>
                  <div className="skeleton" style={{ width:"60%", height:14, marginBottom:6 }} />
                  <div className="skeleton" style={{ width:"40%", height:11 }} />
                </div>
              </div>
            ))}
          </div>
        ) : display.length === 0 ? (
          <div style={{ textAlign:"center", padding:"56px 24px", color:"var(--text-2)" }}>
            <Brain size={36} style={{ margin:"0 auto 12px", opacity:.3 }} />
            <p style={{ fontWeight:700, fontSize:14, color:"var(--text)" }}>No candidates found</p>
            <p style={{ fontSize:12 }}>Try adjusting your filters or uploading new resumes</p>
          </div>
        ) : (
          <table style={{ width:"100%", borderCollapse:"collapse" }}>
            <thead>
              <tr style={{ borderBottom:"1px solid var(--border)" }}>
                {["Candidate","Role","ATS Score","Status",""].map(h => (
                  <th key={h} style={{
                    padding:"12px 20px", textAlign: h===""?"right":"left",
                    fontSize:10, fontWeight:800, color:"var(--text-2)",
                    textTransform:"uppercase", letterSpacing:".1em", whiteSpace:"nowrap"
                  }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {display.map((c, idx) => {
                const score = c.score ?? c.ats_score ?? 0
                return (
                  <motion.tr
                    key={c.id ?? idx}
                    initial={{ opacity:0, x:-8 }}
                    animate={{ opacity:1, x:0 }}
                    transition={{ delay: idx * 0.04 }}
                    onClick={() => setSelected(c)}
                    style={{ cursor:"pointer", transition:"background .15s" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(99,102,241,.035)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    {/* Candidate */}
                    <td style={{ padding:"14px 20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:12 }}>
                        <div style={{
                          width:38, height:38, borderRadius:10,
                          background:"rgba(99,102,241,.12)", color:"var(--accent)",
                          display:"flex", alignItems:"center", justifyContent:"center",
                          fontWeight:900, fontSize:15
                        }}>
                          {(c.name||"?").charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p style={{ fontWeight:700, fontSize:13, color:"var(--text)", margin:0 }}>{c.name}</p>
                          <p style={{ fontSize:11, color:"var(--text-2)", margin:0 }}>{c.email}</p>
                        </div>
                      </div>
                    </td>
                    {/* Role */}
                    <td style={{ padding:"14px 20px" }}>
                      <p style={{ fontSize:13, color:"var(--text)", margin:0 }}>{c.role ?? c.job_role ?? "—"}</p>
                    </td>
                    {/* Score */}
                    <td style={{ padding:"14px 20px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                        <div style={{ flex:1, maxWidth:80, height:6, background:"var(--border)", borderRadius:99, overflow:"hidden" }}>
                          <motion.div
                            initial={{ width:0 }}
                            animate={{ width:`${score}%` }}
                            transition={{ delay: idx*0.04 + 0.2, duration:.6 }}
                            style={{ height:"100%", background: scoreColor(score), borderRadius:99 }}
                          />
                        </div>
                        <span style={{ fontSize:13, fontWeight:800, color: scoreColor(score) }}>{score}%</span>
                      </div>
                    </td>
                    {/* Status badge */}
                    <td style={{ padding:"14px 20px" }}>
                      <span style={{
                        padding:"3px 10px", borderRadius:99, fontSize:10, fontWeight:800,
                        border:`1px solid ${scoreColor(score)}`,
                        color: scoreColor(score),
                        background: `${scoreColor(score)}14`
                      }}>
                        {score >= 85 ? "Excellent" : score >= 60 ? "Good" : "Review"}
                      </span>
                    </td>
                    {/* Arrow */}
                    <td style={{ padding:"14px 20px", textAlign:"right" }}>
                      <ChevronRight size={15} style={{ color:"var(--text-2)", opacity:.4 }} />
                    </td>
                  </motion.tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>

      {/* Slide Panel */}
      {selected && <CandidatePanel candidate={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
