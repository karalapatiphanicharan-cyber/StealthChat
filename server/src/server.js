const http = require('http');
const app = require('./app');
const { Server } = require('socket.io');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO (No implementation in Phase 1)
const io = new Server(server, {
  cors: {
    origin: '*',
  }
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
