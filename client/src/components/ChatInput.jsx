import React from 'react';
import { Send } from 'lucide-react';
import Button from './Button';

const ChatInput = ({ value, onChange, onSend }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (value.trim()) onSend();
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2 p-4 bg-dark-card border-t border-white/5">
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Type a message..."
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white"
      />
      <Button type="submit" className="!p-3 rounded-xl">
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
