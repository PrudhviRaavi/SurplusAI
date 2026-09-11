/**
 * FoodShareAI - Donor Controller
 * Handles donor profile retrieval, onboarding updates, and impact analytics.
 */
const donorService = require('../services/donorService');
const impactService = require('../services/impactService');
const achievementService = require('../services/achievementService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/donor/profile
 */
const getProfile = async (req, res, next) => {
  try {
    const profileData = await donorService.getDonorProfile(req.user.id);
    return sendSuccess(res, 'Donor profile retrieved', profileData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/donor/profile
 */
const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await donorService.updateDonorProfile(req.user.id, req.body);
    return sendSuccess(res, 'Donor profile updated successfully', updatedProfile, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donor/impact
 */
const getImpact = async (req, res, next) => {
  try {
    const impactData = await impactService.getDonorImpact(req.user.id);
    return sendSuccess(res, 'Donor impact metrics retrieved', impactData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donor/achievements
 */
const getAchievements = async (req, res, next) => {
  try {
    const badges = await achievementService.getDonorAchievements(req.user.id);
    return sendSuccess(res, 'Donor achievements retrieved', badges, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  getImpact,
  getAchievements,
};
