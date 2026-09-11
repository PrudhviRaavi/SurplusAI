/**
 * FoodShareAI - Notification Model
 * Stores in-app alerts and operational notifications for all actors.
 */
const mongoose = require('mongoose');
const { NOTIFICATION_TYPES } = require('../utils/constants');

const notificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      enum: {
        values: NOTIFICATION_TYPES,
        message: '{VALUE} is not a valid notification type',
      },
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [1000, 'Message cannot exceed 1000 characters'],
    },
    relatedEntityType: {
      type: String,
      enum: {
        values: [
          'DONATION',
          'CLAIM',
          'DELIVERY',
          'AI_ANALYSIS',
          'RISK_ASSESSMENT',
          'DEMAND_FORECAST',
          'NGO_PROFILE',
          'USER',
          'AUDIT_LOG',
          'SYSTEM',
        ],
        message: '{VALUE} is not a valid related entity type',
      },
      default: 'SYSTEM',
      index: true,
    },
    relatedEntityId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      index: true,
    },
    priority: {
      type: String,
      enum: {
        values: ['LOW', 'NORMAL', 'HIGH', 'CRITICAL'],
        message: '{VALUE} is not a valid notification priority',
      },
      default: 'NORMAL',
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// High performance query indexes
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, type: 1, relatedEntityId: 1, createdAt: -1 });

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
