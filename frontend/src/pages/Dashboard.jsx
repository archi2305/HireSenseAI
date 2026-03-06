import Sidebar from "../components/Sidebar"
import ResumeAnalyzer from "../components/ResumeAnalyzer"

function Dashboard() {
  return (
    <div className="flex">

      <Sidebar />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        <h1 className="text-3xl font-bold mb-6">
          Dashboard
        </h1>

        <ResumeAnalyzer />

      </div>

    </div>
  )
}

export default Dashboard