import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock } from "lucide-react";

import InputField from "../components/InputField";
import SocialButton from "../components/SocialButton";

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

  // Mock social login
  const handleSocialLogin = (provider) => {
    console.log(`Logging in with ${provider}`);
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
    <div className="min-h-screen flex w-full bg-slate-50 relative overflow-hidden">
      
      {/* Background Floating Orbs for Mobile */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-mint/30 blur-3xl lg:hidden animation-float"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-pastelBlue/30 blur-3xl lg:hidden animation-float" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[40%] right-[-20%] w-[50%] h-[50%] rounded-full bg-softPink/20 blur-3xl lg:hidden animation-float" style={{ animationDelay: '4s' }}></div>

      {/* LEFT SIDE: Brand / Welcome (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 flex-col justify-between p-12 bg-gradient-to-br from-mint via-softPink to-pastelBlue relative overflow-hidden">
        {/* Decorative glass shapes */}
        <div className="absolute top-[20%] right-[10%] w-64 h-64 bg-white/20 backdrop-blur-3xl rounded-full mix-blend-overlay animate-pulse"></div>
        <div className="absolute bottom-[10%] left-[20%] w-80 h-80 bg-white/20 backdrop-blur-2xl rounded-full mix-blend-overlay animate-pulse" style={{ animationDelay: '2s' }}></div>
        
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/30 backdrop-blur-md flex items-center justify-center shadow-lg border border-white/40">
            <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6 text-white" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          </div>
          <span className="text-2xl font-bold text-white tracking-tight">HireSense AI</span>
        </div>

        <div className="relative z-10 max-w-md">
          <h1 className="text-5xl font-extrabold text-white mb-6 leading-tight">
            Smart hiring <br/> starts here.
          </h1>
          <p className="text-lg text-white/90 leading-relaxed font-medium">
            AI-powered resume parsing and ATS scoring to find your perfect candidate effortlessly.
          </p>
        </div>

        <div className="relative z-10 flex gap-4 text-white/80 text-sm font-medium">
          <span>Targeted analytics</span>
          <span>•</span>
          <span>Precision matching</span>
        </div>
      </div>

      {/* RIGHT SIDE: Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_40px_rgb(0,0,0,0.06)] p-8 sm:p-10 border border-white">
          
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mint to-pastelBlue flex items-center justify-center shadow-md">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-slate-800" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
            </div>
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">HireSense AI</span>
          </div>

          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-800 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm">Please log in to your account.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="Email Address"
              type="email"
              name="email"
              icon={Mail}
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              success={formData.email && !errors.email}
              disabled={loading}
            />

            <InputField
              label="Password"
              type="password"
              name="password"
              icon={Lock}
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              disabled={loading}
            />

            <div className="flex items-center justify-between mt-2 mb-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-pastelBlue focus:ring-pastelBlue/30 transition-colors" />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-sm font-semibold text-pastelBlue hover:text-indigo-500 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center py-3.5 rounded-2xl text-sm font-bold text-slate-800
                bg-gradient-to-r from-mint via-pastelBlue to-softPink
                shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-pastelBlue/30
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 
                relative overflow-hidden group
              `}
            >
              {/* Shine effect */}
              <div className="absolute inset-0 w-1/4 h-full bg-white/30 transform skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <div className="mt-8 space-y-3">
            <SocialButton icon={GoogleIcon} provider="Google" onClick={() => handleSocialLogin('Google')} disabled={loading} />
            <SocialButton icon={GithubIcon} provider="GitHub" onClick={() => handleSocialLogin('GitHub')} disabled={loading} />
          </div>

          <p className="text-center text-sm text-slate-500 mt-10">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-pastelBlue hover:text-indigo-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      {/* Tailwind Custom Keyframes applied via index.css usually, but can use Arbitrary variants */}
      <style>{`
        @keyframes shine {
          100% { transform: translateX(400%) skewX(12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.05); }
        }
        .animation-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
