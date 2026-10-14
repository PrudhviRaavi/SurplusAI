/**
 * FoodShareAI - Health Check Controller
 * Reports honest status for Express server, MongoDB connectivity, and ML microservice.
 * Never exposes credentials, secrets, or internal connection strings.
 */
const mongoose = require('mongoose');
const { checkMlServiceHealth } = require('../services/aiAnalysisService');

/**
 * Health check endpoint to verify backend status & connectivity
 * @route GET /api/health
 */
const getHealth = async (req, res) => {
  const dbState = mongoose.connection.readyState;
  const dbStatusMap = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  // Asynchronously query ML microservice health with 3-second timeout
  const mlHealth = await checkMlServiceHealth();

  const isDatabaseConnected = dbState === 1;
  const isMlConnected = mlHealth && mlHealth.connected === true;
  const isHealthy = isDatabaseConnected;
  const statusCode = isHealthy ? 200 : 503;

  return res.status(statusCode).json({
    success: isHealthy,
    service: 'foodshareai-backend',
    message: isHealthy
      ? 'FoodShareAI API is operational'
      : 'FoodShareAI API is degraded: database is disconnected',
    timestamp: new Date().toISOString(),
    status: {
      uptimeSeconds: Math.floor(process.uptime()),
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: dbStatusMap[dbState] || 'unknown',
        connected: isDatabaseConnected,
      },
      mlMicroservice: {
        connected: isMlConnected,
        status: mlHealth?.status || 'UNREACHABLE',
        modelVersions: mlHealth?.modelVersions || null,
        modelsStatus: mlHealth?.modelsStatus || null,
      },
    },
  });
};

module.exports = {
  getHealth,
};
