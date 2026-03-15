import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE_URL = "http://127.0.0.1:8001"

function History({ searchQuery = "" }) {

  const [analyses, setAnalyses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analyses`)
        setAnalyses(response.data || [])
      } catch (err) {
        console.error("Failed to load history", err)
        setError("Failed to load")
      } finally {
        setLoading(false)
      }
    }

    fetchHistory()
  }, [])

  const query = (searchQuery || "").toLowerCase()
  const filtered = analyses.filter((item) => {
    const resume = (item.resume_name || "").toLowerCase()
    const role = (item.job_role || "").toLowerCase()
    return resume.includes(query) || role.includes(query)
  })

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-xl font-semibold mb-4">
        Resume Analysis History
      </h2>

      {loading && (
        <p className="text-gray-500 text-sm">Loading...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      <table className="w-full text-left">

        <thead>

          <tr className="border-b text-gray-500">

            <th className="py-2">ID</th>
            <th>Resume</th>
            <th>Job Role</th>
            <th>ATS Score</th>
            <th>Date</th>

          </tr>

        </thead>

        <tbody>

          {filtered.map((item) => (

            <tr key={item.id} className="border-b">

              <td className="py-2">{item.id}</td>
              <td>{item.resume_name}</td>
              <td>{item.job_role}</td>

              <td className="font-semibold text-green-600">
                {item.ats_score}%
              </td>

              <td>
                {item.date && new Date(item.date).toLocaleDateString()}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

export default History