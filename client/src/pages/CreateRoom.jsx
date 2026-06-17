import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import Input from '../components/Input';
import Button from '../components/Button';
import { ArrowLeft, MessageSquarePlus } from 'lucide-react';

const CreateRoom = () => {
  const [nickname, setNickname] = useState('');
  const navigate = useNavigate();

  const handleCreate = (e) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    navigate('/room/DEMO123');
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
                onChange={(e) => setNickname(e.target.value)}
                required
              />
              <Button type="submit" className="w-full">
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
