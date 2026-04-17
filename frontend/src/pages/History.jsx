import { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import axios from "axios"
import { ArrowRight, Briefcase, Search } from "lucide-react"
import toast from "react-hot-toast"
import ActivityFeed from "../components/ActivityFeed"
import CandidateTable from "../components/CandidateTable"
import { useAnalysis } from "../context/AnalysisContext"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

function History() {
  const navigate = useNavigate()
  const { setAnalysisResult } = useAnalysis()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analysis`)
        setAnalyses(response.data || [])
      } catch (error) {
        console.error("Failed to fetch history API", error)
        toast.error("Unable to fetch parsed resumes")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  const filteredAnalyses = useMemo(() => {
    if (!search.trim()) return analyses
    const q = search.toLowerCase()
    return analyses.filter((item) =>
      [item?.candidate, item?.job_role, item?.id, `${item?.ats_score ?? ""}`]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    )
  }, [analyses, search])

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1280, margin: "0 auto", display: "grid", gap: 18 }}>
      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
            History
          </p>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Pipeline Activity and Resume Archive</h1>
        </div>
        <div style={{ position: "relative", minWidth: 280 }}>
          <Search size={14} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "var(--text-2)" }} />
          <input
            className="input"
            style={{ paddingLeft: 32 }}
            placeholder="Search history..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="card" style={{ padding: 16 }}>
        <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Live stream</p>
        <ActivityFeed />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Candidate feed</p>
        <CandidateTable searchQuery={search} />
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ margin: 0, fontWeight: 800 }}>Parsed resumes list</p>
          <button className="btn btn-secondary" onClick={() => navigate("/analyzer")}>
            New Extraction
          </button>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Candidate", "Role", "ATS", "Date", ""].map((header) => (
                  <th
                    key={header}
                    style={{
                      textAlign: header ? "left" : "right",
                      padding: "10px 12px",
                      color: "var(--text-2)",
                      fontSize: 10,
                      textTransform: "uppercase",
                      letterSpacing: ".08em",
                    }}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {!loading && filteredAnalyses.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 18, color: "var(--text-2)", fontSize: 13 }}>
                    No parsed resumes found.
                  </td>
                </tr>
              )}

              {filteredAnalyses.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Briefcase size={14} style={{ color: "var(--accent)" }} />
                      {item.candidate || "Unknown Candidate"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.job_role || "N/A"}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.ats_score ?? 0}%</td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.date || "N/A"}</td>
                  <td style={{ padding: "12px 12px", textAlign: "right" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px" }}
                      onClick={() => {
                        setAnalysisResult(item)
                        navigate("/results")
                      }}
                    >
                      Open
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default History