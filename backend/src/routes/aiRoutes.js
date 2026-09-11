/**
 * FoodShareAI - Standalone AI Route for Direct Image Analysis
 * Permits authenticated users (such as Donors drafting a listing) to analyze an image directly
 * before or during donation creation.
 */
const express = require('express');
const router = express.Router();

const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { analyzeFoodImage, checkMlServiceHealth } = require('../services/aiAnalysisService');
const { sendSuccess } = require('../utils/apiResponse');

// Health of the ML Microservice
router.get('/health', async (req, res, next) => {
  try {
    const health = await checkMlServiceHealth();
    return sendSuccess(res, 'ML microservice health status', health, 200);
  } catch (err) {
    next(err);
  }
});

// Direct image analysis for donors during creation flow
router.post('/analyze', authenticate, authorizeRoles('DONOR'), async (req, res, next) => {
  try {
    const { imageUri, imageData, imageUrl, foodCategory, preparationTime, quantity } = req.body;
    const imgPayload = imageUri || imageData || imageUrl;

    if (!imgPayload) {
      const err = new Error('imageUri, imageData, or imageUrl is required');
      err.statusCode = 400;
      throw err;
    }

    const result = await analyzeFoodImage(imgPayload, {
      foodCategory,
      preparationTime,
      quantity,
    });

    return sendSuccess(res, result.message || 'Image analysis processed', result, 200);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
