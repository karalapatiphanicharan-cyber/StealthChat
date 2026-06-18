import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';
import { PrivacyProvider, usePrivacy } from './context/PrivacyContext';
import PrivacyOverlay from './components/PrivacyOverlay';

const AppContent = () => {
  const { togglePrivacyMode } = usePrivacy();

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Shortcut: Ctrl + Shift + H
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        togglePrivacyMode();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [togglePrivacyMode]);

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <PrivacyOverlay />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="create" element={<CreateRoom />} />
          <Route path="join" element={<JoinRoom />} />
          <Route path="room/:roomCode" element={<Room />} />
        </Route>
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <PrivacyProvider>
      <AppContent />
    </PrivacyProvider>
  );
}

export default App;
