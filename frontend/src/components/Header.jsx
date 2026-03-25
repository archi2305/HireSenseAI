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

  // Ensure z-index is high so drop down elements stay above other layout things
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white/70 backdrop-blur-xl border-b border-white/60 z-40 sticky top-0 transition-shadow transition-colors duration-300">
      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200/50 flex-1 max-w-sm hover:shadow-soft focus-within:shadow-soft focus-within:ring-2 focus-within:ring-pastelBlue focus-within:border-transparent transition-all duration-300">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes, skills, or candidates..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-400"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative" ref={bellRef}>
          <button
            type="button"
            onClick={() => {
              setBellOpen(!bellOpen)
              setProfileOpen(false)
            }}
            className="relative p-2.5 rounded-full hover:bg-slate-50 transition-colors duration-200 border border-transparent hover:border-slate-100 focus:outline-none focus:ring-2 focus:ring-pastelBlue"
          >
            <Bell className="w-5 h-5 text-slate-600" />
            {notifications && notifications.length > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-softPink border-2 border-white"></span>
            )}
          </button>
          
          <div className="absolute right-0 mt-2 w-80 z-50">
            <NotificationDropdown items={notifications} open={bellOpen} />
          </div>
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button 
            type="button"
            onClick={() => {
              setProfileOpen(!profileOpen)
              setBellOpen(false)
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200/50 hover:bg-slate-50 transition-colors focus:outline-none focus:ring-2 focus:ring-pastelBlue bg-white shadow-sm"
          >
            {user?.avatar_url ? (
              <img src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${user.avatar_url}`} alt="Avatar" className="w-8 h-8 rounded-lg object-cover shadow-sm border border-slate-200" />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-sm">
                <User className="w-4 h-4 text-slate-800" />
              </div>
            )}
            <div className="flex flex-col text-left mr-1">
              <span className="text-xs font-semibold text-slate-700 leading-none">{user?.fullname || "Guest User"}</span>
              <span className="text-[10px] text-slate-500 leading-none mt-0.5">{user?.email || "guest@hiresense.ai"}</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          <AnimatePresence>
          {profileOpen && (
            <motion.div 
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute right-0 mt-2 w-56 bg-white/95 backdrop-blur-2xl rounded-2xl shadow-glass border border-white/60 py-2 z-50 origin-top-right"
            >
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-sm font-semibold text-slate-800">My Account</p>
              </div>
              
              <Link to="/profile" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-dashboardBg hover:text-slate-900 transition-colors">
                <User className="w-4 h-4 text-pastelBlue" />
                Profile
              </Link>
              
              <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-dashboardBg hover:text-slate-900 transition-colors">
                <Settings className="w-4 h-4 text-pastelBlue" />
                Settings
              </Link>
              
              <div className="h-px bg-slate-100 my-1 w-[80%] mx-auto"></div>
              
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </motion.div>
          )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  )
}

export default Header
