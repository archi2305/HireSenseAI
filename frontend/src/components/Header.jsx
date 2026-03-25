import { useState, useRef, useEffect } from "react"
import { Bell, User, Search, Settings, LogOut, ChevronDown } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"
import { motion, AnimatePresence } from "framer-motion"

function Header({ notifications }) {
  const { searchTerm, setSearchTerm } = useDashboard()
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const profileRef = useRef(null)
  const bellRef = useRef(null)

  const containerVariants = {
    hidden: { opacity: 0, y: -20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  // Quick close on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
      if (bellRef.current && !bellRef.current.contains(event.target)) {
        setBellOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <motion.header 
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-md border-b border-white/50 shadow-card sticky top-0 z-40 transition-all duration-300"
    >
      {/* Search Bar */}
      <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/50 flex-1 max-w-md hover:bg-white/80 focus-within:bg-white focus-within:shadow-hover-card focus-within:ring-2 focus-within:ring-indigo-400 focus-within:border-transparent transition-all duration-300">
        <Search className="w-5 h-5 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes, skills, or candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-6 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <motion.button
            type="button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setBellOpen(!bellOpen)
              setProfileOpen(false)
            }}
            className="relative p-3 rounded-full hover:bg-white/60 transition-all duration-300 border border-transparent hover:border-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400 shadow-sm"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications && notifications.length > 0 && (
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="absolute top-1 right-1 w-3 h-3 rounded-full bg-gradient-to-r from-softPink to-pastelBlue border-2 border-white shadow-sm"
              />
            )}
          </motion.button>
          
          <div className="absolute right-0 mt-3 w-80 z-50">
            <NotificationDropdown items={notifications} open={bellOpen} />
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <motion.button 
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              setProfileOpen(!profileOpen)
              setBellOpen(false)
            }}
            className="flex items-center gap-3 px-4 py-2.5 rounded-2xl border border-white/50 hover:bg-white/60 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white/60 backdrop-blur-sm shadow-sm"
          >
            {user?.avatar_url ? (
              <img src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${user.avatar_url}`} alt="Avatar" className="w-9 h-9 rounded-xl object-cover shadow-sm border border-white/50" />
            ) : (
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-sm">
                <User className="w-5 h-5 text-white" />
              </div>
            )}
            <div className="flex flex-col text-left mr-1">
              <span className="text-sm font-semibold text-slate-700 leading-none">{user?.fullname || "Guest User"}</span>
              <span className="text-xs text-slate-500 leading-none mt-0.5">{user?.email || "guest@hiresense.ai"}</span>
            </div>
            <motion.div
              animate={{ rotate: profileOpen ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </motion.div>
          </motion.button>

          <AnimatePresence>
          {profileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-3 w-64 bg-white/90 backdrop-blur-md rounded-2xl shadow-hover-card border border-white/50 py-3 z-50 origin-top-right"
            >
              <div className="px-4 py-3 border-b border-white/50 mb-2">
                <p className="text-sm font-semibold text-slate-800">My Account</p>
              </div>
              
              <Link 
                to="/profile" 
                onClick={() => setProfileOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
              >
                <User className="w-4 h-4 text-indigo-500" />
                Profile
              </Link>
              
              <Link 
                to="/settings" 
                onClick={() => setProfileOpen(false)} 
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 transition-all duration-300"
              >
                <Settings className="w-4 h-4 text-indigo-500" />
                Settings
              </Link>
              
              <div className="h-px bg-slate-100 my-2 w-[80%] mx-auto"></div>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-all duration-300"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </motion.button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </motion.header>
  )
}

export default Header
