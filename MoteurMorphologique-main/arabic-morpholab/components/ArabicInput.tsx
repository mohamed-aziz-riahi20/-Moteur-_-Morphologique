
import React from 'react';

interface ArabicInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

const ArabicInput: React.FC<ArabicInputProps> = ({ 
  label, 
  value, 
  onChange, 
  placeholder, 
  className = "",
  required = false 
}) => {
  return (
    <div className={`flex flex-col space-y-1 ${className}`}>
      <label className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</label>
      <input
        type="text"
        dir="rtl"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all arabic-font text-xl placeholder:text-slate-300 dark:placeholder:text-slate-600"
      />
    </div>
  );
};

export default ArabicInput;
