function RecentAnalyses() {

  const analyses = [
    {
      resume: "resume.pdf",
      role: "Backend Developer",
      score: 71,
      date: "Today"
    },
    {
      resume: "resume_data.pdf",
      role: "Data Analyst",
      score: 65,
      date: "Yesterday"
    },
    {
      resume: "resume_ml.pdf",
      role: "ML Engineer",
      score: 78,
      date: "2 days ago"
    }
  ]

  return (

    <div className="bg-white rounded-xl shadow-md p-6">

      <h2 className="text-lg font-semibold mb-4">
        Recent Resume Analyses
      </h2>

      <table className="w-full text-sm">

        <thead>

          <tr className="text-gray-500 border-b">

            <th className="text-left py-2">Resume</th>
            <th className="text-left py-2">Job Role</th>
            <th className="text-left py-2">ATS Score</th>
            <th className="text-left py-2">Date</th>

          </tr>

        </thead>

        <tbody>

          {analyses.map((item, index) => (

            <tr key={index} className="border-b">

              <td className="py-2">{item.resume}</td>
              <td className="py-2">{item.role}</td>

              <td className="py-2">

                <span className="bg-green-100 text-green-700 px-2 py-1 rounded">
                  {item.score}%
                </span>

              </td>

              <td className="py-2 text-gray-500">
                {item.date}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>

  )
}

export default RecentAnalyses