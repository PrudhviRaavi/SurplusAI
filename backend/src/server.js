/**
 * FoodShareAI - Server Entry Point
 */
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { initSocketServer } = require('./socket');

const PORT = process.env.PORT || 5000;

let server;
let io;

const startServer = async () => {
  try {
    // Connect to MongoDB
    const dbConn = await connectDB();
    if (!dbConn) {
      console.warn('⚠️  [SERVER WARNING] Database connection was not established. Backend starting in DEGRADED mode.');
    }

    // Create HTTP server wrapping Express app
    server = http.createServer(app);

    // Initialize Socket.IO server
    io = initSocketServer(server);

    // Start Listening
    server.listen(PORT, () => {
      console.log('==================================================');
      console.log(`🚀 FoodShareAI API Server running in ${process.env.NODE_ENV || 'development'} mode`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`⚡ Socket.IO real-time engine initialized`);
      console.log(`🩺 Health check: http://localhost:${PORT}/api/health`);
      console.log('==================================================');
    });
  } catch (error) {
    console.error(`❌ Failed to start server: ${error.message}`);
    process.exit(1);
  }
};

const mongoose = require('mongoose');

// Graceful Shutdown Handler
const shutdown = async (signal) => {
  console.log(`\n🛑 Received ${signal}. Shutting down gracefully...`);

  if (io) {
    try {
      io.close();
      console.log('⚡ Socket.IO engine closed');
    } catch (_) {}
  }

  if (server) {
    server.close(async () => {
      console.log('🔒 HTTP server closed');
      try {
        if (mongoose.connection && mongoose.connection.readyState !== 0) {
          await mongoose.connection.close(false);
          console.log('🍃 MongoDB connection closed cleanly');
        }
      } catch (_) {}
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

process.on('unhandledRejection', (err) => {
  console.error(`💥 Unhandled Promise Rejection: ${err.message}`);
  if (server) {
    server.close(() => process.exit(1));
  } else {
    process.exit(1);
  }
});

process.on('uncaughtException', (err) => {
  console.error(`💥 Uncaught Exception: ${err.message}`);
  process.exit(1);
});

startServer();
