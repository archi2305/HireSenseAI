import { useState } from "react"
import axios from "axios"
import { Upload, FileText, X, CheckCircle2, Loader2 } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ROLES = [
  "Software Engineer",
  "Backend Developer",
  "Data Scientist",
  "AI Engineer",
  "Frontend Developer",
]

function ResumeUpload({ setResult = () => {} }) {
  const [file, setFile] = useState(null)
  const [selectedRole, setSelectedRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const [isDragging, setIsDragging] = useState(false)

  const handleFile = (selectedFile) => {
    setFile(selectedFile)
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files[0]
    if (droppedFile) {
      handleFile(droppedFile)
    }
  }

  const removeFile = () => {
    setFile(null)
    setIsComplete(false)
  }

  const analyzeResume = async () => {
    if (!file || !jobDescription || !selectedRole) {
      alert("Please select a role, upload resume and add job description")
      return
    }

    const formData = new FormData()
    formData.append("resume", file)
    formData.append("job_description", jobDescription)
    formData.append("job_role", selectedRole)

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
    <div className="space-y-6">
      {/* Drag and Drop Upload Card */}
      <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-md border border-slate-100/50">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">
          Resume Analyzer
        </h2>

        {!file ? (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed p-12 rounded-2xl text-center transition-all duration-300 ${
              isDragging
                ? "border-softPink bg-softPink/10"
                : "border-slate-300 hover:border-lavender"
            }`}
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-softPink to-lavender flex items-center justify-center mx-auto mb-4">
              <Upload className="w-8 h-8 text-white" />
            </div>

            <p className="text-slate-700 font-semibold mb-2">
              Drag and drop your resume here
            </p>
            <p className="text-slate-500 text-sm mb-4">
              or click below to select (PDF, DOC, DOCX)
            </p>

            <label className="inline-block">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => handleFile(e.target.files[0])}
                className="hidden"
              />
              <span className="inline-block px-6 py-2 rounded-lg bg-gradient-to-r from-softPink to-lavender text-white font-medium cursor-pointer hover:shadow-md transition-all hover:scale-105">
                Choose File
              </span>
            </label>
          </div>
        ) : (
          <div className="flex items-center gap-4 p-4 rounded-xl bg-gradient-to-r from-softPink/10 to-lavender/10 border border-softPink/30">
            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-softPink to-lavender flex items-center justify-center flex-shrink-0">
              <FileText className="w-6 h-6 text-white" />
            </div>

            <div className="flex-1">
              <p className="text-sm font-semibold text-slate-900">
                {file.name}
              </p>
              <p className="text-xs text-slate-600">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <button
              onClick={removeFile}
              className="p-2 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        )}
      </div>

      {/* Role Selection and Job Description */}
      <div className="grid grid-cols-2 gap-6">
        {/* Role Selector */}
        <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100/50">
          <label className="block text-slate-900 font-semibold mb-3">
            Select Target Role
          </label>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-2 border border-slate-200 rounded-xl bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-softPink"
          >
            <option value="">-- Choose a role --</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        {/* Job Description Preview */}
        <div className="bg-gradient-to-br from-pastelBlue/20 to-mint/20 p-6 rounded-2xl border border-pastelBlue/30 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 text-sm font-medium">
              {selectedRole ? `Analyzing for ${selectedRole}` : "Select a role first"}
            </p>
          </div>
        </div>
      </div>

      {/* Job Description Textarea */}
      <div className="bg-white/80 backdrop-blur p-6 rounded-2xl shadow-md border border-slate-100/50">
        <label className="block text-slate-900 font-semibold mb-3">
          Job Description
        </label>
        <textarea
          placeholder="Paste the job description here..."
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          className="w-full px-4 py-3 border border-slate-200 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-softPink resize-none"
          rows="6"
        />
      </div>

      {/* Analyze Button */}
      <button
        type="button"
        onClick={analyzeResume}
        disabled={isAnalyzing || !file || !selectedRole || !jobDescription}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-softPink to-lavender text-white font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        {isAnalyzing ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Analyzing Resume...
          </>
        ) : (
          "Analyze Resume"
        )}
      </button>

      {isComplete && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200">
          <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-700 font-medium">
            Analysis complete! Check the results below.
          </p>
        </div>
      )}
    </div>
  )
}

export default ResumeUpload
