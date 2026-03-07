import { useState } from "react"
import RecentAnalyses from "./components/RecentAnalyses"
import Sidebar from "./components/Sidebar"
import DashboardHeader from "./components/DashboardHeader"
import ResumeUpload from "./components/ResumeUpload"
import ResultCard from "./components/ResultCard"
import StatsCards from "./components/StatsCards"
import History from "./components/History"
import { ScoreHistoryChart, SectionScoresChart, ApplicationStatsChart } from "./components/AnalyticsCharts"

function App() {

  const [page, setPage] = useState("upload")
  const [result, setResult] = useState(null)

  return (

    <div className="flex bg-gray-100 min-h-screen">

      {/* SIDEBAR */}

      <Sidebar setPage={setPage} />

      {/* MAIN CONTENT */}

      <div className="flex-1">

        <DashboardHeader />

        <div className="p-6 space-y-6">

          {/* DASHBOARD */}

{page === "dashboard" && (
  <>

    <StatsCards />

    <div className="grid grid-cols-2 gap-6 mt-6">

      <ScoreHistoryChart />

      <SectionScoresChart />

    </div>

    <div className="mt-6">
      <RecentAnalyses />
    </div>

  </>
)}

          {/* UPLOAD RESUME */}

          {page === "upload" && (
            <>
              <ResumeUpload setResult={setResult} />

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
            <History />
          )}

          {/* MY RESUMES (placeholder for now) */}

          {page === "resumes" && (
            <div className="bg-white p-6 rounded-xl shadow-md">
              <h2 className="text-xl font-semibold mb-2">
                My Resumes
              </h2>

              <p className="text-gray-500">
                Resume management feature coming soon.
              </p>
            </div>
          )}

        </div>

      </div>

    </div>

  )
}

export default App