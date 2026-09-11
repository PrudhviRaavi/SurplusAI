/**
 * FoodShareAI - Centralized Impact Service
 * Provides deterministic, reliable impact calculations from actual completed platform transactions.
 * Strictly adheres to rule: only successful/completed transactions contribute to impact.
 * No fabricated metrics, no double counting, zero-safe percentage mathematics.
 */
const mongoose = require('mongoose');
const {
  Impact,
  Donation,
  Claim,
  Delivery,
  VolunteerProfile,
  NgoProfile,
  DonorProfile,
} = require('../models');
const {
  DONATION_STATUS,
  CLAIM_STATUS,
  DELIVERY_STATUS,
  ROLES,
} = require('../utils/constants');

/**
 * Standard CO2 avoidance multiplier: 2.5 kg CO2 avoided per 1 kg surplus food rescued
 */
const CO2_FACTOR = 2.5;

/**
 * Calculates CO2 saved in kg rounded to 1 decimal place
 */
const calculateCo2 = (foodKg) => Math.round((Number(foodKg) || 0) * CO2_FACTOR * 10) / 10;

/**
 * Idempotently records verified impact metrics across Volunteer, Donor, and NGO
 * upon successful completion of a delivery task.
 * @param {string|object} deliveryOrId
 */
const recordDeliveryImpact = async (deliveryOrId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return null;
  }

  let delivery =
    typeof deliveryOrId === 'object' && deliveryOrId._id
      ? deliveryOrId
      : await Delivery.findById(deliveryOrId).populate('donationId');

  if (!delivery) return null;

  // Strict idempotency: Never record impact twice for the same delivery
  if (delivery.impactRecorded) {
    return { alreadyRecorded: true, deliveryId: delivery._id };
  }

  const donation = delivery.donationId;
  const quantity = Number(donation?.quantity) || 0;
  const mealsRescued = Number(donation?.estimatedMeals) || quantity || 1;
  const co2SavedKg = calculateCo2(quantity);

  const operations = [];

  // 1. Volunteer Impact
  if (delivery.volunteerId) {
    operations.push(
      Impact.findOneAndUpdate(
        { userId: delivery.volunteerId },
        {
          $setOnInsert: { role: ROLES.VOLUNTEER },
          $inc: {
            deliveriesCompleted: 1,
            foodSavedKg: quantity,
            mealsRescued,
            co2SavedKg,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
  }

  // 2. Donor Impact
  if (delivery.donorId) {
    operations.push(
      Impact.findOneAndUpdate(
        { userId: delivery.donorId },
        {
          $setOnInsert: { role: ROLES.DONOR },
          $inc: {
            donationsCompleted: 1,
            foodSavedKg: quantity,
            mealsRescued,
            co2SavedKg,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
  }

  // 3. NGO Impact
  if (delivery.ngoId) {
    operations.push(
      Impact.findOneAndUpdate(
        { userId: delivery.ngoId },
        {
          $setOnInsert: { role: ROLES.NGO },
          $inc: {
            mealsRescued,
            foodSavedKg: quantity,
            co2SavedKg,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      )
    );
  }

  await Promise.all(operations);

  delivery.impactRecorded = true;
  await delivery.save();

  return {
    success: true,
    deliveryId: delivery._id,
    quantityRescued: quantity,
    mealsRescued,
    co2SavedKg,
  };
};

/**
 * Retrieves donor real impact analytics strictly from completed transactions
 * @param {string} donorUserId
 */
const getDonorImpact = async (donorUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      totalDonations: 0,
      completedDonations: 0,
      activeDonations: 0,
      totalQuantityDonated: 0,
      quantitySuccessfullyRedistributed: 0,
      successfulRedistributionRate: 0,
      mealsRescued: 0,
      co2SavedKg: 0,
      beneficiariesReached: 0,
      impactPoints: 0,
      recentCompletedDonations: [],
      contributionSummary: [],
      impactTrend: [],
    };
  }

  const donations = await Donation.find({ donorId: donorUserId }).sort({ createdAt: -1 }).lean();

  const totalDonations = donations.length;
  const completedList = donations.filter((d) => d.status === DONATION_STATUS.COMPLETED);
  const completedDonations = completedList.length;

  const activeList = donations.filter((d) =>
    [
      DONATION_STATUS.PUBLISHED,
      DONATION_STATUS.MATCHED,
      DONATION_STATUS.CLAIMED,
      DONATION_STATUS.PICKUP_PENDING,
      DONATION_STATUS.IN_TRANSIT,
    ].includes(d.status)
  );
  const activeDonations = activeList.length;

  const totalQuantityDonated = Math.round(donations.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0) * 10) / 10;
  const quantitySuccessfullyRedistributed = Math.round(completedList.reduce((sum, d) => sum + (Number(d.quantity) || 0), 0) * 10) / 10;

  const successfulRedistributionRate =
    totalQuantityDonated > 0
      ? Math.round((quantitySuccessfullyRedistributed / totalQuantityDonated) * 1000) / 10
      : 0;

  const mealsRescued = completedList.reduce((sum, d) => sum + (Number(d.estimatedMeals) || Number(d.quantity) || 1), 0);
  const co2SavedKg = calculateCo2(quantitySuccessfullyRedistributed);
  const beneficiariesReached = mealsRescued;

  // Impact points: 75 points per verified completed donation
  const impactPoints = completedDonations * 75;

  // Sync with persistent Impact document
  await Impact.findOneAndUpdate(
    { userId: donorUserId },
    {
      role: ROLES.DONOR,
      mealsRescued,
      foodSavedKg: quantitySuccessfullyRedistributed,
      donationsCompleted: completedDonations,
      impactPoints,
      co2SavedKg,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Recent completed donations
  const recentCompletedDonations = completedList.slice(0, 5).map((d) => ({
    id: d._id.toString(),
    title: d.title,
    foodCategory: d.foodCategory,
    quantity: d.quantity,
    quantityUnit: d.quantityUnit,
    estimatedMeals: d.estimatedMeals,
    completedAt: d.completedAt || d.updatedAt,
  }));

  // Category-wise contribution summary with zero-safe percentages
  const categoryMap = {};
  for (const d of completedList) {
    const cat = d.foodCategory || 'OTHER';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, quantity: 0, meals: 0, count: 0 };
    }
    categoryMap[cat].quantity += Number(d.quantity) || 0;
    categoryMap[cat].meals += Number(d.estimatedMeals) || 1;
    categoryMap[cat].count += 1;
  }

  const contributionSummary = Object.values(categoryMap).map((item) => ({
    category: item.category,
    quantity: Math.round(item.quantity * 10) / 10,
    meals: item.meals,
    count: item.count,
    percentage:
      quantitySuccessfullyRedistributed > 0
        ? Math.round((item.quantity / quantitySuccessfullyRedistributed) * 1000) / 10
        : 0,
  }));

  // Time-based impact trend (monthly aggregations from completed transactions)
  const monthlyMap = {};
  for (const d of completedList) {
    const date = new Date(d.completedAt || d.updatedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { period: monthKey, quantityKg: 0, meals: 0, donations: 0 };
    }
    monthlyMap[monthKey].quantityKg += Number(d.quantity) || 0;
    monthlyMap[monthKey].meals += Number(d.estimatedMeals) || 1;
    monthlyMap[monthKey].donations += 1;
  }

  const impactTrend = Object.values(monthlyMap)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((m) => ({
      ...m,
      quantityKg: Math.round(m.quantityKg * 10) / 10,
    }));

  return {
    totalDonations,
    completedDonations,
    activeDonations,
    totalQuantityDonated,
    quantitySuccessfullyRedistributed,
    successfulRedistributionRate,
    mealsRescued,
    co2SavedKg,
    beneficiariesReached,
    impactPoints,
    recentCompletedDonations,
    contributionSummary,
    impactTrend,
  };
};

/**
 * Retrieves NGO real impact analytics from verified completed claims & received deliveries
 * @param {string} ngoUserId
 */
const getNgoImpact = async (ngoUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      claimedDonations: 0,
      completedClaims: 0,
      quantityReceived: 0,
      foodRedistributed: 0,
      beneficiariesServed: 0,
      completedDeliveriesReceived: 0,
      co2AvoidedKg: 0,
      impactPoints: 0,
      categoryWiseReceived: [],
      recentActivity: [],
      impactTrend: [],
    };
  }

  const [claims, deliveries] = await Promise.all([
    Claim.find({ ngoId: ngoUserId }).populate('donationId').sort({ createdAt: -1 }).lean(),
    Delivery.find({ ngoId: ngoUserId }).populate('donationId').sort({ createdAt: -1 }).lean(),
  ]);

  const claimedDonations = claims.length;
  const completedClaimsList = claims.filter((c) => c.status === CLAIM_STATUS.COMPLETED);
  const completedClaims = completedClaimsList.length;

  const completedDeliveriesList = deliveries.filter((d) => d.status === DELIVERY_STATUS.COMPLETED);
  const completedDeliveriesReceived = completedDeliveriesList.length;

  // Use completed claims/deliveries to calculate received quantities
  let quantityReceived = 0;
  let mealsServed = 0;
  const categoryMap = {};

  for (const c of completedClaimsList) {
    const donation = c.donationId;
    const qty = Number(c.requestedQuantity) || Number(donation?.quantity) || 0;
    const meals = Number(donation?.estimatedMeals) || qty || 1;

    quantityReceived += qty;
    mealsServed += meals;

    const cat = donation?.foodCategory || 'OTHER';
    if (!categoryMap[cat]) {
      categoryMap[cat] = { category: cat, quantity: 0, meals: 0, count: 0 };
    }
    categoryMap[cat].quantity += qty;
    categoryMap[cat].meals += meals;
    categoryMap[cat].count += 1;
  }

  quantityReceived = Math.round(quantityReceived * 10) / 10;
  const co2AvoidedKg = calculateCo2(quantityReceived);
  const beneficiariesServed = mealsServed;
  const impactPoints = completedClaims * 50;

  // Sync persistent Impact record
  await Impact.findOneAndUpdate(
    { userId: ngoUserId },
    {
      role: ROLES.NGO,
      mealsRescued: mealsServed,
      foodSavedKg: quantityReceived,
      donationsCompleted: completedClaims,
      impactPoints,
      co2SavedKg: co2AvoidedKg,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Category wise breakdown
  const categoryWiseReceived = Object.values(categoryMap).map((item) => ({
    category: item.category,
    quantity: Math.round(item.quantity * 10) / 10,
    meals: item.meals,
    count: item.count,
    percentage:
      quantityReceived > 0
        ? Math.round((item.quantity / quantityReceived) * 1000) / 10
        : 0,
  }));

  // Recent activity list
  const recentActivity = completedClaimsList.slice(0, 5).map((c) => ({
    id: c._id.toString(),
    donationTitle: c.donationId?.title || 'Food Donation',
    foodCategory: c.donationId?.foodCategory || 'OTHER',
    quantity: c.requestedQuantity || c.donationId?.quantity || 0,
    receivedAt: c.confirmedAt || c.updatedAt,
  }));

  // Monthly trend
  const monthlyMap = {};
  for (const c of completedClaimsList) {
    const date = new Date(c.confirmedAt || c.updatedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { period: monthKey, quantityKg: 0, meals: 0, count: 0 };
    }
    monthlyMap[monthKey].quantityKg += Number(c.requestedQuantity) || Number(c.donationId?.quantity) || 0;
    monthlyMap[monthKey].meals += Number(c.donationId?.estimatedMeals) || 1;
    monthlyMap[monthKey].count += 1;
  }

  const impactTrend = Object.values(monthlyMap)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((m) => ({
      ...m,
      quantityKg: Math.round(m.quantityKg * 10) / 10,
    }));

  return {
    claimedDonations,
    completedClaims,
    quantityReceived,
    foodRedistributed: mealsServed,
    beneficiariesServed,
    completedDeliveriesReceived,
    co2AvoidedKg,
    impactPoints,
    categoryWiseReceived,
    recentActivity,
    impactTrend,
  };
};

/**
 * Retrieves volunteer real impact analytics strictly from completed delivery dispatches
 * @param {string} volunteerUserId
 */
const getVolunteerImpact = async (volunteerUserId) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      completedDeliveries: 0,
      totalDeliveries: 0,
      successfulDeliveries: 0,
      successRate: 0,
      totalDistanceTravelledKm: 0,
      foodTransportedKg: 0,
      mealsRescued: 0,
      beneficiariesReached: 0,
      impactPoints: 0,
      co2SavedKg: 0,
      hoursLogged: 0,
      currentRank: null,
      recentCompletedTasks: [],
      impactTrend: [],
    };
  }

  const deliveries = await Delivery.find({ volunteerId: volunteerUserId })
    .populate('donationId')
    .sort({ createdAt: -1 })
    .lean();

  const totalDeliveries = deliveries.length;
  const completedList = deliveries.filter((d) => d.status === DELIVERY_STATUS.COMPLETED);
  const completedDeliveries = completedList.length;

  const successRate =
    totalDeliveries > 0
      ? Math.round((completedDeliveries / totalDeliveries) * 1000) / 10
      : 0;

  let totalMeters = 0;
  let totalQuantity = 0;
  let mealsRescued = 0;
  let estimatedMinutes = 0;

  for (const d of completedList) {
    totalMeters += Number(d.routeDistance) || 0;
    const qty = Number(d.donationId?.quantity) || 0;
    totalQuantity += qty;
    mealsRescued += Number(d.donationId?.estimatedMeals) || qty || 1;
    estimatedMinutes += Number(d.estimatedDuration) || 20;
  }

  const totalDistanceTravelledKm = Math.round((totalMeters / 1000) * 10) / 10;
  const foodTransportedKg = Math.round(totalQuantity * 10) / 10;
  const co2SavedKg = calculateCo2(foodTransportedKg);
  const beneficiariesReached = mealsRescued;
  const hoursLogged = Math.round((estimatedMinutes / 60) * 10) / 10;

  // Points: 75 per completed delivery
  const impactPoints = completedDeliveries * 75;

  // Sync persistent Impact document
  await Impact.findOneAndUpdate(
    { userId: volunteerUserId },
    {
      role: ROLES.VOLUNTEER,
      mealsRescued,
      foodSavedKg: foodTransportedKg,
      deliveriesCompleted: completedDeliveries,
      impactPoints,
      co2SavedKg,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  // Sync VolunteerProfile
  await VolunteerProfile.findOneAndUpdate(
    { userId: volunteerUserId },
    {
      completedDeliveries,
      impactPoints,
    }
  );

  // Calculate current rank among volunteers
  const higherCount = await Impact.countDocuments({
    role: ROLES.VOLUNTEER,
    impactPoints: { $gt: impactPoints },
  });
  const currentRank = higherCount + 1;

  // Recent completed delivery tasks
  const recentCompletedTasks = completedList.slice(0, 5).map((d) => ({
    id: d._id.toString(),
    donationTitle: d.donationId?.title || 'Food Delivery',
    foodCategory: d.donationId?.foodCategory || 'OTHER',
    quantity: d.donationId?.quantity || 0,
    distanceKm: Math.round(((d.routeDistance || 0) / 1000) * 10) / 10,
    completedAt: d.completedAt || d.updatedAt,
  }));

  // Monthly trend
  const monthlyMap = {};
  for (const d of completedList) {
    const date = new Date(d.completedAt || d.updatedAt);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    if (!monthlyMap[monthKey]) {
      monthlyMap[monthKey] = { period: monthKey, deliveries: 0, foodKg: 0, distanceKm: 0 };
    }
    monthlyMap[monthKey].deliveries += 1;
    monthlyMap[monthKey].foodKg += Number(d.donationId?.quantity) || 0;
    monthlyMap[monthKey].distanceKm += (d.routeDistance || 0) / 1000;
  }

  const impactTrend = Object.values(monthlyMap)
    .sort((a, b) => a.period.localeCompare(b.period))
    .map((m) => ({
      ...m,
      foodKg: Math.round(m.foodKg * 10) / 10,
      distanceKm: Math.round(m.distanceKm * 10) / 10,
    }));

  return {
    completedDeliveries,
    totalDeliveries,
    successfulDeliveries: completedDeliveries,
    successRate,
    totalDistanceTravelledKm,
    foodTransportedKg,
    mealsRescued,
    beneficiariesReached,
    impactPoints,
    co2SavedKg,
    hoursLogged,
    currentRank,
    recentCompletedTasks,
    impactTrend,
  };
};

module.exports = {
  CO2_FACTOR,
  calculateCo2,
  recordDeliveryImpact,
  getDonorImpact,
  getNgoImpact,
  getVolunteerImpact,
};
