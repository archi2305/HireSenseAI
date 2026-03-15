import { useEffect, useState } from "react"
import axios from "axios"

function History() {

  const [analyses, setAnalyses] = useState([])

  useEffect(() => {
    fetchHistory()
  }, [])

  const fetchHistory = async () => {
    try {

      const response = await axios.get(
        "http://127.0.0.1:8000/analysis"
      )

      setAnalyses(response.data)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="p-10">

      <h1 className="text-3xl font-bold mb-6">
        Analysis History
      </h1>

      <div className="space-y-4">

        {analyses.map((item) => (
          <div
            key={item.id}
            className="bg-white p-4 rounded-lg shadow"
          >

            <h3 className="font-semibold">
              ATS Score: {item.ats_score}%
            </h3>

            <p className="text-sm text-gray-500">
              ID: {item.id}
            </p>

          </div>
        ))}

      </div>

    </div>
  )
}

export default History