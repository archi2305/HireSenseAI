import React, { useState } from "react"
import { Upload, FileText, CheckCircle, Target, Zap, ArrowRight, Brain, Search, Sparkles } from "lucide-react"
import toast from "react-hot-toast"
import ATSResultCard from "./ATSResultCard"
import { motion, AnimatePresence } from "framer-motion"
import SectionReveal from "./SectionReveal"
import { API_BASE_URL } from "../services/api"

export default function ResumeAnalyzer() {
  const API_URL = API_BASE_URL
  const [file, setFile] = useState(null)
  const [jobDescription, setJobDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const getUploadErrorMessage = (error) => {
    const status = error?.status
    const detail = error?.data?.detail
    const code = typeof detail === "object" ? detail?.code : undefined

    if (!error) return "Server error"
    if (code === "NO_FILE_SELECTED") return "No file selected"
    if (code === "INVALID_FILE_FORMAT" || status === 415) return "Unsupported file type"
    if (code === "FILE_UPLOAD_FAILED" || status === 422) {
      return "File upload failed"
    }
    if (status >= 500 || code === "SERVER_ERROR") return "Server error"
    return "File upload failed"
  }

  const handleUpload = async (e) => {
    e.preventDefault()
    if (!file) return toast.error("No file selected")
    if (!jobDescription) return toast.error("Intelligence required.")
    const fileName = (file.name || "").toLowerCase()
    const isPdf = fileName.endsWith(".pdf")
    const isDocx = fileName.endsWith(".docx")
    if (!isPdf && !isDocx) {
      return toast.error("Unsupported file type")
    }

    setLoading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append("role", "Not specified")
    formData.append("job_description", jobDescription)
    console.log("[upload] API URL:", `${API_URL}/api/analyze`)
    for (const [key, value] of formData.entries()) {
      const debugValue =
        value instanceof File
          ? `${value.name} (${value.type || "unknown-type"}, ${value.size} bytes)`
          : value
      console.log(`[upload] FormData ${key}:`, debugValue)
    }

    try {
      const response = await fetch(`${API_URL}/api/analyze`, {
        method: "POST",
        body: formData,
      })
      const data = await response.json().catch(() => ({}))
      console.log("[upload] analyze response status:", response.status)
      console.log("[upload] analyze response body:", data)
      if (!response.ok) {
        throw { status: response.status, data }
      }

      setResult(data)
      if (data?.warning) {
        toast.error(data.warning)
      }
      toast.success("Analysis synchronized.")
    } catch (error) {
      console.error("[upload] analyze error:", error?.data || error)
      toast.error(getUploadErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto w-full space-y-12 font-sans overflow-x-hidden">
      
      <SectionReveal direction="down">
        <div className="flex flex-col gap-2 mb-8">
           <div className="flex items-center gap-2 text-theme-accent font-black text-[11px] uppercase tracking-[0.2em]">
              <Brain size={14} />
              <span>Matching Engine</span>
           </div>
           <h1 className="text-[32px] font-black text-theme-text tracking-tighter leading-none">
             Intel <span className="text-theme-accent">Parser</span>
           </h1>
           <p className="text-[14px] text-theme-textSecondary max-w-xl font-medium leading-relaxed">
             Recursive extraction of semantic candidate profiles against deep vector job descriptions.
           </p>
        </div>
      </SectionReveal>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        
        {/* Input Panel */}
        <SectionReveal direction="right" delay={0.2} className="h-full">
          <div className="linear-card p-8 h-full flex flex-col relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-theme-accent/5 blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-theme-accent/10 transition-all duration-700" />
            
            <div className="space-y-6 relative z-10 flex-1">
               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Target size={16} className="text-theme-accent" />
                     <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Protocol Framework</h3>
                  </div>
                  <textarea 
                    placeholder="Paste job description or core requirements here..."
                    className="linear-input w-full min-h-[350px] resize-none bg-theme-bg/50 focus:bg-theme-surface"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                     <Upload size={16} className="text-theme-accent" />
                     <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Candidate Payload</h3>
                  </div>
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-theme-border/60 rounded-2xl p-8 bg-theme-bg/20 hover:bg-theme-accent/[0.03] hover:border-theme-accent/30 transition-all duration-500 cursor-pointer group/upload">
                    <input type="file" accept=".pdf,.docx" className="hidden" onChange={(e) => setFile(e.target.files[0])} />
                    <div className="w-12 h-12 rounded-xl bg-theme-surface border border-theme-border flex items-center justify-center text-theme-textSecondary group-hover/upload:text-theme-accent group-hover/upload:shadow-accent-glow transition-all duration-500 mb-4">
                       <FileText size={24} />
                    </div>
                    <p className="text-[13px] font-bold text-theme-text mb-1">{file ? file.name : "Inject Candidate CV"}</p>
                    <p className="text-[11px] text-theme-textSecondary font-medium opacity-60 italic">.pdf, .docx (Max 10MB)</p>
                  </label>
               </div>
            </div>

            <div className="pt-8">
               <button 
                onClick={handleUpload}
                disabled={loading}
                className="linear-btn-primary w-full py-4 flex items-center justify-center gap-3 shadow-accent-glow relative overflow-hidden"
               >
                 {loading ? (
                   <>
                     <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                     <span className="text-[14px] font-black">Decrypting Payload...</span>
                   </>
                 ) : (
                   <>
                     <Zap size={16} fill="white" />
                     <span className="text-[14px] font-black">Initialize Analysis Pipeline</span>
                     <ArrowRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                   </>
                 )}
               </button>
            </div>
          </div>
        </SectionReveal>

        {/* Results Panel */}
        <SectionReveal direction="left" delay={0.4} className="h-full">
          <div className="linear-card p-8 h-full bg-theme-sidebar/20 relative overflow-hidden border-theme-accent/5">
             <div className="absolute top-0 right-0 p-8 opacity-5">
                <Brain size={128} />
             </div>
             
             <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-center justify-between mb-8">
                   <div className="flex items-center gap-2.5">
                      <Sparkles size={16} className="text-theme-accent" />
                      <h3 className="text-[13px] font-black text-theme-text uppercase tracking-widest">Real-time Extraction</h3>
                   </div>
                   {result && (
                      <div className="px-3 py-1 rounded-full bg-success/10 border border-success/20 text-success text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 animate-fade-in">
                        <CheckCircle size={12} />
                        Sync Verified
                      </div>
                   )}
                </div>

                <div className="flex-1 flex flex-col justify-center">
                   <AnimatePresence mode="wait">
                      {loading ? (
                        <motion.div 
                          key="loading"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                          className="space-y-6"
                        >
                           {[1,2,3,4,5].map(i => (
                             <div key={i} className="space-y-2">
                                <div className="h-3 bg-theme-surface rounded-full w-24 animate-pulse" />
                                <div className="h-2 bg-theme-surface/50 rounded-full w-full animate-pulse" />
                             </div>
                           ))}
                        </motion.div>
                      ) : result ? (
                        <motion.div 
                          key="result"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="h-full"
                        >
                           <ATSResultCard result={result} />
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="empty"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="text-center space-y-4 py-20 opacity-30"
                        >
                           <Search size={48} className="mx-auto" />
                           <p className="text-[13px] font-bold tracking-widest uppercase">Awaiting Intel Injection</p>
                        </motion.div>
                      )}
                   </AnimatePresence>
                </div>
             </div>
          </div>
        </SectionReveal>

      </div>
    </div>
  )
}
