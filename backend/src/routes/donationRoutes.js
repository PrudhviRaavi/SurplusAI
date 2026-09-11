/**
 * FoodShareAI - Donation Routes
 * Endpoints for donation creation, listing, detail viewing, modification, publishing, and AI analysis.
 */
const express = require('express');
const router = express.Router();

const donationController = require('../controllers/donationController');
const riskController = require('../controllers/riskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All donation endpoints require authentication
router.use(authenticate);

// Donor-specific donation management routes
router.post('/', authorizeRoles('DONOR'), donationController.createDonation);
router.get('/my', authorizeRoles('DONOR'), donationController.getMyDonations);

// Duplicate inspection route
router.get('/:id/duplicates', riskController.getDonationDuplicates);

// Single donation view (authorization checked at controller level for donor ownership)
router.get('/:id', donationController.getDonationById);

// Donor-specific lifecycle routes
router.put('/:id', authorizeRoles('DONOR'), donationController.updateDonation);
router.delete('/:id', authorizeRoles('DONOR'), donationController.deleteOrCancelDonation);
router.post('/:id/publish', authorizeRoles('DONOR'), donationController.publishDonation);
router.post('/:id/analyze', authorizeRoles('DONOR'), donationController.requestFoodAnalysis);
router.get('/:id/analysis', authorizeRoles('DONOR'), donationController.getFoodAnalysis);

module.exports = router;
