import { useState } from "react"
import axios from "axios"
import toast from "react-hot-toast"
import { Loader2, UploadCloud, FileType, CheckCircle2, AlertCircle, Sparkles } from "lucide-react"
import ATSResultCard from "./ATSResultCard"
import { motion, AnimatePresence } from "framer-motion"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const ROLE_TEMPLATES = {
  "Software Engineer": "Proficient in Python, SQL, and distributed systems. Experience with cloud infrastructure and RESTful APIs.",
  "Frontend Developer": "Expertise in React, Tailwind CSS, and Framer Motion. Focused on high-fidelity UI/UX implementation.",
  "Data Scientist": "Strong background in statistics, machine learning, and data visualization using Python and Pandas.",
}

function ResumeAnalyzer({ onAnalysisCompleted }) {
  const [file, setFile] = useState(null)
  const [jobRole, setJobRole] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!file || !jobDescription) return toast.error("File and JD required.")
    
    setLoading(true)
    const formData = new FormData()
    formData.append("resume", file)
    formData.append("job_description", jobDescription)
    formData.append("job_role", jobRole)

    try {
      const res = await axios.post(`${API_BASE_URL}/analyze`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })
      setResult(res.data)
      toast.success("Analysis complete.")
      onAnalysisCompleted?.({ ...res.data, job_role: jobRole })
    } catch {
      toast.error("Analysis failed.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-6xl mx-auto w-full space-y-6">
      
      <div className="flex items-center justify-between mb-2">
         <div>
            <h1 className="text-[20px] font-bold text-theme-text tracking-tight">Intelligence Parser</h1>
            <p className="text-[13px] text-theme-textSecondary italic">Automated extraction and score weighting.</p>
         </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left: Input Config */}
        <div className="flex-1 flex flex-col gap-5">
           <div className="linear-card p-5 space-y-5">
              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Target Job Role</label>
                 <select
                   className="linear-input w-full"
                   value={jobRole}
                   onChange={(e) => {
                     setJobRole(e.target.value)
                     if (ROLE_TEMPLATES[e.target.value]) setJobDescription(ROLE_TEMPLATES[e.target.value])
                   }}
                 >
                   <option value="">Select template...</option>
                   {Object.keys(ROLE_TEMPLATES).map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[11px] font-bold text-theme-textSecondary uppercase tracking-widest">Job Description / Requirements</label>
                 <textarea
                   rows={10}
                   className="linear-input w-full resize-none font-mono text-[12px] leading-relaxed"
                   placeholder="Paste core requirements here..."
                   value={jobDescription}
                   onChange={(e) => setJobDescription(e.target.value)}
                 />
              </div>
           </div>
        </div>

        {/* Right: Upload zone */}
        <div className="w-full lg:w-[380px] flex flex-col gap-4">
           <div className={`linear-card p-6 h-full flex flex-col items-center justify-center border-dashed relative group overflow-hidden 
             ${file ? 'border-theme-accent/50 bg-theme-accent/5' : 'hover:border-theme-textSecondary/40'}`}>
              
              <input 
                type="file" 
                className="absolute inset-0 opacity-0 cursor-pointer z-10" 
                onChange={(e) => setFile(e.target.files?.[0])}
                accept=".pdf,.doc,.docx" 
              />

              <div className="flex flex-col items-center text-center">
                 <div className={`p-4 rounded-full bg-theme-bg border border-theme-border mb-4 transition-transform duration-300 group-hover:scale-110
                   ${file ? 'text-theme-accent border-theme-accent/30' : 'text-theme-textSecondary'}`}>
                    {file ? <CheckCircle2 size={32} /> : <UploadCloud size={32} />}
                 </div>
                 <h3 className="text-[14px] font-bold text-theme-text mb-1">{file ? file.name : 'Upload Resume'}</h3>
                 <p className="text-[11px] text-theme-textSecondary italic">{file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOC UP TO 10MB'}</p>
                 
                 {loading && (
                   <div className="mt-6 flex flex-col items-center gap-3">
                      <Loader2 size={24} className="animate-spin text-theme-accent" />
                      <span className="text-[11px] font-bold text-theme-accent uppercase tracking-widest animate-pulse">Running AI Weights...</span>
                   </div>
                 )}
              </div>

              {!file && <div className="absolute inset-0 bg-gradient-to-t from-theme-bg/40 to-transparent pointer-events-none" />}
           </div>

           <button
             onClick={handleAnalyze}
             disabled={loading || !file || !jobDescription}
             className="linear-btn-primary w-full py-2.5 shadow-accent-glow flex items-center justify-center gap-2 group"
           >
             <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
             Execute Intelligent Parse
           </button>
        </div>
      </div>

      <AnimatePresence>
        {result && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8"
          >
            <ATSResultCard result={result} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ResumeAnalyzer
