import { useState } from "react"
import axios from "axios"
import { Upload, FileText, X, CheckCircle2 } from "lucide-react"

const API_BASE_URL = "http://127.0.0.1:8001"

function ResumeUpload({ setResult = () => {} }) {

  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleFile = (selectedFile) => {
    setFile(selectedFile)
  }

  const removeFile = () => {
    setFile(null)
    setIsComplete(false)
  }

  const analyzeResume = async () => {

    if (!file || !jobDescription) {
      alert("Please upload resume and add job description")
      return
    }

    const formData = new FormData()

    formData.append("resume", file)
    formData.append("job_description", jobDescription)

    try {

      setIsAnalyzing(true)

      const response = await axios.post(
        `${API_BASE_URL}/analyze`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }
      )

      setResult(response.data)

      setIsAnalyzing(false)
      setIsComplete(true)

    } catch (error) {

      console.error("Failed to analyze resume", error)
      alert("Failed to analyze resume. Please check that the backend is running on port 8001.")
      setIsAnalyzing(false)

    }

  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <h2 className="text-lg font-semibold mb-4">
        Upload Resume
      </h2>

      {!file ? (

        <div className="border-2 border-dashed p-10 rounded-lg text-center">

          <Upload className="mx-auto mb-2" />

          <p className="text-sm mb-3">
            Upload your resume (PDF / DOC / DOCX)
          </p>

          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => handleFile(e.target.files[0])}
          />

        </div>

      ) : (

        <div className="flex items-center gap-3 border p-3 rounded">

          <FileText />

          <div className="flex-1">
            <p className="text-sm font-medium">{file.name}</p>
            <p className="text-xs text-gray-500">
              {(file.size / 1024).toFixed(1)} KB
            </p>
          </div>

          <button onClick={removeFile}>
            <X />
          </button>

        </div>

      )}

      <textarea
        placeholder="Paste Job Description"
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        className="w-full border p-2 rounded mt-4 h-32"
      />

      <button
        type="button"
        onClick={analyzeResume}
        className="bg-blue-600 text-white px-4 py-2 rounded mt-4 disabled:opacity-60"
        disabled={isAnalyzing}
      >
        Analyze Resume
      </button>

      {isAnalyzing && (
        <p className="text-sm mt-3 text-gray-500">
          Analyzing resume...
        </p>
      )}

      {isComplete && (
        <div className="flex items-center gap-2 text-green-600 mt-3">
          <CheckCircle2 size={16} />
          <span>Analysis complete</span>
        </div>
      )}

    </div>

  )
}

export default ResumeUpload