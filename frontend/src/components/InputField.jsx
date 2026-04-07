import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle2, AlertCircle } from "lucide-react";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  icon: Icon,
  error,
  success,
  disabled,
  className = "",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = type === "password";
  const inputType = isPassword && showPassword ? "text" : type;

  // Determine border and glow colors based on state
  let stateClasses = "border-slate-200 focus:border-pastelBlue focus:ring-pastelBlue/20";
  let iconColor = isFocused ? "text-pastelBlue" : "text-slate-400";

  if (error) {
    stateClasses = "border-red-300 focus:border-red-400 focus:ring-red-400/20";
    iconColor = "text-red-400";
  } else if (success) {
    stateClasses = "border-green-300 focus:border-green-400 focus:ring-green-400/20";
    iconColor = "text-green-500";
  }

  return (
    <div className="w-full relative mb-1">
      <div className="relative group">
        {/* Left Icon */}
        {Icon && (
          <div className="absolute left-3.5 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200">
            <Icon size={18} className={iconColor} />
          </div>
        )}

        {/* Input */}
        <input
          type={inputType}
          name={name}
          id={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          className={`
            block w-full rounded-2xl px-4 pb-2.5 pt-6 text-sm text-slate-800 bg-white/50 backdrop-blur-sm
            border-2 outline-none transition-all duration-300 ease-in-out shadow-sm
            focus:bg-white focus:ring-4 disabled:opacity-50 disabled:bg-slate-50
            peer
            ${Icon ? "pl-11" : ""}
            ${stateClasses}
            ${className}
          `}
          placeholder=" "
        />

        {/* Floating Label */}
        <label
          htmlFor={name}
          className={`
            absolute text-slate-500 duration-300 transform -translate-y-3 scale-75 top-4 z-10 origin-[0]
            peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0
            peer-focus:scale-75 peer-focus:-translate-y-3
            ${Icon ? "left-11" : "left-4"}
            ${error ? "text-red-500 peer-focus:text-red-500" : success ? "text-green-600 peer-focus:text-green-600" : "peer-focus:text-pastelBlue"}
          `}
        >
          {label}
        </label>

        {/* Right Action Icons (Password Toggle / Success Check) */}
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 flex items-center gap-2">
          {success && !error && (
            <CheckCircle2 size={18} className="text-green-500 animate-in zoom-in duration-300" />
          )}
          
          {error && (
            <AlertCircle size={18} className="text-red-500 animate-in zoom-in duration-300" />
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-slate-600 transition-colors focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
      </div>

      {/* Error Message */}
      <div className={`overflow-hidden transition-all duration-300 ${error ? 'max-h-10 opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <p className="text-xs text-red-500 ml-2 font-medium">{error}</p>
      </div>
    </div>
  );
};

export default InputField;
