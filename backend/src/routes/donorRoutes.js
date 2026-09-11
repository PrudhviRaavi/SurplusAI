/**
 * FoodShareAI - Donor Routes
 * Endpoints for authenticated donors to manage their profile and view impact.
 */
const express = require('express');
const router = express.Router();

const donorController = require('../controllers/donorController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All donor routes require authentication and DONOR role
router.use(authenticate);
router.use(authorizeRoles('DONOR'));

router.get('/profile', donorController.getProfile);
router.put('/profile', donorController.updateProfile);
router.get('/impact', donorController.getImpact);
router.get('/achievements', donorController.getAchievements);

module.exports = router;
