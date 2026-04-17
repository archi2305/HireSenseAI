import { createContext, useContext, useMemo, useState } from "react"

const AnalysisContext = createContext(null)

export function AnalysisProvider({ children }) {
  const [uploadedResume, setUploadedResume] = useState(null)
  const [analysisInput, setAnalysisInput] = useState({
    role: "",
    jobDescription: "",
  })
  const [analysisResult, setAnalysisResult] = useState(null)

  const value = useMemo(
    () => ({
      uploadedResume,
      setUploadedResume,
      analysisInput,
      setAnalysisInput,
      analysisResult,
      setAnalysisResult,
      clearAnalysis: () => {
        setUploadedResume(null)
        setAnalysisResult(null)
      },
    }),
    [uploadedResume, analysisInput, analysisResult]
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
