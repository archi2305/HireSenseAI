import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

import InputField from "../components/InputField";
import SocialButton from "../components/SocialButton";
import SectionReveal from "../components/SectionReveal";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    }
    return newErrors;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    const success = await login(formData.email, formData.password);
    setLoading(false);

    if (success) {
      navigate("/dashboard");
    }
  };

  const handleSocialLogin = (provider) => {
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/${provider.toLowerCase()}/login`;
  };

  const GoogleIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );

  const GithubIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-gradient-to-br from-[#f4ecff] via-[#edf4ff] to-[#e6f6ff] font-sans">
      <div className="pointer-events-none absolute -top-28 -left-16 h-72 w-72 rounded-full bg-[#d7c7ff]/45 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-12 h-80 w-80 rounded-full bg-[#9ed5ff]/40 blur-3xl" />

      <SectionReveal direction="down">
        <div className="w-full max-w-[460px] relative z-10 flex flex-col items-center">
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-14 h-14 rounded-2xl bg-white/75 border border-white/80 flex items-center justify-center text-indigo-500 shadow-[0_12px_30px_rgba(90,95,180,.16)]">
              <Sparkles size={22} />
            </div>
            <h1 className="mt-4 text-[30px] font-extrabold text-slate-900 tracking-tight leading-none">
              HireSense{" "}
              <span className="bg-gradient-to-r from-violet-600 to-sky-500 bg-clip-text text-transparent">
                AI
              </span>
            </h1>
            <div className="mt-2 flex items-center gap-2 text-slate-500">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.16em]">
                Interview-ready workspace
              </span>
            </div>
          </div>

          <div className="w-full p-8 md:p-10 rounded-3xl border border-white/55 bg-white/55 backdrop-blur-xl shadow-[0_30px_90px_rgba(99,102,241,.18)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-violet-200/20 via-white/5 to-sky-200/20 pointer-events-none" />

            <div className="text-center mb-8 relative z-10">
              <h2 className="text-[30px] font-bold text-slate-900 tracking-tight mb-1">Welcome back</h2>
              <p className="text-slate-600 text-[14px] font-medium">
                Sign in to continue hiring with intelligence.
              </p>
            </div>

            <div className="flex gap-3 mb-8 relative z-10">
              <div className="flex-1">
                <SocialButton
                  icon={GoogleIcon}
                  text="Google"
                  provider="Google"
                  onClick={() => handleSocialLogin("Google")}
                  disabled={loading}
                  className="!rounded-2xl !border-white/70 !bg-white/75 !text-slate-700 hover:!bg-white hover:!shadow-md hover:!border-indigo-200"
                />
              </div>
              <div className="flex-1">
                <SocialButton
                  icon={GithubIcon}
                  text="GitHub"
                  provider="GitHub"
                  onClick={() => handleSocialLogin("GitHub")}
                  disabled={loading}
                  className="!rounded-2xl !border-white/70 !bg-white/75 !text-slate-700 hover:!bg-white hover:!shadow-md hover:!border-indigo-200"
                />
              </div>
            </div>

            <div className="mb-8 flex items-center gap-4 relative z-10">
              <div className="flex-1 h-px bg-slate-200/70"></div>
              <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-[0.16em]">or</span>
              <div className="flex-1 h-px bg-slate-200/70"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
              <div className="space-y-4">
                <InputField
                  label="Email address"
                  type="email"
                  name="email"
                  icon={Mail}
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  className="!rounded-2xl !border-white/70 !bg-white/80 focus:!ring-indigo-200/60 focus:!border-indigo-300"
                />

                <InputField
                  label="Password"
                  type="password"
                  name="password"
                  icon={Lock}
                  value={formData.password}
                  onChange={handleChange}
                  error={errors.password}
                  className="!rounded-2xl !border-white/70 !bg-white/80 focus:!ring-indigo-200/60 focus:!border-indigo-300"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded-md border-slate-300 bg-white/80 text-indigo-500 focus:ring-indigo-300/60 transition-all" />
                  <span className="text-xs font-medium text-slate-500 group-hover:text-slate-700 transition-colors">Keep me signed in</span>
                </label>
                <Link to="/forgot-password" size="sm" className="text-xs font-semibold text-indigo-500 hover:underline tracking-wide">
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-violet-600 to-sky-500 text-white shadow-[0_14px_34px_rgba(99,102,241,.36)] hover:-translate-y-0.5 hover:shadow-[0_18px_42px_rgba(59,130,246,.38)] transition-all duration-300 flex items-center justify-center gap-3 font-semibold tracking-wide relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[14px] font-semibold">Verifying...</span>
                  </>
                ) : (
                  <>
                    <span className="text-[14px] font-semibold">Access Workspace</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[12px] font-medium text-slate-500 mt-8 relative z-10">
              New to HireSense?{" "}
              <Link to="/signup" className="font-semibold text-indigo-500 hover:underline ml-1">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}

export default Login;
