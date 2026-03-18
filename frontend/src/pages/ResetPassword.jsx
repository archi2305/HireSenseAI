import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Lock, BrainCircuit, Loader2, KeyRound } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import InputField from "../components/InputField";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      toast.error("Invalid structural URL explicitly tracked mapping null components", { id: 'invalid_token' });
      navigate("/login");
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      toast.error("Password string strictly must be minimally 6 parameters reliably");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Identical schema combinations definitely do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password", { token, new_password: password });
      toast.success(response.data.message || "Password re-mapped safely", {
        duration: 3000,
        style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
      });
      navigate("/login");
    } catch (error) {
      const msg = error.response?.data?.detail || "JWT validation crashed natively completely expired.";
      toast.error(msg, {
        style: { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-mint/30 via-pink-50 to-pastelBlue/20 z-0"></div>
      
      {/* Animated Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-softPink/40 blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-pastelBlue/40 blur-[120px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

      <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative z-10 w-full animate-fadeIn">
        <div className="w-full max-w-[420px] bg-white/70 backdrop-blur-2xl rounded-[32px] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.06)] border border-white/60 relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pastelBlue via-mint to-softPink rounded-2xl flex items-center justify-center shadow-lg mb-4 transform hover:scale-105 transition-transform">
              <div className="w-14 h-14 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center">
                <KeyRound className="text-slate-700" size={32} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight text-center">Establish New Password</h1>
            <p className="text-slate-500 font-medium mt-2 text-center text-sm">
              Safely overwrite your previous payload dictionary.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <InputField
              label="New Secure Password"
              id="password"
              type="password"
              icon={Lock}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
            
            <InputField
              label="Confirm Schema Integrity"
              id="confirmPassword"
              type="password"
              icon={Lock}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 mt-4 bg-gradient-to-r from-pastelBlue via-mint to-pastelBlue rounded-xl text-slate-800 font-bold text-[15px] shadow-[0_4px_14px_0_rgba(167,243,208,0.5)] hover:shadow-[0_6px_20px_rgba(167,243,208,0.4)] hover:-translate-y-[2px] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(167,243,208,0.5)] flex items-center justify-center relative overflow-hidden group"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:animate-shine"></div>
              {loading ? <Loader2 size={20} className="animate-spin" /> : "Deploy Rebuild"}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
