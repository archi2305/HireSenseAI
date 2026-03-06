import { TrendingUp, Target } from "lucide-react"

function ATSScoreCard({ score }) {

  const previousScore = 65
  const improvement = score - previousScore

  const circumference = 2 * Math.PI * 45
  const strokeDashoffset = circumference - (score / 100) * circumference

  const getScoreColor = (score) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreLabel = (score) => {
    if (score >= 80) return "Excellent"
    if (score >= 60) return "Good"
    if (score >= 40) return "Fair"
    return "Needs Work"
  }

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <div className="flex justify-between items-start mb-6">

        <div>

          <h2 className="flex items-center gap-2 font-semibold text-lg">
            <Target size={18} />
            ATS Compatibility Score
          </h2>

          <p className="text-sm text-gray-500">
            Optimized for Software Engineer
          </p>

        </div>

        {improvement > 0 && (
          <div className="flex items-center gap-1 text-green-600 text-xs">
            <TrendingUp size={12} />
            +{improvement}%
          </div>
        )}

      </div>

      <div className="flex items-center gap-8">

        {/* Circular Score */}

        <div className="relative flex items-center justify-center w-32 h-32">

          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">

            <circle
              stroke="#eee"
              strokeWidth="8"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
            />

            <circle
              stroke="#6366f1"
              strokeWidth="8"
              strokeLinecap="round"
              fill="transparent"
              r="45"
              cx="50"
              cy="50"
              style={{
                strokeDasharray: circumference,
                strokeDashoffset: strokeDashoffset
              }}
            />

          </svg>

          <div className="absolute flex flex-col items-center">

            <span className={`text-3xl font-bold ${getScoreColor(score)}`}>
              {score}
            </span>

            <span className="text-xs text-gray-500">
              out of 100
            </span>

          </div>

        </div>

        {/* Metrics */}

        <div className="flex-1 space-y-3">

          <div className="flex justify-between text-sm">

            <span className="text-gray-500">
              Overall Status
            </span>

            <span className={`font-medium ${getScoreColor(score)}`}>
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

      <div className="flex justify-between text-xs mb-1">

        <span className="text-gray-500">
          {label}
        </span>

        <span className="font-medium">
          {value}%
        </span>

      </div>

      <div className="w-full bg-gray-200 h-1.5 rounded-full">

        <div
          className="bg-indigo-600 h-full rounded-full"
          style={{ width: `${value}%` }}
        />

      </div>

    </div>

  )
}

export default ATSScoreCard