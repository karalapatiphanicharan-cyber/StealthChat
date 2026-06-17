import React from 'react';
import { MessageSquareOff } from 'lucide-react';

const EmptyState = ({ message = "No messages yet." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full space-y-4 opacity-30 text-white">
      <div className="p-6 bg-white/5 rounded-full">
        <MessageSquareOff className="w-12 h-12" />
      </div>
      <p className="text-lg font-medium">{message}</p>
      <p className="text-sm">Be the first one to say hello!</p>
    </div>
  );
};

export default EmptyState;
