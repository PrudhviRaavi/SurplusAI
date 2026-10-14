/**
 * FoodShareAI - Socket.IO Server Initialization
 * Authenticates handshakes via existing JWT tokens and registers modular socket handlers.
 */
const { Server } = require('socket.io');
const { verifyAccessToken } = require('../utils/jwt');
const { User } = require('../models');
const { registerDeliveryHandlers } = require('./deliverySocket');

let ioInstance = null;

/**
 * Returns the current active Socket.IO server instance.
 */
const getIO = () => ioInstance;

/**
 * Emits an event specifically to a user's private notification channel.
 */
const emitToUser = (userId, event, payload) => {
  if (ioInstance && userId) {
    ioInstance.to(`user:${userId.toString()}`).emit(event, payload);
  }
};

/**
 * Emits an event to all connected sockets matching a specific system role.
 */
const emitToRole = (role, event, payload) => {
  if (ioInstance && role) {
    ioInstance.to(`role:${role}`).emit(event, payload);
  }
};

/**
 * Initializes Socket.IO on the provided HTTP server
 * @param {import('http').Server} httpServer
 * @returns {import('socket.io').Server}
 */
const initSocketServer = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: '*', // Allow React Native / Expo dev client connections
      methods: ['GET', 'POST'],
      credentials: true,
    },
    pingTimeout: 20000,
    pingInterval: 25000,
  });

  ioInstance = io;

  // Authentication Middleware for Socket.IO
  io.use(async (socket, next) => {
    try {
      const authHeader = socket.handshake.auth?.token || socket.handshake.headers?.authorization;

      if (!authHeader) {
        return next(new Error('Authentication token required'));
      }

      const token = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : authHeader;
      const decoded = verifyAccessToken(token);

      if (!decoded || !decoded.userId) {
        return next(new Error('Invalid authentication token'));
      }

      // Verify active user status
      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (!user || user.status === 'SUSPENDED') {
        return next(new Error('User account is invalid or suspended'));
      }

      // Attach user context to socket
      socket.user = {
        id: user._id.toString(),
        role: user.role,
        fullName: user.fullName,
      };

      next();
    } catch (err) {
      next(new Error(`Socket authentication failed: ${err.message}`));
    }
  });

  io.on('connection', (socket) => {
    // Automatically join user's private notification room
    if (socket.user?.id) {
      socket.join(`user:${socket.user.id}`);
    }

    // Join role-specific broadcast room
    if (socket.user?.role) {
      socket.join(`role:${socket.user.role}`);
    }

    // Register modular event handlers
    registerDeliveryHandlers(io, socket);

    socket.on('disconnect', () => {
      // Disconnection handled safely without disrupting delivery state
    });
  });

  return io;
};

const broadcastDonationCreated = (donation) => {
  if (ioInstance && donation) {
    ioInstance.to('role:NGO').emit('donation:created', donation);
    ioInstance.to('role:VOLUNTEER').emit('donation:created', donation);
    ioInstance.emit('donation:published', donation);
  }
};

const broadcastDonationUpdated = (donation) => {
  if (ioInstance && donation) {
    ioInstance.emit('donation:updated', donation);
  }
};

const broadcastTaskUpdated = (task) => {
  if (ioInstance && task) {
    ioInstance.emit('task:updated', task);
  }
};

module.exports = {
  initSocketServer,
  getIO,
  emitToUser,
  emitToRole,
  broadcastDonationCreated,
  broadcastDonationUpdated,
  broadcastTaskUpdated,
};
