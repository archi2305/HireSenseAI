import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import { toast } from "react-hot-toast";

function OAuthSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      loginWithToken(token)
        .then(() => {
          navigate("/dashboard");
        })
        .catch((error) => {
          toast.error(error?.userMessage || "Auth failed");
          navigate("/login");
        });
    } else {
      toast.error("Auth failed");
      navigate("/login");
    }
  }, [searchParams, loginWithToken, navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      <div className="absolute inset-0 bg-gradient-to-br from-mint/30 via-pink-50 to-pastelBlue/20 z-0"></div>
      
      <div className="absolute top-[-10%] left-[-5%] w-[40vw] h-[40vw] max-w-[500px] max-h-[500px] rounded-full bg-softPink/40 blur-[100px] animate-pulse z-0"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[45vw] h-[45vw] max-w-[600px] max-h-[600px] rounded-full bg-pastelBlue/40 blur-[120px] animate-pulse z-0" style={{ animationDelay: '2s' }}></div>

      <div className="relative z-10 flex flex-col items-center bg-white/70 backdrop-blur-2xl p-10 rounded-[32px] border border-white/60 shadow-[0_8px_40px_rgb(0,0,0,0.06)] max-w-sm w-full text-center">
        <Loader2 size={48} className="animate-spin text-pastelBlue mb-6 mx-auto" strokeWidth={2.5} />
        <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">Redirecting...</h2>
        <p className="text-slate-500 font-medium mt-2">Finalizing your secure login session.</p>
      </div>
    </div>
  );
}

export default OAuthSuccess;
