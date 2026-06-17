import React, { useState, useEffect } from 'react';
import { Shield, Copy, Users } from 'lucide-react';

const RoomHeader = ({ roomCode, participantCount }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 bg-dark-card border-b border-white/5">
      <div className="flex items-center space-x-6">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Room Code</p>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-mono font-bold text-accent uppercase">{roomCode || '------'}</h2>
            <button
              onClick={handleCopy}
              aria-label="Copy Room Code"
              className="p-1.5 hover:bg-white/5 rounded transition-colors text-gray-500 hover:text-white relative group"
              title="Copy Room Code"
            >
              <Copy className="w-4 h-4" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent text-white text-[10px] rounded font-bold">
                  Copied!
                </span>
              )}
            </button>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        <div className="hidden sm:flex flex-col">
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Participants</p>
          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="w-4 h-4 text-accent" />
            <span className="font-bold">{participantCount || 0} / 15</span>
          </div>
        </div>
      </div>

      <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm font-medium text-white">
        <Shield className="w-4 h-4 text-accent" />
        <span className="hidden xs:inline">Privacy Mode</span>
      </button>
    </div>
  );
};

export default RoomHeader;
