import React from 'react';
import { Shield, Copy } from 'lucide-react';

const RoomHeader = ({ roomCode }) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 bg-dark-card border-b border-white/5">
      <div className="flex items-center space-x-4">
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">Room Code</p>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-mono font-bold text-accent">{roomCode || '------'}</h2>
            <button className="p-1 hover:bg-white/5 rounded transition-colors text-gray-500 hover:text-white">
              <Copy className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <button className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm font-medium text-white">
        <Shield className="w-4 h-4 text-accent" />
        <span>Privacy Mode</span>
      </button>
    </div>
  );
};

export default RoomHeader;
