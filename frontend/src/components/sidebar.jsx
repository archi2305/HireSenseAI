import {
  LayoutDashboard,
  Upload,
  FileText,
  BarChart3,
  History
} from "lucide-react"

function Sidebar({ setPage }) {

  const menuItem =
    "flex items-center gap-3 px-4 py-3 text-gray-200 hover:bg-white/10 rounded-lg cursor-pointer transition"

  return (

    <div className="w-64 min-h-screen bg-gradient-to-b from-[#0f172a] to-[#020617] p-5">

      {/* Logo */}

      <div className="flex items-center gap-3 mb-10">

        <div className="bg-indigo-600 p-2 rounded-lg">
          <LayoutDashboard size={20} color="white" />
        </div>

        <h1 className="text-white text-lg font-semibold">
          HireSense AI
        </h1>

      </div>

      {/* Menu */}

      <div className="flex flex-col gap-2">

        <div
          className={menuItem}
          onClick={() => setPage("dashboard")}
        >
          <LayoutDashboard size={18} />
          Dashboard
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("upload")}
        >
          <Upload size={18} />
          Upload Resume
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("resumes")}
        >
          <FileText size={18} />
          My Resumes
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("analytics")}
        >
          <BarChart3 size={18} />
          Analytics
        </div>

        <div
          className={menuItem}
          onClick={() => setPage("history")}
        >
          <History size={18} />
          History
        </div>

      </div>

    </div>

  )
}

export default Sidebar