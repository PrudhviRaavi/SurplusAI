/**
 * FoodShareAI - NGO Controller
 * Handles incoming HTTP requests for NGO profiles, discovery, matching, claims, and dashboard.
 */
const ngoService = require('../services/ngoService');
const impactService = require('../services/impactService');
const achievementService = require('../services/achievementService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/ngo/profile
 * Return authenticated NGO's user and profile details
 */
const getProfile = async (req, res, next) => {
  try {
    const profileData = await ngoService.getNgoProfile(req.user.id);
    return sendSuccess(res, 'NGO profile retrieved successfully', profileData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/ngo/profile
 * Update NGO profile fields and check onboarding completion
 */
const updateProfile = async (req, res, next) => {
  try {
    const updatedProfile = await ngoService.updateNgoProfile(req.user.id, req.body);
    return sendSuccess(res, 'NGO profile updated successfully', updatedProfile, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/donations
 * Discover eligible published donations with optional spatial and category filtering
 */
const discoverDonations = async (req, res, next) => {
  try {
    const discoveryData = await ngoService.discoverAvailableDonations(req.query, req.user.id);
    return sendSuccess(res, 'Available food donations discovered', discoveryData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/matches/:donationId
 * Smart matching factor breakdown for a specific donation
 */
const getDonationMatch = async (req, res, next) => {
  try {
    const matchData = await ngoService.getDonationMatchDetails(
      req.params.donationId,
      req.user.id
    );
    return sendSuccess(res, 'Donation smart match factors computed', matchData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/recommendations
 * Ranked recommendations ordered by weighted match score
 */
const getRecommendations = async (req, res, next) => {
  try {
    const recommendationsData = await ngoService.getRecommendedDonations(
      req.user.id,
      req.query
    );
    return sendSuccess(res, 'Recommended donations retrieved', recommendationsData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/ngo/donations/:donationId/claim
 * Claim an eligible donation with duplicate and concurrent claim prevention
 */
const claimDonation = async (req, res, next) => {
  try {
    const claimResult = await ngoService.claimDonation(
      req.params.donationId,
      req.user.id,
      req.body
    );
    return sendSuccess(res, 'Donation successfully claimed', claimResult, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/claims
 * Retrieve list of claims belonging to the authenticated NGO
 */
const getClaims = async (req, res, next) => {
  try {
    const claimsData = await ngoService.getNgoClaims(req.user.id, req.query);
    return sendSuccess(res, 'NGO claims retrieved successfully', claimsData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/claims/:id
 * Retrieve details of a specific claim (ownership protected)
 */
const getClaimById = async (req, res, next) => {
  try {
    const claimData = await ngoService.getNgoClaimById(req.params.id, req.user.id);
    return sendSuccess(res, 'Claim details retrieved', claimData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/dashboard
 * Return database-backed NGO dashboard summary metrics
 */
const getDashboard = async (req, res, next) => {
  try {
    const dashboardData = await ngoService.getNgoDashboardData(req.user.id);
    return sendSuccess(res, 'NGO dashboard metrics retrieved', dashboardData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/impact
 * Return authenticated NGO's real impact analytics
 */
const getImpact = async (req, res, next) => {
  try {
    const impactData = await impactService.getNgoImpact(req.user.id);
    return sendSuccess(res, 'NGO impact metrics retrieved successfully', impactData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/ngo/achievements
 * Return authenticated NGO's verified achievements
 */
const getAchievements = async (req, res, next) => {
  try {
    const badges = await achievementService.getNgoAchievements(req.user.id);
    return sendSuccess(res, 'NGO achievements retrieved successfully', badges, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  discoverDonations,
  getDonationMatch,
  getRecommendations,
  claimDonation,
  getClaims,
  getClaimById,
  getDashboard,
  getImpact,
  getAchievements,
};
