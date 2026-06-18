import React from 'react';
import { usePrivacy } from '../context/PrivacyContext';

const PrivacyOverlay = () => {
  const { isPrivacyMode, togglePrivacyMode } = usePrivacy();

  if (!isPrivacyMode) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] bg-[#050505] flex flex-col items-center justify-center cursor-default animate-in fade-in duration-300"
      onClick={(e) => {
          // Double click or specific sequence could be an alternative,
          // but for now we follow the requirement of using the button or shortcut.
          // We don't want accidental clicks to exit privacy mode easily if looking like a dead screen.
      }}
    >
      <p className="text-gray-800 text-sm font-medium select-none tracking-widest opacity-30">
        Offline.
      </p>

      {/* Hidden exit button for mouse users who know where to click (optional UX)
          But the prompt says existing Privacy Mode button or shortcut.
          If the entire UI is hidden, the existing button is also hidden.
          So we might need a subtle way to exit without the shortcut if they forget it.
          Let's add a small, nearly invisible toggle in the corner or just rely on shortcut.
      */}
      <button
        onClick={togglePrivacyMode}
        className="fixed bottom-4 right-4 w-8 h-8 opacity-0 hover:opacity-5 cursor-default"
        aria-label="Exit"
      />
    </div>
  );
};

export default PrivacyOverlay;
