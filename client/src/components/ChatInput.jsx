import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from './Button';

const ChatInput = ({ onSend, disabled }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = () => {
    const trimmed = value.trim();
    if (trimmed) {
      onSend(trimmed);
      setValue('');
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSend();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-2 p-4 bg-dark-card border-t border-white/5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <textarea
        ref={inputRef}
        rows="1"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;
        }}
        onKeyDown={handleKeyDown}
        placeholder={disabled ? "Privacy mode active..." : "Type a message..."}
        className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all text-white resize-none max-h-[150px] overflow-y-auto"
      />
      <Button type="submit" className="!p-3 rounded-xl mb-0.5" disabled={!value.trim() || disabled}>
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};

export default ChatInput;
