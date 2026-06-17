const roomUtils = require('../utils/roomUtils');

const socketHandler = (io) => {
  io.on('connection', (socket) => {
    let currentRoomCode = null;
    let currentUserNickname = null;

    const leaveCurrentRoom = () => {
      if (currentRoomCode) {
        const result = roomUtils.removeUserFromRoom(currentRoomCode, socket.id);
        if (result) {
          const { room, user } = result;
          const nickname = user ? user.nickname : 'Someone';

          const systemMsg = roomUtils.addSystemMessageToRoom(currentRoomCode, `${nickname} left the room.`);
          socket.to(currentRoomCode).emit('receive-message', systemMsg);

          if (room.users.size > 0) {
            io.to(currentRoomCode).emit('update-participants', { count: room.users.size });
          }
          socket.leave(currentRoomCode);
        }
        currentRoomCode = null;
      }
    };

    // Create Room
    socket.on('create-room', ({ nickname }, callback) => {
      if (!nickname || nickname.trim() === '') {
        return callback({ error: 'Nickname is required' });
      }

      leaveCurrentRoom();

      const room = roomUtils.createRoom();
      const { error } = roomUtils.addUserToRoom(room.code, socket.id, nickname);

      if (error) {
        return callback({ error });
      }

      socket.join(room.code);
      currentRoomCode = room.code;
      currentUserNickname = nickname;

      console.log(`Room created: ${room.code} by ${nickname}`);
      callback({ roomCode: room.code });
    });

    // Join Room
    socket.on('join-room', ({ nickname, roomCode }, callback) => {
      if (!nickname || nickname.trim() === '') {
        return callback({ error: 'Nickname is required' });
      }
      if (!roomCode || roomCode.trim() === '') {
        return callback({ error: 'Room code is required' });
      }

      const code = roomCode.toUpperCase();

      // If already in this room, just return current state
      if (currentRoomCode === code) {
        const room = roomUtils.getRoom(code);
        if (room) {
          return callback({
            roomCode: code,
            messages: room.messages,
            participantCount: room.users.size
          });
        }
      }

      leaveCurrentRoom();

      const { room, error } = roomUtils.addUserToRoom(code, socket.id, nickname);

      if (error) {
        return callback({ error });
      }

      socket.join(code);
      currentRoomCode = code;
      currentUserNickname = nickname;

      // Notify others in the room
      const systemMsg = roomUtils.addSystemMessageToRoom(code, `${nickname} joined the room.`);
      socket.to(code).emit('receive-message', systemMsg);

      // Update participant counts for everyone in the room
      io.to(code).emit('update-participants', { count: room.users.size });

      console.log(`${nickname} joined room: ${code}`);
      callback({
        roomCode: code,
        messages: room.messages,
        participantCount: room.users.size
      });
    });

    socket.on('leave-room', () => {
      leaveCurrentRoom();
    });

    // Send Message
    socket.on('send-message', ({ text }, callback) => {
      if (!currentRoomCode || !currentUserNickname) {
        return callback({ error: 'Not in a room' });
      }
      if (!text || text.trim() === '') {
        return callback({ error: 'Message cannot be empty' });
      }

      const message = roomUtils.addMessageToRoom(currentRoomCode, currentUserNickname, text);
      if (message) {
        io.to(currentRoomCode).emit('receive-message', message);
        callback({ success: true });
      } else {
        callback({ error: 'Failed to send message' });
      }
    });

    // Disconnect
    socket.on('disconnect', () => {
      leaveCurrentRoom();
      console.log('Client disconnected');
    });
  });
};

module.exports = socketHandler;
