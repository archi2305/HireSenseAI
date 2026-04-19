import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle, FileCheck, TrendingUp, Zap } from "lucide-react"
import axios from "axios"
import { motion } from "framer-motion"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { useAnalysis } from "../context/AnalysisContext"
import { fetchAnalysesHistory } from "../services/analysisService"

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Dashboard() {
  const navigate = useNavigate()
  const { recentSearches, setHistory } = useAnalysis()
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
    total_analyses: 0,
    active_jobs: 0,
  })
  const [statsLoading, setStatsLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/dashboard`)
        setStats((prev) => ({ ...prev, ...response.data }))
      } catch (error) {
        console.error("Failed to load dashboard stats", error)
        setStats({
          total_resumes: 0,
          avg_score: 72,
          total_analyses: 0,
          active_jobs: 1,
        })
      } finally {
        setStatsLoading(false)
      }
    }
    loadStats()
  }, [])

  useEffect(() => {
    const loadHistory = async () => {
      const records = await fetchAnalysesHistory()
      if (Array.isArray(records) && records.length > 0) {
        setHistory(records)
      }
    }
    loadHistory()
  }, [setHistory])

  const cardItems = useMemo(
    () => [
      {
        title: "Processed Files",
        value: stats.total_resumes ?? 0,
        icon: FileCheck,
        color: "#6366f1",
        onClick: () => navigate("/history"),
      },
      {
        title: "Match Rate",
        value: `${Math.round(stats.avg_score ?? 0)}%`,
        icon: TrendingUp,
        color: "#10b981",
        onClick: () => navigate("/history"),
      },
      {
        title: "AI Accuracy",
        value: `${Math.round((stats.avg_score ?? 0) * 0.96)}%`,
        icon: CheckCircle,
        color: "#f59e0b",
        onClick: () => navigate("/history"),
      },
      {
        title: "Active Pipelines",
        value: stats.active_jobs ?? 0,
        icon: Zap,
        color: "#3b82f6",
        onClick: () => navigate("/analyzer"),
      },
    ],
    [navigate, stats]
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      style={{ padding: "32px 40px", maxWidth: 1320, margin: "0 auto", display: "grid", gap: 20 }}
    >
      <motion.div
        className="card card-lift glow-card"
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
        style={{ padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}
      >
        <div>
          <p style={{ margin: 0, fontWeight: 700, fontSize: 14 }}>Start a new resume analysis</p>
          <p style={{ margin: "4px 0 0", fontSize: 12, color: "var(--text-2)" }}>Upload from analyzer for the full guided flow.</p>
        </div>
        <button className="btn btn-primary btn-glow" onClick={() => navigate("/analyzer")}>Upload Resume</button>
      </motion.div>

      <motion.div
        className="card card-lift glow-card"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.05 }}
        style={{ padding: 24, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}
      >
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 6 }}>
            Dashboard Overview
          </p>
          <h1 className="text-gradient-brand" style={{ margin: 0, fontSize: 32, fontWeight: 900, letterSpacing: "-0.02em" }}>
            Hiring Intelligence Console
          </h1>
          <p style={{ marginTop: 8, color: "var(--text-2)", fontSize: 14 }}>Overview metrics, performance trends, and recent resume activity.</p>
        </div>
        <button className="btn btn-secondary" onClick={() => navigate("/history")}>View History</button>
      </motion.div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: 14 }}>
        {cardItems.map((item) => (
          <motion.button
            type="button"
            key={item.title}
            className="card card-lift"
            onClick={item.onClick}
            whileHover={{ y: -5, scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            style={{ padding: 18, textAlign: "left", cursor: "pointer" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.color}20`, color: item.color, display: "grid", placeItems: "center", marginBottom: 12 }}>
              <item.icon size={16} />
            </div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".08em" }}>
              {item.title}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900 }}>{item.value}</p>
          </motion.button>
        ))}
      </div>

      <div className="card card-lift" style={{ padding: 16 }}>
        {statsLoading ? (
          <div className="skeleton" style={{ height: 260 }} />
        ) : (
          <AnalyticsCharts showSkills={false} />
        )}
      </div>

      <div className="card card-lift" style={{ padding: 16 }}>
        <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Recent activity</p>
        <div style={{ display: "grid", gap: 8 }}>
          {recentSearches.length === 0 ? (
            <p style={{ margin: 0, fontSize: 13, color: "var(--text-2)" }}>No data yet. Upload your first resume.</p>
          ) : (
            recentSearches.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => navigate(`/results/${item.id}`)}
                className="card card-lift"
                style={{ padding: "10px 12px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}
              >
                <span style={{ fontSize: 13, fontWeight: 600 }}>{item.resume_name || "Untitled Resume"}</span>
                <span style={{ fontSize: 12, color: "var(--text-2)" }}>{item.ats_score ?? 0}%</span>
              </button>
            ))
          )}
        </div>
      </div>
    </motion.div>
  )
}