import { CheckCircle2, XCircle, Lightbulb, Sparkles } from "lucide-react"

function SkillsAnalysis({ matchedSkills = [], missingSkills = [], suggestions = "" }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow-md">

      <div className="flex items-center gap-2 mb-6">

        <Sparkles size={18} className="text-indigo-600" />

        <h2 className="text-lg font-semibold">
          Skills Analysis
        </h2>

      </div>

      {/* Matched Skills */}

      <div className="mb-6">

        <div className="flex items-center gap-2 mb-3">

          <CheckCircle2 size={16} className="text-green-600" />

          <span className="font-medium text-sm">
            Matched Skills
          </span>

          <span className="ml-auto text-xs text-gray-500">
            {matchedSkills.length} found
          </span>

        </div>

        <div className="flex flex-wrap gap-2">

          {matchedSkills.map((skill, index) => (

            <span
              key={index}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>

          ))}

        </div>

      </div>

      {/* Missing Skills */}

      <div className="mb-6">

        <div className="flex items-center gap-2 mb-3">

          <XCircle size={16} className="text-red-600" />

          <span className="font-medium text-sm">
            Missing Skills
          </span>

          <span className="ml-auto text-xs text-gray-500">
            {missingSkills.length} missing
          </span>

        </div>

        <div className="flex flex-wrap gap-2">

          {missingSkills.map((skill, index) => (

            <span
              key={index}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>

          ))}

        </div>

      </div>

      {/* Suggestions */}

      <div>

        <div className="flex items-center gap-2 mb-3">

          <Lightbulb size={16} className="text-yellow-500" />

          <span className="font-medium text-sm">
            Suggestions
          </span>

        </div>

        <div className="bg-blue-50 p-3 rounded text-sm text-gray-700">

          {suggestions}

        </div>

      </div>

    </div>

  )

}

export default SkillsAnalysis