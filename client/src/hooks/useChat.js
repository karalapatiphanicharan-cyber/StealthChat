import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

export const useChat = (roomCode, nickname) => {
  const [messages, setMessages] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const socket = socketService.connect();

    socket.on('connect', () => {
      setIsConnected(true);
      if (roomCode && nickname) {
        socket.emit('join-room', { roomCode, nickname }, (response) => {
          if (response.error) {
            setError(response.error);
          } else {
            setMessages(response.messages || []);
            setParticipantCount(response.participantCount || 1);
          }
        });
      }
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('update-participants', ({ count }) => {
      setParticipantCount(count);
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomCode, nickname]);

  const sendMessage = useCallback((text) => {
    socketService.emit('send-message', { text }, (response) => {
      if (response.error) {
        console.error('Failed to send message:', response.error);
      }
    });
  }, []);

  const createRoom = useCallback((nickname, callback) => {
    const socket = socketService.connect();
    socket.emit('create-room', { nickname }, callback);
  }, []);

  const joinRoom = useCallback((nickname, roomCode, callback) => {
    const socket = socketService.connect();
    socket.emit('join-room', { nickname, roomCode }, callback);
  }, []);

  return {
    messages,
    participantCount,
    error,
    isConnected,
    sendMessage,
    createRoom,
    joinRoom
  };
};
