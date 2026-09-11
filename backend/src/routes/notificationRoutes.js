/**
 * FoodShareAI - Notification Routes
 * Endpoints for notification feed, unread metrics, read state toggles, and device tokens.
 */
const express = require('express');
const router = express.Router();

const notificationController = require('../controllers/notificationController');
const { authenticate } = require('../middleware/authMiddleware');

// All notification endpoints require authentication
router.use(authenticate);

// Listing & metrics
router.get('/', notificationController.getMyNotifications);
router.get('/unread-count', notificationController.getUnreadCount);

// Bulk and single read status updates
router.put('/read-all', notificationController.markAllAsRead);
router.put('/:id/read', notificationController.markAsRead);

// Deletion
router.delete('/:id', notificationController.deleteNotification);

// Push device token registration & removal
router.post('/device-token', notificationController.registerDeviceToken);
router.delete('/device-token', notificationController.removeDeviceToken);

module.exports = router;
