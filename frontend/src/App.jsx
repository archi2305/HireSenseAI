import { useState } from "react"
import RecentAnalyses from "./components/RecentAnalyses"
import Sidebar from "./components/sidebar"
import Header from "./components/Header"
import ResumeUpload from "./components/ResumeUpload"
import ResultCard from "./components/ResultCard"
import StatsCards from "./components/StatsCards"
import History from "./components/History"
import {
  ScoreHistoryChart,
  SectionScoresChart,
  ApplicationStatsChart
} from "./components/AnalyticsCharts"
import MyResumes from "./components/MyResumes"

function App() {
  const [page, setPage] = useState("dashboard")
  const [result, setResult] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([])

  const handleSearch = (value) => {
    setSearchQuery(value)
  }

  const addNotification = (message) => {
    setNotifications((prev) => [
      { id: Date.now(), message },
      ...prev.slice(0, 9),
    ])
  }

  return (

    <div className="flex min-h-screen bg-dashboard-gradient">

      {/* SIDEBAR */}

      <Sidebar active={page} onChange={setPage} />

      {/* MAIN CONTENT */}

      <div className="flex-1 flex flex-col">

        <Header
          search={searchQuery}
          onSearchChange={handleSearch}
          notifications={notifications}
        />
        <div className="p-6 space-y-6">

          {/* DASHBOARD */}

          {page === "dashboard" && (
            <>
              <StatsCards setPage={setPage} />

              <div className="grid grid-cols-2 gap-6 mt-6">
                <ScoreHistoryChart />
                <SectionScoresChart />
              </div>

              <div className="mt-6">
                <RecentAnalyses searchQuery={searchQuery} />
              </div>
            </>
          )}
          {/* UPLOAD RESUME */}

          {page === "analyzer" && (
            <>
              <ResumeUpload
                setResult={setResult}
                onAnalyzed={() =>
                  addNotification("Resume analyzed successfully • ATS score generated")
                }
              />

              {result && (
                <ResultCard result={result} />
              )}
            </>
          )}

          {/* ANALYTICS */}

          {page === "analytics" && (

            <div className="grid grid-cols-3 gap-6">

              <ScoreHistoryChart />

              <SectionScoresChart />

              <ApplicationStatsChart />

            </div>

          )}

          {/* HISTORY */}

          {page === "history" && (
            <History searchQuery={searchQuery} />
          )}

          {/* MY RESUMES (placeholder for now) */}

          {page === "resumes" && (
            <MyResumes searchQuery={searchQuery} />
          )}

        </div>

      </div>

    </div>

  )
}

export default App
