import { useEffect, useState } from "react"
import axios from "axios"
import Sidebar from "../components/Sidebar"
import Header from "../components/Header"
import ResumeAnalyzer from "../components/ResumeAnalyzer"

const API_BASE_URL = "http://127.0.0.1:8001"

function Dashboard() {
  const [active, setActive] = useState("analyzer")
  const [search, setSearch] = useState("")
  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analyses`)
        setAnalyses(res.data || [])
      } catch (error) {
        console.error("Failed to load analyses", error)
      }
    }
    fetchAnalyses()
  }, [])

  const handleNewAnalysis = (analysis) => {
    setAnalyses((prev) => [analysis, ...prev])
  }

  const filteredAnalyses = analyses.filter((item) => {
    if (!search) return true
    const q = search.toLowerCase()
    const skills = [
      ...(item.matched_skills || []),
      ...(item.missing_skills || []),
    ].join(" ")
    return (
      skills.toLowerCase().includes(q) ||
      (item.suggestions || "").toLowerCase().includes(q) ||
      String(item.ats_score || "").includes(q)
    )
  })

  return (
    <div className="flex min-h-screen bg-dashboardBg">
      <Sidebar active={active} onChange={setActive} />

      <div className="flex-1 flex flex-col">
        <Header
          search={search}
          onSearchChange={setSearch}
          notifications={filteredAnalyses}
        />

        <main className="flex-1 p-6 md:p-8 space-y-6">
          {active === "analyzer" && (
            <ResumeAnalyzer onAnalysisCompleted={handleNewAnalysis} />
          )}

          {active === "history" && (
            <section className="bg-cardBg rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-4">
                Analysis History
              </h2>
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b text-slate-500">
                    <th className="py-2">ID</th>
                    <th>Resume</th>
                    <th>Role</th>
                    <th>ATS</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAnalyses.map((item) => (
                    <tr key={item.id} className="border-b last:border-0">
                      <td className="py-2 text-xs text-slate-500">
                        {item.id}
                      </td>
                      <td className="text-sm text-slate-800">
                        {item.resume_name}
                      </td>
                      <td className="text-sm text-slate-600">
                        {item.job_role}
                      </td>
                      <td className="text-sm font-semibold text-indigo-600">
                        {item.ats_score}%
                      </td>
                      <td className="text-xs text-slate-500">
                        {item.date &&
                          new Date(item.date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                  {filteredAnalyses.length === 0 && (
                    <tr>
                      <td
                        colSpan={5}
                        className="py-4 text-xs text-slate-500 text-center"
                      >
                        No analyses yet. Run a resume through the analyzer to
                        see history here.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </section>
          )}

          {active === "dashboard" && (
            <section className="bg-cardBg rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Overview
              </h2>
              <p className="text-sm text-slate-500">
                Use the sidebar to jump into the Resume Analyzer or view
                detailed history.
              </p>
            </section>
          )}

          {active === "settings" && (
            <section className="bg-cardBg rounded-2xl shadow-md p-6">
              <h2 className="text-lg font-semibold text-slate-900 mb-2">
                Settings
              </h2>
              <p className="text-sm text-slate-500">
                Settings are not wired to a backend yet, but this is where
                you&apos;d configure API keys, theme, and notification
                preferences.
              </p>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default Dashboard