import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { Plus, Users, Shield, Lock, Zap, MessageCircle } from 'lucide-react';
import logo from '../assets/logo.png';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-6xl h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-accent/10 blur-[120px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-blue-500/5 blur-[100px] rounded-full"></div>
      </div>

      <div className="max-w-5xl w-full z-10 text-center space-y-16">
        <div className="space-y-8">
          <div className="flex justify-center mb-4">
             <div className="relative group">
                <div className="absolute inset-0 bg-accent/20 blur-2xl rounded-full scale-110 group-hover:bg-accent/30 transition-all duration-500"></div>
                <div className="relative w-24 h-24 bg-dark-card border border-white/10 rounded-3xl flex items-center justify-center shadow-2xl overflow-hidden p-4">
                  <img src={logo} alt="StealthChat" className="w-full h-full object-contain" />
                </div>
             </div>
          </div>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black tracking-tight text-white">
              Stealth<span className="text-accent">Chat</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
              Premium, temporary, and encrypted communication.
              <span className="block text-gray-500 text-lg mt-2">Create a room. Share the code. Chat instantly.</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
          <Button
            className="w-full sm:w-64 h-16 text-lg font-bold shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all"
            onClick={() => navigate('/create')}
          >
            <Plus className="w-5 h-5 mr-3" />
            Create Secure Room
          </Button>
          <Button
            variant="secondary"
            className="w-full sm:w-64 h-16 text-lg font-bold border-white/10 hover:bg-white/5 transition-all"
            onClick={() => navigate('/join')}
          >
            <Users className="w-5 h-5 mr-3" />
            Join Existing Room
          </Button>
        </div>

        <div className="pt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all duration-300 text-left space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">End-to-End Privacy</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Your messages exist only in memory for the duration of the session. Zero persistence, zero logs, zero traces.
            </p>
          </div>
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all duration-300 text-left space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">Instant Deployment</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              No accounts, no registration, no tracking. Simply pick a nickname and start chatting in seconds.
            </p>
          </div>
          <div className="group p-8 rounded-3xl bg-white/5 border border-white/5 hover:border-accent/20 hover:bg-accent/5 transition-all duration-300 text-left space-y-4">
            <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
              <Shield className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-bold text-white">Secure Ephemeral Rooms</h3>
            <p className="text-gray-400 leading-relaxed text-sm">
              Unique room codes with strict 15-participant limits. Perfect for quick, private, and secure team syncs.
            </p>
          </div>
        </div>

        <div className="pt-12">
           <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest font-bold text-gray-500">
             <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
             <span>Network Online • All Systems Operational</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
