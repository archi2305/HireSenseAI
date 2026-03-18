import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Mail, Lock, BrainCircuit } from "lucide-react";

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

  const handleSocialLogin = (provider) => {
    setLoading(true);
    window.location.href = `http://127.0.0.1:8000/api/oauth/${provider.toLowerCase()}/login`;
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
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50 font-sans">
      
      {/* Dynamic Pastel Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mint/30 via-pink-50 to-pastelBlue/20 z-0"></div>
      
      {/* Floating Blurred Orbs wrapped in animation */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-mint/40 blur-[80px] sm:blur-[100px] animation-float z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-pastelBlue/40 blur-[90px] sm:blur-[120px] animation-float z-0" style={{ animationDelay: '2s' }}></div>
      <div className="absolute top-[20%] right-[30%] w-[35vw] h-[35vw] max-w-[400px] max-h-[400px] rounded-full bg-softPink/30 blur-[70px] sm:blur-[100px] animation-float z-0" style={{ animationDelay: '4s' }}></div>

      {/* Main Content Container */}
      <div className="w-full max-w-[420px] relative z-10 flex flex-col items-center">
        
        {/* Modern AI Logo */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-mint via-pastelBlue to-softPink p-[2px] shadow-xl shadow-pastelBlue/20 mb-4 transform hover:scale-105 transition-transform duration-300">
             <div className="w-full h-full bg-white/95 backdrop-blur-xl rounded-[14px] flex items-center justify-center">
               <BrainCircuit className="w-7 h-7 text-slate-800" />
             </div>
          </div>
          <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-600 tracking-tight">
            HireSkillAI
          </h1>
        </div>

        {/* Auth Glass Card */}
        <div className="w-full bg-white/70 backdrop-blur-2xl rounded-[32px] shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/60 p-8 sm:p-10">
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight mb-2">Welcome Back</h2>
            <p className="text-slate-500 text-sm font-medium">Please enter your details to sign in.</p>
          </div>

          {/* Equal Width Social Login */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <SocialButton icon={GoogleIcon} text="Google" provider="Google" onClick={() => handleSocialLogin('Google')} disabled={loading} />
            </div>
            <div className="flex-1">
              <SocialButton icon={GithubIcon} text="GitHub" provider="GitHub" onClick={() => handleSocialLogin('GitHub')} disabled={loading} />
            </div>
          </div>

          <div className="mb-6 flex items-center gap-4">
            <div className="flex-1 h-px bg-slate-200"></div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Or</span>
            <div className="flex-1 h-px bg-slate-200"></div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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

            <div className="flex items-center justify-between pt-1 pb-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-[18px] h-[18px] rounded-md border-slate-300 text-pastelBlue focus:ring-pastelBlue/30 transition-colors" />
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-sm font-semibold text-pastelBlue hover:text-indigo-500 transition-colors">
                Forgot password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`
                w-full flex items-center justify-center py-3.5 rounded-2xl text-sm font-bold text-white
                bg-gradient-to-r from-mint via-pastelBlue to-softPink background-animate
                shadow-lg shadow-pastelBlue/25 hover:shadow-xl hover:shadow-pastelBlue/40 
                hover:-translate-y-0.5 transition-all duration-300
                focus:outline-none focus:ring-4 focus:ring-pastelBlue/30
                disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0 
                relative overflow-hidden group
              `}
              style={{ backgroundSize: '200% auto' }}
            >
              <div className="absolute inset-0 w-1/4 h-full bg-white/30 transform skew-x-12 -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out]"></div>
              
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Logging in...
                </>
              ) : (
                "Log in"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-slate-500 mt-8 font-medium">
            Don't have an account?{" "}
            <Link to="/signup" className="font-bold text-pastelBlue hover:text-indigo-500 transition-colors">
              Sign up
            </Link>
          </p>
        </div>
      </div>
      
      <style>{`
        @keyframes shine {
          100% { transform: translateX(400%) skewX(12deg); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-15px) scale(1.02); }
        }
        @keyframes gradientX {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animation-float {
          animation: float 8s ease-in-out infinite;
        }
        .background-animate:hover {
          animation: gradientX 3s ease infinite;
        }
      `}</style>
    </div>
  );
}

export default Login;
