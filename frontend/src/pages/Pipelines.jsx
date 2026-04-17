import { useEffect, useState } from "react"
import axios from "axios"
import { Workflow } from "lucide-react"
import EmptyState from "../components/EmptyState"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const getPipelineStatus = (score) => {
  const numeric = Number(score || 0)
  if (numeric >= 80) return "completed"
  if (numeric >= 50) return "processing"
  return "queued"
}

export default function Pipelines() {
  const [pipelines, setPipelines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPipelines = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${API_BASE_URL}/candidates`)
        const normalized = (response.data || []).map((item) => ({
          id: item.id,
          name: item.name,
          role: item.role,
          score: item.ats_score,
          status: getPipelineStatus(item.ats_score),
        }))
        setPipelines(normalized)
      } catch (error) {
        setPipelines([])
      } finally {
        setLoading(false)
      }
    }
    fetchPipelines()
  }, [])

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1200, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 8 }}>
          Pipelines
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Active Processing Pipelines</h1>
      </div>

      <div className="card" style={{ padding: 18 }}>
        {loading ? (
          <p style={{ margin: 0, color: "var(--text-2)" }}>Loading pipelines...</p>
        ) : pipelines.length === 0 ? (
          <EmptyState
            title="No pipelines yet"
            description="No data yet. Upload your first resume."
            icon={Workflow}
          />
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Candidate</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Role</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>ATS</th>
                <th style={{ textAlign: "left", padding: "10px 12px" }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {pipelines.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px" }}>{item.name || "Unknown Candidate"}</td>
                  <td style={{ padding: "12px" }}>{item.role || "N/A"}</td>
                  <td style={{ padding: "12px" }}>{item.score ?? 0}%</td>
                  <td style={{ padding: "12px", textTransform: "capitalize" }}>{item.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
