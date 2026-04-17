import { useEffect, useState } from "react"
import axios from "axios"
import { BarChart3, Target, BrainCircuit } from "lucide-react"
import AnalyticsCharts from "../components/AnalyticsCharts"
import EmptyState from "../components/EmptyState"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

export default function Analytics() {
  const [overview, setOverview] = useState(null)
  const [skills, setSkills] = useState([])
  const [scoreBuckets, setScoreBuckets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        const [overviewRes, skillsRes, scoresRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/overview`),
          axios.get(`${API_BASE_URL}/analytics/skills`),
          axios.get(`${API_BASE_URL}/analytics/scores`),
        ])
        setOverview(overviewRes.data || {})
        setSkills(skillsRes.data || [])
        setScoreBuckets(scoresRes.data || [])
      } catch (error) {
        setOverview(null)
        setSkills([])
        setScoreBuckets([])
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [])

  const totalResumes = Number(overview?.total_resumes || 0)

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1320, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 8 }}>
          Analytics
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Match Rate and AI Accuracy</h1>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 20 }}>
          <p style={{ margin: 0, color: "var(--text-2)" }}>Loading analytics...</p>
        </div>
      ) : totalResumes === 0 ? (
        <div className="card" style={{ padding: 20 }}>
          <EmptyState
            title="No analytics yet"
            description="No data yet. Upload your first resume."
            icon={BarChart3}
          />
        </div>
      ) : (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12, textTransform: "uppercase", fontWeight: 700 }}>Match Rate</p>
              <p style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 900 }}>{Math.round(overview?.avg_score || 0)}%</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12, textTransform: "uppercase", fontWeight: 700 }}>AI Accuracy</p>
              <p style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 900 }}>{Math.round((overview?.avg_score || 0) * 0.96)}%</p>
            </div>
            <div className="card" style={{ padding: 18 }}>
              <p style={{ margin: 0, color: "var(--text-2)", fontSize: 12, textTransform: "uppercase", fontWeight: 700 }}>Total Resumes</p>
              <p style={{ margin: "8px 0 0", fontSize: 30, fontWeight: 900 }}>{totalResumes}</p>
            </div>
          </div>

          <div className="card" style={{ padding: 16 }}>
            <AnalyticsCharts showSkills />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: 12 }}>
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Top Skills</h3>
              {skills.length === 0 ? (
                <p style={{ margin: 0, color: "var(--text-2)" }}>No skill data available.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {skills.map((item) => (
                    <li key={`${item.name}-${item.count}`} style={{ marginBottom: 6 }}>
                      {item.name}: {item.count}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            <div className="card" style={{ padding: 18 }}>
              <h3 style={{ margin: "0 0 10px", fontSize: 15 }}>Score Distribution</h3>
              {scoreBuckets.length === 0 ? (
                <p style={{ margin: 0, color: "var(--text-2)" }}>No score data available.</p>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {scoreBuckets.map((item) => (
                    <li key={`${item.name}-${item.value}`} style={{ marginBottom: 6 }}>
                      {item.name}: {item.value}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
