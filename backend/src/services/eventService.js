/**
 * FoodShareAI - Event-Driven Communication Service
 * Orchestrates domain lifecycle events across donors, NGOs, volunteers, and administrators.
 * Translates operational transactions into role-aware, privacy-preserving notifications.
 */
const { User } = require('../models');
const notificationService = require('./notificationService');

/**
 * Triggered when a donor publishes a new surplus food listing.
 */
const emitDonationPublished = async (donation) => {
  if (!donation || !donation.donorId) return null;

  return notificationService.createNotification({
    userId: donation.donorId,
    type: 'DONATION_PUBLISHED',
    title: 'Donation Published Successfully 🍲',
    message: `Your listing "${donation.title}" (${donation.quantity} ${donation.quantityUnit}) is now visible to nearby verified NGOs.`,
    relatedEntityType: 'DONATION',
    relatedEntityId: donation._id,
    priority: 'NORMAL',
    data: { donationId: donation._id },
  });
};

/**
 * Triggered when an NGO claims a published food donation.
 */
const emitDonationClaimed = async (donation, claim, ngoName = 'A verified NGO') => {
  if (!donation || !donation.donorId) return null;

  return notificationService.createNotification({
    userId: donation.donorId,
    type: 'DONATION_CLAIMED',
    title: 'Donation Claimed! 🎉',
    message: `${ngoName} has claimed your donation "${donation.title}". A volunteer delivery task will be coordinated shortly.`,
    relatedEntityType: 'CLAIM',
    relatedEntityId: claim ? claim._id : donation._id,
    priority: 'NORMAL',
    data: {
      donationId: donation._id,
      claimId: claim ? claim._id : null,
    },
  });
};

/**
 * Triggered when ML food analysis finishes processing an image.
 */
const emitAnalysisCompleted = async (donation, aiAnalysis) => {
  if (!donation || !donation.donorId) return null;

  const freshness = aiAnalysis?.freshness?.predictedClass || 'ASSESSED';
  const isSafe = aiAnalysis?.expiry?.isSafeToConsume !== false;

  return notificationService.createNotification({
    userId: donation.donorId,
    type: 'AI_ANALYSIS_COMPLETED',
    title: 'AI Food Analysis Completed 🔍',
    message: `Analysis completed for "${donation.title}". Freshness: ${freshness}. Safety Status: ${isSafe ? 'VERIFIED' : 'REVIEW_REQUIRED'}.`,
    relatedEntityType: 'AI_ANALYSIS',
    relatedEntityId: aiAnalysis ? aiAnalysis._id : null,
    priority: isSafe ? 'NORMAL' : 'HIGH',
    data: {
      donationId: donation._id,
      aiAnalysisId: aiAnalysis ? aiAnalysis._id : null,
    },
  });
};

/**
 * Triggered when automated ML analysis fails.
 */
const emitAnalysisFailed = async (donation, errorReason = 'Analysis inconclusive') => {
  if (!donation || !donation.donorId) return null;

  return notificationService.createNotification({
    userId: donation.donorId,
    type: 'AI_ANALYSIS_FAILED',
    title: 'Food Analysis Update ℹ️',
    message: `Automated vision analysis could not be finalized for "${donation.title}". (${errorReason}). Manual verification will proceed.`,
    relatedEntityType: 'DONATION',
    relatedEntityId: donation._id,
    priority: 'LOW',
    data: { donationId: donation._id },
  });
};

/**
 * Triggered when food safety monitoring detects an operational risk or expiry warning.
 */
const emitSafetyAlert = async (donation, safetyStatus, issueDescription) => {
  if (!donation || !donation.donorId) return null;

  return notificationService.createNotification({
    userId: donation.donorId,
    type: 'FOOD_SAFETY_WARNING',
    title: 'Food Safety Alert ⚠️',
    message: `Listing "${donation.title}" flagged: ${safetyStatus}. ${issueDescription || 'Please review consumption window.'}`,
    relatedEntityType: 'DONATION',
    relatedEntityId: donation._id,
    priority: 'HIGH',
    data: {
      donationId: donation._id,
      safetyStatus,
    },
  });
};

/**
 * Triggered when a volunteer is assigned to a delivery task.
 */
const emitDeliveryAssigned = async (delivery, volunteerId) => {
  if (!volunteerId) return null;

  return notificationService.createNotification({
    userId: volunteerId,
    type: 'DELIVERY_ASSIGNED',
    title: 'New Delivery Task Available 🛵',
    message: `You have been allocated a rescue delivery task (${delivery.distanceKm || 'Short'} km). Tap to review pickup details.`,
    relatedEntityType: 'DELIVERY',
    relatedEntityId: delivery._id,
    priority: 'NORMAL',
    data: { deliveryId: delivery._id },
  });
};

/**
 * Triggered when a volunteer accepts a delivery task.
 */
const emitDeliveryAccepted = async (delivery, donorId, ngoId, volunteerName = 'A volunteer') => {
  const promises = [];

  if (donorId) {
    promises.push(
      notificationService.createNotification({
        userId: donorId,
        type: 'DELIVERY_ACCEPTED',
        title: 'Volunteer En Route for Pickup 🛵',
        message: `${volunteerName} accepted the delivery task and is heading to collect "${delivery.title || 'your donation'}".`,
        relatedEntityType: 'DELIVERY',
        relatedEntityId: delivery._id,
        priority: 'NORMAL',
        data: { deliveryId: delivery._id },
      })
    );
  }

  if (ngoId) {
    promises.push(
      notificationService.createNotification({
        userId: ngoId,
        type: 'DELIVERY_ACCEPTED',
        title: 'Delivery Task Confirmed 🛵',
        message: `${volunteerName} has taken charge of your claimed food delivery.`,
        relatedEntityType: 'DELIVERY',
        relatedEntityId: delivery._id,
        priority: 'NORMAL',
        data: { deliveryId: delivery._id },
      })
    );
  }

  return Promise.all(promises);
};

/**
 * Triggered when food is collected by the volunteer from the donor.
 */
const emitFoodPickedUp = async (delivery, ngoId) => {
  if (!ngoId) return null;

  return notificationService.createNotification({
    userId: ngoId,
    type: 'FOOD_PICKED_UP',
    title: 'Food Picked Up & In Transit 📦',
    message: 'The volunteer has verified pickup from the donor. Real-time delivery tracking is active.',
    relatedEntityType: 'DELIVERY',
    relatedEntityId: delivery._id,
    priority: 'NORMAL',
    data: { deliveryId: delivery._id },
  });
};

/**
 * Triggered when the volunteer completes a delivery with proof of delivery.
 */
const emitDeliveryCompleted = async (delivery, donorId, ngoId, volunteerId) => {
  const promises = [];

  if (donorId) {
    promises.push(
      notificationService.createNotification({
        userId: donorId,
        type: 'DELIVERY_COMPLETED',
        title: 'Donation Successfully Delivered! ❤️',
        message: 'Your surplus food has been safely delivered to the community center. Thank you for your impact!',
        relatedEntityType: 'DELIVERY',
        relatedEntityId: delivery._id,
        priority: 'NORMAL',
        data: { deliveryId: delivery._id },
      })
    );
  }

  if (ngoId) {
    promises.push(
      notificationService.createNotification({
        userId: ngoId,
        type: 'DELIVERY_COMPLETED',
        title: 'Food Delivery Received ✅',
        message: 'The volunteer has delivered the food package and uploaded proof of handover.',
        relatedEntityType: 'DELIVERY',
        relatedEntityId: delivery._id,
        priority: 'NORMAL',
        data: { deliveryId: delivery._id },
      })
    );
  }

  if (volunteerId) {
    promises.push(
      notificationService.createNotification({
        userId: volunteerId,
        type: 'DELIVERY_COMPLETED',
        title: 'Delivery Mission Complete! 🏆',
        message: 'Delivery confirmed with proof. Impact points and rescued meals added to your profile!',
        relatedEntityType: 'DELIVERY',
        relatedEntityId: delivery._id,
        priority: 'NORMAL',
        data: { deliveryId: delivery._id },
      })
    );
  }

  return Promise.all(promises);
};

/**
 * Triggered when Isolation Forest or baseline monitor detects an anomaly.
 * Exclusively dispatched to administrators.
 */
const emitRiskAlert = async (riskAssessment) => {
  if (!riskAssessment) return null;

  // Guard against buffering when running in disconnected mode
  if (User.db && User.db.readyState !== 1) {
    return null;
  }

  // Find all administrator accounts
  const admins = await User.find({ role: 'ADMIN', isActive: true }).select('_id').lean();
  if (!admins || admins.length === 0) return null;

  const adminIds = admins.map((a) => a._id);
  const primaryReason = riskAssessment.reasons && riskAssessment.reasons[0] ? riskAssessment.reasons[0] : 'Anomaly detected';

  return notificationService.notifyUsers(adminIds, {
    type: 'RISK_REVIEW_REQUIRED',
    title: 'Governance Alert: Risk Review Required 🛡️',
    message: `[${riskAssessment.riskLevel} Risk] Anomaly flagged for ${riskAssessment.entityType}: ${primaryReason}.`,
    relatedEntityType: 'RISK_ASSESSMENT',
    relatedEntityId: riskAssessment._id,
    priority: riskAssessment.riskLevel === 'HIGH' ? 'HIGH' : 'NORMAL',
    data: {
      riskAssessmentId: riskAssessment._id,
      riskLevel: riskAssessment.riskLevel,
    },
  });
};

/**
 * Triggered when high demand is forecasted for a food category.
 */
const emitDemandAlert = async (ngoId, categoryName, surgePercentage = 30) => {
  if (!ngoId) return null;

  return notificationService.createNotification({
    userId: ngoId,
    type: 'DEMAND_ALERT',
    title: 'Surplus Demand Alert 📈',
    message: `High regional demand forecasted for ${categoryName} (+${surgePercentage}%). Prioritize relevant matches.`,
    relatedEntityType: 'DEMAND_FORECAST',
    priority: 'LOW',
    data: { category: categoryName },
  });
};

/**
 * Triggered when a high-compatibility donation recommendation is found for an NGO.
 */
const emitMatchRecommendation = async (ngoId, donation, matchScore) => {
  if (!ngoId || !donation) return null;

  return notificationService.createNotification({
    userId: ngoId,
    type: 'MATCH_RECOMMENDATION',
    title: 'High-Match Surplus Food Available 🎯',
    message: `"${donation.title}" matches your capacity & category profile (${matchScore}% match). Claim before expiry.`,
    relatedEntityType: 'DONATION',
    relatedEntityId: donation._id,
    priority: 'NORMAL',
    data: {
      donationId: donation._id,
      matchScore,
    },
  });
};

/**
 * Triggered when an administrator approves, rejects, or requests review for an NGO.
 */
const emitNgoVerificationDecision = async (ngoUserId, status, reason = '') => {
  if (!ngoUserId) return null;

  let notifType = 'NGO_REVIEW_REQUESTED';
  let title = 'NGO Verification Review Requested 📋';
  let message = `The administration has requested additional review for your organization profile.${reason ? ' Notes: ' + reason : ''}`;
  let priority = 'NORMAL';

  if (status === 'VERIFIED') {
    notifType = 'NGO_VERIFIED';
    title = 'NGO Verification Approved! 🎉';
    message = 'Your organization profile has been verified by the administration. You may now discover and claim surplus food donations.';
    priority = 'HIGH';
  } else if (status === 'REJECTED') {
    notifType = 'NGO_REJECTED';
    title = 'NGO Verification Update ⚠️';
    message = `Your organization verification request was rejected.${reason ? ' Reason: ' + reason : ''}`;
    priority = 'HIGH';
  }

  return notificationService.createNotification({
    userId: ngoUserId,
    type: notifType,
    title,
    message,
    relatedEntityType: 'NGO_PROFILE',
    priority,
    data: { status, reason },
  });
};

module.exports = {
  emitDonationPublished,
  emitDonationClaimed,
  emitAnalysisCompleted,
  emitAnalysisFailed,
  emitSafetyAlert,
  emitDeliveryAssigned,
  emitDeliveryAccepted,
  emitFoodPickedUp,
  emitDeliveryCompleted,
  emitRiskAlert,
  emitDemandAlert,
  emitMatchRecommendation,
  emitNgoVerificationDecision,
};
