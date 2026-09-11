/**
 * FoodShareAI - Notification Service
 * Centralized notification engine managing in-app notifications, deduplication,
 * real-time Socket.IO emission, and asynchronous Expo push notifications.
 */
const { Notification, User } = require('../models');
const { pushNotificationService } = require('./pushNotificationService') ? require('./pushNotificationService') : { sendPushNotification: () => {} };
const { emitToUser } = require('../socket');

/**
 * Checks whether an identical notification was recently generated to prevent spam.
 */
const shouldSendNotification = async (userId, type, relatedEntityId, cooldownMinutes = 15) => {
  if (!userId || !type) return true;

  const query = {
    userId,
    type,
  };

  if (relatedEntityId) {
    query.relatedEntityId = relatedEntityId;
  }

  const cutoff = new Date(Date.now() - cooldownMinutes * 60 * 1000);
  query.createdAt = { $gte: cutoff };

  const recent = await Notification.findOne(query).lean();
  return !recent;
};

/**
 * Creates, persists, and broadcasts a new notification.
 */
const createNotification = async ({
  userId,
  type,
  title,
  message,
  relatedEntityType = 'SYSTEM',
  relatedEntityId = null,
  priority = 'NORMAL',
  data = {},
  bypassDeduplication = false,
}) => {
  if (!userId || !type || !title || !message) {
    throw new Error('userId, type, title, and message are required to create a notification');
  }

  // Deduplication check
  if (!bypassDeduplication) {
    const shouldSend = await shouldSendNotification(userId, type, relatedEntityId);
    if (!shouldSend) {
      return { deduplicated: true, message: 'Notification skipped due to cooldown deduplication' };
    }
  }

  // 1. Persist notification in MongoDB
  const notification = await Notification.create({
    userId,
    type,
    title: title.trim(),
    message: message.trim(),
    relatedEntityType,
    relatedEntityId,
    priority,
    data,
    isRead: false,
  });

  const payload = {
    id: notification._id.toString(),
    type: notification.type,
    title: notification.title,
    message: notification.message,
    relatedEntityType: notification.relatedEntityType,
    relatedEntityId: notification.relatedEntityId,
    priority: notification.priority,
    data: notification.data,
    createdAt: notification.createdAt.toISOString(),
  };

  // 2. Real-time in-app notification broadcast via Socket.IO
  try {
    emitToUser(userId, 'notification:new', { notification: payload });
  } catch (err) {
    // Non-blocking socket emission
  }

  // 3. Asynchronous push notification dispatch
  try {
    const user = await User.findById(userId).select('pushTokens notificationPreferences').lean();
    if (user && Array.isArray(user.pushTokens) && user.pushTokens.length > 0) {
      // Check user preferences if configured
      const prefs = user.notificationPreferences || {};
      let allowed = true;
      if (type.startsWith('DONATION') && prefs.donations === false) allowed = false;
      if (type.startsWith('CLAIM') && prefs.claims === false) allowed = false;
      if (type.startsWith('DELIVERY') && prefs.deliveries === false) allowed = false;
      if (type.includes('SAFETY') && prefs.safety === false) allowed = false;
      if (type.includes('DEMAND') && prefs.demand === false) allowed = false;

      // Always permit HIGH and CRITICAL priority alerts
      if (priority === 'HIGH' || priority === 'CRITICAL') allowed = true;

      if (allowed) {
        // Fire and forget push dispatch (never blocks execution)
        const pushService = require('./pushNotificationService');
        pushService
          .sendPushNotification({
            pushTokens: user.pushTokens,
            title,
            body: message,
            data: { ...data, notificationId: notification._id.toString(), type },
            priority,
          })
          .catch(() => {});
      }
    }
  } catch (err) {
    // Never allow push delivery failures to fail database transactions
  }

  return notification;
};

/**
 * Convenience method for notifying a user.
 */
const notifyUser = (payload) => createNotification(payload);

/**
 * Dispatches a notification to multiple target users concurrently.
 */
const notifyUsers = async (userIds, payloadTemplate) => {
  if (!Array.isArray(userIds) || userIds.length === 0) return [];

  const promises = userIds.map((userId) =>
    createNotification({
      ...payloadTemplate,
      userId,
    }).catch(() => null)
  );

  return Promise.all(promises);
};

/**
 * Retrieves paginated notifications for an authenticated user.
 */
const getUserNotifications = async (userId, { page = 1, limit = 20, unreadOnly = false, type } = {}) => {
  const query = { userId };

  if (unreadOnly) {
    query.isRead = false;
  }

  if (type) {
    query.type = type;
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [notifications, total, unreadCount] = await Promise.all([
    Notification.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Notification.countDocuments(query),
    Notification.countDocuments({ userId, isRead: false }),
  ]);

  return {
    notifications,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
    },
    unreadCount,
  };
};

/**
 * Retrieves unread notification count for a user.
 */
const getUnreadCount = async (userId) => {
  const count = await Notification.countDocuments({ userId, isRead: false });
  return { count };
};

/**
 * Marks a specific notification as read.
 */
const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOne({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    const err = new Error('Notification not found or access denied');
    err.statusCode = 404;
    throw err;
  }

  notification.isRead = true;
  notification.readAt = new Date();
  await notification.save();

  return notification;
};

/**
 * Marks all notifications for a user as read.
 */
const markAllAsRead = async (userId) => {
  const result = await Notification.updateMany(
    { userId, isRead: false },
    { $set: { isRead: true, readAt: new Date() } }
  );

  return { updatedCount: result.modifiedCount };
};

/**
 * Deletes a notification without deleting referenced operational entities.
 */
const deleteNotification = async (notificationId, userId) => {
  const notification = await Notification.findOneAndDelete({
    _id: notificationId,
    userId,
  });

  if (!notification) {
    const err = new Error('Notification not found or access denied');
    err.statusCode = 404;
    throw err;
  }

  return { success: true, message: 'Notification deleted' };
};

/**
 * Registers an Expo push token for an authenticated user.
 */
const registerDeviceToken = async (userId, pushToken) => {
  if (!pushToken || typeof pushToken !== 'string') {
    const err = new Error('Valid pushToken string is required');
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { $addToSet: { pushTokens: pushToken.trim() } },
    { new: true }
  ).select('pushTokens');

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  return { success: true, message: 'Device token registered successfully' };
};

/**
 * Removes an Expo push token (e.g. on logout).
 */
const removeDeviceToken = async (userId, pushToken) => {
  if (!pushToken) {
    // If no specific token passed, clear all tokens for this user
    await User.findByIdAndUpdate(userId, { $set: { pushTokens: [] } });
  } else {
    await User.findByIdAndUpdate(userId, { $pull: { pushTokens: pushToken.trim() } });
  }

  return { success: true, message: 'Device token removed successfully' };
};

module.exports = {
  shouldSendNotification,
  createNotification,
  notifyUser,
  notifyUsers,
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  registerDeviceToken,
  removeDeviceToken,
};
