import React from 'react';

const Card = ({ children, className = '' }) => {
  return (
    <div className={`bg-dark-card border border-white/5 rounded-2xl p-6 shadow-2xl ${className}`}>
      {children}
    </div>
  );
};

export default Card;
