const crypto = require('crypto');

// In-memory room storage
const rooms = new Map();

/**
 * Generates a unique 6-character uppercase alphanumeric room code.
 */
const generateRoomCode = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  } while (rooms.has(code));
  return code;
};

/**
 * Room Management Helpers
 */
const roomUtils = {
  getRoom: (code) => rooms.get(code.toUpperCase()),

  createRoom: () => {
    const code = generateRoomCode();
    const room = {
      code,
      users: new Map(), // socket.id -> { nickname }
      messages: [],
      files: new Map() // fileId -> { name, type, data }
    };
    rooms.set(code, room);
    return room;
  },

  deleteRoom: (code) => {
    return rooms.delete(code.toUpperCase());
  },

  addUserToRoom: (code, socketId, nickname) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return { error: 'Room not found' };

    // Check if nickname is already in use
    const isNicknameTaken = Array.from(room.users.values()).some(u => u.nickname.toLowerCase() === nickname.toLowerCase());
    if (isNicknameTaken) return { error: 'Nickname already in use in this room' };

    if (room.users.size >= 15) return { error: 'Room is full' };

    // Cancel inactivity timer if user joins
    if (room.inactivityTimer) {
      clearTimeout(room.inactivityTimer);
      room.inactivityTimer = null;
      console.log(`Inactivity timer cancelled for room: ${code}`);
    }

    room.users.set(socketId, { nickname });
    return { room };
  },

  removeUserFromRoom: (code, socketId) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const user = room.users.get(socketId);
    room.users.delete(socketId);

    // Cleanup empty rooms after 30 minutes
    if (room.users.size === 0) {
      if (room.inactivityTimer) clearTimeout(room.inactivityTimer);

      room.inactivityTimer = setTimeout(() => {
        rooms.delete(code.toUpperCase());
        console.log(`Room ${code} deleted due to 30 minutes of inactivity.`);
      }, 30 * 60 * 1000); // 30 minutes

      console.log(`Inactivity timer started for room: ${code}`);
    }

    return { room, user };
  },

  addMessageToRoom: (code, nickname, text, type = 'chat', fileData = null) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const message = {
      id: crypto.randomUUID(),
      sender: nickname,
      text,
      timestamp: new Date().toISOString(),
      type,
      reactions: {}, // emoji -> Set(socketId)
      file: fileData
    };

    room.messages.push(message);
    return message;
  },

  addReactionToMessage: (code, messageId, socketId, emoji) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const message = room.messages.find(m => m.id === messageId);
    if (!message) return null;

    if (!message.reactions) {
      message.reactions = {};
    }

    if (!message.reactions[emoji]) {
      message.reactions[emoji] = new Set();
    }

    if (message.reactions[emoji].has(socketId)) {
      message.reactions[emoji].delete(socketId);
    } else {
      message.reactions[emoji].add(socketId);
    }

    return message;
  },

  addFileToRoom: (code, name, type, data) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const fileId = crypto.randomUUID();
    room.files.set(fileId, { name, type, data });
    return fileId;
  },

  getFileFromRoom: (code, fileId) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;
    return room.files.get(fileId);
  },

  addSystemMessageToRoom: (code, text) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const message = {
      id: crypto.randomUUID(),
      sender: 'System',
      text,
      timestamp: new Date().toISOString(),
      type: 'system',
      reactions: {}
    };

    room.messages.push(message);
    return message;
  }
};

module.exports = roomUtils;
