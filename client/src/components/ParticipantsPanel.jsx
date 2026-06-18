import React from 'react';
import { Users, X } from 'lucide-react';

const ParticipantsPanel = ({ participants, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="w-64 bg-dark-card border-l border-white/5 flex flex-col animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Users className="w-4 h-4 text-accent" />
          <h3 className="font-bold text-sm">Participants</h3>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-white/5 rounded-lg transition-colors text-gray-500 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {participants.map((p, i) => (
          <div key={i} className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group">
            <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">{p}</span>
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-black/20">
        <p className="text-[10px] text-gray-600 uppercase tracking-widest font-bold">
          {participants.length} connected
        </p>
      </div>
    </div>
  );
};

export default ParticipantsPanel;
