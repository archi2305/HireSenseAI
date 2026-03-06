import { FileText, Target, TrendingUp, CheckCircle } from "lucide-react"

const stats = [
  {
    title: "Total Resumes",
    value: "12",
    description: "Analyzed this month",
    icon: FileText,
    trend: "+3 from last month",
  },
  {
    title: "Avg. ATS Score",
    value: "78",
    description: "Current average",
    icon: Target,
    trend: "+12% improvement",
  },
  {
    title: "Applications",
    value: "25",
    description: "Jobs applied to",
    icon: TrendingUp,
    trend: "+8 this week",
  },
  {
    title: "Interviews",
    value: "7",
    description: "Scheduled",
    icon: CheckCircle,
    trend: "28% success rate",
  },
]

function StatsCards() {
  return (

    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

      {stats.map((stat, index) => {

        const Icon = stat.icon

        return (

          <div
            key={index}
            className="bg-white p-5 rounded-xl shadow-md"
          >

            <div className="flex justify-between items-start">

              <div>

                <p className="text-sm text-gray-500">
                  {stat.title}
                </p>

                <p className="text-3xl font-bold mt-1">
                  {stat.value}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {stat.description}
                </p>

              </div>

              <div className="bg-indigo-100 p-2 rounded-lg">
                <Icon size={20} className="text-indigo-600" />
              </div>

            </div>

            <div className="flex items-center gap-1 text-xs mt-3 text-green-600">

              <TrendingUp size={12} />

              <span>
                {stat.trend}
              </span>

            </div>

          </div>

        )

      })}

    </div>

  )
}

export default StatsCards