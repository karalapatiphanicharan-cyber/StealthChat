import { useState, useEffect, useCallback } from 'react';
import socketService from '../services/socketService';

export const useChat = (roomCode, nickname) => {
  const [messages, setMessages] = useState([]);
  const [participantCount, setParticipantCount] = useState(0);
  const [participants, setParticipants] = useState([]);
  const [error, setError] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [typers, setTypers] = useState(new Set());

  useEffect(() => {
    const socket = socketService.connect();

    const joinRoom = () => {
      if (roomCode && nickname) {
        socket.emit('join-room', { roomCode, nickname }, (response) => {
          if (response.error) {
            setError(response.error);
          } else {
            setMessages(response.messages || []);
            setParticipantCount(response.participantCount || 1);
            setParticipants(response.participants || [nickname]);
          }
        });
      }
    };

    if (socket.connected) {
      setIsConnected(true);
      joinRoom();
    }

    socket.on('connect', () => {
      setIsConnected(true);
      joinRoom();
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    socket.on('receive-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on('update-participants', ({ count, participants }) => {
      setParticipantCount(count);
      if (participants) setParticipants(participants);
    });

    socket.on('user-typing', ({ nickname: typerNickname, isTyping }) => {
      setTypers((prev) => {
        const next = new Set(prev);
        if (isTyping) {
          next.add(typerNickname);
        } else {
          next.delete(typerNickname);
        }
        return next;
      });
    });

    socket.on('update-reactions', ({ messageId, reactions }) => {
      setMessages((prev) => prev.map(msg =>
        msg.id === messageId ? { ...msg, reactions } : msg
      ));
    });

    return () => {
      socketService.disconnect();
    };
  }, [roomCode, nickname]);

  const sendMessage = useCallback((text, type = 'chat', fileData = null) => {
    socketService.emit('send-message', { text, type, fileData }, (response) => {
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

  const sendReaction = useCallback((messageId, emoji) => {
    socketService.emit('send-reaction', { messageId, emoji }, (response) => {
      if (response.error) {
        console.error('Failed to send reaction:', response.error);
      }
    });
  }, []);

  const setTyping = useCallback((isTyping) => {
    if (isTyping) {
      socketService.emit('typing-start');
    } else {
      socketService.emit('typing-stop');
    }
  }, []);

  const uploadFile = useCallback((file, callback) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = e.target.result;
      socketService.emit('upload-file', {
        name: file.name,
        type: file.type,
        data
      }, callback);
    };
    reader.readAsDataURL(file);
  }, []);

  return {
    messages,
    participantCount,
    participants,
    typers: Array.from(typers),
    error,
    isConnected,
    sendMessage,
    sendReaction,
    setTyping,
    uploadFile,
    createRoom,
    joinRoom
  };
};
