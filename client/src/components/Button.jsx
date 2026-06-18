import React from 'react';

const Button = ({ children, onClick, type = 'button', variant = 'primary', className = '', loading = false, ...props }) => {
  const baseStyles = "px-6 py-3 rounded-xl font-medium transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed min-w-[120px]";

  const variants = {
    primary: "bg-accent hover:bg-accent-hover text-white shadow-lg shadow-accent/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    outline: "bg-transparent border border-white/20 hover:border-white/40 text-white",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={props.disabled || loading}
      {...props}
    >
      {loading ? (
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          <span>Loading...</span>
        </div>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
