/**
 * FoodShareAI - Donation Controller
 * Handles food donation creation, listing, detail viewing, updating, cancelling, publishing, and AI analysis.
 */
const donationService = require('../services/donationService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * POST /api/donations
 */
const createDonation = async (req, res, next) => {
  try {
    const donation = await donationService.createDonation(req.user.id, req.body);
    return sendSuccess(res, 'Donation draft created successfully', donation, 201);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donations/my
 */
const getMyDonations = async (req, res, next) => {
  try {
    const result = await donationService.getMyDonations(req.user.id, req.query);
    return sendSuccess(res, 'Donations retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donations/:id
 */
const getDonationById = async (req, res, next) => {
  try {
    const donation = await donationService.getDonationById(
      req.params.id,
      req.user.id,
      req.user.role
    );
    return sendSuccess(res, 'Donation retrieved successfully', donation, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/donations/:id
 */
const updateDonation = async (req, res, next) => {
  try {
    const updated = await donationService.updateDonation(
      req.params.id,
      req.user.id,
      req.body
    );
    return sendSuccess(res, 'Donation updated successfully', updated, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE /api/donations/:id
 */
const deleteOrCancelDonation = async (req, res, next) => {
  try {
    const result = await donationService.deleteOrCancelDonation(
      req.params.id,
      req.user.id
    );
    return sendSuccess(res, result.message, { action: result.action }, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/donations/:id/publish
 */
const publishDonation = async (req, res, next) => {
  try {
    const published = await donationService.publishDonation(
      req.params.id,
      req.user.id
    );
    return sendSuccess(res, 'Donation published successfully! It is now visible for NGO matching.', published, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/donations/:id/analyze
 */
const requestFoodAnalysis = async (req, res, next) => {
  try {
    const result = await donationService.requestFoodAnalysis(
      req.params.id,
      req.user.id
    );
    return sendSuccess(res, result.message, result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/donations/:id/analysis
 */
const getFoodAnalysis = async (req, res, next) => {
  try {
    const result = await donationService.getFoodAnalysis(
      req.params.id,
      req.user.id
    );
    return sendSuccess(res, result.message || 'Analysis details retrieved', result, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteOrCancelDonation,
  publishDonation,
  requestFoodAnalysis,
  getFoodAnalysis,
};
