import React, { useState, useRef, useEffect } from "react"
import { Bell, User, Search, Settings, LogOut, ChevronDown } from "lucide-react"
import { useNavigate, Link } from "react-router-dom"
import NotificationDropdown from "./NotificationDropdown"
import { useAuth } from "../context/AuthContext"
import { useDashboard } from "../context/DashboardContext"
import Tooltip from "./Tooltip"

function Header({ notifications }) {
  const { searchTerm, setSearchTerm } = useDashboard()
  const [bellOpen, setBellOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  
  const profileRef = useRef(null)
  const bellRef = useRef(null)

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
    <header className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200 sticky top-0 z-40 transition-all duration-200">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-gray-50 border border-gray-200 flex-1 max-w-sm transition-all duration-200 focus-within:border-[#a5b4fc] focus-within:bg-white">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent text-[13px] outline-none w-full text-slate-800 placeholder:text-slate-400 font-medium"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        <div className="relative" ref={bellRef}>
          <Tooltip content="Notifications">
            <button
              onClick={() => {
                setBellOpen(!bellOpen)
                setProfileOpen(false)
              }}
              className="relative p-2 rounded-md hover:bg-gray-100 transition-all duration-200 text-slate-500 hover:text-slate-800"
            >
              <Bell className="w-4 h-4" />
              {notifications && notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#a5b4fc] border border-white" />
              )}
            </button>
          </Tooltip>
          
          {bellOpen && (
            <div className="absolute right-0 mt-2 w-80 z-50 bg-white rounded-md border border-gray-200 shadow-sm">
              <NotificationDropdown items={notifications} open={bellOpen} />
            </div>
          )}
        </div>

        <div className="relative" ref={profileRef}>
          <button 
            onClick={() => {
              setProfileOpen(!profileOpen)
              setBellOpen(false)
            }}
            className="flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-gray-100 transition-all duration-200 text-left"
          >
            {user?.avatar_url ? (
              <img src={`${import.meta.env.VITE_API_URL || "http://127.0.0.1:8000"}${user.avatar_url}`} alt="Avatar" className="w-6 h-6 rounded border border-gray-200 object-cover" />
            ) : (
              <div className="w-6 h-6 rounded bg-[#a5b4fc] flex items-center justify-center">
                <User className="w-3 h-3 text-white" />
              </div>
            )}
            <div className="flex items-center gap-1">
              <span className="text-[13px] font-medium text-slate-700">{user?.fullname?.split(" ")[0] || "User"}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-sm border border-gray-200 py-1 z-50">
              <div className="px-3 py-2 border-b border-gray-100 mb-1">
                <p className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">{user?.email || "Account"}</p>
              </div>
              
              <Link 
                to="/profile" 
                onClick={() => setProfileOpen(false)} 
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-gray-50 transition-all duration-200"
              >
                <User className="w-4 h-4 text-slate-400" />
                Profile
              </Link>
              
              <Link 
                to="/settings" 
                onClick={() => setProfileOpen(false)} 
                className="flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-slate-700 hover:bg-gray-50 transition-all duration-200"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                Settings
              </Link>
              
              <div className="h-px bg-gray-100 my-1"></div>
              
              <button
                onClick={handleLogout}
                className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-[13px] font-medium text-red-600 hover:bg-red-50 transition-all duration-200"
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
