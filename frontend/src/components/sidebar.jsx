import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, FileText, History, Settings, Target, User } from "lucide-react"
import { motion, LayoutGroup } from "framer-motion"

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

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="w-72 h-full bg-white/70 backdrop-blur-md border-r border-white/50 flex flex-col p-6 shadow-glass z-30"
    >
      <motion.div 
        variants={itemVariants}
        className="mb-10 px-3 flex items-center gap-4"
      >
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-card hover:scale-110 transition-transform duration-300">
          <FileText className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
          HireSense
        </h2>
      </motion.div>

      <nav className="flex-1">
        <LayoutGroup>
          <ul className="space-y-2 relative">
            {menu.map((item, index) => {
              const Icon = item.icon
              const isActive = location.pathname === item.path

              return (
                <motion.li 
                  key={item.name} 
                  variants={itemVariants}
                  className="relative group"
                >
                  {isActive && (
                    <motion.div
                      layoutId="sidebar-active"
                      className="absolute inset-0 bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-2xl shadow-sm"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  <Link
                    to={item.path}
                    className={`relative z-10 flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 font-medium text-sm
                    ${isActive 
                      ? "text-indigo-600" 
                      : "text-slate-500 hover:text-slate-900 hover:bg-white/50"
                    }`}
                  >
                    <motion.div 
                      whileHover={{ scale: 1.15, rotate: 5 }} 
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                      <Icon 
                        size={20} 
                        className={`transition-colors duration-300 ${isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-indigo-500"}`} 
                      />
                    </motion.div>
                    <span className="font-medium">{item.name}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="sidebar-dot"
                        className="ml-auto w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 shadow-sm" 
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.li>
              )
            })}
          </ul>
        </LayoutGroup>
      </nav>
      
      <motion.div 
        variants={itemVariants}
        className="mt-auto pt-10"
      >
        <div className="p-6 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 rounded-2xl border border-indigo-100/50 text-center hover:shadow-card transition-all duration-300">
          <p className="text-sm font-semibold text-slate-700 mb-2">Upgrade to Pro</p>
          <p className="text-xs text-slate-500 mb-4">Get unlimited resume parsing</p>
          <motion.button 
            whileHover={{ scale: 1.05 }} 
            whileTap={{ scale: 0.95 }}
            className="w-full py-3 bg-gradient-to-r from-indigo-400 to-purple-400 text-white rounded-xl text-sm font-semibold shadow-card hover:shadow-hover-card transition-all duration-300"
          >
            View Plans
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default Sidebar