import { useState } from "react"
import { Bell, User, Search } from "lucide-react"
import NotificationDropdown from "./NotificationDropdown"

function Header({ search, onSearchChange, notifications }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-white/60 backdrop-blur border-b border-slate-100/50">
      {/* Search Bar */}
      <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100/50 border border-slate-200/50 flex-1 max-w-xs hover:bg-slate-100 transition-colors">
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search resumes..."
          value={search}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="bg-transparent text-sm outline-none w-full text-slate-700 placeholder:text-slate-500"
        />
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-slate-100 transition-all duration-200 hover:scale-105"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {notifications && notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-softPink text-[10px] text-white flex items-center justify-center font-semibold">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>
          <NotificationDropdown items={notifications} open={open} />
        </div>

        {/* User Profile */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-100/50 border border-slate-200/50 hover:bg-slate-100 transition-colors cursor-pointer">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-softPink to-lavender flex items-center justify-center">
            <User className="w-3 h-3 text-white" />
          </div>
          <span className="text-xs font-medium text-slate-700">
            Guest
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header

