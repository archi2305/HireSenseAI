import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom"
import Sidebar from "./components/sidebar"
import Header from "./components/Header"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ResumeAnalyzer from "./components/ResumeAnalyzer"
import History from "./pages/History"
import Settings from "./pages/Settings"

function ProtectedRoute({ children }) {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true"
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }
  return children
}

function Layout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [notifications, setNotifications] = useState([])

  const handleSearch = (value) => {
    setSearchQuery(value)
  }

  // Adding some initial notifications for the dropdown testing
  useEffect(() => {
    setNotifications([
      { id: 1, message: "Welcome to HireSense UI!" },
      { id: 2, message: "Your ATS score is now available for John Doe." }
    ])
  }, [])

  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-gradient">
      {/* SIDEBAR (Left) */}
      <Sidebar />

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col relative w-full h-full">
        {/* HEADER (Top) */}
        <Header
          search={searchQuery}
          onSearchChange={handleSearch}
          notifications={notifications}
        />
        
        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  )
}

function App() {
  const navigate = useNavigate()

  const handleLogin = (user) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(user))
    navigate("/dashboard")
  }

  const handleSignup = (user) => {
    localStorage.setItem("isAuthenticated", "true")
    localStorage.setItem("user", JSON.stringify(user))
    navigate("/dashboard")
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route path="/signup" element={<Signup onSignup={handleSignup} />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analyzer" element={<ResumeAnalyzer />} />
        <Route path="/history" element={<History />} />
        <Route path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default App
