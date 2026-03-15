function NotificationDropdown({ items = [], open }) {
  if (!open) return null

  const latest = items.slice(0, 3)

  return (
    <div className="absolute right-0 mt-2 bg-cardBg shadow-lg p-3 rounded-xl w-72 border border-slate-100 z-20">
      <p className="text-xs font-semibold text-slate-500 mb-2">
        Recent Analyses
      </p>
      {latest.length === 0 ? (
        <p className="text-xs text-slate-500">
          No analyses yet. Run your first resume analysis.
        </p>
      ) : (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {latest.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center px-2 py-1 rounded-lg hover:bg-dashboardBg transition-all duration-200"
            >
              <div>
                <p className="text-xs font-medium text-slate-800">
                  {item.job_role || "Role"}
                </p>
                <p className="text-[11px] text-slate-500">
                  {item.date
                    ? new Date(item.date).toLocaleString()
                    : "Just now"}
                </p>
                <p className="text-[11px] text-slate-500 line-clamp-1">
                  {item.suggestionsPreview || "View detailed suggestions in results."}
                </p>
              </div>
              <span className="text-xs font-semibold text-indigo-600">
                {item.ats_score}%
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown

