/**
 * FoodShareAI - Database Connection Configuration
 */
const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoURI = process.env.MONGODB_URI;

  if (!mongoURI) {
    console.warn('⚠️  [MongoDB] MONGODB_URI is not set in environment variables. Running in disconnected mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ [MongoDB] Connected successfully: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    // Safe failure: log the error and allow server to manage lifecycle
    return null;
  }
};

module.exports = connectDB;
