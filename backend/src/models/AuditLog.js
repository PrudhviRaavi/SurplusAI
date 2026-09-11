/**
 * FoodShareAI - Audit Log Model
 * Immutable governance audit records documenting all administrative and operational interventions.
 * Security notice: Never store passwords, tokens, hashes, or sensitive credentials in metadata.
 */
const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Actor user reference is required'],
      index: true,
    },
    action: {
      type: String,
      required: [true, 'Audit action is required'],
      trim: true,
      index: true,
    },
    entityType: {
      type: String,
      required: [true, 'Entity type is required'],
      enum: {
        values: [
          'USER',
          'NGO_PROFILE',
          'DONOR_PROFILE',
          'VOLUNTEER_PROFILE',
          'DONATION',
          'CLAIM',
          'DELIVERY',
          'RISK_ASSESSMENT',
          'SAFETY_ALERT',
          'DEMAND_FORECAST',
          'SYSTEM',
        ],
        message: '{VALUE} is not a valid audit entity type',
      },
      index: true,
    },
    entityId: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: () => ({}),
    },
    ipAddress: {
      type: String,
      trim: true,
      default: '',
    },
    userAgent: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// High-performance audit search indexes
auditLogSchema.index({ action: 1, createdAt: -1 });
auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ actorId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

const AuditLog = mongoose.model('AuditLog', auditLogSchema);

module.exports = AuditLog;
