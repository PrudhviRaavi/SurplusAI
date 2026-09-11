/**
 * FoodShareAI - Food Safety Monitoring Controller
 * Exposes deterministic food safety evaluations and administrative safety alert feeds.
 */
const { Donation } = require('../models');
const safetyMonitoringService = require('../services/safetyMonitoringService');

/**
 * GET /api/safety/donations/:id
 * Retrieves deterministic food safety status and risk indicators for a donation.
 * Accessible to authorized participants (donor, NGO, volunteer, admin).
 */
const getDonationSafety = async (req, res, next) => {
  try {
    const { id } = req.params;

    const donation = await Donation.findById(id).populate('aiAnalysisId');
    if (!donation) {
      return res.status(404).json({
        success: false,
        error: { code: 'DONATION_NOT_FOUND', message: 'Donation listing not found' },
      });
    }

    const evaluation = safetyMonitoringService.evaluateDonationSafety(
      donation,
      donation.aiAnalysisId,
      new Date()
    );

    // Sanitize response based on role: operational safety only
    return res.status(200).json({
      success: true,
      donationId: evaluation.donationId,
      status: evaluation.status,
      riskFlags: evaluation.riskFlags,
      expiry: evaluation.expiry,
      freshness: {
        status: evaluation.freshness.status || evaluation.freshness.predictedClass || 'UNKNOWN',
      },
      pickup: {
        status: evaluation.pickup.status,
        isOverdue: evaluation.pickup.isOverdue,
      },
      checkedAt: evaluation.checkedAt,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/admin/safety/alerts
 * Scans active donations and aggregates operational food safety warnings.
 * Exclusively restricted to ADMIN.
 */
const getAdminSafetyAlerts = async (req, res, next) => {
  try {
    const alertsData = await safetyMonitoringService.scanActiveDonationsForSafety();

    return res.status(200).json({
      success: true,
      data: alertsData,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getDonationSafety,
  getAdminSafetyAlerts,
};
