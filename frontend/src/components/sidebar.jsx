import React from "react"
import { LayoutDashboard, FileText, History, Settings, User, BrainCircuit, BriefcaseBusiness } from "lucide-react"
import { Link, useLocation } from "react-router-dom"
import { motion } from "framer-motion"

function Sidebar() {
  const location = useLocation()
  
  const menu = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Analyzer", path: "/analyzer", icon: FileText },
    { name: "History", path: "/history", icon: History },
  ]
  const bottomMenu = [
    { name: "Preferences", path: "/preferences", icon: Settings }
  ]

  return (
    <div className="w-[240px] h-full bg-theme-sidebar flex flex-col border-r border-theme-border z-30 select-none transition-colors duration-500 relative overflow-hidden font-sans">
      
      {/* Sidebar background glow */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[30%] bg-theme-accent/5 blur-[80px] pointer-events-none" />

      <div className="px-6 h-16 flex items-center gap-3 shrink-0 mb-4">
        <div className="w-9 h-9 rounded-xl border border-theme-accent/30 bg-gradient-to-br from-violet-500/35 via-indigo-500/25 to-cyan-400/20 flex items-center justify-center text-white shadow-accent-glow relative overflow-hidden group">
          <BrainCircuit size={15} className="relative z-10" />
          <BriefcaseBusiness size={11} className="absolute -bottom-[1px] -right-[1px] z-10 text-cyan-100" />
          <motion.div
            animate={{ x: ["120%", "-120%"] }}
            transition={{ repeat: Infinity, duration: 2.2, ease: "linear" }}
            className="absolute inset-0 bg-white/20 skew-x-12"
          />
        </div>
        <div className="flex flex-col">
           <h2 className="text-[15px] font-black text-gradient-brand tracking-tighter leading-none">
             HIRESENSE
           </h2>
           <span className="text-[10px] text-theme-textSecondary font-bold tracking-widest uppercase">AI Hiring Copilot</span>
        </div>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto py-2 space-y-8">
        <div>
          <p className="px-4 mb-3 text-[10px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-40">Intelligence</p>
          <ul className="space-y-1">
            {menu.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`relative group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-[13px] font-semibold 
                    ${isActive 
                      ? "bg-theme-accent/5 text-theme-accent shadow-sm" 
                      : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute inset-x-0 inset-y-0 bg-theme-accent/5 border border-theme-accent/20 rounded-xl"
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon 
                      size={18} 
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-theme-accent" : "text-theme-textSecondary group-hover:text-theme-text"}`} 
                    />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        <div>
          <p className="px-4 mb-3 text-[10px] font-black text-theme-textSecondary uppercase tracking-[0.2em] opacity-40">Control</p>
          <ul className="space-y-1">
            {bottomMenu.map((item) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <li key={item.name}>
                  <Link
                    to={item.path}
                    className={`relative group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 text-[13px] font-semibold 
                    ${isActive 
                      ? "bg-theme-accent/5 text-theme-accent shadow-sm" 
                      : "text-theme-textSecondary hover:text-theme-text hover:bg-theme-hover"
                    }`}
                  >
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-active"
                        className="absolute inset-x-0 inset-y-0 bg-theme-accent/5 border border-theme-accent/20 rounded-xl"
                        transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    <Icon 
                      size={18} 
                      className={`relative z-10 transition-all duration-300 group-hover:scale-110 ${isActive ? "text-theme-accent" : "text-theme-textSecondary group-hover:text-theme-text"}`} 
                    />
                    <span className="relative z-10">{item.name}</span>
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>
      
      <div className="p-4 m-3 mt-auto bg-theme-surface/50 border border-theme-border rounded-2xl relative overflow-hidden group overflow-hidden">
        {/* Decorative glow */}
        <div className="absolute top-0 right-0 w-24 h-24 bg-theme-accent/10 blur-2xl rounded-full -mr-12 -mt-12 group-hover:bg-theme-accent/20 transition-colors duration-500" />
        
        <Link to="/profile" className="flex items-center gap-3 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-theme-accent/20 border border-theme-accent/30 flex items-center justify-center text-theme-accent group-hover:bg-theme-accent group-hover:text-white transition-all duration-500 shrink-0">
            <User size={18} />
          </div>
          <div className="flex flex-col min-w-0">
             <p className="text-[13px] font-bold text-theme-text truncate leading-none mb-1">Port Recruiter</p>
             <div className="flex items-center gap-1">
                <div className="w-1 h-1 rounded-full bg-success" />
                <p className="text-[10px] text-theme-textSecondary font-bold uppercase tracking-widest opacity-60">Verified</p>
             </div>
          </div>
        </Link>
      </div>
    </div>
  )
}

export default Sidebar