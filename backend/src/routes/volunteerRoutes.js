/**
 * FoodShareAI - Volunteer Routes
 * Complete routing for volunteer operations, tasks, active deliveries, and impact.
 */
const express = require('express');
const router = express.Router();

const volunteerController = require('../controllers/volunteerController');
const deliveryController = require('../controllers/deliveryController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All volunteer endpoints require JWT authentication and VOLUNTEER role
router.use(authenticate);
router.use(authorizeRoles('VOLUNTEER'));

// 1. Volunteer Profile & Dashboard
router.get('/profile', volunteerController.getProfile);
router.put('/profile', volunteerController.updateProfile);
router.get('/dashboard', volunteerController.getDashboard);
router.get('/impact', volunteerController.getImpact);
router.get('/leaderboard', volunteerController.getLeaderboard);
router.get('/leaderboard/me', volunteerController.getMyRank);
router.get('/achievements', volunteerController.getAchievements);

// 2. Task Discovery & Acceptance
router.get('/tasks', deliveryController.getAvailableTasks);
router.get('/tasks/:id', deliveryController.getTaskById);
router.post('/tasks/:id/accept', deliveryController.acceptTask);

// 3. Active Delivery Lifecycle Execution
router.get('/deliveries', deliveryController.getMyDeliveries);
router.get('/deliveries/:id', deliveryController.getDeliveryById);
router.put('/deliveries/:id/status', deliveryController.updateDeliveryStatus);
router.post('/deliveries/:id/pickup', deliveryController.confirmPickup);
router.post('/deliveries/:id/proof', deliveryController.uploadProof);
router.post('/deliveries/:id/complete', deliveryController.completeDelivery);

module.exports = router;
