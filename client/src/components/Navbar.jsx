import React from 'react';
import { Link } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { usePrivacy } from '../context/PrivacyContext';

const Navbar = () => {
  const { togglePrivacyMode } = usePrivacy();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">StealthChat</span>
          </Link>

          <div>
            <button
              onClick={togglePrivacyMode}
              className="flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10 text-sm font-medium text-white"
            >
              <Shield className="w-4 h-4 text-accent" />
              <span>Privacy Mode</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
