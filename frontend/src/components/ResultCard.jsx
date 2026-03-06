import SkillChart from "./SkillChart"
import ATSScore from "./ATSScore"
import StatsCard from "./StatsCard"
function ResultCard({ result }) {

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

        <div className="grid grid-cols-4 gap-4 mb-6">

  <StatsCard
    title="Total Skills"
    value={result.matched_skills.length + result.missing_skills.length}
  />

  <StatsCard
    title="Matched Skills"
    value={result.matched_skills.length}
  />

  <StatsCard
    title="Missing Skills"
    value={result.missing_skills.length}
  />

  <StatsCard
    title="ATS Score"
    value={`${result.ats_score}%`}
  />

</div>

      {/* ATS SCORE */}

      <div className="flex items-center justify-between mb-6">

        <div>
          <h2 className="text-xl font-semibold">
            ATS Score
          </h2>

          <p className="text-gray-500 text-sm">
            Resume match score
          </p>
        </div>

        <ATSScore score={result.ats_score} />

      </div>

      {/* SKILL MATCH CHART */}

      <SkillChart
        matched={result.matched_skills}
        missing={result.missing_skills}
      />

      {/* MATCHED SKILLS */}

      <div className="mb-5">

        <h3 className="font-semibold mb-2">
          Matched Skills
        </h3>

        <div className="flex flex-wrap gap-2">

          {result.matched_skills.map((skill, index) => (
            <span
              key={index}
              className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      {/* MISSING SKILLS */}

      <div className="mb-5">

        <h3 className="font-semibold mb-2">
          Missing Skills
        </h3>

        <div className="flex flex-wrap gap-2">

          {result.missing_skills.map((skill, index) => (
            <span
              key={index}
              className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm"
            >
              {skill}
            </span>
          ))}

        </div>

      </div>

      {/* SUGGESTIONS */}

      <div className="bg-blue-50 p-4 rounded-lg">

        <h3 className="font-semibold mb-1">
          Suggestions
        </h3>

        <p className="text-gray-700">
          {result.suggestions}
        </p>

      </div>

    </div>
  )
}

export default ResultCard