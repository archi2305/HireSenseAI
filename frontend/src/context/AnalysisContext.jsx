import { createContext, useContext, useEffect, useMemo, useState } from "react"

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [uploadedResume, setUploadedResume] = useState(null)
  const [analysisInput, setAnalysisInput] = useState({
    role: "",
    jobDescription: "",
  })
  const [analysisResult, setAnalysisResult] = useState(null)
  const [history, setHistory] = useState([])

  useEffect(() => {
    try {
      const saved = localStorage.getItem("analysis_history_v1")
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setHistory(parsed)
        }
      }
    } catch {
      setHistory([])
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("analysis_history_v1", JSON.stringify(history))
    } catch {
      // ignore storage failures in private mode
    }
  }, [history])

  const recordAnalysis = (result, meta = {}) => {
    if (!result) return
    const merged = {
      ...result,
      ...meta,
      id: result.id || meta.id || Date.now(),
      date: result.date || result.created_at || new Date().toISOString(),
      resume_name: result.resume_name || meta.resume_name || uploadedResume?.name || "Uploaded Resume",
      job_role: result.job_role || meta.job_role || analysisInput.role || "General",
      ats_score: Number(result.ats_score ?? meta.ats_score ?? 0),
    }

    setAnalysisResult(merged)
    setHistory((prev) => {
      const next = [merged, ...prev.filter((item) => String(item.id) !== String(merged.id))]
      return next.slice(0, 100)
    })
  }

  const value = useMemo(
    () => ({
      uploadedResume,
      setUploadedResume,
      analysisInput,
      setAnalysisInput,
      analysisResult,
      setAnalysisResult,
      history,
      setHistory,
      recentSearches: history.slice(0, 5),
      recordAnalysis,
      clearAnalysis: () => {
        setUploadedResume(null)
        setAnalysisResult(null)
      },
    }),
    [uploadedResume, analysisInput, analysisResult, history]
  )

  return <AnalysisContext.Provider value={value}>{children}</AnalysisContext.Provider>
}

export function useAnalysis() {
  const context = useContext(AnalysisContext)
  if (!context) {
    throw new Error("useAnalysis must be used within AnalysisProvider")
  }
  return context
}
