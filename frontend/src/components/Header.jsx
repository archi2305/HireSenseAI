import { useState, useRef, useEffect } from "react"
import { Bell, User, Search, Settings, LogOut, ChevronDown } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"

function Header({ search, onSearchChange, notifications }) {
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  
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
    localStorage.removeItem("isAuthenticated")
    localStorage.removeItem("user")
    navigate("/login")
  }

  // Ensure z-index is high so drop down elements stay above other layout things
  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white/80 backdrop-blur-md border-b border-slate-100 z-40 sticky top-0 shadow-sm">
      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 border border-slate-200/50 flex-1 max-w-sm hover:bg-white focus-within:bg-white focus-within:ring-2 focus-within:ring-pastelBlue focus-within:border-transparent transition-all">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes, skills, or candidates..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
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
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-sm">
              <User className="w-4 h-4 text-slate-800" />
            </div>
            <div className="flex flex-col text-left mr-1">
              <span className="text-xs font-semibold text-slate-700 leading-none">Guest User</span>
              <span className="text-[10px] text-slate-500 leading-none mt-0.5">guest@hiresense.ai</span>
            </div>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50 transform opacity-100 scale-100 transition-all origin-top-right">
              <div className="px-4 py-2 border-b border-slate-50 mb-1">
                <p className="text-sm font-semibold text-slate-800">My Account</p>
              </div>
              
              <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <User className="w-4 h-4" />
                Profile
              </Link>
              
              <Link to="/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-3 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                <Settings className="w-4 h-4" />
                Settings
              </Link>
              
              <div className="h-px bg-slate-100 my-1"></div>
              
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Log out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

export default Header
