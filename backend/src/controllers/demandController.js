/**
 * FoodShareAI - Demand & Operational Intelligence Controller
 * Exposes time-series demand predictions for NGOs and comprehensive operational intelligence for Admins.
 */
const demandPredictionService = require('../services/demandPredictionService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/demand/forecast
 * Retrieves or generates food demand predictions (accessible to authenticated NGOs and Admins)
 */
const getDemandForecast = async (req, res, next) => {
  try {
    const { foodCategory, period, forceRegenerate } = req.query;

    const result = await demandPredictionService.generateForecast({
      foodCategory: foodCategory || 'ALL',
      period: period || '24_HOURS',
      forceRegenerate: forceRegenerate === 'true',
    });

    return sendSuccess(
      res,
      result.status === 'INSUFFICIENT_DATA'
        ? 'Not enough historical data for a reliable demand forecast.'
        : result.status === 'MODEL_NOT_LOADED'
        ? 'AI demand model is currently offline/not loaded.'
        : 'Demand forecast retrieved successfully.',
      result,
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/intelligence/demand
 * Admin-exclusive operational intelligence dashboard endpoint
 */
const getAdminDemandIntelligence = async (req, res, next) => {
  try {
    const { foodCategory, period } = req.query;

    const result = await demandPredictionService.generateForecast({
      foodCategory: foodCategory || 'ALL',
      period: period || 'ALL',
      forceRegenerate: false,
    });

    const forecast = result.forecast || {};

    const intelligenceData = {
      status: result.status,
      modelVersion: forecast.modelVersion || 'demand_lstm_v1',
      category: foodCategory || 'ALL',
      todaySupply: forecast.todaySupply || 0,
      todayDemand: forecast.todayDemand || 0,
      gapMeals: forecast.gapMeals || 0,
      forecast24h: forecast.forecast24h || 0,
      forecast7d: forecast.forecast7d || 0,
      forecast30d: forecast.forecast30d || 0,
      confidence: forecast.confidence || 0,
      categoryBreakdown: forecast.categoryBreakdown || [],
      inputDataRange: forecast.inputDataRange || {},
      evaluationMetrics: forecast.evaluationMetrics || {},
      generatedAt: forecast.generatedAt || new Date(),
    };

    return sendSuccess(
      res,
      'Admin operational intelligence demand metrics retrieved successfully',
      intelligenceData,
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDemandForecast,
  getAdminDemandIntelligence,
};
