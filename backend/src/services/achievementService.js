/**
 * FoodShareAI - Achievement & Badge Service
 * Evaluates deterministic achievement milestones and badges based on verified database activity.
 * Directly aligns with existing UI representations in BadgeCard and mockImpactService.
 */
const mongoose = require('mongoose');
const { Impact, Donation, Claim, Delivery } = require('../models');
const { DONATION_STATUS, CLAIM_STATUS, DELIVERY_STATUS } = require('../utils/constants');

/**
 * Pure evaluation function for Volunteer badges
 * @param {Object} stats
 */
const evaluateVolunteerBadges = (stats = {}) => {
  const completedDeliveries = stats.completedDeliveries || stats.completedDeliveriesCount || 0;
  const mealsDelivered = stats.mealsDelivered || 0;
  const completionRate = stats.completionRate !== undefined ? stats.completionRate : 100;

  return [
    {
      id: 'b11',
      title: 'First Delivery',
      description: 'Completed your first food rescue dispatch',
      icon: '🚲',
      isUnlocked: completedDeliveries >= 1,
      unlockRequirement: 'Complete 1 delivery',
      currentProgress: Math.min(completedDeliveries, 1),
      maxProgress: 1,
      progress: { current: Math.min(completedDeliveries, 1), target: 1 },
    },
    {
      id: 'b12',
      title: '10 Deliveries',
      description: 'Safely delivered 10 food rescue shipments',
      icon: '🛵',
      isUnlocked: completedDeliveries >= 10,
      unlockRequirement: 'Complete 10 deliveries',
      currentProgress: Math.min(completedDeliveries, 10),
      maxProgress: 10,
      progress: { current: Math.min(completedDeliveries, 10), target: 10 },
    },
    {
      id: 'b13',
      title: '50 Deliveries',
      description: 'Completed 50 community rescue dispatches',
      icon: '⚡',
      isUnlocked: completedDeliveries >= 50,
      unlockRequirement: 'Complete 50 deliveries',
      currentProgress: Math.min(completedDeliveries, 50),
      maxProgress: 50,
      progress: { current: Math.min(completedDeliveries, 50), target: 50 },
    },
    {
      id: 'b14',
      title: '100 Meals Delivered',
      description: 'Transported 100+ meals from donor to NGO',
      icon: '🏆',
      isUnlocked: mealsDelivered >= 100,
      unlockRequirement: 'Deliver 100 meals',
      currentProgress: Math.min(mealsDelivered, 100),
      maxProgress: 100,
      progress: { current: Math.min(mealsDelivered, 100), target: 100 },
    },
    {
      id: 'b15',
      title: 'Reliable Volunteer',
      description: 'Maintained 95%+ historical completion rate',
      icon: '⭐',
      isUnlocked: completedDeliveries >= 5 && completionRate >= 95,
      unlockRequirement: '5+ deliveries and 95%+ completion rate',
      currentProgress: Math.round(completionRate),
      maxProgress: 100,
      progress: { current: Math.round(completionRate), target: 100 },
    },
  ];
};

/**
 * Pure evaluation function for Donor badges
 * @param {Object} stats
 */
const evaluateDonorBadges = (stats = {}) => {
  const completedDonations = stats.donationsCompleted || stats.completedDonationsCount || 0;
  const mealsRescued = stats.mealsShared || stats.mealsRescued || 0;
  const foodSavedKg = stats.foodRescuedKg || stats.foodSavedKg || 0;
  const organizationsSupported = stats.organizationsSupported || stats.ngosSupportedCount || 0;

  return [
    {
      id: 'b1',
      title: 'First Donation',
      description: 'Rescued your first surplus meal listing',
      icon: '🌱',
      isUnlocked: completedDonations >= 1,
      unlockRequirement: 'Complete 1 donation',
      currentProgress: Math.min(completedDonations, 1),
      maxProgress: 1,
      progress: { current: Math.min(completedDonations, 1), target: 1 },
    },
    {
      id: 'b2',
      title: '10 Donations',
      description: 'Completed 10 surplus food contributions',
      icon: '📦',
      isUnlocked: completedDonations >= 10,
      unlockRequirement: 'Complete 10 donations',
      currentProgress: Math.min(completedDonations, 10),
      maxProgress: 10,
      progress: { current: Math.min(completedDonations, 10), target: 10 },
    },
    {
      id: 'b3',
      title: '100 Meals Rescued',
      description: 'Shared 100+ meals with local receivers',
      icon: '🍱',
      isUnlocked: mealsRescued >= 100,
      unlockRequirement: 'Rescue 100 meals',
      currentProgress: Math.min(mealsRescued, 100),
      maxProgress: 100,
      progress: { current: Math.min(mealsRescued, 100), target: 100 },
    },
    {
      id: 'b4',
      title: 'Community Supporter',
      description: 'Supported 5+ verified local organizations',
      icon: '🤝',
      isUnlocked: organizationsSupported >= 5,
      unlockRequirement: 'Support 5 organizations',
      currentProgress: Math.min(organizationsSupported, 5),
      maxProgress: 5,
      progress: { current: Math.min(organizationsSupported, 5), target: 5 },
    },
    {
      id: 'b5',
      title: 'High Impact Donor',
      description: 'Rescued 500+ kg of nutritious surplus food',
      icon: '🔥',
      isUnlocked: foodSavedKg >= 500,
      unlockRequirement: 'Rescue 500 kg food',
      currentProgress: Math.min(foodSavedKg, 500),
      maxProgress: 500,
      progress: { current: Math.min(foodSavedKg, 500), target: 500 },
    },
  ];
};

/**
 * Pure evaluation function for NGO badges
 * @param {Object} stats
 */
const evaluateNgoBadges = (stats = {}) => {
  const completedClaims = stats.claimsCompleted || stats.completedClaimsCount || 0;
  const mealsServed = stats.mealsReceived || stats.mealsServed || 0;
  const foodSavedKg = stats.foodRescuedKg || stats.foodSavedKg || 0;
  const donorsConnected = stats.donorsConnected || 0;

  return [
    {
      id: 'b6',
      title: 'First Redistribution',
      description: 'Received and distributed first surplus claim',
      icon: '🍲',
      isUnlocked: completedClaims >= 1,
      unlockRequirement: 'Complete 1 redistribution',
      currentProgress: Math.min(completedClaims, 1),
      maxProgress: 1,
      progress: { current: Math.min(completedClaims, 1), target: 1 },
    },
    {
      id: 'b7',
      title: '100 Meals Served',
      description: 'Redistributed 100+ meals to community members',
      icon: '❤️',
      isUnlocked: mealsServed >= 100,
      unlockRequirement: 'Serve 100 meals',
      currentProgress: Math.min(mealsServed, 100),
      maxProgress: 100,
      progress: { current: Math.min(mealsServed, 100), target: 100 },
    },
    {
      id: 'b8',
      title: '500 Meals Served',
      description: 'Redistributed 500+ meals to local families',
      icon: '🌟',
      isUnlocked: mealsServed >= 500,
      unlockRequirement: 'Serve 500 meals',
      currentProgress: Math.min(mealsServed, 500),
      maxProgress: 500,
      progress: { current: Math.min(mealsServed, 500), target: 500 },
    },
    {
      id: 'b9',
      title: 'Community Partner',
      description: 'Connected with 5+ verified donor partners',
      icon: '🏛️',
      isUnlocked: donorsConnected >= 5,
      unlockRequirement: 'Connect with 5 donors',
      currentProgress: Math.min(donorsConnected, 5),
      maxProgress: 5,
      progress: { current: Math.min(donorsConnected, 5), target: 5 },
    },
    {
      id: 'b10',
      title: 'High Impact Org',
      description: 'Diverted 500+ kg food waste from landfill',
      icon: '♻️',
      isUnlocked: foodSavedKg >= 500,
      unlockRequirement: 'Rescue 500 kg food',
      currentProgress: Math.min(foodSavedKg, 500),
      maxProgress: 500,
      progress: { current: Math.min(foodSavedKg, 500), target: 500 },
    },
  ];
};

/**
 * Evaluates volunteer achievement badges via DB query
 * @param {string} volunteerUserId
 */
const getVolunteerAchievements = async (volunteerUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return evaluateVolunteerBadges();
  }

  const [impact, completedDeliveriesCount, totalDeliveriesCount] = await Promise.all([
    Impact.findOne({ userId: volunteerUserId }).lean(),
    Delivery.countDocuments({ volunteerId: volunteerUserId, status: DELIVERY_STATUS.COMPLETED }),
    Delivery.countDocuments({ volunteerId: volunteerUserId }),
  ]);

  const mealsDelivered = impact?.mealsRescued || 0;
  const completionRate =
    totalDeliveriesCount > 0 ? (completedDeliveriesCount / totalDeliveriesCount) * 100 : 0;

  return evaluateVolunteerBadges({
    completedDeliveries: completedDeliveriesCount,
    mealsDelivered,
    completionRate,
  });
};

/**
 * Evaluates donor achievement badges via DB query
 * @param {string} donorUserId
 */
const getDonorAchievements = async (donorUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return evaluateDonorBadges();
  }

  const [impact, completedDonationsCount, distinctNgos] = await Promise.all([
    Impact.findOne({ userId: donorUserId }).lean(),
    Donation.countDocuments({ donorId: donorUserId, status: DONATION_STATUS.COMPLETED }),
    Delivery.distinct('ngoId', { donorId: donorUserId, status: DELIVERY_STATUS.COMPLETED }),
  ]);

  const mealsRescued = impact?.mealsRescued || 0;
  const foodSavedKg = impact?.foodSavedKg || 0;
  const ngosSupportedCount = distinctNgos.length;

  return evaluateDonorBadges({
    donationsCompleted: completedDonationsCount,
    mealsRescued,
    foodSavedKg,
    organizationsSupported: ngosSupportedCount,
  });
};

/**
 * Evaluates NGO achievement badges via DB query
 * @param {string} ngoUserId
 */
const getNgoAchievements = async (ngoUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return evaluateNgoBadges();
  }

  const [impact, completedClaimsCount, distinctDonors] = await Promise.all([
    Impact.findOne({ userId: ngoUserId }).lean(),
    Claim.countDocuments({ ngoId: ngoUserId, status: CLAIM_STATUS.COMPLETED }),
    Delivery.distinct('donorId', { ngoId: ngoUserId, status: DELIVERY_STATUS.COMPLETED }),
  ]);

  const mealsServed = impact?.mealsRescued || 0;
  const foodSavedKg = impact?.foodSavedKg || 0;
  const donorsConnected = distinctDonors.length;

  return evaluateNgoBadges({
    claimsCompleted: completedClaimsCount,
    mealsServed,
    foodSavedKg,
    donorsConnected,
  });
};

module.exports = {
  evaluateVolunteerBadges,
  evaluateDonorBadges,
  evaluateNgoBadges,
  getVolunteerAchievements,
  getDonorAchievements,
  getNgoAchievements,
};
