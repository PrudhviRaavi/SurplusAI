/**
 * FoodShareAI - Admin Operational Intelligence Controller
 * Exclusively restricted to ADMIN role.
 * Consolidates system telemetry, governance queues, operations monitoring, and spatial intelligence.
 */
const adminService = require('../services/adminService');
const auditLogService = require('../services/auditLogService');
const mapAnalyticsService = require('../services/mapAnalyticsService');
const { sendSuccess, sendError } = require('../utils/apiResponse');

/**
 * Extracts client IP and User-Agent for audit trails
 */
const getClientMeta = (req) => ({
  ipAddress: req.ip || req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '',
  userAgent: req.headers['user-agent'] || '',
});

/**
 * GET /api/admin/dashboard
 */
const getDashboard = async (req, res, next) => {
  try {
    const data = await adminService.getDashboardOverview();
    return sendSuccess(res, 'Admin operational overview retrieved successfully', data, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users
 */
const getUsers = async (req, res, next) => {
  try {
    const result = await adminService.getUsers(req.query);
    return sendSuccess(res, 'Users retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/users/:id
 */
const getUserById = async (req, res, next) => {
  try {
    const user = await adminService.getUserById(req.params.id);
    return sendSuccess(res, 'User details retrieved successfully', user, 200);
  } catch (error) {
    if (error.statusCode === 404) {
      return sendError(res, error.message, null, 404);
    }
    next(error);
  }
};

/**
 * PUT /api/admin/users/:id/status
 */
const updateUserStatus = async (req, res, next) => {
  try {
    const adminId = req.user.id || req.user._id;
    const targetUserId = req.params.id;
    const { isActive, reason } = req.body;

    if (isActive === undefined) {
      return sendError(res, 'isActive status boolean is required in request body', null, 400);
    }

    const updatedUser = await adminService.updateUserStatus(
      adminId,
      targetUserId,
      { isActive, reason },
      getClientMeta(req)
    );

    return sendSuccess(
      res,
      `User account ${updatedUser.isActive ? 'activated' : 'deactivated'} successfully`,
      updatedUser,
      200
    );
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, null, error.statusCode);
    }
    next(error);
  }
};

/**
 * GET /api/admin/ngos/pending
 */
const getPendingNgos = async (req, res, next) => {
  try {
    const result = await adminService.getPendingNgos(req.query);
    return sendSuccess(res, 'Pending NGO verification queue retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/ngos
 */
const getNgos = async (req, res, next) => {
  try {
    const result = await adminService.getNgos(req.query);
    return sendSuccess(res, 'NGO profiles retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/ngos/:id
 */
const getNgoById = async (req, res, next) => {
  try {
    const ngo = await adminService.getNgoById(req.params.id);
    return sendSuccess(res, 'NGO profile retrieved successfully', ngo, 200);
  } catch (error) {
    if (error.statusCode === 404) {
      return sendError(res, error.message, null, 404);
    }
    next(error);
  }
};

/**
 * PUT /api/admin/ngos/:id/verification
 */
const updateNgoVerification = async (req, res, next) => {
  try {
    const adminId = req.user.id || req.user._id;
    const ngoId = req.params.id;
    const { status, reason } = req.body;

    const updatedNgo = await adminService.verifyNgo(
      adminId,
      ngoId,
      { status, reason },
      getClientMeta(req)
    );

    return sendSuccess(
      res,
      `NGO verification updated to ${updatedNgo.verificationStatus}`,
      updatedNgo,
      200
    );
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, error.message, null, error.statusCode);
    }
    next(error);
  }
};

/**
 * GET /api/admin/donations
 */
const getDonations = async (req, res, next) => {
  try {
    const result = await adminService.getDonations(req.query);
    return sendSuccess(res, 'Donation listings retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/donations/:id
 */
const getDonationById = async (req, res, next) => {
  try {
    const donation = await adminService.getDonationById(req.params.id);
    return sendSuccess(res, 'Donation operational details retrieved successfully', donation, 200);
  } catch (error) {
    if (error.statusCode === 404) {
      return sendError(res, error.message, null, 404);
    }
    next(error);
  }
};

/**
 * GET /api/admin/claims
 */
const getClaims = async (req, res, next) => {
  try {
    const result = await adminService.getClaims(req.query);
    return sendSuccess(res, 'Claim records retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/claims/:id
 */
const getClaimById = async (req, res, next) => {
  try {
    const claim = await adminService.getClaimById(req.params.id);
    return sendSuccess(res, 'Claim operational details retrieved successfully', claim, 200);
  } catch (error) {
    if (error.statusCode === 404) {
      return sendError(res, error.message, null, 404);
    }
    next(error);
  }
};

/**
 * GET /api/admin/deliveries
 */
const getDeliveries = async (req, res, next) => {
  try {
    const result = await adminService.getDeliveries(req.query);
    return sendSuccess(res, 'Delivery tasks retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/deliveries/:id
 */
const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await adminService.getDeliveryById(req.params.id);
    return sendSuccess(res, 'Delivery operational details retrieved successfully', delivery, 200);
  } catch (error) {
    if (error.statusCode === 404) {
      return sendError(res, error.message, null, 404);
    }
    next(error);
  }
};

/**
 * GET /api/admin/intelligence/map
 */
const getMapIntelligence = async (req, res, next) => {
  try {
    const mapData = await mapAnalyticsService.getOperationalMapData(req.query);
    return sendSuccess(res, 'Operational map intelligence retrieved successfully', mapData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/intelligence/kpis
 */
const getOperationalKpis = async (req, res, next) => {
  try {
    const kpisData = await adminService.getOperationalKPIs(req.query);
    return sendSuccess(res, 'Operational KPIs retrieved successfully', kpisData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/intelligence/impact
 */
const getImpactSummary = async (req, res, next) => {
  try {
    const impactData = await adminService.getImpactSummary();
    return sendSuccess(res, 'Platform impact summary retrieved successfully', impactData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/admin/audit-logs
 */
const getAuditLogs = async (req, res, next) => {
  try {
    const result = await auditLogService.getAuditLogs(req.query);
    return sendSuccess(res, 'Audit logs retrieved successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
  getUsers,
  getUserById,
  updateUserStatus,
  getPendingNgos,
  getNgos,
  getNgoById,
  updateNgoVerification,
  getDonations,
  getDonationById,
  getClaims,
  getClaimById,
  getDeliveries,
  getDeliveryById,
  getMapIntelligence,
  getOperationalKpis,
  getImpactSummary,
  getAuditLogs,
};
