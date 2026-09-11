/**
 * FoodShareAI - Volunteer Service
 * Manages volunteer profile, onboarding status, and real database dashboard metrics.
 */
const { User, VolunteerProfile, Delivery, Impact } = require('../models');
const {
  VOLUNTEER_PREFERENCES,
  TRANSPORTATION_TYPES,
  AVAILABILITY_SLOTS,
  DELIVERY_STATUS,
} = require('../utils/constants');
const deliveryService = require('./deliveryService');

/**
 * 1. Get authenticated volunteer profile and identity
 * @param {string} userId
 */
const getVolunteerProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  let profile = await VolunteerProfile.findOne({ userId });
  if (!profile) {
    // Auto-create initial default profile
    profile = await VolunteerProfile.create({
      userId,
      fullName: user.fullName,
      phone: user.phone || '',
      email: user.email,
      transportation: 'TWO_WHEELER',
      preferredTravelRadius: 10,
      location: { type: 'Point', coordinates: [78.4867, 17.385] }, // Default Hyderabad coordinates
      isAvailable: true,
    });
  }

  return {
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
    profile,
  };
};

/**
 * 2. Update authenticated volunteer profile
 * @param {string} userId
 * @param {object} updateData
 */
const updateVolunteerProfile = async (userId, updateData = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Strictly disallow updating role, password, or security privileges
  if (updateData.role || updateData.password || updateData.passwordHash || updateData.ownership) {
    const err = new Error('Modifying account role, password, or security privileges is forbidden');
    err.statusCode = 403;
    throw err;
  }

  // Update basic user identity fields if provided
  if (updateData.fullName && typeof updateData.fullName === 'string' && updateData.fullName.trim()) {
    user.fullName = updateData.fullName.trim();
  }
  if (updateData.phone && typeof updateData.phone === 'string') {
    user.phone = updateData.phone.trim();
  }

  let profile = await VolunteerProfile.findOne({ userId });
  if (!profile) {
    profile = new VolunteerProfile({ userId });
  }

  if (updateData.fullName) {
    profile.fullName = updateData.fullName.trim();
  }
  if (updateData.phone) {
    profile.phone = updateData.phone.trim();
  }
  if (updateData.email) {
    profile.email = updateData.email.trim().toLowerCase();
  }

  // Transportation mode
  if (updateData.transportation) {
    const norm = String(updateData.transportation).toUpperCase();
    if (TRANSPORTATION_TYPES.includes(norm)) {
      profile.transportation = norm;
    }
  }

  // Travel radius
  if (updateData.travelRadius !== undefined || updateData.preferredTravelRadius !== undefined) {
    const rad = Number(
      updateData.travelRadius !== undefined ? updateData.travelRadius : updateData.preferredTravelRadius
    );
    if (!isNaN(rad) && rad >= 0) {
      profile.preferredTravelRadius = rad;
    }
  }

  // Volunteer preferences
  if (Array.isArray(updateData.volunteerPreferences)) {
    profile.volunteerPreferences = updateData.volunteerPreferences.filter((p) =>
      VOLUNTEER_PREFERENCES.includes(p)
    );
  }

  // Availability slots
  if (Array.isArray(updateData.availability)) {
    profile.availability = updateData.availability.filter((slot) =>
      AVAILABILITY_SLOTS.includes(slot)
    );
  }

  // isAvailable toggle
  if (updateData.isAvailable !== undefined) {
    profile.isAvailable = Boolean(updateData.isAvailable);
  }

  // Location: GeoJSON Point or latitude/longitude
  if (updateData.location && Array.isArray(updateData.location.coordinates)) {
    const [lng, lat] = updateData.location.coordinates.map(Number);
    if (!isNaN(lng) && !isNaN(lat) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      profile.location = { type: 'Point', coordinates: [lng, lat] };
    }
  } else if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
    const lat = Number(updateData.latitude);
    const lng = Number(updateData.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      profile.location = { type: 'Point', coordinates: [lng, lat] };
    }
  }

  // Onboarding completion evaluation
  const hasName = Boolean(profile.fullName || user.fullName);
  const hasPhone = Boolean(profile.phone || user.phone);
  const hasLocation = Boolean(
    profile.location &&
      Array.isArray(profile.location.coordinates) &&
      profile.location.coordinates.length === 2
  );

  if (hasName && hasPhone && hasLocation) {
    user.profileCompleted = true;
  }

  await user.save();
  await profile.save();

  return {
    user: {
      id: user._id.toString(),
      fullName: user.fullName,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      profileCompleted: user.profileCompleted,
    },
    profile,
  };
};

/**
 * 3. Retrieve real database-backed volunteer dashboard data
 * @param {string} volunteerUserId
 */
const getVolunteerDashboardData = async (volunteerUserId) => {
  const volProfile = await VolunteerProfile.findOne({ userId: volunteerUserId });

  // 1. Available task count (unassigned deliveries open for pickup)
  const availableTaskCount = await Delivery.countDocuments({
    volunteerId: null,
    status: { $in: [DELIVERY_STATUS.AVAILABLE, DELIVERY_STATUS.PENDING, DELIVERY_STATUS.ASSIGNED] },
  });

  // 2. Active delivery count for this volunteer
  const activeDeliveryCount = await Delivery.countDocuments({
    volunteerId: volunteerUserId,
    status: {
      $in: [
        DELIVERY_STATUS.ACCEPTED,
        DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
        DELIVERY_STATUS.PICKED_UP,
        DELIVERY_STATUS.IN_TRANSIT,
        DELIVERY_STATUS.ARRIVED,
        DELIVERY_STATUS.DELIVERED,
      ],
    },
  });

  // 3. Completed delivery count for this volunteer
  const completedDeliveryCount = await Delivery.countDocuments({
    volunteerId: volunteerUserId,
    status: DELIVERY_STATUS.COMPLETED,
  });

  // 4. Total deliveries associated with this volunteer
  const totalDeliveries = await Delivery.countDocuments({
    volunteerId: volunteerUserId,
  });

  // 5. Impact metrics
  const impactData = await deliveryService.getVolunteerImpact(volunteerUserId);

  // 6. Current active delivery (if any)
  const activeDeliveriesList = await deliveryService.getMyDeliveries(volunteerUserId, { limit: 1 });
  const currentActiveDelivery = activeDeliveriesList.deliveries?.[0] || null;

  // 7. Recent nearby available tasks
  const availableTasksList = await deliveryService.getAvailableDeliveryTasks(
    { limit: 3 },
    volunteerUserId
  );

  return {
    availableTaskCount,
    activeDeliveryCount,
    completedDeliveryCount,
    totalDeliveries,
    isOnline: volProfile?.isAvailable ?? true,
    impact: {
      impactPoints: impactData.points,
      completedDeliveries: completedDeliveryCount,
      foodDeliveredKg: impactData.foodDelivered,
      mealsRescued: impactData.mealsRescued,
      co2AvoidedKg: impactData.co2SavedKg,
    },
    currentActiveDelivery,
    recentAvailableTasks: availableTasksList.tasks || [],
  };
};

module.exports = {
  getVolunteerProfile,
  updateVolunteerProfile,
  getVolunteerDashboardData,
};
