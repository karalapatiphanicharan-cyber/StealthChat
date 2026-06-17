import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import RoomHeader from '../components/RoomHeader';
import ChatInput from '../components/ChatInput';
import EmptyState from '../components/EmptyState';

const Room = () => {
  const { roomCode } = useParams();
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (!message.trim()) return;
    console.log('Sending message:', message);
    setMessage('');
  };

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-dark-card/50 border-x border-white/5 shadow-2xl">
      <RoomHeader roomCode={roomCode} />

      <div className="flex-1 overflow-y-auto p-6 scroll-smooth min-h-0">
        <EmptyState />
      </div>

      <ChatInput
        value={message}
        onChange={setMessage}
        onSend={handleSend}
      />
    </div>
  );
};

export default Room;
