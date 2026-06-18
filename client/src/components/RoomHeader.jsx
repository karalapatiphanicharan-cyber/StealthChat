import React, { useState, useEffect } from 'react';
import { Shield, Copy, Users, Eye, EyeOff, LogOut, Bell, BellOff, Search } from 'lucide-react';
import { usePrivacy } from '../context/PrivacyContext';

const RoomHeader = ({ roomCode, participantCount, notificationsEnabled, setNotificationsEnabled, onToggleParticipants, onToggleSearch }) => {
  const [copied, setCopied] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();

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
            <h2 className="text-xl font-mono font-bold text-accent uppercase tracking-wider">
              {isHidden ? '••••••' : (roomCode || '------')}
            </h2>
            <div className="flex items-center bg-white/5 rounded-lg p-0.5 ml-1">
              <button
                onClick={() => setIsHidden(!isHidden)}
                aria-label={isHidden ? "Reveal Room Code" : "Hide Room Code"}
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white group"
                title={isHidden ? "Reveal" : "Hide"}
              >
                {isHidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </button>
              <button
                onClick={handleCopy}
                aria-label="Copy Room Code"
                className="p-1.5 hover:bg-white/10 rounded transition-colors text-gray-400 hover:text-white relative group"
                title="Copy Room Code"
              >
                <Copy className="w-4 h-4" />
                {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-green-500 text-white text-[10px] rounded font-bold whitespace-nowrap">
                  ✓ Room code copied
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="h-8 w-px bg-white/10 hidden sm:block"></div>

        <button
          onClick={onToggleParticipants}
          className="hidden sm:flex flex-col text-left group hover:opacity-80 transition-opacity"
        >
          <p className="text-xs text-gray-500 uppercase tracking-widest font-bold group-hover:text-accent transition-colors">Participants</p>
          <div className="flex items-center space-x-2 text-gray-300">
            <Users className="w-4 h-4 text-accent" />
            <span className="font-bold">{participantCount || 0} / 15</span>
          </div>
        </button>
      </div>

      <div className="flex items-center space-x-2">
        <button
          onClick={onToggleSearch}
          className="p-2 rounded-full hover:bg-white/5 text-gray-400 transition-colors"
          title="Search Messages"
        >
          <Search className="w-4 h-4" />
        </button>

        <button
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className={`p-2 rounded-full transition-colors border ${notificationsEnabled ? 'bg-white/5 hover:bg-white/10 border-white/10 text-white' : 'bg-red-500/10 border-red-500/20 text-red-500'}`}
          title={notificationsEnabled ? "Notifications ON" : "Notifications OFF"}
        >
          {notificationsEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </button>

        <button
          onClick={togglePrivacyMode}
          className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-colors border text-sm font-medium ${isPrivacyMode ? 'bg-accent/20 border-accent text-accent' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}
        >
          <Shield className="w-4 h-4" />
          <span className="hidden xs:inline">{isPrivacyMode ? 'Disable Privacy' : 'Privacy Mode'}</span>
        </button>

        <button
          onClick={() => {
            if (window.confirm("Leave this room?\n\nYou will disconnect from the chat.")) {
              window.location.href = "/";
            }
          }}
          className="p-2 rounded-full bg-red-500/10 hover:bg-red-500/20 text-red-500 transition-colors border border-red-500/20"
          title="Leave Room"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default RoomHeader;
