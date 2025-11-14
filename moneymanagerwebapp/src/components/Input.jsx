import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const Input = ({ label, value, onChange, placeholder, type = "text" }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="mb-4">
      {/* Label */}
      <label className="text-[13px] text-slate-800 block mb-1">{label}</label>

      {/* Input Field */}
      <div className="relative">
        <input
          className="w-full bg-transparent outline-none border border-gray-300 rounded-md py-2 px-3 pr-10 text-gray-700 leading-tight focus:outline-none focus:border-blue-500"
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}   // ✅ FIXED
        />

        {/* Password Toggle Icon */}
        {type === "password" && (
          <span
            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Eye size={20} className="text-blue-500" />
            ) : (
              <EyeOff size={20} className="text-slate-400" />
            )}
          </span>
        )}
      </div>
    </div>
  );
};

export default Input;
