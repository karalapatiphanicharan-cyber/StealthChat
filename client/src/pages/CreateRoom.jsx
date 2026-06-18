import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';
import socketService from '../services/socketService';

const CreateRoom = () => {
  const [nickname, setNickname] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nickname.trim()) {
      setError('Nickname is required');
      return;
    }

    setIsLoading(true);
    setError('');

    const socket = socketService.connect();
    socket.emit('create-room', { nickname }, (response) => {
      setIsLoading(false);
      if (response.error) {
        setError(response.error);
      } else if (response.roomCode) {
        // Store nickname in sessionStorage to use in the Room page
        sessionStorage.setItem('stealthchat_nickname', nickname);
        navigate(`/room/${response.roomCode}`);
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
                <MessageSquarePlus className="w-8 h-8 text-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white">Create Room</h2>
              <p className="text-gray-400">Set your nickname to get started</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Your Nickname"
                placeholder="Enter nickname..."
                value={nickname}
                onChange={(e) => {
                  setNickname(e.target.value);
                  setError('');
                }}
              />

              {error && <p className="text-red-500 text-sm text-center font-medium">{error}</p>}

              <Button type="submit" className="w-full" loading={isLoading}>
                Create Room
              </Button>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CreateRoom;
