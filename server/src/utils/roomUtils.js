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
      messages: []
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
    if (room.users.size >= 15) return { error: 'Room is full' };

    room.users.set(socketId, { nickname });
    return { room };
  },

  removeUserFromRoom: (code, socketId) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const user = room.users.get(socketId);
    room.users.delete(socketId);

    // Cleanup empty rooms
    if (room.users.size === 0) {
      rooms.delete(code.toUpperCase());
    }

    return { room, user };
  },

  addMessageToRoom: (code, nickname, text) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const message = {
      id: crypto.randomUUID(),
      sender: nickname,
      text,
      timestamp: new Date().toISOString(),
      type: 'chat'
    };

    room.messages.push(message);
    return message;
  },

  addSystemMessageToRoom: (code, text) => {
    const room = rooms.get(code.toUpperCase());
    if (!room) return null;

    const message = {
      id: crypto.randomUUID(),
      sender: 'System',
      text,
      timestamp: new Date().toISOString(),
      type: 'system'
    };

    room.messages.push(message);
    return message;
  }
};

module.exports = roomUtils;
