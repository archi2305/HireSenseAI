import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, User, BrainCircuit, Zap, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

import InputField from "../components/InputField";
import SocialButton from "../components/SocialButton";
import SectionReveal from "../components/SectionReveal";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullname) newErrors.fullname = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
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
    const success = await signup(formData.fullname, formData.email, formData.password);
    setLoading(false);

    if (success) {
      navigate("/login");
    }
  };

  const GithubIcon = (props) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
    </svg>
  );

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-y-auto bg-theme-bg font-sans transition-colors duration-500">
      
      {/* Premium Mixpanel Background */}
      <div className="fixed inset-0 mesh-gradient opacity-60"></div>
      
      {/* Floating Background Effects */}
      <div className="fixed top-[-10%] left-[-5%] w-[40vw] h-[40vw] rounded-full bg-theme-accent/5 blur-[120px] animate-pulse-glow"></div>
      <div className="fixed bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] rounded-full bg-blue-500/5 blur-[120px] animate-pulse-glow" style={{ animationDelay: '2s' }}></div>

      <SectionReveal direction="down">
        <div className="w-full max-w-[440px] relative z-10 flex flex-col items-center my-8">
          
          <div className="flex flex-col items-center justify-center mb-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-theme-accent flex items-center justify-center text-white shadow-accent-glow transform hover:scale-105 transition-all duration-500 group relative overflow-hidden">
               <Zap size={28} fill="white" className="relative z-10" />
               <motion.div 
                  animate={{ x: ['100%', '-100%'] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                  className="absolute inset-0 bg-white/20 skew-x-12"
               />
            </div>
            <h1 className="mt-4 text-[24px] font-black text-theme-text tracking-tighter leading-none italic uppercase">
              HireSense <span className="text-theme-accent">AI</span>
            </h1>
            <div className="mt-2 flex items-center gap-2">
               <div className="w-1.5 h-1.5 rounded-full bg-theme-accent animate-pulse" />
               <span className="text-[10px] text-theme-textSecondary font-black uppercase tracking-[0.2em]">Recruitment Source Protocol</span>
            </div>
          </div>

          <div className="w-full linear-card p-10 backdrop-premium border-theme-accent/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-tr from-theme-accent/5 via-transparent to-transparent pointer-events-none" />
            
            <div className="text-center mb-8 relative z-10">
              <h2 className="text-[24px] font-black text-theme-text tracking-tight mb-1">Create Source</h2>
              <p className="text-theme-textSecondary text-[13px] font-medium italic opacity-70">Register your organizational framework.</p>
            </div>

            <div className="mb-8 relative z-10">
              <SocialButton
                icon={GithubIcon}
                text="GitHub"
                provider="GitHub"
                onClick={() => {
                  console.log("Redirecting to backend...");
                  window.location.href = "http://localhost:8000/auth/github/login";
                }}
                disabled={loading}
                className="!bg-theme-bg !border-theme-border hover:!border-theme-accent/30 !text-theme-text"
              />
            </div>

            <div className="mb-8 flex items-center gap-4 opacity-30 relative z-10">
              <div className="flex-1 h-px bg-theme-border"></div>
              <span className="text-[10px] font-black text-theme-text uppercase tracking-widest">Or</span>
              <div className="flex-1 h-px bg-theme-border"></div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
              <InputField
                label="Full Protocol Name"
                type="text"
                name="fullname"
                icon={User}
                value={formData.fullname}
                onChange={handleChange}
                error={errors.fullname}
                className="!linear-input !bg-theme-bg"
              />

              <InputField
                label="Email Identifier"
                type="email"
                name="email"
                icon={Mail}
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                className="!linear-input !bg-theme-bg"
              />

              <InputField
                label="Access Key"
                type="password"
                name="password"
                icon={Lock}
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                className="!linear-input !bg-theme-bg"
              />

              <InputField
                label="Verify Key"
                type="password"
                name="confirmPassword"
                icon={Lock}
                value={formData.confirmPassword}
                onChange={handleChange}
                error={errors.confirmPassword}
                className="!linear-input !bg-theme-bg"
              />

              <button
                type="submit"
                disabled={loading}
                className="linear-btn-primary w-full py-4 mt-4 shadow-accent-glow flex items-center justify-center gap-3 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12" />
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span className="text-[14px] font-black uppercase tracking-widest">Deploying...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span className="text-[14px] font-black uppercase tracking-widest">Initialize Node</span>
                  </>
                )}
              </button>
            </form>

            <p className="text-center text-[12px] font-medium text-theme-textSecondary mt-10 relative z-10">
              Already have credentials?{" "}
              <Link to="/login" className="font-black text-theme-accent hover:underline uppercase tracking-widest ml-1">
                Access Protocol
              </Link>
            </p>
          </div>
        </div>
      </SectionReveal>
    </div>
  );
}

export default Signup;
