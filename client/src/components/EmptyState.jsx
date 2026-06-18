import React from 'react';
import { MessageSquare } from 'lucide-react';

const EmptyState = ({ message = "No messages yet.", subtext = "Be the first one to say hello!" }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 text-white/20 animate-in fade-in duration-700">
      <div className="p-8 bg-white/5 rounded-[2rem] border border-white/5">
        <MessageSquare className="w-16 h-16" />
      </div>
      <div className="text-center space-y-1">
        <p className="text-xl font-bold tracking-tight uppercase italic">{message}</p>
        <p className="text-sm font-medium tracking-wide">{subtext}</p>
      </div>
    </div>
  );
};

export default EmptyState;
