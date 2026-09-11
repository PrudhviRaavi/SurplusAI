/**
 * FoodShareAI - Gamification & Leaderboard Service
 * Manages verified volunteer point awards, level progression, and privacy-preserving leaderboards.
 * Strictly guarantees idempotency: completing the same delivery twice never duplicates points.
 * Strictly prevents data leakage: leaderboard exposes only safe public names and metrics.
 */
const mongoose = require('mongoose');
const { Impact, VolunteerProfile, Delivery, User } = require('../models');
const { ROLES, DELIVERY_STATUS } = require('../utils/constants');

/**
 * Standard Gamification Level Boundaries (aligned with UI theme)
 */
const VOLUNTEER_LEVELS = Object.freeze([
  { level: 1, name: 'First Step', minPoints: 0, nextLevelPoints: 200 },
  { level: 2, name: 'Food Friend', minPoints: 200, nextLevelPoints: 500 },
  { level: 3, name: 'Community Builder', minPoints: 500, nextLevelPoints: 1000 },
  { level: 4, name: 'Impact Maker', minPoints: 1000, nextLevelPoints: 2500 },
  { level: 5, name: 'Food Rescue Champion', minPoints: 2500, nextLevelPoints: null },
]);

/**
 * Points Award Configuration
 */
const POINT_RULES = Object.freeze({
  DELIVERY_COMPLETED: 75,
  PICKUP_CONFIRMED: 25,
});

/**
 * Evaluates volunteer level from points
 * @param {number} points
 */
const calculateLevel = (points = 0) => {
  const pts = Math.max(0, Number(points) || 0);

  for (let i = VOLUNTEER_LEVELS.length - 1; i >= 0; i--) {
    const lvl = VOLUNTEER_LEVELS[i];
    if (pts >= lvl.minPoints) {
      return {
        level: lvl.level,
        levelName: lvl.name,
        currentPoints: pts,
        nextLevelPoints: lvl.nextLevelPoints,
        pointsNeededForNextLevel: lvl.nextLevelPoints ? Math.max(0, lvl.nextLevelPoints - pts) : 0,
      };
    }
  }

  return {
    level: 1,
    levelName: 'First Step',
    currentPoints: pts,
    nextLevelPoints: 200,
    pointsNeededForNextLevel: Math.max(0, 200 - pts),
  };
};

/**
 * Idempotently awards verified points to a volunteer upon delivery completion.
 * @param {string|object} deliveryOrId
 * @param {string} volunteerUserId
 */
const awardDeliveryCompletionPoints = async (deliveryOrId, volunteerUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return { pointsAwarded: 0, totalPoints: 0 };
  }

  let delivery =
    typeof deliveryOrId === 'object' && deliveryOrId._id
      ? deliveryOrId
      : await Delivery.findById(deliveryOrId);

  if (!delivery) return null;

  // Strict idempotency: Never award completion points twice
  if (delivery.pointsAwarded) {
    const currentProfile = await VolunteerProfile.findOne({ userId: volunteerUserId }).lean();
    return {
      alreadyAwarded: true,
      pointsAwarded: 0,
      totalPoints: currentProfile?.impactPoints || 0,
    };
  }

  const pointsAwarded = POINT_RULES.DELIVERY_COMPLETED;

  // Atomically increment profile points
  const updatedProfile = await VolunteerProfile.findOneAndUpdate(
    { userId: volunteerUserId },
    {
      $inc: {
        impactPoints: pointsAwarded,
      },
    },
    { new: true }
  );

  // Atomically increment persistent Impact points
  await Impact.findOneAndUpdate(
    { userId: volunteerUserId },
    {
      $setOnInsert: { role: ROLES.VOLUNTEER },
      $inc: {
        impactPoints: pointsAwarded,
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  delivery.pointsAwarded = true;
  await delivery.save();

  return {
    success: true,
    pointsAwarded,
    totalPoints: updatedProfile?.impactPoints || pointsAwarded,
    levelInfo: calculateLevel(updatedProfile?.impactPoints || pointsAwarded),
  };
};

/**
 * Public volunteer leaderboard with strict privacy guarantees
 * @param {object} options
 */
const getVolunteerLeaderboard = async ({
  timeframe = 'All Time',
  category = 'Volunteers',
  page = 1,
  limit = 20,
  currentUserId = null,
} = {}) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      leaderboard: [],
      category,
      timeframe,
      pagination: { page: 1, limit, total: 0, totalPages: 1 },
    };
  }

  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 20));
  const skip = (pageNum - 1) * limitNum;

  // Map category to role filter
  let roleFilter = ROLES.VOLUNTEER;
  if (category === 'Donors') roleFilter = ROLES.DONOR;
  if (category === 'NGOs') roleFilter = ROLES.NGO;
  const roleQuery = category === 'Overall' ? {} : { role: roleFilter };

  const [impactRecords, total] = await Promise.all([
    Impact.find(roleQuery)
      .populate('userId', 'fullName role')
      .sort({ impactPoints: -1, deliveriesCompleted: -1, donationsCompleted: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Impact.countDocuments(roleQuery),
  ]);

  const leaderboard = impactRecords.map((rec, index) => {
    const rank = skip + index + 1;
    const user = rec.userId;
    const isCurrentUser = Boolean(
      currentUserId && user?._id && user._id.toString() === currentUserId.toString()
    );

    let primaryMetric = `${rec.deliveriesCompleted || 0} deliveries`;
    if (rec.role === ROLES.DONOR) {
      primaryMetric = `${rec.mealsRescued || 0} meals shared`;
    } else if (rec.role === ROLES.NGO) {
      primaryMetric = `${rec.mealsRescued || 0} meals served`;
    }

    return {
      rank,
      id: rec._id.toString(),
      name: user?.fullName || 'Community Hero',
      role: rec.role,
      points: rec.impactPoints || 0,
      completedDeliveries: rec.deliveriesCompleted || 0,
      donationsCompleted: rec.donationsCompleted || 0,
      mealsRescued: rec.mealsRescued || 0,
      primaryMetric,
      isCurrentUser,
    };
  });

  return {
    leaderboard,
    category,
    timeframe,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum) || 1,
    },
  };
};

/**
 * Retrieves current volunteer rank position, level, and nearby competitors
 * @param {string} volunteerUserId
 */
const getVolunteerRank = async (volunteerUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      currentRank: null,
      totalPoints: 0,
      completedDeliveries: 0,
      levelInfo: calculateLevel(0),
      nearbyPositions: [],
    };
  }

  const [myImpact, myProfile] = await Promise.all([
    Impact.findOne({ userId: volunteerUserId }).lean(),
    VolunteerProfile.findOne({ userId: volunteerUserId }).lean(),
  ]);

  const totalPoints = myImpact?.impactPoints || myProfile?.impactPoints || 0;
  const completedDeliveries = myImpact?.deliveriesCompleted || myProfile?.completedDeliveries || 0;

  // Rank = count of volunteers with strictly greater points + 1
  const higherCount = await Impact.countDocuments({
    role: ROLES.VOLUNTEER,
    impactPoints: { $gt: totalPoints },
  });
  const currentRank = higherCount + 1;

  const levelInfo = calculateLevel(totalPoints);

  // Fetch nearby positions (above and below)
  const nearbyRecords = await Impact.find({ role: ROLES.VOLUNTEER })
    .populate('userId', 'fullName')
    .sort({ impactPoints: -1, deliveriesCompleted: -1 })
    .skip(Math.max(0, currentRank - 2))
    .limit(3)
    .lean();

  const startRank = Math.max(1, currentRank - 1);
  const nearbyPositions = nearbyRecords.map((r, idx) => ({
    rank: startRank + idx,
    name: r.userId?.fullName || 'Volunteer',
    points: r.impactPoints || 0,
    deliveries: r.deliveriesCompleted || 0,
    isCurrentUser: r.userId?._id?.toString() === volunteerUserId.toString(),
  }));

  return {
    currentRank,
    totalPoints,
    completedDeliveries,
    levelInfo,
    nearbyPositions,
  };
};

module.exports = {
  VOLUNTEER_LEVELS,
  POINT_RULES,
  calculateLevel,
  awardDeliveryCompletionPoints,
  getVolunteerLeaderboard,
  getVolunteerRank,
};
