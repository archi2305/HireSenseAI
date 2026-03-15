import { ScoreHistoryChart, SectionScoresChart, ApplicationStatsChart } from "./AnalyticsCharts"
import ATSScoreCard from "./ATSScoreCard"
import SkillsAnalysis from "./SkillsAnalysis"

function ResultCard({ result }) {
  return (
    <div className="mt-6 space-y-6">
      {/* ATS Score Card */}
      <ATSScoreCard score={result.ats_score} />

      {/* Skills Analysis */}
      <SkillsAnalysis
        matchedSkills={result.matched_skills}
        missingSkills={result.missing_skills}
        suggestions={result.suggestions}
      />

      {/* Analytics Charts */}
      <div className="grid grid-cols-3 gap-6">
        <ScoreHistoryChart />
        <SectionScoresChart />
        <ApplicationStatsChart />
      </div>
    </div>
  )
}

export default ResultCard
