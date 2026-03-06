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
        "http://127.0.0.1:8000/analysis",
        {
          headers: {
            "X-API-Key": "supersecretkey"
          }
        }
      )

      setAnalyses(response.data)

    } catch (error) {

      console.error(error)

    }

  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-4">
        Resume Analysis History
      </h2>

      <table className="w-full text-left">

        <thead>

          <tr className="border-b text-gray-500">

            <th className="py-2">ID</th>
            <th>ATS Score</th>
            <th>Matched</th>
            <th>Missing</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {analyses.map((item) => (

            <tr key={item.id} className="border-b">

              <td className="py-2">{item.id}</td>

              <td className="font-semibold text-green-600">
                {item.ats_score}%
              </td>

              <td>{item.matched_skills.length}</td>

              <td>{item.missing_skills.length}</td>

              <td>
                {new Date(item.created_at).toLocaleDateString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

export default History