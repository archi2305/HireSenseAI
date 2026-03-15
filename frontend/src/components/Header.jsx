import { useState } from "react"
import { Bell, User } from "lucide-react"
import SearchBar from "./SearchBar"
import NotificationDropdown from "./NotificationDropdown"

function Header({ search, onSearchChange, notifications }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="flex items-center justify-between px-8 py-4 bg-cardBg/90 backdrop-blur border-b border-slate-100">
      <SearchBar value={search} onChange={onSearchChange} />

      <div className="flex items-center gap-4">
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((prev) => !prev)}
            className="relative p-2 rounded-full hover:bg-dashboardBg transition-all duration-200"
          >
            <Bell className="w-5 h-5 text-slate-700" />
            {notifications.length > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-softPink text-[10px] text-slate-800 flex items-center justify-center">
                {notifications.length > 9 ? "9+" : notifications.length}
              </span>
            )}
          </button>
          <NotificationDropdown items={notifications} open={open} />
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-dashboardBg border border-slate-100">
          <User className="w-4 h-4 text-slate-500" />
          <span className="text-xs font-medium text-slate-700">
            Guest
          </span>
        </div>
      </div>
    </header>
  )
}

export default Header

