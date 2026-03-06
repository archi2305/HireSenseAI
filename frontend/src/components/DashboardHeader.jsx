import { Bell, Search, Plus } from "lucide-react"

function DashboardHeader() {

  return (

    <div className="flex items-center justify-between h-16 px-6 bg-white border-b">

      {/* Search */}

      <div className="flex items-center gap-4 flex-1">

        <div className="relative w-72">

          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />

          <input
            type="search"
            placeholder="Search resumes, jobs..."
            className="w-full pl-9 pr-3 py-2 border rounded-lg text-sm"
          />

        </div>

      </div>

      {/* Actions */}

      <div className="flex items-center gap-3">

        <button className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm">

          <Plus size={16} />

          New Analysis

        </button>

        <button className="relative p-2 hover:bg-gray-100 rounded">

          <Bell size={18} />

          <span className="absolute top-1 right-1 w-2 h-2 bg-indigo-600 rounded-full"></span>

        </button>

      </div>

    </div>

  )
}

export default DashboardHeader