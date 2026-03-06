import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts"
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from "lucide-react"

const scoreHistory = [
  { month: "Jan", score: 45 },
  { month: "Feb", score: 52 },
  { month: "Mar", score: 58 },
  { month: "Apr", score: 65 },
  { month: "May", score: 72 },
  { month: "Jun", score: 78 },
]

const sectionScores = [
  { section: "Experience", score: 85 },
  { section: "Skills", score: 92 },
  { section: "Education", score: 88 },
  { section: "Projects", score: 70 },
  { section: "Summary", score: 75 },
]

const applicationStats = [
  { name: "Interviews", value: 12, color: "#6366f1" },
  { name: "Pending", value: 8, color: "#22c55e" },
  { name: "Rejected", value: 5, color: "#ef4444" },
]

export function ScoreHistoryChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <TrendingUp size={18} /> Score History
      </h3>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <AreaChart data={scoreHistory}>
            <XAxis dataKey="month" />
            <YAxis domain={[0, 100]} />
            <Tooltip />
            <Area type="monotone" dataKey="score" stroke="#6366f1" fill="#6366f1" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function SectionScoresChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <BarChart3 size={18} /> Section Analysis
      </h3>

      <div style={{ width: "100%", height: 200 }}>
        <ResponsiveContainer>
          <BarChart data={sectionScores} layout="vertical">
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="section" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="score" fill="#6366f1" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function ApplicationStatsChart() {
  return (
    <div className="bg-white p-5 rounded-xl shadow-md">
      <h3 className="flex items-center gap-2 font-semibold mb-4">
        <PieChartIcon size={18} /> Application Status
      </h3>

      <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
        <div style={{ width: 160, height: 160 }}>
          <ResponsiveContainer>
            <PieChart>
              <Pie data={applicationStats} innerRadius={40} outerRadius={70} dataKey="value">
                {applicationStats.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div>
          {applicationStats.map((stat) => (
            <div key={stat.name} style={{ display: "flex", gap: "10px", marginBottom: "8px" }}>
              <div
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: "50%",
                  backgroundColor: stat.color,
                }}
              />
              <span>{stat.name}</span>
              <strong>{stat.value}</strong>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}