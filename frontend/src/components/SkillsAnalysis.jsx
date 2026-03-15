import { CheckCircle2, XCircle, Lightbulb, Sparkles } from "lucide-react"

function SkillsAnalysis({ matchedSkills = [], missingSkills = [], suggestions = "" }) {
  return (
    <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-md border border-slate-100/50">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pastelBlue to-mint flex items-center justify-center">
          <Sparkles size={20} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">
          Skills Analysis
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Matched Skills */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 size={18} className="text-green-600" />
            <span className="font-bold text-slate-900">
              Matched Skills
            </span>
            <span className="ml-auto text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
              {matchedSkills.length} found
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {matchedSkills.length > 0 ? (
              matchedSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-green-100 text-green-700 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500 text-sm">No matched skills yet</p>
            )}
          </div>
        </div>

        {/* Missing Skills */}
        <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-200">
          <div className="flex items-center gap-2 mb-4">
            <XCircle size={18} className="text-red-600" />
            <span className="font-bold text-slate-900">
              Missing Skills
            </span>
            <span className="ml-auto text-xs font-semibold text-red-600 bg-red-100 px-2 py-1 rounded-full">
              {missingSkills.length} missing
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {missingSkills.length > 0 ? (
              missingSkills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-red-100 text-red-700 px-3 py-1 rounded-lg text-sm font-medium"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-slate-500 text-sm">All skills matched!</p>
            )}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="bg-gradient-to-r from-lavender/20 to-softPink/20 p-6 rounded-xl border border-lavender/50">
        <div className="flex items-center gap-2 mb-3">
          <Lightbulb size={18} className="text-amber-500" />
          <span className="font-bold text-slate-900">
            Suggestions
          </span>
        </div>
        <p className="text-slate-700 leading-relaxed text-sm">
          {suggestions || "Suggestions will appear after analysis"}
        </p>
      </div>
    </div>
  )
}

export default SkillsAnalysis
