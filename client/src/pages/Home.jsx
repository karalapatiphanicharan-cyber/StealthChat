import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Plus, Users } from 'lucide-react';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-12 md:py-20 text-center">
      <div className="max-w-3xl space-y-12">
        <div className="space-y-6">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
            StealthChat
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-medium max-w-lg mx-auto">
            Create a room. Share the code. Chat instantly.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
          <Button
            className="w-full sm:w-60 h-14 text-base"
            onClick={() => navigate('/create')}
          >
            <Plus className="w-5 h-5 mr-2" />
            Create Room
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-60 h-14 text-base"
            onClick={() => navigate('/join')}
          >
            <Users className="w-5 h-5 mr-2" />
            Join Room
          </Button>
        </div>

        <div className="pt-16 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-bold mb-2 text-accent">Temporary</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Rooms and messages exist only as long as you need them. No history, no traces.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-bold mb-2 text-accent">Anonymous</h3>
            <p className="text-gray-400 text-sm leading-relaxed">No accounts, no emails, no tracking. Just pick a nickname and start chatting.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors">
            <h3 className="text-lg font-bold mb-2 text-accent">Real-time</h3>
            <p className="text-gray-400 text-sm leading-relaxed">Instant communication with up to 15 participants in a single room.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
