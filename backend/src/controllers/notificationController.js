/**
 * FoodShareAI - Notification Controller
 * REST handlers for notification listing, unread badge counters, read state updates,
 * deletion, and Expo device token registration.
 */
const notificationService = require('../services/notificationService');

/**
 * GET /api/notifications
 * Retrieves paginated notifications belonging exclusively to the authenticated user.
 */
const getMyNotifications = async (req, res, next) => {
  try {
    const { page, limit, unreadOnly, type } = req.query;

    const result = await notificationService.getUserNotifications(req.user._id, {
      page,
      limit,
      unreadOnly: unreadOnly === 'true' || unreadOnly === true,
      type,
    });

    return res.status(200).json({
      success: true,
      data: result.notifications,
      pagination: result.pagination,
      unreadCount: result.unreadCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/notifications/unread-count
 * Returns unread notification count for the authenticated user.
 */
const getUnreadCount = async (req, res, next) => {
  try {
    const result = await notificationService.getUnreadCount(req.user._id);

    return res.status(200).json({
      success: true,
      count: result.count,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/:id/read
 * Marks a specific notification as read.
 */
const markAsRead = async (req, res, next) => {
  try {
    const { id } = req.params;

    const notification = await notificationService.markAsRead(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/notifications/read-all
 * Marks all unread notifications for the authenticated user as read.
 */
const markAllAsRead = async (req, res, next) => {
  try {
    const result = await notificationService.markAllAsRead(req.user._id);

    return res.status(200).json({
      success: true,
      message: 'All notifications marked as read',
      updatedCount: result.updatedCount,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/:id
 * Deletes an individual notification belonging to the authenticated user.
 */
const deleteNotification = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await notificationService.deleteNotification(id, req.user._id);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/notifications/device-token
 * Registers an Expo push token for the authenticated user.
 */
const registerDeviceToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;

    if (!pushToken) {
      return res.status(400).json({
        success: false,
        error: { code: 'MISSING_PUSH_TOKEN', message: 'pushToken string is required' },
      });
    }

    const result = await notificationService.registerDeviceToken(req.user._id, pushToken);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/notifications/device-token
 * Removes a registered Expo push token (e.g., upon user logout).
 */
const removeDeviceToken = async (req, res, next) => {
  try {
    const { pushToken } = req.body;

    const result = await notificationService.removeDeviceToken(req.user._id, pushToken);

    return res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerDeviceToken,
  removeDeviceToken,
};
