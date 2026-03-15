import { useState } from "react"

function Signup({ onSignup }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!name || !email || !password) return
    onSignup?.({ name, email })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dashboardBg">
      <div className="bg-cardBg rounded-2xl shadow-md p-8 w-full max-w-md">
        <h1 className="text-2xl font-semibold text-slate-900 mb-1">
          Create your account
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Sign up to start analyzing resumes with HireSense AI.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-dashboardBg focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-dashboardBg focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm bg-dashboardBg focus:outline-none focus:ring-2 focus:ring-pastelBlue"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 rounded-xl text-sm font-semibold text-slate-900 bg-gradient-to-r from-softPink to-lavender shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Sign up
          </button>
        </form>
      </div>
    </div>
  )
}

export default Signup

