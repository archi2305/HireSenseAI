import { useEffect, useMemo, useState } from "react"
import { useLocation } from "react-router-dom"
import axios from "axios"
import { Search } from "lucide-react"
import EmptyState from "../components/EmptyState"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"

const useQuery = () => new URLSearchParams(useLocation().search)

export default function SearchResults() {
  const queryParams = useQuery()
  const q = (queryParams.get("q") || "").trim()
  const [candidates, setCandidates] = useState([])
  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!q) {
      setCandidates([])
      setAnalyses([])
      return
    }

    let cancelled = false
    const fetchResults = async () => {
      setLoading(true)
      try {
        const [candidateRes, analysesRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/candidates?search=${encodeURIComponent(q)}`),
          axios.get(`${API_BASE_URL}/analyses`),
        ])
        if (cancelled) return
        setCandidates(candidateRes.data || [])

        const lower = q.toLowerCase()
        const filteredAnalyses = (analysesRes.data || []).filter((item) => {
          const values = [item.resume_name, item.job_role].filter(Boolean).join(" ").toLowerCase()
          return values.includes(lower)
        })
        setAnalyses(filteredAnalyses)
      } catch (error) {
        if (!cancelled) {
          setCandidates([])
          setAnalyses([])
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchResults()
    return () => {
      cancelled = true
    }
  }, [q])

  const groupedSkills = useMemo(() => {
    const count = new Map()
    candidates.forEach((item) => {
      ;(item.skills || []).forEach((skill) => {
        const key = String(skill || "").trim()
        if (!key) return
        count.set(key, (count.get(key) || 0) + 1)
      })
    })
    return [...count.entries()].map(([name, total]) => ({ name, total })).slice(0, 8)
  }, [candidates])

  return (
    <div style={{ padding: "32px 40px", maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>
      <div className="card" style={{ padding: 24 }}>
        <p style={{ fontSize: 11, fontWeight: 800, color: "var(--accent)", textTransform: "uppercase", letterSpacing: ".09em", marginBottom: 8 }}>
          Search
        </p>
        <h1 style={{ margin: 0, fontSize: 30, fontWeight: 900 }}>Search Results</h1>
        <p style={{ margin: "8px 0 0", color: "var(--text-2)" }}>{q ? `Query: "${q}"` : "Type a query in the global search bar."}</p>
      </div>

      {loading ? (
        <div className="card" style={{ padding: 18 }}>
          <p style={{ margin: 0, color: "var(--text-2)" }}>Searching...</p>
        </div>
      ) : !q || (candidates.length === 0 && analyses.length === 0 && groupedSkills.length === 0) ? (
        <div className="card" style={{ padding: 18 }}>
          <EmptyState
            title="No results found"
            description="No data yet. Upload your first resume."
            icon={Search}
          />
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 }}>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Candidates</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {candidates.slice(0, 8).map((item) => (
                <li key={`candidate-${item.id}`} style={{ marginBottom: 6 }}>
                  {item.name} ({item.role || "N/A"})
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Resumes</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {analyses.slice(0, 8).map((item) => (
                <li key={`resume-${item.id}`} style={{ marginBottom: 6 }}>
                  {item.resume_name} ({item.job_role || "N/A"})
                </li>
              ))}
            </ul>
          </div>
          <div className="card" style={{ padding: 16 }}>
            <h3 style={{ marginTop: 0 }}>Skills</h3>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {groupedSkills.map((item) => (
                <li key={`skill-${item.name}`} style={{ marginBottom: 6 }}>
                  {item.name} ({item.total})
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
