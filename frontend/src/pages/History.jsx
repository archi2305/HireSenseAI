import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { ArrowRight, Briefcase, Search } from "lucide-react"
import toast from "react-hot-toast"
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts"
import { useAnalysis } from "../context/AnalysisContext"
import { fetchAnalysesHistory } from "../services/analysisService"

function History() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialQuery = searchParams.get("q") || ""
  const { setHistory } = useAnalysis()
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState(initialQuery)
  const [compareA, setCompareA] = useState("")
  const [compareB, setCompareB] = useState("")

  useEffect(() => {
    setSearch(initialQuery)
  }, [initialQuery])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const records = await fetchAnalysesHistory()
        setAnalyses(records || [])
        setHistory(records || [])
      } catch (error) {
        console.error("Failed to fetch history API", error)
        toast.error("Unable to fetch previous analyses")
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [setHistory])

  const filteredAnalyses = useMemo(() => {
    if (!search.trim()) return analyses
    const q = search.toLowerCase()
    return analyses.filter((item) =>
      [item?.resume_name, item?.job_role, item?.id, `${item?.ats_score ?? ""}`]
        .filter(Boolean)
        .some((field) => String(field).toLowerCase().includes(q))
    )
  }, [analyses, search])

  const trendData = useMemo(
    () =>
      [...analyses]
        .reverse()
        .map((item, idx) => ({
          name: `Run ${idx + 1}`,
          score: Number(item.ats_score || 0),
        })),
    [analyses]
  )

  const compareResult = useMemo(() => {
    const first = analyses.find((item) => String(item.id) === String(compareA))
    const second = analyses.find((item) => String(item.id) === String(compareB))
    if (!first || !second) return null
    const delta = Number(second.ats_score || 0) - Number(first.ats_score || 0)
    return { first, second, delta }
  }, [analyses, compareA, compareB])

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1280, margin: "0 auto", display: "grid", gap: 18 }}>
      <div className="card" style={{ padding: 24, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".08em", marginBottom: 6 }}>
            History
          </p>
          <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Previous Analyses</h1>
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
        <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Score trend</p>
        {trendData.length === 0 ? (
          <p style={{ margin: 0, color: "var(--text-2)", fontSize: 13 }}>Not enough data to plot trend.</p>
        ) : (
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" stroke="var(--text-2)" />
                <YAxis stroke="var(--text-2)" />
                <Tooltip />
                <Line dataKey="score" stroke="var(--accent)" strokeWidth={3} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <p style={{ margin: "0 0 10px", fontWeight: 800 }}>Compare old vs new resume</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
          <select className="input" value={compareA} onChange={(e) => setCompareA(e.target.value)}>
            <option value="">Select older analysis</option>
            {analyses.map((item) => (
              <option key={`old-${item.id}`} value={item.id}>
                #{item.id} · {item.resume_name}
              </option>
            ))}
          </select>
          <select className="input" value={compareB} onChange={(e) => setCompareB(e.target.value)}>
            <option value="">Select newer analysis</option>
            {analyses.map((item) => (
              <option key={`new-${item.id}`} value={item.id}>
                #{item.id} · {item.resume_name}
              </option>
            ))}
          </select>
        </div>
        {compareResult ? (
          <p style={{ margin: "10px 0 0", fontSize: 13, color: compareResult.delta >= 0 ? "var(--success)" : "var(--error)" }}>
            Score change: {compareResult.first.ats_score}% → {compareResult.second.ats_score}% ({compareResult.delta >= 0 ? "+" : ""}
            {compareResult.delta.toFixed(1)}%)
          </p>
        ) : null}
      </div>

      <div className="card" style={{ padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <p style={{ margin: 0, fontWeight: 800 }}>Resume analysis history</p>
          <button className="btn btn-secondary" onClick={() => navigate("/analyzer")}>
            Upload Resume
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
                    No data yet. Upload your first resume.
                  </td>
                </tr>
              )}

              {filteredAnalyses.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid var(--border)" }}>
                  <td style={{ padding: "12px 12px", fontSize: 13, fontWeight: 600 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Briefcase size={14} style={{ color: "var(--accent)" }} />
                      {item.resume_name || "Unknown Resume"}
                    </div>
                  </td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.job_role || "N/A"}</td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.ats_score ?? 0}%</td>
                  <td style={{ padding: "12px 12px", fontSize: 13 }}>{item.date || "N/A"}</td>
                  <td style={{ padding: "12px 12px", textAlign: "right" }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: "6px 12px" }}
                      onClick={() => navigate(`/results/${item.id}`)}
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