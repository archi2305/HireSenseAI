import { PieChart, Pie, Cell, Tooltip } from "recharts"

function SkillChart({ matched, missing }) {

  const data = [
    { name: "Matched", value: matched.length },
    { name: "Missing", value: missing.length }
  ]

  const COLORS = ["#22c55e", "#ef4444"]

  return (
    <div className="flex justify-center mt-6">

      <PieChart width={300} height={200}>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={70}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index]} />
          ))}
        </Pie>

        <Tooltip />

      </PieChart>

    </div>
  )
}

export default SkillChart