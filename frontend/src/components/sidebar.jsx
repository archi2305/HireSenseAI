import { LayoutDashboard, FileText, History, Settings } from "lucide-react"

function Sidebar({ active, onChange }) {
  const menu = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Resume Analyzer", icon: FileText },
    { name: "History", icon: History },
    { name: "Settings", icon: Settings }
  ]

  return (
    <div className="w-64 h-screen bg-white border-r p-6">
      <h2 className="text-xl font-bold mb-8">HireSense</h2>

      <ul className="space-y-4">
        {menu.map((item) => {
          const Icon = item.icon

          return (
            <li
              key={item.name}
              onClick={() => onChange(item.name)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer 
              ${active === item.name ? "bg-pink-100 text-pink-600" : "hover:bg-gray-100"}`}
            >
              <Icon size={18} />
              {item.name}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export default Sidebar