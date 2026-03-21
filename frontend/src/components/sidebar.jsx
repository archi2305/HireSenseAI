import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, History, Settings, Target, User } from "lucide-react"

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
    <div className="w-64 h-full bg-white border-r border-slate-100 flex flex-col p-6 shadow-sm z-30">
      <div className="mb-8 px-2 flex items-center gap-3">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-sm">
          <FileText className="w-4 h-4 text-slate-800" />
        </div>
        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
          HireSense
        </h2>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menu.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.path

            return (
              <li key={item.name}>
                <Link
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 font-medium text-sm
                  ${isActive 
                    ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`}
                >
                  <Icon 
                    size={18} 
                    className={`${isActive ? "text-pastelBlue" : "text-slate-400"}`} 
                  />
                  {item.name}
                  
                  {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-pastelBlue" />
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="p-4 bg-gradient-to-br from-softPink/10 to-lavender/10 rounded-2xl border border-softPink/20 text-center">
          <p className="text-xs font-semibold text-slate-700 mb-1">Upgrade to Pro</p>
          <p className="text-[10px] text-slate-500 mb-3">Get unlimited resume parsing</p>
          <button className="w-full py-2 bg-white rounded-lg text-xs font-semibold text-slate-700 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            View Plans
          </button>
        </div>
      </div>
    </div>
  )
}

export default Sidebar