import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import CreateRoom from './pages/CreateRoom';
import JoinRoom from './pages/JoinRoom';
import Room from './pages/Room';

function App() {
  return (
    <Router>
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
}

export default App;
