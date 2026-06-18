import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowLeft, LogIn } from 'lucide-react';
import socketService from '../services/socketService';

const JoinRoom = () => {
  const [nickname, setNickname] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleJoin = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Nickname is required');
      return;
    }
    if (!roomCode.trim()) {
      setError('Room code is required');
      return;
    }

    setIsLoading(true);
    setError('');

    const socket = socketService.connect();
    const formattedCode = roomCode.trim().toUpperCase();

    socket.emit('join-room', { nickname, roomCode: formattedCode }, (response) => {
      setIsLoading(false);
      if (response.error) {
        setError(response.error);
      } else {
        sessionStorage.setItem('stealthchat_nickname', nickname);
        navigate(`/room/${formattedCode}`);
      }
    });
  };

  return (
    <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-6">
        <button
          onClick={() => navigate('/')}
          className="flex items-center text-gray-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </button>

        <Card>
          <div className="space-y-6">
            <div className="text-center space-y-2">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LogIn className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white">Join Room</h2>
              <p className="text-gray-400">Enter a room code to join the chat</p>
            </div>

            <form onSubmit={handleJoin} className="space-y-4">
              <Input
                label="Your Nickname"
                placeholder="Enter nickname..."
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
              />
              <Input
                label="Room Code"
                placeholder="Enter room code..."
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value);
                  setError('');
                }}
                className="uppercase font-mono tracking-widest"
              />

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <Button type="submit" className="w-full" loading={isLoading}>
                Join Room
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default JoinRoom;
