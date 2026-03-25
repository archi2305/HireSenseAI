import { Routes, Route, Navigate, useLocation } from "react-router-dom"
import { Toaster } from "react-hot-toast"
import { AnimatePresence, motion } from "framer-motion"
import { AuthProvider, useAuth } from "./context/AuthContext"
import { DashboardProvider } from "./context/DashboardContext"
import ToastContainer from "./components/ToastContainer"
import PageTransition from "./components/PageTransition"

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
import Profile from "./pages/Profile"

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-theme-bg">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 1, 0.5] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-12 h-12 bg-theme-accent rounded-full shadow-accent-glow"
        />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }
  
  return children
}

function Layout() {
  const location = useLocation()
  const notifications = [
    { id: 1, message: "Welcome to HireSense AI!" },
    { id: 2, message: "Engine successfully calibrated." }
  ]

  return (
    <div className="flex h-screen w-full bg-theme-bg text-theme-text font-sans selection:bg-theme-accent selection:text-white overflow-hidden mesh-gradient relative">
      
      {/* Background Glows for Mixpanel Feel */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-theme-accent/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 h-full relative z-10 overflow-hidden bg-transparent">
        <Header notifications={notifications} />
        
        <main className="flex-1 overflow-y-auto w-full relative">
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              <Route path="dashboard" element={<PageTransition><Dashboard /></PageTransition>} />
              <Route path="analyzer" element={<PageTransition><ResumeAnalyzer /></PageTransition>} />
              <Route path="matching" element={<PageTransition><CandidateMatching /></PageTransition>} />
              <Route path="history" element={<PageTransition><History /></PageTransition>} />
              <Route path="profile" element={<PageTransition><Profile /></PageTransition>} />
              <Route path="settings" element={<PageTransition><Settings /></PageTransition>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
      
      <ToastContainer />
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <DashboardProvider>
        <Toaster 
          position="bottom-right" 
          toastOptions={{ 
            className: 'floating-layer backdrop-premium !border-theme-border !text-theme-text !bg-theme-surface/80',
            duration: 4000
          }} 
        />
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/oauth-success" element={<OAuthSuccess />} />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DashboardProvider>
    </AuthProvider>
  )
}

export default App
