import { useEffect, useState } from "react"
import axios from "axios"
import { FileText, Download, Trash2 } from "lucide-react"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

function MyResumes({ searchQuery = "" }) {
  const [resumes, setResumes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/analyses`)
        const normalized = (response.data || []).map((item) => ({
          id: item.id,
          name: item.resume_name || "Untitled Resume",
          updated_at: item.date,
          completion_percentage: item.ats_score ?? 0,
        }))
        setResumes(normalized)
      } catch (err) {
        console.error("Failed to load resumes", err)
        setError("Failed to load resumes")
        setResumes([])
      } finally {
        setLoading(false)
      }
    }

    fetchResumes()
  }, [])

  const query = (searchQuery || "").toLowerCase()
  const filtered = resumes.filter((item) => {
    const name = (item.name || "").toLowerCase()
    return name.includes(query)
  })

  return (
    <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-md border border-slate-100/50">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-softPink to-lavender flex items-center justify-center">
          <FileText size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          My Resumes
        </h2>
      </div>

      {loading && (
        <p className="text-slate-500 text-sm py-8 text-center">Loading resumes...</p>
      )}

      {error && !loading && (
        <p className="text-red-500 text-sm py-8 text-center">{error}</p>
      )}

      {!loading && !error && filtered.length === 0 && (
        <p className="text-slate-500 text-sm py-8 text-center">
          No resumes found.
        </p>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((resume) => (
            <div
              key={resume.id}
              className="group relative p-6 rounded-xl border border-slate-200/50 bg-gradient-to-br from-slate-50 to-slate-100 hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                <button className="p-2 rounded-lg bg-white hover:bg-slate-100 transition-colors shadow-md">
                  <Download className="w-4 h-4 text-slate-700" />
                </button>
                <button className="p-2 rounded-lg bg-white hover:bg-red-50 transition-colors shadow-md">
                  <Trash2 className="w-4 h-4 text-red-600" />
                </button>
              </div>

              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-softPink to-lavender flex items-center justify-center mb-4">
                <FileText className="w-6 h-6 text-white" />
              </div>

              <h3 className="font-bold text-slate-900 text-sm mb-2 pr-20">
                {resume.name}
              </h3>

              <p className="text-xs text-slate-600 mb-4">
                Updated{" "}
                {resume.updated_at
                  ? new Date(resume.updated_at).toLocaleDateString()
                  : "Recently"}
              </p>

              <div className="w-full h-1 rounded-full bg-slate-200 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-softPink to-lavender transition-all"
                  style={{ width: `${resume.completion_percentage || 75}%` }}
                />
              </div>
              <p className="text-xs text-slate-500 mt-2">
                {resume.completion_percentage || 75}% complete
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyResumes
