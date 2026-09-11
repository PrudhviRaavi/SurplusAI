/**
 * FoodShareAI - Risk & Duplicate Detection Controller
 * Provides endpoints for duplicate inspection and administrative governance.
 */
const { Donation, RiskAssessment } = require('../models');
const duplicateDetectionService = require('../services/duplicateDetectionService');
const riskDetectionService = require('../services/riskDetectionService');

/**
 * GET /api/donations/:id/duplicates
 * Inspects potential duplicate listings for a donation.
 * Restricted to donation owner (DONOR) and ADMIN.
 */
const getDonationDuplicates = async (req, res, next) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id);
    if (!donation) {
      return res.status(404).json({
        success: false,
        error: { code: 'DONATION_NOT_FOUND', message: 'Donation listing not found' },
      });
    }

    // Role check: Only the owning donor or ADMIN may inspect duplicates
    const isOwner = req.user && donation.donorId && req.user._id.toString() === donation.donorId.toString();
    const isAdmin = req.user && req.user.role === 'ADMIN';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        success: false,
        error: { code: 'FORBIDDEN', message: 'Access to duplicate inspection is restricted to the donor or administrator' },
      });
    }

    const duplicatesResult = await duplicateDetectionService.findPotentialDuplicates(id);

    // If caller is donor, omit internal administrative scores
    if (!isAdmin) {
      const sanitizedDuplicates = duplicatesResult.potentialDuplicates.map((dup) => ({
        donationId: dup.donationId,
        title: dup.title,
        foodCategory: dup.foodCategory,
        createdAt: dup.createdAt,
      }));

      return res.status(200).json({
        success: true,
        donationId: duplicatesResult.donationId,
        potentialDuplicates: sanitizedDuplicates,
        status: duplicatesResult.status,
      });
    }

    return res.status(200).json({
      success: true,
      ...duplicatesResult,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/risk/assessments
 * Retrieves paginated risk assessments.
 * Exclusively restricted to ADMIN.
 */
const getAdminRiskAssessments = async (req, res, next) => {
  try {
    const { riskLevel, status, entityType, page = 1, limit = 20 } = req.query;

    const query = {};
    if (riskLevel) query.riskLevel = riskLevel;
    if (status) query.status = status;
    if (entityType) query.entityType = entityType;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [assessments, total] = await Promise.all([
      RiskAssessment.find(query)
        .populate('userId', 'name email role')
        .populate('reviewedBy', 'name email')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      RiskAssessment.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      data: assessments,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/admin/risk/assessments/:id/review
 * Records administrative review decision on an anomaly flag.
 * Exclusively restricted to ADMIN.
 */
const reviewRiskAssessment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;

    const validStatuses = ['PENDING', 'REVIEWED', 'DISMISSED', 'CONFIRMED'];
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_STATUS',
          message: `Status must be one of: ${validStatuses.join(', ')}`,
        },
      });
    }

    const assessment = await RiskAssessment.findById(id);
    if (!assessment) {
      return res.status(404).json({
        success: false,
        error: { code: 'ASSESSMENT_NOT_FOUND', message: 'Risk assessment record not found' },
      });
    }

    assessment.status = status;
    assessment.reviewedBy = req.user._id;
    assessment.reviewedAt = new Date();
    if (reviewNotes !== undefined) {
      assessment.reviewNotes = String(reviewNotes).trim();
    }

    await assessment.save();

    return res.status(200).json({
      success: true,
      message: 'Risk assessment successfully updated',
      data: assessment,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDonationDuplicates,
  getAdminRiskAssessments,
  reviewRiskAssessment,
};
