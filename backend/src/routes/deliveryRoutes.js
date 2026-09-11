/**
 * FoodShareAI - Delivery Routes
 * Core delivery resource routing.
 */
const express = require('express');
const router = express.Router();

const deliveryController = require('../controllers/deliveryController');
const routeController = require('../controllers/routeController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

router.use(authenticate);

// Volunteer-assigned operations
router.get('/', authorizeRoles('VOLUNTEER', 'ADMIN'), deliveryController.getMyDeliveries);
router.get('/available', authorizeRoles('VOLUNTEER', 'ADMIN'), deliveryController.getAvailableTasks);
router.get('/:id', deliveryController.getDeliveryById);
router.post('/:id/accept', authorizeRoles('VOLUNTEER'), deliveryController.acceptTask);
router.put('/:id/status', authorizeRoles('VOLUNTEER'), deliveryController.updateDeliveryStatus);
router.post('/:id/pickup', authorizeRoles('VOLUNTEER'), deliveryController.confirmPickup);
router.post('/:id/proof', authorizeRoles('VOLUNTEER'), deliveryController.uploadProof);
router.post('/:id/complete', authorizeRoles('VOLUNTEER'), deliveryController.completeDelivery);

// Route & GPS Tracking Operations
router.post('/:id/route', authorizeRoles('VOLUNTEER', 'ADMIN'), routeController.generateDeliveryRoute);
router.get('/:id/route', routeController.getDeliveryRoute);
router.get('/:id/location', routeController.getDeliveryLocation);

module.exports = router;
