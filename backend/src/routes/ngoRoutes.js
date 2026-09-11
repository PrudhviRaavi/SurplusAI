/**
 * FoodShareAI - NGO Routes
 * API endpoints for authenticated NGO users.
 * Handles profile management, available food discovery, smart matching, claims, and dashboard.
 */
const express = require('express');
const router = express.Router();

const ngoController = require('../controllers/ngoController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All NGO endpoints require valid JWT authentication and NGO role
router.use(authenticate);
router.use(authorizeRoles('NGO'));

// 1. NGO Profile Endpoints
router.get('/profile', ngoController.getProfile);
router.put('/profile', ngoController.updateProfile);

// 2. NGO Discovery & Recommendations
router.get('/donations', ngoController.discoverDonations);
router.get('/recommendations', ngoController.getRecommendations);
router.get('/matches/:donationId', ngoController.getDonationMatch);

// 3. Claims & Lifecycle Management
router.post('/donations/:donationId/claim', ngoController.claimDonation);
router.get('/claims', ngoController.getClaims);
router.get('/claims/:id', ngoController.getClaimById);

// 4. NGO Dashboard & Impact Analytics
router.get('/dashboard', ngoController.getDashboard);
router.get('/impact', ngoController.getImpact);
router.get('/achievements', ngoController.getAchievements);

module.exports = router;
