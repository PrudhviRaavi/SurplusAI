/**
 * FoodShareAI - Food Safety Monitoring Service
 * Evaluates food safety deterministically using expiry timestamps, pickup deadlines,
 * preparation elapsed time, and custom ML predictions (EfficientNet freshness, XGBoost safety).
 * No arbitrary user overrides or fabricated risk metrics.
 */
const { Donation, AIAnalysis } = require('../models');
const { DONATION_STATUS, FRESHNESS_STATUS } = require('../utils/constants');

// Configurable safety evaluation thresholds
const SAFETY_CONFIG = {
  WARNING_EXPIRY_THRESHOLD_HOURS: 2.0, // Alert when expiry is within 2 hours
  STALE_UNCOLLECTED_GRACE_MINUTES: 15, // Grace period after pickupEndTime before flagging
  MAX_ROOM_TEMP_COOKED_HOURS: 4.0,     // Standard food safety rule for prepared cooked meals
};

/**
 * Evaluates expiry risk based on target expiry timestamp against reference time.
 */
const evaluateExpiryRisk = (expiryTime, now = new Date()) => {
  if (!expiryTime) {
    return { isExpired: false, hoursRemaining: null, status: 'UNKNOWN' };
  }

  const expiryMs = new Date(expiryTime).getTime();
  const nowMs = new Date(now).getTime();
  const diffHours = (expiryMs - nowMs) / (1000 * 60 * 60);

  if (diffHours <= 0) {
    return {
      isExpired: true,
      hoursRemaining: 0,
      status: 'EXPIRED',
      reason: 'Food safe consumption window has passed',
    };
  }

  if (diffHours <= SAFETY_CONFIG.WARNING_EXPIRY_THRESHOLD_HOURS) {
    return {
      isExpired: false,
      hoursRemaining: Math.max(0, Math.round(diffHours * 10) / 10),
      status: 'WARNING',
      reason: `Safe consumption window approaching (< ${SAFETY_CONFIG.WARNING_EXPIRY_THRESHOLD_HOURS}h remaining)`,
    };
  }

  return {
    isExpired: false,
    hoursRemaining: Math.round(diffHours * 10) / 10,
    status: 'SAFE',
    reason: 'Well within safe consumption window',
  };
};

/**
 * Evaluates operational pickup risk if pickup window expired while food is still uncollected.
 */
const evaluatePickupRisk = (pickupEndTime, donationStatus, now = new Date()) => {
  if (!pickupEndTime) {
    return { isOverdue: false, status: 'NORMAL' };
  }

  const endMs = new Date(pickupEndTime).getTime();
  const nowMs = new Date(now).getTime();
  const graceMs = SAFETY_CONFIG.STALE_UNCOLLECTED_GRACE_MINUTES * 60 * 1000;

  // Only active uncompleted donations can have pickup window risk
  const uncollectedStatuses = [
    DONATION_STATUS.PUBLISHED,
    DONATION_STATUS.CLAIMED,
  ];

  if (nowMs > endMs + graceMs && uncollectedStatuses.includes(donationStatus)) {
    const overdueMinutes = Math.round((nowMs - endMs) / (1000 * 60));
    return {
      isOverdue: true,
      overdueMinutes,
      status: 'PICKUP_RISK',
      reason: `Pickup window ended ${overdueMinutes} minutes ago and donation remains uncollected`,
    };
  }

  return {
    isOverdue: false,
    overdueMinutes: 0,
    status: 'NORMAL',
  };
};

/**
 * Comprehensive deterministic safety evaluation for a donation and its AI analysis.
 */
const evaluateDonationSafety = (donation, aiAnalysis = null, now = new Date()) => {
  const riskFlags = [];
  let overallStatus = 'SAFE';

  // 1. Check Expiry
  const expiryEval = evaluateExpiryRisk(donation.expiryTime, now);
  if (expiryEval.isExpired) {
    overallStatus = 'EXPIRED';
    riskFlags.push(expiryEval.reason);
  } else if (expiryEval.status === 'WARNING') {
    if (overallStatus === 'SAFE') overallStatus = 'WARNING';
    riskFlags.push(expiryEval.reason);
  }

  // 2. Check Pickup Window
  const pickupEval = evaluatePickupRisk(donation.pickupEndTime, donation.status, now);
  if (pickupEval.isOverdue) {
    if (overallStatus === 'SAFE' || overallStatus === 'WARNING') overallStatus = 'AT_RISK';
    riskFlags.push(pickupEval.reason);
  }

  // 3. Check AI Analysis (Freshness & XGBoost Safety Prediction)
  let freshnessData = { status: donation.freshnessStatus || 'UNKNOWN' };
  let expiryPrediction = null;

  if (aiAnalysis) {
    freshnessData = aiAnalysis.freshness || freshnessData;
    expiryPrediction = aiAnalysis.expiry || null;

    const freshnessCategory = freshnessData.predictedClass || freshnessData.status;

    if (freshnessCategory === FRESHNESS_STATUS.UNSAFE) {
      overallStatus = 'UNSAFE';
      riskFlags.push('Vision model (EfficientNet) identified signs of decomposition / unsafe freshness');
    } else if (freshnessCategory === FRESHNESS_STATUS.EXPIRING) {
      if (overallStatus === 'SAFE') overallStatus = 'WARNING';
      riskFlags.push('Vision model detected food near end of shelf-life');
    }

    if (expiryPrediction && expiryPrediction.isSafeToConsume === false) {
      overallStatus = 'UNSAFE';
      riskFlags.push('XGBoost safety model flagged high spoilage probability based on thermal/elapsed parameters');
    }
  } else if (!donation.aiAnalysisId && donation.status === DONATION_STATUS.DRAFT) {
    // Missing AI analysis during draft phase
    if (overallStatus === 'SAFE') overallStatus = 'PENDING_ANALYSIS';
  }

  // 4. Preparation Time Check for Cooked Food (4-hour rule)
  if (donation.foodCategory === 'COOKED_MEALS' && donation.preparationTime) {
    const prepMs = new Date(donation.preparationTime).getTime();
    const elapsedHours = (new Date(now).getTime() - prepMs) / (1000 * 60 * 60);
    if (elapsedHours > SAFETY_CONFIG.MAX_ROOM_TEMP_COOKED_HOURS && !donation.claimedAt) {
      if (overallStatus === 'SAFE' || overallStatus === 'WARNING') overallStatus = 'AT_RISK';
      riskFlags.push(`Cooked meal prepared ${Math.round(elapsedHours * 10) / 10} hours ago (exceeds ${SAFETY_CONFIG.MAX_ROOM_TEMP_COOKED_HOURS}h ambient safety threshold)`);
    }
  }

  return {
    donationId: donation._id,
    status: overallStatus,
    riskFlags,
    expiry: {
      expiryTime: donation.expiryTime,
      hoursRemaining: expiryEval.hoursRemaining,
      status: expiryEval.status,
    },
    freshness: freshnessData,
    pickup: pickupEval,
    checkedAt: new Date(now).toISOString(),
  };
};

/**
 * Scans active donations in MongoDB for admin food safety monitoring.
 * Returns operational safety alerts formatted for the Admin Intelligence Center.
 */
const scanActiveDonationsForSafety = async () => {
  const activeStatuses = [
    DONATION_STATUS.PUBLISHED,
    DONATION_STATUS.CLAIMED,
    DONATION_STATUS.ACCEPTED,
    DONATION_STATUS.PICKUP_STARTED,
    DONATION_STATUS.IN_TRANSIT,
  ];

  const donations = await Donation.find({ status: { $in: activeStatuses } })
    .populate('donorId', 'fullName name email phone')
    .populate('aiAnalysisId')
    .sort({ expiryTime: 1 })
    .limit(100)
    .lean();

  const alerts = [];
  const now = new Date();

  for (const donation of donations) {
    const evaluation = evaluateDonationSafety(donation, donation.aiAnalysisId, now);

    // If any risk or warning flag is present, include in admin alerts
    if (evaluation.status !== 'SAFE' && evaluation.status !== 'PENDING_ANALYSIS') {
      let severity = 'Info';
      if (evaluation.status === 'EXPIRED' || evaluation.status === 'UNSAFE') {
        severity = 'Critical';
      } else if (evaluation.status === 'AT_RISK' || evaluation.status === 'WARNING') {
        severity = 'Warning';
      }

      const donorName = donation.donorId ? (donation.donorId.fullName || donation.donorId.name || 'Anonymous Donor') : 'Unknown Donor';

      alerts.push({
        id: `safe-${donation._id}`,
        title: evaluation.riskFlags[0] || `Food Safety Alert: ${evaluation.status}`,
        donationId: donation._id,
        foodName: donation.title,
        donorName,
        severity,
        safetyStatus: evaluation.status,
        timeRemaining: evaluation.expiry.hoursRemaining !== null ? `${evaluation.expiry.hoursRemaining}h remaining` : 'Expired',
        issue: evaluation.riskFlags.join('; '),
        recommendedAction:
          evaluation.status === 'EXPIRED' || evaluation.status === 'UNSAFE'
            ? 'Cancel listing immediately and prevent distribution.'
            : 'Fast-track priority dispatch or mark for immediate review.',
        checkedAt: evaluation.checkedAt,
      });
    }
  }

  return {
    totalAlerts: alerts.length,
    alerts,
    scannedAt: now.toISOString(),
  };
};

module.exports = {
  SAFETY_CONFIG,
  evaluateExpiryRisk,
  evaluatePickupRisk,
  evaluateDonationSafety,
  scanActiveDonationsForSafety,
};
