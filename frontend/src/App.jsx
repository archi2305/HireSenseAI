import { useState, useEffect } from "react"
import { Routes, Route, Navigate, useNavigate, Outlet } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"

import Sidebar from "./components/sidebar"
import Header from "./components/Header"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import Dashboard from "./pages/Dashboard"
import ResumeAnalyzer from "./components/ResumeAnalyzer"
import CandidateMatching from "./pages/CandidateMatching"
import History from "./pages/History"
import Settings from "./pages/Settings"
import OAuthSuccess from "./pages/OAuthSuccess"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-dashboardBg">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastelBlue"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function Layout() {
  const [notifications, setNotifications] = useState([])

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
        <Header notifications={notifications} />
        
        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/analyzer" element={<ResumeAnalyzer />} />
            <Route path="/matching" element={<CandidateMatching />} />
            <Route path="/history" element={<History />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Routes>
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
