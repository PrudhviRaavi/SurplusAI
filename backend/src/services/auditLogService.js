/**
 * FoodShareAI - Audit Log Service
 * Handles recording and retrieval of administrative audit events.
 * Strips sensitive data (passwords, tokens, secrets) before persisting.
 */
const { AuditLog } = require('../models');

/**
 * Sanitizes metadata to prevent recording sensitive secrets
 */
const sanitizeMetadata = (meta) => {
  if (!meta || typeof meta !== 'object') return {};

  const clean = Array.isArray(meta) ? [...meta] : { ...meta };
  const sensitiveKeys = ['password', 'passwordHash', 'token', 'accessToken', 'refreshToken', 'secret', 'pushToken'];

  for (const key of Object.keys(clean)) {
    if (sensitiveKeys.some((s) => key.toLowerCase().includes(s.toLowerCase()))) {
      delete clean[key];
    } else if (clean[key] && typeof clean[key] === 'object') {
      clean[key] = sanitizeMetadata(clean[key]);
    }
  }

  return clean;
};

/**
 * Logs an administrative governance action
 * Resilient: Failure to log does not crash primary transaction
 */
const logAction = async ({
  actorId,
  action,
  entityType,
  entityId = null,
  metadata = {},
  ipAddress = '',
  userAgent = '',
}) => {
  try {
    if (!actorId || !action || !entityType) {
      console.warn('⚠️ [AuditLog] Missing required fields for audit log entry');
      return null;
    }

    const sanitizedMeta = sanitizeMetadata(metadata);

    const logEntry = await AuditLog.create({
      actorId,
      action,
      entityType,
      entityId,
      metadata: sanitizedMeta,
      ipAddress: ipAddress ? String(ipAddress).substring(0, 100) : '',
      userAgent: userAgent ? String(userAgent).substring(0, 255) : '',
    });

    return logEntry;
  } catch (err) {
    console.error(`❌ [AuditLog] Error writing audit record: ${err.message}`);
    return null;
  }
};

/**
 * Retrieves paginated audit logs with multi-field filtering
 */
const getAuditLogs = async ({
  action,
  entityType,
  actorId,
  startDate,
  endDate,
  page = 1,
  limit = 20,
}) => {
  const query = {};

  if (action) {
    query.action = action;
  }

  if (entityType) {
    query.entityType = entityType;
  }

  if (actorId) {
    query.actorId = actorId;
  }

  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) {
      query.createdAt.$gte = new Date(startDate);
    }
    if (endDate) {
      query.createdAt.$lte = new Date(endDate);
    }
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [logs, total] = await Promise.all([
    AuditLog.find(query)
      .populate('actorId', 'fullName email role')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    AuditLog.countDocuments(query),
  ]);

  return {
    logs,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

module.exports = {
  sanitizeMetadata,
  logAction,
  getAuditLogs,
};
