import React from "react";

const SocialButton = ({ icon: Icon, provider, text, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-2 px-3 py-2.5 
        bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl shadow-sm
        text-sm font-semibold text-slate-700 transition-all duration-300
        hover:border-pastelBlue/60 hover:bg-slate-50 hover:shadow hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-pastelBlue/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm
      `}
    >
      <Icon className="w-5 h-5 text-slate-700" />
      <span>{text || provider}</span>
    </button>
  );
};

export default SocialButton;
