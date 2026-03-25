import { motion } from "framer-motion"
import { CheckCircle2, AlertCircle, Lightbulb, Zap } from "lucide-react"

function ATSResultCard({ result, compact = false }) {
  if (!result) return null

  return (
    <div className={`space-y-6 ${compact ? '' : 'p-6 bg-theme-surface border border-theme-border rounded-md shadow-linear'}`}>
      {!compact && (
        <div className="flex items-center justify-between border-b border-theme-border pb-4">
          <h2 className="text-[18px] font-bold text-theme-text tracking-tight flex items-center gap-2">
            <Zap className="text-warning fill-warning" size={20} />
            Analysis Result
          </h2>
          <div className="flex items-center gap-2">
            <span className="text-[12px] font-bold text-theme-textSecondary uppercase tracking-widest">ATS Match</span>
            <div className={`px-2 py-1 rounded text-[16px] font-black border border-current bg-opacity-10 
              ${result.ats_score >= 80 ? 'text-success border-success/20' : 'text-warning border-warning/20'}`}>
              {result.ats_score}%
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 size={14} />
            <h3 className="text-[12px] font-bold uppercase tracking-widest">Matched Skills</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.matched_skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-success/5 border border-success/20 text-success text-[12px] rounded-sm font-medium">
                {skill}
              </span>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-error">
            <AlertCircle size={14} />
            <h3 className="text-[12px] font-bold uppercase tracking-widest">Missing Gaps</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {result.missing_skills.length > 0 ? result.missing_skills.map((skill, index) => (
              <span key={index} className="px-2 py-1 bg-error/5 border border-error/20 text-error text-[12px] rounded-sm font-medium">
                {skill}
              </span>
            )) : (
              <span className="text-[12px] text-theme-textSecondary italic">No major gaps identified.</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-theme-bg border border-theme-border p-4 rounded-md space-y-3">
        <div className="flex items-center gap-2 text-theme-accent">
          <Lightbulb size={16} />
          <h3 className="text-[13px] font-bold uppercase tracking-widest">AI Suggestions</h3>
        </div>
        <p className="text-[13px] text-theme-textSecondary leading-relaxed italic">
          "{result.suggestions}"
        </p>
      </div>
    </div>
  )
}

export default ATSResultCard
