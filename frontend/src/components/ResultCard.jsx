import StatsCards from "./StatsCards"
import { ScoreHistoryChart, SectionScoresChart, ApplicationStatsChart } from "./AnalyticsCharts"
import ATSScoreCard from "./ATSScoreCard"
import SkillsAnalysis from "./SkillsAnalysis"

function ResultCard({ result }) {

  return (

    <div className="bg-white p-6 rounded-xl shadow-md mt-6">

      <StatsCards />

      <div className="mt-6">
        <ATSScoreCard score={result.ats_score} />
      </div>

      <div className="mt-6">
        <SkillsAnalysis
          matchedSkills={result.matched_skills}
          missingSkills={result.missing_skills}
          suggestions={result.suggestions}
        />
      </div>

      <div className="grid grid-cols-3 gap-6 mt-6">

        <ScoreHistoryChart />

        <SectionScoresChart />

        <ApplicationStatsChart />

      </div>

      {/* MATCHED SKILLS */}

      <div className="mt-6">

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

      <div className="mt-6">

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

      <div className="bg-blue-50 p-4 rounded-lg mt-6">

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