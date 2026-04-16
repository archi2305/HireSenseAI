import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Loader2, Mail, Lock, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";

import InputField from "../components/InputField";
import SocialButton from "../components/SocialButton";
import SectionReveal from "../components/SectionReveal";

function Login() {
  const { login, devLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const error = searchParams.get("error");
    const provider = searchParams.get("provider");
    if (!error) return;

    if (error === "provider_not_configured") {
      const providerName = provider ? `${provider[0].toUpperCase()}${provider.slice(1)}` : "Social";
      toast.error(`${providerName} login is not configured on server`);
      return;
    }
    if (error === "provider_not_supported") {
      toast.error("Selected social provider is not supported");
      return;
    }
    if (error === "oauth_redirect_failed") {
      toast.error("Could not start social login flow");
      return;
    }
    if (error === "oauth_failed") {
      toast.error("Social login failed. Please try again");
      return;
    }
    if (error === "missing_email") {
      toast.error("Social account email is unavailable");
    }
    if (error === "google_disabled" || error === "google_not_configured") {
      toast.error("Google sign-in is not configured on server");
    }
  }, [searchParams]);

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

  const handleGoogleLogin = () => {
    setLoading(true);
    window.location.href = `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/google/login`;
  };

  const handleDemoLogin = () => {
    setLoading(true);
    try {
      devLogin();
      navigate("/dashboard");
    } catch (error) {
      toast.error("Demo login failed");
      console.error("Demo login failed", error);
    } finally {
      setLoading(false);
    }
  };

  const GoogleIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.48-1.73 4.35-5.27 4.35-3.17 0-5.75-2.62-5.75-5.85s2.58-5.85 5.75-5.85c1.8 0 3 .77 3.69 1.43l2.51-2.43C16.72 4.2 14.66 3.3 12.17 3.3 7.2 3.3 3.17 7.36 3.17 12.35s4.03 9.05 9 9.05c5.2 0 8.64-3.65 8.64-8.8 0-.6-.07-1.05-.16-1.5z"/>
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

            <div className="space-y-3 mb-8 relative z-10">
              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={loading}
                className="w-full py-3 rounded-2xl border border-indigo-200/80 bg-white/90 text-sm font-semibold text-indigo-700 hover:bg-white hover:shadow-md transition-all disabled:opacity-60"
              >
                Continue as demo (no password)
              </button>
              <SocialButton
                icon={GoogleIcon}
                text="Google"
                provider="Google"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="!rounded-2xl !border-white/70 !bg-white/75 !text-slate-700 hover:!bg-white hover:!shadow-md hover:!border-indigo-200"
              />
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
