/**
 * FoodShareAI - Safety Routes
 * Routes for food safety verification and administrative safety alert feeds.
 */
const express = require('express');
const router = express.Router();

const safetyController = require('../controllers/safetyController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All safety routes require authentication
router.use(authenticate);

// Public / operational safety evaluation for a donation
router.get('/donations/:id', safetyController.getDonationSafety);

// Administrative safety monitoring alerts
router.get('/admin/alerts', authorizeRoles('ADMIN'), safetyController.getAdminSafetyAlerts);

module.exports = router;
