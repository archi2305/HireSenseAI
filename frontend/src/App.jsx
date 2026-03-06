import { useState } from "react"
import ResumeAnalyzer from "./components/ResumeAnalyzer"
import History from "./components/History"
import Sidebar from "./components/Sidebar"

function App() {

  const [page, setPage] = useState("analyze")

  return (

    <div className="flex">

      <Sidebar setPage={setPage} />

      <div className="flex-1 p-10 bg-gray-100 min-h-screen">

        {page === "analyze" && <ResumeAnalyzer />}

        {page === "history" && <History />}

      </div>

    </div>

  )

}

export default App