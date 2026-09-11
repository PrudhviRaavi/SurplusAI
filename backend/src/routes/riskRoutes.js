/**
 * FoodShareAI - Risk Routes
 * Routes for administrative risk governance, anomaly reviews, and duplicate detection.
 */
const express = require('express');
const router = express.Router();

const riskController = require('../controllers/riskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All risk routes require authentication
router.use(authenticate);

// Donation duplicate detection (accessible to donor and admin)
router.get('/donations/:id/duplicates', riskController.getDonationDuplicates);

// Administrative risk governance (admin only)
router.get('/admin/assessments', authorizeRoles('ADMIN'), riskController.getAdminRiskAssessments);
router.put('/admin/assessments/:id/review', authorizeRoles('ADMIN'), riskController.reviewRiskAssessment);

module.exports = router;
