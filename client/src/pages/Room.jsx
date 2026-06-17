import React, { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import RoomHeader from '../components/RoomHeader';
import ChatInput from '../components/ChatInput';
import EmptyState from '../components/EmptyState';
import { useChat } from '../hooks/useChat';

const Room = () => {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const nickname = sessionStorage.getItem('stealthchat_nickname');
  const messagesEndRef = useRef(null);

  const { messages, participantCount, error, sendMessage } = useChat(roomCode, nickname);

  useEffect(() => {
    if (!nickname) {
      navigate('/join');
    }
  }, [nickname, navigate]);

  useEffect(() => {
    if (error) {
      alert(error);
      navigate('/join');
    }
  }, [error, navigate]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col max-w-5xl mx-auto w-full bg-dark-card/50 border-x border-white/5 shadow-2xl">
      <RoomHeader roomCode={roomCode} participantCount={participantCount} />

      <div className="flex-1 overflow-y-auto p-4 sm:p-6 scroll-smooth min-h-0 space-y-4">
        {messages.length === 0 ? (
          <EmptyState />
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.type === 'system' ? 'items-center' : 'items-start'}`}
            >
              {msg.type === 'system' ? (
                <p className="text-xs text-gray-500 font-medium py-2 px-4 bg-white/5 rounded-full uppercase tracking-widest">
                  {msg.text}
                </p>
              ) : (
                <div className="max-w-[80%] space-y-1">
                  <p className="text-xs font-bold text-accent px-1">
                    {msg.sender === nickname ? 'You' : msg.sender}
                  </p>
                  <div className={`px-4 py-2 rounded-2xl ${msg.sender === nickname ? 'bg-accent text-white' : 'bg-white/5 text-gray-200'}`}>
                    <p className="text-sm leading-relaxed">{msg.text}</p>
                  </div>
                  <p className="text-[10px] text-gray-600 px-1 text-right">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <ChatInput onSend={sendMessage} />
    </div>
  );
};

export default Room;
