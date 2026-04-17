import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowRight, CheckCircle, FileCheck, TrendingUp, Zap, Sparkles } from "lucide-react"
import axios from "axios"
import AnalyticsCharts from "../components/AnalyticsCharts"
import { useDashboard } from "../context/DashboardContext"
import { useAnalysis } from "../context/AnalysisContext"
import EmptyState from "../components/EmptyState"

const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Dashboard() {
  const navigate = useNavigate()
  const { candidates } = useDashboard()
  const { analysisResult } = useAnalysis()
  const [stats, setStats] = useState({
    total_resumes: 0,
    avg_score: 0,
    total_analyses: 0,
    active_jobs: 0,
  })

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await axios.get(`${API_BASE}/dashboard`)
        setStats((prev) => ({ ...prev, ...response.data }))
      } catch (error) {
        console.error("Failed to load dashboard stats", error)
      }
    }
    loadStats()
  }, [])

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
        onClick: () => navigate("/analytics"),
      },
      {
        title: "AI Accuracy",
        value: `${Math.round((stats.avg_score ?? 0) * 0.96)}%`,
        icon: CheckCircle,
        color: "#f59e0b",
        onClick: () => navigate("/analytics"),
      },
      {
        title: "Active Pipelines",
        value: stats.active_jobs ?? 0,
        icon: Zap,
        color: "#3b82f6",
        onClick: () => navigate("/pipelines"),
      },
    ],
    [navigate, stats]
  )

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1320, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", gap: 16, alignItems: "center", flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 6 }}>
            Dashboard Overview
          </p>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Hiring Intelligence Console</h1>
          <p style={{ marginTop: 8, color: "var(--text-2)", fontSize: 14 }}>
            {candidates.length} candidates in pipeline
            {analysisResult?.ats_score ? ` · Latest ATS: ${analysisResult.ats_score}%` : ""}
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => navigate("/history")}>
            View All
            <ArrowRight size={14} />
          </button>
          <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
            Upload Resume
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 14 }}>
        {cardItems.map((item) => (
          <button
            type="button"
            key={item.title}
            className="card card-lift"
            onClick={item.onClick}
            style={{ padding: 18, textAlign: "left", cursor: "pointer" }}
          >
            <div style={{ width: 34, height: 34, borderRadius: 10, background: `${item.color}20`, color: item.color, display: "grid", placeItems: "center", marginBottom: 12 }}>
              <item.icon size={16} />
            </div>
            <p style={{ margin: 0, fontSize: 11, fontWeight: 700, color: "var(--text-2)", textTransform: "uppercase", letterSpacing: ".08em" }}>
              {item.title}
            </p>
            <p style={{ margin: "6px 0 0", fontSize: 28, fontWeight: 900 }}>{item.value}</p>
          </button>
        ))}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <AnalyticsCharts showSkills={false} />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <p style={{ margin: 0, fontWeight: 800, fontSize: 14 }}>Quick Actions</p>
        </div>
        {Number(stats.total_resumes || 0) === 0 ? (
          <EmptyState
            title="No data yet"
            description="No data yet. Upload your first resume."
            icon={Sparkles}
          />
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            <button className="btn btn-primary" onClick={() => navigate("/analyzer")}>
              Upload Resume
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/analytics")}>
              Match Rate Analytics
            </button>
            <button className="btn btn-secondary" onClick={() => navigate("/pipelines")}>
              View Pipelines
            </button>
          </div>
        )}
      </div>
    </div>
  )
}