import { useState } from "react"
import axios from "axios"
import ResultCard from "./ResultCard"

function ResumeAnalyzer() {
  const [resume, setResume] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append("resume", resume)
    formData.append("job_description", jobDescription)

    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/analyze",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "X-API-Key": "supersecretkey"
          }
        }
      )

      setResult(response.data)

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md max-w-2xl">

      <h2 className="text-xl font-semibold mb-4">
        Analyze Resume
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">

        <input
          type="file"
          onChange={(e) => setResume(e.target.files[0])}
          className="w-full border p-2 rounded"
        />

        <textarea
          placeholder="Paste Job Description"
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full border p-2 rounded h-32"
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Analyze Resume
        </button>

      </form>

      {/* RESULT DISPLAY */}

      {result && (
        <div className="mt-6">
          <ResultCard result={result} />
        </div>
      )}

    </div>
  )
}

export default ResumeAnalyzer