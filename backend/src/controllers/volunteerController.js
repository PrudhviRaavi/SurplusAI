/**
 * FoodShareAI - Volunteer Controller
 * Handles volunteer profile retrieval, updates, dashboard metrics, and impact analytics.
 */
const volunteerService = require('../services/volunteerService');
const deliveryService = require('../services/deliveryService');
const impactService = require('../services/impactService');
const gamificationService = require('../services/gamificationService');
const achievementService = require('../services/achievementService');
const routeOptimizationService = require('../services/routeOptimizationService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/volunteer/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profileData = await volunteerService.getVolunteerProfile(req.user.id);
    return sendSuccess(res, 'Volunteer profile retrieved', profileData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/volunteer/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const updated = await volunteerService.updateVolunteerProfile(req.user.id, req.body);
    return sendSuccess(res, 'Volunteer profile updated successfully', updated, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await volunteerService.getVolunteerDashboardData(req.user.id);
    return sendSuccess(res, 'Volunteer dashboard metrics retrieved', dashboardData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/impact
 */
const getImpact = async (req, res, next) => {
  try {
    const impactData = await impactService.getVolunteerImpact(req.user.id);
    return sendSuccess(res, 'Volunteer impact analytics retrieved', impactData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/leaderboard
 */
const getLeaderboard = async (req, res, next) => {
  try {
    const { timeframe, category, page, limit } = req.query;
    const leaderboardData = await gamificationService.getVolunteerLeaderboard({
      timeframe,
      category,
      page,
      limit,
      currentUserId: req.user.id,
    });
    return sendSuccess(res, 'Volunteer leaderboard retrieved successfully', leaderboardData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/leaderboard/me
 */
const getMyRank = async (req, res, next) => {
  try {
    const rankData = await gamificationService.getVolunteerRank(req.user.id);
    return sendSuccess(res, 'Volunteer rank and level retrieved successfully', rankData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/achievements
 */
const getAchievements = async (req, res, next) => {
  try {
    const badges = await achievementService.getVolunteerAchievements(req.user.id);
    return sendSuccess(res, 'Volunteer achievements retrieved successfully', badges, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/volunteer/route/optimize
 * Optimizes a multi-stop dispatch route for volunteer requests using A*
 */
const optimizeMultiStopRoute = async (req, res, next) => {
  try {
    const { stops } = req.body;
    if (!Array.isArray(stops) || stops.length < 2) {
      const err = new Error('At least 2 route stops with valid coordinates are required');
      err.statusCode = 400;
      throw err;
    }
    const routePlan = routeOptimizationService.generateMultiStopRoute(stops);
    return sendSuccess(res, 'Optimized multi-stop route generated successfully using A*', routePlan, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getDashboard,
  getImpact,
  getLeaderboard,
  getMyRank,
  getAchievements,
  optimizeMultiStopRoute,
};
