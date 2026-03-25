import React from "react"
import { LayoutDashboard, FileText, History, Settings, Target, User } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

function Sidebar() {
  const location = useLocation()
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", path: "/analyzer", icon: FileText },
    { name: "Candidate Match", path: "/matching", icon: Target },
    { name: "History", path: "/history", icon: History },
    { name: "Profile", path: "/profile", icon: User },
    { name: "Settings", path: "/settings", icon: Settings }
  ]

  return (
    <div className="w-[240px] h-full bg-[#f8fafc] flex flex-col p-4 z-30 transition-all duration-200">
      <div className="mb-8 px-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#a5b4fc] flex items-center justify-center shadow-sm">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-lg font-semibold text-slate-800 tracking-tight">
          HireSense
        </h2>
      </div>

      <nav className="flex-1 mt-2">
        <ul className="space-y-1">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all duration-200 text-[13px] font-medium
                  ${isActive 
                    ? "bg-white text-slate-900 shadow-sm border border-gray-200" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <Icon 
                    size={16} 
                    className={`transition-colors duration-200 ${isActive ? "text-[#a5b4fc]" : "text-slate-400"}`} 
                  />
                  <span>{item.name}</span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="mt-auto pt-6 px-1">
        <div className="p-4 bg-white rounded-lg border border-gray-200 text-center shadow-sm transition-all duration-200 hover:border-[#a5b4fc]">
          <p className="text-[13px] font-semibold text-slate-800 mb-1">Upgrade</p>
          <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">Unlimited resume parsing.</p>
          <button className="w-full py-2 bg-[#f8fafc] text-slate-700 hover:bg-white hover:text-slate-900 border border-gray-200 rounded-md text-[12px] font-medium transition-all duration-200">
            View Plans
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar