import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip } from 'lucide-react';
import Button from './Button';

const ChatInput = ({ onSend, disabled, onTyping, onUpload }) => {
  const [value, setValue] = useState('');
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

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
    if ((e.key === 'Enter' && !e.shiftKey) || (e.key === 'Enter' && e.ctrlKey)) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 25 * 1024 * 1024) {
        alert('File too large (Max 25MB)');
        return;
      }
      onUpload(file, (response) => {
        if (response.error) alert(response.error);
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`flex items-end space-x-2 p-4 bg-dark-card border-t border-white/5 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}>
      <div className="flex items-center mb-1">
        <label className="p-2 cursor-pointer text-gray-500 hover:text-accent transition-colors">
          <Paperclip className="w-5 h-5" />
          <input type="file" className="hidden" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt" />
        </label>
      </div>
      <textarea
        ref={inputRef}
        rows="1"
        value={value}
        disabled={disabled}
        onChange={(e) => {
          setValue(e.target.value);
          e.target.style.height = 'auto';
          e.target.style.height = `${Math.min(e.target.scrollHeight, 150)}px`;

          if (onTyping) {
            onTyping(true);
            if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
            typingTimeoutRef.current = setTimeout(() => {
              onTyping(false);
            }, 3000);
          }
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
