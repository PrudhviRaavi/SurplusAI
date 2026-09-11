/**
 * FoodShareAI - Donor Service
 * Manages donor profiles, onboarding status, and real impact analytics.
 */
const { User, DonorProfile, Donation, Impact } = require('../models');
const { DONOR_TYPES, FOOD_CATEGORIES, DONATION_FREQUENCIES } = require('../utils/constants');

/**
 * Get authenticated donor profile
 * @param {string} userId
 */
const getDonorProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  let profile = await DonorProfile.findOne({ userId });
  if (!profile) {
    // Auto-create default profile if not yet created
    profile = await DonorProfile.create({
      userId,
      donorType: 'OTHER',
      organizationName: user.fullName,
      location: { type: 'Point', coordinates: [78.3826, 17.4474] },
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
 * Update authenticated donor profile
 * @param {string} userId
 * @param {object} updateData
 */
const updateDonorProfile = async (userId, updateData = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Strictly disallow updating role or password through profile API
  if (updateData.role || updateData.password || updateData.passwordHash) {
    const err = new Error('Changing role or password is not permitted through this API');
    err.statusCode = 403;
    throw err;
  }

  // Update basic user information if provided
  if (updateData.fullName && typeof updateData.fullName === 'string' && updateData.fullName.trim()) {
    user.fullName = updateData.fullName.trim();
  }
  if (updateData.phone && typeof updateData.phone === 'string') {
    user.phone = updateData.phone.trim();
  }

  let profile = await DonorProfile.findOne({ userId });
  if (!profile) {
    profile = new DonorProfile({ userId });
  }

  // Update profile fields
  if (updateData.donorType) {
    const normalizedDonorType = updateData.donorType.toUpperCase();
    if (DONOR_TYPES.includes(normalizedDonorType)) {
      profile.donorType = normalizedDonorType;
    }
  }

  if (updateData.organizationName) {
    profile.organizationName = updateData.organizationName.trim();
  }

  if (updateData.contactPerson) {
    profile.contactPerson = updateData.contactPerson.trim();
  }

  if (updateData.address || updateData.organizationAddress) {
    const addr = updateData.address || updateData.organizationAddress;
    if (typeof addr === 'string') {
      profile.address.street = addr.trim();
    } else if (typeof addr === 'object') {
      profile.address = {
        ...profile.address.toObject(),
        ...addr,
      };
    }
  }

  if (Array.isArray(updateData.foodCategories) || Array.isArray(updateData.donationPreferences)) {
    const categories = updateData.foodCategories || updateData.donationPreferences;
    profile.foodCategories = categories.filter((c) => FOOD_CATEGORIES.includes(c));
  }

  if (updateData.typicalDonationQuantity !== undefined) {
    const qty = Number(updateData.typicalDonationQuantity);
    if (!isNaN(qty) && qty >= 0) {
      profile.typicalDonationQuantity = qty;
    }
  }

  if (updateData.donationFrequency && DONATION_FREQUENCIES.includes(updateData.donationFrequency.toUpperCase())) {
    profile.donationFrequency = updateData.donationFrequency.toUpperCase();
  }

  if (updateData.operatingHours) {
    if (typeof updateData.operatingHours === 'object') {
      profile.operatingHours = { ...profile.operatingHours.toObject(), ...updateData.operatingHours };
    }
  }

  // Handle location update (either GeoJSON Point or latitude/longitude)
  if (updateData.location && Array.isArray(updateData.location.coordinates)) {
    const [lng, lat] = updateData.location.coordinates;
    if (lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      profile.location = { type: 'Point', coordinates: [lng, lat] };
    }
  } else if (updateData.latitude !== undefined && updateData.longitude !== undefined) {
    const lat = Number(updateData.latitude);
    const lng = Number(updateData.longitude);
    if (!isNaN(lat) && !isNaN(lng) && lng >= -180 && lng <= 180 && lat >= -90 && lat <= 90) {
      profile.location = { type: 'Point', coordinates: [lng, lat] };
    }
  }

  // Check if required onboarding information is completed
  const hasOrg = Boolean(profile.organizationName);
  const hasLocation = Boolean(profile.location && profile.location.coordinates && profile.location.coordinates.length === 2);
  const hasContact = Boolean(profile.contactPerson || profile.address?.street);

  if (hasOrg && hasLocation && hasContact) {
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
 * Calculate donor impact from real database records
 * @param {string} userId
 */
const getDonorImpact = async (userId) => {
  // Aggregate real donation statistics from MongoDB
  const donations = await Donation.find({ donorId: userId });

  const totalDonations = donations.length;
  const completedDonations = donations.filter((d) => d.status === 'COMPLETED').length;
  const publishedDonations = donations.filter((d) => d.status === 'PUBLISHED' || d.status === 'MATCHED' || d.status === 'CLAIMED').length;

  const totalFoodQuantityDonated = donations
    .filter((d) => d.status === 'COMPLETED' || d.status === 'PUBLISHED')
    .reduce((sum, d) => sum + (d.quantity || 0), 0);

  const mealsRescued = donations
    .filter((d) => d.status === 'COMPLETED' || d.status === 'PUBLISHED')
    .reduce((sum, d) => sum + (d.estimatedMeals || 1), 0);

  // CO2 saved: industry standard factor ~ 2.5 kg CO2 per kg food rescued
  const co2SavedKg = Math.round(totalFoodQuantityDonated * 2.5 * 10) / 10;

  // Fetch or update persistent Impact document
  let impactDoc = await Impact.findOne({ userId });
  if (!impactDoc) {
    impactDoc = await Impact.create({
      userId,
      role: 'DONOR',
      mealsRescued,
      foodSavedKg: totalFoodQuantityDonated,
      donationsCompleted: completedDonations,
      impactPoints: completedDonations * 50 + publishedDonations * 10,
      co2SavedKg,
    });
  } else {
    impactDoc.mealsRescued = mealsRescued;
    impactDoc.foodSavedKg = totalFoodQuantityDonated;
    impactDoc.donationsCompleted = completedDonations;
    impactDoc.impactPoints = completedDonations * 50 + publishedDonations * 10;
    impactDoc.co2SavedKg = co2SavedKg;
    await impactDoc.save();
  }

  return {
    totalDonations,
    completedDonations,
    publishedDonations,
    totalFoodQuantityDonated,
    mealsRescued,
    impactPoints: impactDoc.impactPoints,
    co2SavedKg,
  };
};

module.exports = {
  getDonorProfile,
  updateDonorProfile,
  getDonorImpact,
};
