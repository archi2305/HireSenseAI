import { TrendingUp, Target } from "lucide-react"

function ATSScoreCard({ score }) {
  const previousScore = 65
  const improvement = score - previousScore

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-amber-600"
    return "text-red-600"
  }

  const getCircleColor = (score) => {
    if (score >= 80) return "#10b981"
    if (score >= 60) return "#f59e0b"
    return "#ef4444"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  return (
    <div className="bg-white/80 backdrop-blur p-8 rounded-2xl shadow-md border border-slate-100/50">
      <div className="flex justify-between items-start mb-8">
        <div>
          <h2 className="flex items-center gap-2 font-bold text-xl text-slate-900">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-softPink to-lavender flex items-center justify-center">
              <Target size={18} className="text-white" />
            </div>
            ATS Compatibility Score
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Resume analysis and matching optimization
          </p>
        </div>

        {improvement > 0 && (
          <div className="flex items-center gap-1 text-green-600 text-sm font-semibold bg-green-50 px-3 py-1 rounded-lg">
            <TrendingUp size={16} />
            +{improvement}%
          </div>
        )}
      </div>

      <div className="flex items-center gap-12">
        {/* Circular Score */}
        <div className="relative flex items-center justify-center w-40 h-40 flex-shrink-0">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              stroke="#e5e7eb"
              strokeWidth="8"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />
            <circle
              stroke={getCircleColor(score)}
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset,
                transition: "stroke-dashoffset 0.6s ease"
              }}
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>
            <span className="text-xs text-slate-500 mt-1">
              out of 100
            </span>
          </div>
        </div>

        {/* Metrics */}
        <div className="flex-1 space-y-4">
          <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50">
            <span className="text-slate-600 font-medium">
              Overall Status
            </span>
            <span className={`font-bold text-lg ${getScoreColor(score)}`}>
              {getScoreLabel(score)}
            </span>
          </div>

          <ScoreMetric label="Keywords Match" value={87} />
          <ScoreMetric label="Formatting" value={92} />
          <ScoreMetric label="Contact Info" value={100} />
          <ScoreMetric label="Section Headers" value={78} />
        </div>
      </div>
    </div>
  )
}

function ScoreMetric({ label, value }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-2">
        <span className="text-slate-600 font-medium">
          {label}
        </span>
        <span className="font-bold text-slate-900">
          {value}%
        </span>
      </div>
      <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-softPink to-lavender transition-all duration-500"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  )
}

export default ATSScoreCard
