import { useEffect, useState } from "react"
import axios from "axios"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell
} from "recharts"

const API_BASE_URL = "http://127.0.0.1:8001"


/* ---------------- SCORE HISTORY CHART ---------------- */

export function ScoreHistoryChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/score-history`)
        setData(res.data || [])
      } catch (err) {
        console.error("Failed to load score history", err)
        setData([])
      }
    }
    fetchHistory()
  }, [])

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Score History
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <LineChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="score"
            stroke="#6366f1"
            strokeWidth={3}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>

  )
}


/* ---------------- SECTION SCORES ---------------- */

export function SectionScoresChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/section-scores`)
        setData(res.data || [])
      } catch (err) {
        console.error("Failed to load section scores", err)
        setData([])
      }
    }
    fetchSections()
  }, [])

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Section Scores
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <BarChart data={data}>

          <XAxis dataKey="name" />

          <YAxis />

          <Tooltip />

          <Bar
            dataKey="score"
            fill="#6366f1"
          />

        </BarChart>

      </ResponsiveContainer>

    </div>

  )
}


/* ---------------- APPLICATION STATS ---------------- */

export function ApplicationStatsChart() {
  const [data, setData] = useState([])

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analyses`)
        const analyses = res.data || []

        const buckets = {
          low: 0,
          medium: 0,
          high: 0,
        }

        analyses.forEach((a) => {
          const score = a.ats_score ?? 0
          if (score < 50) buckets.low += 1
          else if (score < 75) buckets.medium += 1
          else buckets.high += 1
        })

        setData([
          { name: "Low (<50)", value: buckets.low },
          { name: "Medium (50-74)", value: buckets.medium },
          { name: "High (75+)", value: buckets.high },
        ])
      } catch (err) {
        console.error("Failed to load application stats", err)
        setData([])
      }
    }
    fetchStats()
  }, [])

  const COLORS = [
    "#ef4444",
    "#f97316",
    "#22c55e",
  ]

  return (

    <div className="bg-white p-6 rounded-xl shadow">

      <h2 className="text-lg font-semibold mb-4">
        Application Stats
      </h2>

      <ResponsiveContainer width="100%" height={250}>

        <PieChart>

          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={90}
            label
          >

            {data.map((entry, index) => (

              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />

            ))}

          </Pie>

          <Tooltip />

        </PieChart>

      </ResponsiveContainer>

    </div>

  )
}