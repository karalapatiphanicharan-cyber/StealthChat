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

          console.log(`${nickname} left room: ${currentRoomCode}`);

          if (room.users.size > 0) {
            const participants = Array.from(room.users.values()).map(u => u.nickname);
            io.to(currentRoomCode).emit('update-participants', {
              count: room.users.size,
              participants
            });
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
      const room = roomUtils.getRoom(code);

      if (!room) {
        return callback({ error: 'Room not found' });
      }

      // If already in this room with same socket, just return current state
      if (currentRoomCode === code && currentUserNickname === nickname) {
        const participants = Array.from(room.users.values()).map(u => u.nickname);
        const serializedMessages = room.messages.map(msg => ({
          ...msg,
          reactions: Object.fromEntries(
            Object.entries(msg.reactions || {}).map(([emoji, set]) => [emoji, Array.from(set)])
          )
        }));
        return callback({
          roomCode: code,
          messages: serializedMessages,
          participantCount: room.users.size,
          participants
        });
      }

      // Handle re-entry or same nickname from different socket
      const existingUser = Array.from(room.users.entries()).find(
        ([sid, u]) => u.nickname.toLowerCase() === nickname.toLowerCase()
      );

      if (existingUser) {
        const [oldSocketId] = existingUser;
        if (oldSocketId !== socket.id) {
          // Kick the old socket and remove it from the room immediately
          const oldSocket = io.sockets.sockets.get(oldSocketId);
          if (oldSocket) {
            oldSocket.emit('error-msg', 'Logged in from another location');
            oldSocket.leave(code);
          }
          roomUtils.removeUserFromRoom(code, oldSocketId);
        }
      }

      leaveCurrentRoom();

      const { room: updatedRoom, error } = roomUtils.addUserToRoom(code, socket.id, nickname);

      if (error) {
        return callback({ error });
      }

      socket.join(code);
      currentRoomCode = code;
      currentUserNickname = nickname;

      // Update participant counts for everyone in the room INCLUDING the newcomer
      const participants = Array.from(updatedRoom.users.values()).map(u => u.nickname);
      io.to(code).emit('update-participants', {
        count: updatedRoom.users.size,
        participants
      });

      // Notify others in the room
      const systemMsg = roomUtils.addSystemMessageToRoom(code, `${nickname} joined the room.`);
      socket.to(code).emit('receive-message', systemMsg);

      console.log(`${nickname} joined room: ${code}`);

      // Convert Set to Array for reactions serialization
      const serializedMessages = updatedRoom.messages.map(msg => ({
        ...msg,
        reactions: Object.fromEntries(
          Object.entries(msg.reactions || {}).map(([emoji, set]) => [emoji, Array.from(set)])
        )
      }));

      callback({
        roomCode: code,
        messages: serializedMessages,
        participantCount: updatedRoom.users.size,
        participants
      });
    });

    socket.on('leave-room', () => {
      leaveCurrentRoom();
    });

    // Typing indicator
    socket.on('typing-start', () => {
      if (currentRoomCode && currentUserNickname) {
        socket.to(currentRoomCode).emit('user-typing', {
          nickname: currentUserNickname,
          isTyping: true
        });
      }
    });

    socket.on('typing-stop', () => {
      if (currentRoomCode && currentUserNickname) {
        socket.to(currentRoomCode).emit('user-typing', {
          nickname: currentUserNickname,
          isTyping: false
        });
      }
    });

    // Send Message
    socket.on('send-message', ({ text, type = 'chat', fileData = null, theme = 'blue' }, callback) => {
      if (!currentRoomCode || !currentUserNickname) {
        return callback({ error: 'Not in a room' });
      }

      const trimmedText = text ? text.trim() : '';
      if (trimmedText === '' && type === 'chat') {
        return callback({ error: 'Message cannot be empty' });
      }

      const message = roomUtils.addMessageToRoom(currentRoomCode, currentUserNickname, trimmedText, type, fileData, theme);
      if (message) {
        io.to(currentRoomCode).emit('receive-message', message);
        callback({ success: true });
      } else {
        callback({ error: 'Failed to send message' });
      }
    });

    // Send Reaction
    socket.on('send-reaction', ({ messageId, emoji }, callback) => {
      if (!currentRoomCode) return callback({ error: 'Not in a room' });

      const message = roomUtils.addReactionToMessage(currentRoomCode, messageId, socket.id, emoji);
      if (message) {
        // Convert Set to Array for serialization
        const serializedReactions = Object.fromEntries(
          Object.entries(message.reactions || {}).map(([e, set]) => [e, Array.from(set)])
        );

        io.to(currentRoomCode).emit('update-reactions', {
          messageId,
          reactions: serializedReactions
        });
        callback({ success: true });
      } else {
        callback({ error: 'Message not found' });
      }
    });

    // File Upload
    socket.on('upload-file', ({ name, type, data, theme = 'blue' }, callback) => {
      if (!currentRoomCode || !currentUserNickname) {
        return callback({ error: 'Not in a room' });
      }

      // Enforce 25MB limit (roughly 33MB in base64)
      if (data.length > 35000000) {
        return callback({ error: 'File too large (Max 25MB)' });
      }

      const fileId = roomUtils.addFileToRoom(currentRoomCode, name, type, data);
      if (fileId) {
        const fileMessage = roomUtils.addMessageToRoom(
          currentRoomCode,
          currentUserNickname,
          `Shared a file: ${name}`,
          'file',
          { fileId, name, type },
          theme
        );

        io.to(currentRoomCode).emit('receive-message', fileMessage);
        callback({ success: true });
      } else {
        callback({ error: 'Failed to upload file' });
      }
    });

    socket.on('get-file', ({ fileId }, callback) => {
      if (!currentRoomCode) return callback({ error: 'Not in a room' });
      const file = roomUtils.getFileFromRoom(currentRoomCode, fileId);
      if (file) {
        callback({ file });
      } else {
        callback({ error: 'File not found' });
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
