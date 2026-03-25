import React, { useState, useEffect, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  Sparkles, ArrowRight, Zap, Target, Search, Filter,
  Bell, Users, FileCheck, TrendingUp, CheckCircle,
  ArrowUpRight, ArrowDownRight, X, Plus, UploadCloud, 
  BarChart2, ChevronRight, Activity, AlertCircle, 
  Calendar, Star, Moon
} from "lucide-react"
import { useDashboard } from "../context/DashboardContext"
import StatsCards from "../components/StatsCards"
import AnalyticsCharts from "../components/AnalyticsCharts"
import CandidateTable from "../components/CandidateTable"
import ActivityFeed from "../components/ActivityFeed"
import axios from "axios"

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   INSIGHT CARDS (AI highlights)
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function InsightCards({ candidates }) {
  const total = candidates.length
  const highScore = candidates.filter(c => (c.score || c.ats_score || 0) >= 85).length
  const avgScore  = total
    ? Math.round(candidates.reduce((s, c) => s + (c.score || c.ats_score || 0), 0) / total)
    : 0

  const items = [
    {
      icon: Star, color: "#6366f1",
      label: "Top Match Rate",   value: `${avgScore}%`,
      sub: "Across all candidates",
    },
    {
      icon: Users, color: "#10b981",
      label: "High Performers",  value: highScore,
      sub: "Score ≥ 85%",
    },
    {
      icon: AlertCircle, color: "#f59e0b",
      label: "Needs Review",     value: Math.max(0, total - highScore),
      sub: "Below threshold",
    },
  ]

  return (
    <div style={{ display:"flex", gap:16, flexWrap:"wrap", marginBottom:32 }}>
      {items.map((it, i) => {
        const Icon = it.icon
        return (
          <motion.div
            key={i}
            initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }}
            transition={{ delay: i*0.08 }}
            style={{
              flex:"1 1 180px", minWidth:160,
              background:"var(--surface)", border:"1px solid var(--border)",
              borderRadius:14, padding:"18px 20px",
              boxShadow:"var(--shadow-sm)", cursor:"default",
              transition:"all .3s"
            }}
            whileHover={{ y:-3, boxShadow:"var(--shadow-md)" }}
          >
            <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:10 }}>
              <div style={{ background:`${it.color}18`, borderRadius:10, padding:8 }}>
                <Icon size={16} style={{ color:it.color }} />
              </div>
              <span style={{ fontSize:11, fontWeight:700, color:"var(--text-2)", textTransform:"uppercase", letterSpacing:".08em" }}>
                {it.label}
              </span>
            </div>
            <p style={{ fontSize:28, fontWeight:900, color:"var(--text)", lineHeight:1 }}>{it.value}</p>
            <p style={{ fontSize:11, color:"var(--text-2)", marginTop:4 }}>{it.sub}</p>
          </motion.div>
        )
      })}
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   GLOBAL FILTER BAR
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FilterBar({ search, onSearch, role, onRole, score, onScore }) {
  const roles = ["All Roles", "Frontend", "Backend", "AI/ML", "DevOps", "Design"]
  const scores = [
    { label:"All Scores", value:"" },
    { label:"≥ 90%", value:"90" },
    { label:"≥ 75%", value:"75" },
    { label:"≥ 60%", value:"60" },
  ]

  return (
    <motion.div
      initial={{ opacity:0, y:-8 }} animate={{ opacity:1, y:0 }}
      style={{
        display:"flex", flexWrap:"wrap", alignItems:"center", gap:12,
        background:"var(--surface)", border:"1px solid var(--border)",
        borderRadius:14, padding:"12px 18px",
        boxShadow:"var(--shadow-sm)", marginBottom:28
      }}
    >
      {/* Search */}
      <div style={{ position:"relative", flex:"1 1 220px" }}>
        <Search size={15} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"var(--text-2)" }} />
        <input
          className="input"
          style={{ paddingLeft:34, fontSize:13 }}
          placeholder="Search candidates, roles, skills…"
          value={search}
          onChange={e => onSearch(e.target.value)}
        />
      </div>

      {/* Role pills */}
      <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
        {roles.map(r => (
          <button
            key={r}
            className="filter-chip"
            style={role === (r==="All Roles"?"":r) ? { background:"var(--accent)", borderColor:"var(--accent)", color:"#fff" } : {}}
            onClick={() => onRole(r === "All Roles" ? "" : r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Score select */}
      <select
        className="input"
        style={{ width:"auto", paddingRight:32, fontSize:12, cursor:"pointer" }}
        value={score}
        onChange={e => onScore(e.target.value)}
      >
        {scores.map(s => <option key={s.label} value={s.value}>{s.label}</option>)}
      </select>
    </motion.div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   FLOATING ACTION BUTTON
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
function FAB({ navigate }) {
  const [open, setOpen] = useState(false)
  const actions = [
    { icon: UploadCloud, label:"Upload Resume",   onClick:() => navigate("/analyzer") },
    { icon: Users,       label:"View Candidates", onClick:() => navigate("/candidates") },
    { icon: BarChart2,   label:"Analytics",       onClick:() => navigate("/history") },
  ]

  return (
    <div style={{ position:"fixed", bottom:32, right:32, zIndex:99, display:"flex", flexDirection:"column", alignItems:"flex-end", gap:12 }}>
      <AnimatePresence>
        {open && actions.map((a, i) => {
          const Icon = a.icon
          return (
            <motion.button
              key={i}
              initial={{ opacity:0, y:16, scale:.8 }} animate={{ opacity:1, y:0, scale:1 }}
              exit={{ opacity:0, y:8, scale:.8 }}
              transition={{ delay: (actions.length-1-i)*0.06 }}
              onClick={() => { a.onClick(); setOpen(false) }}
              style={{
                display:"flex", alignItems:"center", gap:10,
                background:"var(--surface)", border:"1px solid var(--border)",
                borderRadius:12, padding:"10px 18px",
                fontSize:13, fontWeight:700, color:"var(--text)",
                cursor:"pointer", boxShadow:"var(--shadow-md)",
                whiteSpace:"nowrap"
              }}
            >
              <Icon size={16} style={{ color:"var(--accent)" }} /> {a.label}
            </motion.button>
          )
        })}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale:1.08 }} whileTap={{ scale:.94 }}
        onClick={() => setOpen(o => !o)}
        style={{
          width:52, height:52, borderRadius:"50%",
          background:"var(--accent)", color:"#fff",
          border:"none", cursor:"pointer",
          display:"flex", alignItems:"center", justifyContent:"center",
          boxShadow:"0 4px 24px rgba(99,102,241,.4)",
          fontSize:24
        }}
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration:.2 }}>
          <Plus size={22} />
        </motion.div>
      </motion.button>
    </div>
  )
}

/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
   MAIN DASHBOARD
   ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
export default function Dashboard() {
  const navigate  = useNavigate()
  const {
    candidates, loading,
    searchTerm,   setSearchTerm,
    roleFilter,   setRoleFilter,
    minScoreFilter, setMinScoreFilter,
  } = useDashboard()

  return (
    <div style={{ padding:"32px 40px", maxWidth:1700, margin:"0 auto", minHeight:"100vh", position:"relative" }}>
      <FAB navigate={navigate} />

      {/* ── Hero Banner ── */}
      <motion.div
        initial={{ opacity:0, y:-16 }} animate={{ opacity:1, y:0 }}
        style={{
          display:"flex", flexWrap:"wrap", alignItems:"center",
          justifyContent:"space-between", gap:20,
          background:"var(--surface)", border:"1px solid var(--border)",
          borderRadius:20, padding:"28px 36px",
          boxShadow:"var(--shadow-sm)", marginBottom:28, position:"relative", overflow:"hidden"
        }}
      >
        <div style={{ position:"absolute", top:-60, right:-60, width:320, height:320,
          background:"radial-gradient(circle, rgba(99,102,241,.07) 0%, transparent 70%)",
          pointerEvents:"none"
        }} />
        <div style={{ position:"relative" }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:8 }}>
            <Sparkles size={14} style={{ color:"var(--accent)" }} />
            <span style={{ fontSize:11, fontWeight:800, color:"var(--accent)", textTransform:"uppercase", letterSpacing:".15em" }}>
              AI Prediction Engine
            </span>
          </div>
          <h1 style={{ fontSize:32, fontWeight:900, color:"var(--text)", letterSpacing:"-.02em", lineHeight:1.1, margin:0 }}>
            Recruitment{" "}
            <span style={{ color:"var(--accent)" }}>Intelligence</span>
          </h1>
          <p style={{ fontSize:14, color:"var(--text-2)", marginTop:8, maxWidth:520, lineHeight:1.6 }}>
            Automate your talent acquisition pipeline with semantic matching, real-time analytics and predictive hiring models.
          </p>
        </div>
        <div style={{ display:"flex", gap:12, position:"relative" }}>
          <button className="btn btn-secondary" onClick={() => navigate("/history")}>
            Audit Logs <ArrowRight size={14} />
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
            <Zap size={14} /> New Extraction
          </button>
        </div>
      </motion.div>

      {/* ── Insight Strip ── */}
      <InsightCards candidates={candidates} />

      {/* ── Filter Bar ── */}
      <FilterBar
        search={searchTerm}   onSearch={setSearchTerm}
        role={roleFilter}     onRole={setRoleFilter}
        score={minScoreFilter} onScore={setMinScoreFilter}
      />

      {/* ── Stats Cards ── */}
      <div style={{ marginBottom:32 }}>
        <StatsCards />
      </div>

      {/* ── Main 3-col grid ── */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 340px", gap:28 }}>

        {/* Charts */}
        <div style={{ gridColumn:"1 / 3" }}>
          <AnalyticsCharts />
        </div>

        {/* Activity Feed */}
        <div style={{ gridColumn:"3 / 4" }}>
          <ActivityFeed />
        </div>

        {/* Candidate Table – full width */}
        <div style={{ gridColumn:"1 / 4" }}>
          <div className="card" style={{ overflow:"hidden" }}>
            <div style={{
              padding:"16px 24px", borderBottom:"1px solid var(--border)",
              display:"flex", alignItems:"center", justifyContent:"space-between",
              background:"var(--bg)"
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                <Target size={16} style={{ color:"var(--accent)" }} />
                <span style={{ fontWeight:800, fontSize:14, color:"var(--text)", textTransform:"uppercase", letterSpacing:".05em" }}>
                  Global Candidate Feed
                </span>
                {!loading && (
                  <span style={{ background:"var(--accent)", color:"#fff", borderRadius:99, fontSize:10, fontWeight:800, padding:"2px 8px" }}>
                    {candidates.length}
                  </span>
                )}
              </div>
              <button className="btn btn-secondary" style={{ fontSize:12, padding:"6px 14px" }} onClick={() => navigate("/candidates")}>
                View All <ChevronRight size={13} />
              </button>
            </div>
            <CandidateTable limit={8} hideFilters={true} />
          </div>
        </div>
      </div>
    </div>
  )
}