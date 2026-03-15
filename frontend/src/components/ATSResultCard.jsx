import SkillBadge from "./SkillBadge"

function ATSResultCard({ result }) {
  if (!result) return null

  const score = result.ats_score ?? 0
  const matched = result.matched_skills || []
  const missing = result.missing_skills || []

  const barColor =
    score >= 80 ? "bg-emerald-500" : score >= 60 ? "bg-amber-400" : "bg-rose-400"

  return (
    <div className="mt-6 grid md:grid-cols-3 gap-6">
      {/* Score card */}
      <div className="col-span-1 bg-cardBg rounded-xl shadow-md p-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-2">
          ATS Match Score
        </h3>
        <div className="flex items-end justify-between mb-3">
          <p className="text-4xl font-bold text-slate-900">
            {score}%
          </p>
          <p className="text-xs text-slate-500">
            Based on keyword and skills match
          </p>
        </div>
        <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`${barColor} h-3 rounded-full transition-all duration-500`}
            style={{ width: `${Math.min(score, 100)}%` }}
          />
        </div>
      </div>

      {/* Skills */}
      <div className="col-span-1 bg-cardBg rounded-xl shadow-md p-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">
          Matched Skills
        </h3>
        <div className="flex flex-wrap">
          {matched.length === 0 && (
            <p className="text-xs text-slate-500">
              No skills detected yet.
            </p>
          )}
          {matched.map((skill) => (
            <SkillBadge key={skill} label={skill} type="matched" />
          ))}
        </div>
      </div>

      <div className="col-span-1 bg-cardBg rounded-xl shadow-md p-6">
        <h3 className="text-sm font-semibold text-slate-600 mb-3">
          Missing Skills
        </h3>
        <div className="flex flex-wrap">
          {missing.length === 0 && (
            <p className="text-xs text-slate-500">
              Great match – no missing skills from template.
            </p>
          )}
          {missing.map((skill) => (
            <SkillBadge key={skill} label={skill} type="missing" />
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="md:col-span-3 bg-softPink/10 rounded-xl border border-softPink/30 p-5">
        <h3 className="text-sm font-semibold text-slate-700 mb-2">
          Suggestions
        </h3>
        <p className="text-sm text-slate-700 whitespace-pre-line">
          {result.suggestions}
        </p>
      </div>
    </div>
  )
}

export default ATSResultCard

