import React from "react";

const SocialButton = ({ icon: Icon, provider, onClick, disabled }) => {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`
        w-full flex items-center justify-center gap-3 px-4 py-3 
        bg-white border-2 border-slate-100 rounded-2xl shadow-sm
        text-sm font-semibold text-slate-700 transition-all duration-300
        hover:border-pastelBlue/50 hover:bg-slate-50 hover:shadow-md hover:-translate-y-0.5
        focus:outline-none focus:ring-4 focus:ring-pastelBlue/20
        disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-sm
      `}
    >
      <Icon size={20} className="text-slate-700" />
      <span>Continue with {provider}</span>
    </button>
  );
};

export default SocialButton;
