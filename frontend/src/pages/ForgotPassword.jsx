import { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, BrainCircuit, Loader2, ArrowLeft } from "lucide-react";
import { toast } from "react-hot-toast";
import api from "../services/api";
import InputField from "../components/InputField";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please explicitly provide your mapping email");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/forgot-password", { email });
      toast.success(response.data.message || "Reset link printed to Uvicorn natively!", {
        duration: 5000,
        style: { background: "#f0fdf4", color: "#166534", border: "1px solid #bbf7d0" },
      });
      setSubmitted(true);
    } catch (error) {
      const msg = error.response?.data?.detail || "Server failed dispatching safely. Try again.";
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
                <BrainCircuit className="text-slate-700" size={32} strokeWidth={1.5} />
              </div>
            </div>
            <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight text-center">Forgot Password?</h1>
            <p className="text-slate-500 font-medium mt-2 text-center text-sm">
              No worries, we'll dispatch reset instructions safely.
            </p>
          </div>

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-5">
              <InputField
                label="Email Address"
                id="email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                required
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 mt-4 bg-gradient-to-r from-pastelBlue via-mint to-pastelBlue rounded-xl text-slate-800 font-bold text-[15px] shadow-[0_4px_14px_0_rgba(167,243,208,0.5)] hover:shadow-[0_6px_20px_rgba(167,243,208,0.4)] hover:-translate-y-[2px] transition-all duration-300 disabled:opacity-70 disabled:hover:translate-y-0 disabled:hover:shadow-[0_4px_14px_0_rgba(167,243,208,0.5)] flex items-center justify-center relative overflow-hidden group"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:animate-shine"></div>
                {loading ? <Loader2 size={20} className="animate-spin" /> : "Dispatch Reset Link"}
              </button>
            </form>
          ) : (
            <div className="text-center bg-mint/20 p-4 rounded-xl border border-mint/40 mb-6">
              <p className="text-slate-700 text-sm font-medium">
                Check your background Python Terminal log output strictly. Since active SMTP is disabled currently, your expiring reset payload has successfully mapped directly onto Uvicorn's standard output directly!
              </p>
            </div>
          )}

          <div className="mt-8">
            <Link
              to="/login"
              className="flex items-center justify-center text-sm font-medium text-slate-500 hover:text-pastelBlue transition-colors group"
            >
               <ArrowLeft size={16} className="mr-2 group-hover:-translate-x-1 transition-transform" />
               Back to securely log in
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
