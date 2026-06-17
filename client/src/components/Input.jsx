import React from 'react';

const Input = ({ label, type = 'text', placeholder, value, onChange, className = '', ...props }) => {
  return (
    <div className="w-full space-y-2">
      {label && <label className="block text-sm font-medium text-gray-400 ml-1">{label}</label>}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all placeholder:text-gray-600 text-white ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;
