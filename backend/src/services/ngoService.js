/**
 * FoodShareAI - NGO Service
 * Manages NGO profiles, available food discovery, smart matching, claims, and dashboard metrics.
 */
const mongoose = require('mongoose');
const { User, NgoProfile, Donation, Claim, Impact, DonorProfile } = require('../models');
const { FOOD_CATEGORIES, DONATION_STATUS, CLAIM_STATUS } = require('../utils/constants');
const matchingService = require('./matchingService');
const { broadcastDonationUpdated, broadcastTaskUpdated } = require('../socket');

/**
 * Validate MongoDB ObjectId
 * @param {string} id
 * @param {string} fieldName
 */
const validateObjectId = (id, fieldName = 'ID') => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName} format`);
    error.statusCode = 400;
    throw error;
  }
};

/**
 * 1. Get authenticated NGO profile
 * @param {string} userId
 */
const getNgoProfile = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  let profile = await NgoProfile.findOne({ userId });
  if (!profile) {
    // Auto-initialize profile stub if not yet created
    profile = await NgoProfile.create({
      userId,
      organizationName: user.fullName || 'Community Kitchen',
      organizationType: 'COMMUNITY_KITCHEN',
      location: { type: 'Point', coordinates: [78.4867, 17.385] }, // Default Hyderabad coordinates
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
 * 2. Update authenticated NGO profile
 * @param {string} userId
 * @param {object} updateData
 */
const updateNgoProfile = async (userId, updateData = {}) => {
  const user = await User.findById(userId);
  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    throw err;
  }

  // Strictly disallow updating role, password, or direct privileges
  if (updateData.role || updateData.password || updateData.passwordHash || updateData.ownership) {
    const err = new Error('Modifying account role, password, or security privileges is forbidden');
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

  let profile = await NgoProfile.findOne({ userId });
  if (!profile) {
    profile = new NgoProfile({ userId });
  }

  if (updateData.organizationName) {
    profile.organizationName = updateData.organizationName.trim();
  }

  if (updateData.registrationNumber !== undefined) {
    profile.registrationNumber = String(updateData.registrationNumber).trim();
  }

  if (updateData.contactPerson || updateData.representativeName) {
    profile.representativeName = (updateData.contactPerson || updateData.representativeName).trim();
  }

  if (updateData.designation !== undefined) {
    profile.designation = String(updateData.designation).trim();
  }

  if (updateData.website !== undefined) {
    profile.website = String(updateData.website).trim();
  }

  if (updateData.phone) {
    profile.phone = String(updateData.phone).trim();
  }

  if (updateData.email) {
    profile.email = String(updateData.email).trim().toLowerCase();
  }

  if (updateData.description !== undefined) {
    profile.description = String(updateData.description).trim();
  }

  // Update address
  if (updateData.address) {
    if (typeof updateData.address === 'string') {
      profile.address.street = updateData.address.trim();
    } else if (typeof updateData.address === 'object') {
      profile.address = {
        ...profile.address.toObject(),
        ...updateData.address,
      };
    }
  }

  // Update food requirements (filtered against valid enum)
  if (Array.isArray(updateData.foodRequirements)) {
    profile.foodRequirements = updateData.foodRequirements.filter((cat) =>
      FOOD_CATEGORIES.includes(cat)
    );
  }

  // Update capacity
  if (updateData.capacity !== undefined || updateData.maximumDailyCapacity !== undefined) {
    const cap = Number(updateData.capacity !== undefined ? updateData.capacity : updateData.maximumDailyCapacity);
    if (!isNaN(cap) && cap >= 0) {
      profile.maximumDailyCapacity = cap;
    }
  }

  if (updateData.estimatedMealsRequiredPerDay !== undefined) {
    const meals = Number(updateData.estimatedMealsRequiredPerDay);
    if (!isNaN(meals) && meals >= 0) {
      profile.estimatedMealsRequiredPerDay = meals;
    }
  }

  // Update serviceArea / preferredPickupRadius
  if (updateData.serviceArea !== undefined || updateData.preferredPickupRadius !== undefined) {
    const rad = Number(updateData.serviceArea !== undefined ? updateData.serviceArea : updateData.preferredPickupRadius);
    if (!isNaN(rad) && rad >= 0) {
      profile.preferredPickupRadius = rad;
    }
  }

  // Update operatingHours
  if (updateData.operatingHours && typeof updateData.operatingHours === 'object') {
    profile.operatingHours = {
      ...profile.operatingHours.toObject(),
      ...updateData.operatingHours,
    };
  }

  // Update location: GeoJSON coordinates [longitude, latitude] or separate lat/lng
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

  // Update profileCompleted flag when required onboarding fields are satisfied
  const hasOrg = Boolean(profile.organizationName);
  const hasLocation = Boolean(
    profile.location &&
      Array.isArray(profile.location.coordinates) &&
      profile.location.coordinates.length === 2
  );
  const hasContact = Boolean(profile.representativeName || profile.phone || user.phone);

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
 * 3. Discover available published donations
 * Returns only donations eligible for NGO discovery (status = PUBLISHED, unexpired).
 * Supports spatial radius, foodCategory, quantity range, and pagination.
 * @param {object} query
 * @param {string} ngoUserId
 */
const discoverAvailableDonations = async (query = {}, ngoUserId) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // Strict baseline eligibility filter: PUBLISHED and not yet expired
  const filter = {
    status: DONATION_STATUS.PUBLISHED,
    expiryTime: { $gt: new Date() },
  };

  // Category filter
  if (query.foodCategory && FOOD_CATEGORIES.includes(query.foodCategory)) {
    filter.foodCategory = query.foodCategory;
  }

  // Quantity range filter
  if (query.minQuantity !== undefined || query.maxQuantity !== undefined) {
    filter.quantity = {};
    if (query.minQuantity !== undefined && !isNaN(Number(query.minQuantity))) {
      filter.quantity.$gte = Number(query.minQuantity);
    }
    if (query.maxQuantity !== undefined && !isNaN(Number(query.maxQuantity))) {
      filter.quantity.$lte = Number(query.maxQuantity);
    }
  }

  // Geospatial radius filter
  let userLng = null;
  let userLat = null;

  if (query.longitude !== undefined && query.latitude !== undefined) {
    userLng = Number(query.longitude);
    userLat = Number(query.latitude);
  } else if (ngoUserId) {
    const ngoProfile = await NgoProfile.findOne({ userId: ngoUserId });
    if (ngoProfile?.location?.coordinates?.length === 2) {
      [userLng, userLat] = ngoProfile.location.coordinates;
    }
  }

  const radiusKm = Number(query.radius) || 25; // Default 25km radius

  if (userLng !== null && userLat !== null && !isNaN(userLng) && !isNaN(userLat)) {
    // MongoDB $geoWithin with $centerSphere (radius in radians: radiusKm / Earth radius in km)
    const EARTH_RADIUS_KM = 6378.1;
    filter.location = {
      $geoWithin: {
        $centerSphere: [[userLng, userLat], radiusKm / EARTH_RADIUS_KM],
      },
    };
  }

  // Query database with pagination and safe projection
  const total = await Donation.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;

  const donations = await Donation.find(filter)
    .populate('donorId', 'fullName phone')
    .sort(query.sort || { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Attach donor organization name and calculate distance if coordinates are available
  const sanitizedDonations = await Promise.all(
    donations.map(async (donation) => {
      let donorOrgName = donation.donorId?.fullName || 'Verified Food Donor';
      let donorType = 'RESTAURANT';

      const donorProfile = await DonorProfile.findOne({ userId: donation.donorId?._id }).lean();
      if (donorProfile) {
        donorOrgName = donorProfile.organizationName || donorOrgName;
        donorType = donorProfile.donorType || donorType;
      }

      let distanceKm = null;
      if (userLng !== null && userLat !== null && donation.location?.coordinates) {
        distanceKm = matchingService.calculateDistanceKm(
          [userLng, userLat],
          donation.location.coordinates
        );
      }

      const msLeft = new Date(donation.expiryTime).getTime() - Date.now();
      const hoursLeft = Math.max(0, Math.floor(msLeft / 3600000));
      const minsLeft = Math.max(0, Math.floor((msLeft % 3600000) / 60000));
      const timeLeft = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m remaining` : `${minsLeft}m remaining`;
      const urgency = hoursLeft < 3 ? 'HIGH URGENCY' : 'MEDIUM URGENCY';
      const categoryIconMap = {
        COOKED_MEALS: '🍱',
        FRUITS_VEGETABLES: '🍎',
        BAKERY: '🥐',
        PACKAGED_FOOD: '📦',
        DAIRY: '🥛',
        BEVERAGES: '🧃',
        OTHER: '🍲',
      };
      const icon = categoryIconMap[donation.foodCategory] || '🍱';

      return {
        id: donation._id.toString(),
        _id: donation._id.toString(),
        foodName: donation.title,
        title: donation.title,
        donorName: donorOrgName,
        distance: distanceKm !== null ? `${distanceKm} km away` : 'Nearby',
        freshness: donation.freshnessStatus || 'Good',
        timeLeft,
        urgency,
        icon,
        description: donation.description,
        foodCategory: donation.foodCategory,
        quantity: `${donation.quantity} ${donation.quantityUnit.toLowerCase()}`,
        rawQuantity: donation.quantity,
        quantityUnit: donation.quantityUnit,
        estimatedMeals: donation.estimatedMeals,
        foodImage: donation.foodImage,
        freshnessStatus: donation.freshnessStatus,
        safetyStatus: donation.safetyStatus,
        status: donation.status,
        location: donation.location,
        preparationTime: donation.preparationTime,
        expiryTime: donation.expiryTime,
        pickupStartTime: donation.pickupStartTime,
        pickupEndTime: donation.pickupEndTime,
        publishedAt: donation.publishedAt,
        donor: {
          id: donation.donorId?._id?.toString() || '',
          organizationName: donorOrgName,
          donorType,
        },
        distanceKm,
      };
    })
  );

  return {
    donations: sanitizedDonations,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * 4. Get smart match details for a specific donation and the authenticated NGO
 * @param {string} donationId
 * @param {string} ngoUserId
 */
const getDonationMatchDetails = async (donationId, ngoUserId) => {
  validateObjectId(donationId, 'donationId');

  const donation = await Donation.findById(donationId).populate('donorId', 'fullName phone');
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  if (donation.status !== DONATION_STATUS.PUBLISHED) {
    const err = new Error(`Donation is not available for matching (status: ${donation.status})`);
    err.statusCode = 400;
    throw err;
  }

  if (donation.expiryTime && new Date(donation.expiryTime) <= new Date()) {
    const err = new Error('Donation has expired');
    err.statusCode = 400;
    throw err;
  }

  const ngoProfile = await NgoProfile.findOne({ userId: ngoUserId });
  if (!ngoProfile) {
    const err = new Error('NGO profile not found. Please complete your NGO profile first.');
    err.statusCode = 400;
    throw err;
  }

  // Calculate deterministic weighted match score and explainable match factors
  const matchResult = matchingService.calculateMatchScore(donation, ngoProfile);

  let donorOrgName = donation.donorId?.fullName || 'Verified Donor';
  const donorProfile = await DonorProfile.findOne({ userId: donation.donorId?._id }).lean();
  if (donorProfile?.organizationName) {
    donorOrgName = donorProfile.organizationName;
  }

  return {
    donation: {
      id: donation._id.toString(),
      _id: donation._id.toString(),
      title: donation.title,
      description: donation.description,
      foodCategory: donation.foodCategory,
      quantity: donation.quantity,
      quantityUnit: donation.quantityUnit,
      estimatedMeals: donation.estimatedMeals,
      foodImage: donation.foodImage,
      freshnessStatus: donation.freshnessStatus,
      status: donation.status,
      location: donation.location,
      expiryTime: donation.expiryTime,
      pickupStartTime: donation.pickupStartTime,
      pickupEndTime: donation.pickupEndTime,
      donor: {
        organizationName: donorOrgName,
      },
    },
    matchScore: matchResult.matchScore,
    matchFactors: matchResult.matchFactors,
    distanceKm: matchResult.distanceKm,
  };
};

/**
 * 5. Get recommended donations ranked by smart matchScore for the authenticated NGO
 * @param {string} ngoUserId
 * @param {object} query
 */
const getRecommendedDonations = async (ngoUserId, query = {}) => {
  const ngoProfile = await NgoProfile.findOne({ userId: ngoUserId });
  if (!ngoProfile) {
    const err = new Error('NGO profile not found. Please initialize your profile.');
    err.statusCode = 400;
    throw err;
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));

  // Retrieve candidate published and unexpired donations
  const filter = {
    status: DONATION_STATUS.PUBLISHED,
    expiryTime: { $gt: new Date() },
  };

  if (query.foodCategory && FOOD_CATEGORIES.includes(query.foodCategory)) {
    filter.foodCategory = query.foodCategory;
  }

  const candidateDonations = await Donation.find(filter)
    .populate('donorId', 'fullName phone')
    .lean();

  if (candidateDonations.length === 0) {
    return {
      recommendations: [],
      pagination: { total: 0, page, limit, totalPages: 0 },
    };
  }

  // Rank candidate donations by weighted match score
  const ranked = matchingService.rankMatches(candidateDonations, ngoProfile);

  // Paginate ranked list
  const total = ranked.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const skip = (page - 1) * limit;
  const paginatedSlice = ranked.slice(skip, skip + limit);

  // Enrich with donor details
  const enrichedRecommendations = await Promise.all(
    paginatedSlice.map(async (item) => {
      let donorOrgName = item.donation.donorId?.fullName || 'Food Donor';
      const donorProfile = await DonorProfile.findOne({ userId: item.donation.donorId?._id }).lean();
      if (donorProfile?.organizationName) {
        donorOrgName = donorProfile.organizationName;
      }

      return {
        donation: {
          id: item.donation._id.toString(),
          _id: item.donation._id.toString(),
          title: item.donation.title,
          description: item.donation.description,
          foodCategory: item.donation.foodCategory,
          quantity: item.donation.quantity,
          quantityUnit: item.donation.quantityUnit,
          estimatedMeals: item.donation.estimatedMeals,
          foodImage: item.donation.foodImage,
          freshnessStatus: item.donation.freshnessStatus,
          status: item.donation.status,
          location: item.donation.location,
          expiryTime: item.donation.expiryTime,
          pickupStartTime: item.donation.pickupStartTime,
          pickupEndTime: item.donation.pickupEndTime,
          donor: {
            organizationName: donorOrgName,
          },
        },
        distanceKm: item.distanceKm,
        matchScore: item.matchScore,
        matchFactors: item.matchFactors,
      };
    })
  );

  return {
    recommendations: enrichedRecommendations,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * 6. Claim a published donation
 * Protects against duplicate concurrent claims using atomic findOneAndUpdate.
 * Validates NGO active status, profile, and donation eligibility.
 * Updates Donation status from PUBLISHED -> CLAIMED.
 * Creates Claim record with status CONFIRMED.
 * @param {string} donationId
 * @param {string} ngoUserId
 * @param {object} claimData
 */
const claimDonation = async (donationId, ngoUserId, claimData = {}) => {
  validateObjectId(donationId, 'donationId');

  // 1. Verify NGO user exists, is active, and role is NGO
  const user = await User.findById(ngoUserId);
  if (!user || !user.isActive) {
    const err = new Error('NGO account is not active or authorized to make claims');
    err.statusCode = 403;
    throw err;
  }

  // 2. Verify NGO profile
  const ngoProfile = await NgoProfile.findOne({ userId: ngoUserId });
  if (!ngoProfile) {
    const err = new Error('NGO profile must be set up before claiming food donations');
    err.statusCode = 400;
    throw err;
  }

  // 3. Concurrency Protection: Atomic database update
  // Only updates if donation exists, status is PUBLISHED, and expiryTime > now
  const claimedDonation = await Donation.findOneAndUpdate(
    {
      _id: donationId,
      status: DONATION_STATUS.PUBLISHED,
      expiryTime: { $gt: new Date() },
    },
    {
      status: DONATION_STATUS.CLAIMED,
      claimedAt: new Date(),
    },
    { new: true }
  );

  if (!claimedDonation) {
    // Investigate reason for failure to provide precise, informative response
    const existing = await Donation.findById(donationId);
    if (!existing) {
      const err = new Error('Donation not found');
      err.statusCode = 404;
      throw err;
    }

    if (existing.expiryTime && new Date(existing.expiryTime) <= new Date()) {
      const err = new Error('Donation has expired and can no longer be claimed');
      err.statusCode = 400;
      throw err;
    }

    // Donation already claimed or not in PUBLISHED status -> 409 Conflict
    const err = new Error(
      `Donation cannot be claimed. Current status is ${existing.status} (already claimed or unavailable).`
    );
    err.statusCode = 409;
    throw err;
  }

  // 4. Calculate match metrics for auditing in the Claim document
  const matchResult = matchingService.calculateMatchScore(claimedDonation, ngoProfile);

  // 5. Create Claim document
  let claim;
  try {
    claim = await Claim.create({
      donationId: claimedDonation._id,
      ngoId: ngoUserId,
      requestedQuantity: claimData.requestedQuantity || claimedDonation.quantity,
      matchScore: matchResult.matchScore,
      matchFactors: {
        distanceScore: matchResult.matchFactors.distance,
        foodCompatibilityScore: matchResult.matchFactors.foodCompatibility,
        quantityCapacityScore: matchResult.matchFactors.quantityCompatibility,
        urgencyScore: matchResult.matchFactors.urgency,
        availabilityScore: matchResult.matchFactors.serviceArea,
        historicalReliabilityScore: 85,
        demandScore: matchResult.matchFactors.requirementMatch,
        routeEfficiencyScore: 80,
      },
      status: CLAIM_STATUS.CONFIRMED,
      claimedAt: new Date(),
      confirmedAt: new Date(),
    });
    // 6. Initialize eligible delivery task for volunteer assignment
    try {
      const deliveryService = require('./deliveryService');
      const delivery = await deliveryService.createDeliveryForClaim(claimedDonation, claim, ngoProfile);
      try {
        broadcastDonationUpdated(claimedDonation);
        if (delivery) broadcastTaskUpdated(delivery);
      } catch (_) {}
    } catch (deliveryErr) {
      console.warn('[Delivery] Delivery creation notice:', deliveryErr.message);
    }
  } catch (claimError) {
    // In case of claim document creation failure, roll back donation status to PUBLISHED
    await Donation.findByIdAndUpdate(donationId, {
      status: DONATION_STATUS.PUBLISHED,
      claimedAt: null,
    });
    throw claimError;
  }

  return {
    claim: {
      id: claim._id.toString(),
      _id: claim._id.toString(),
      donationId: claim.donationId.toString(),
      ngoId: claim.ngoId.toString(),
      requestedQuantity: claim.requestedQuantity,
      matchScore: claim.matchScore,
      matchFactors: claim.matchFactors,
      status: claim.status,
      claimedAt: claim.claimedAt,
      confirmedAt: claim.confirmedAt,
    },
    donation: {
      id: claimedDonation._id.toString(),
      title: claimedDonation.title,
      status: claimedDonation.status,
      claimedAt: claimedDonation.claimedAt,
    },
  };
};

/**
 * 7. Get claims belonging to authenticated NGO
 * @param {string} ngoUserId
 * @param {object} query
 */
const getNgoClaims = async (ngoUserId, query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { ngoId: ngoUserId };
  if (query.status && Object.values(CLAIM_STATUS).includes(query.status)) {
    filter.status = query.status;
  }

  const total = await Claim.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;

  const claims = await Claim.find(filter)
    .populate({
      path: 'donationId',
      select: 'title description foodCategory quantity quantityUnit estimatedMeals foodImage status location expiryTime pickupStartTime pickupEndTime donorId',
      populate: { path: 'donorId', select: 'fullName phone' },
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    claims: claims.map((c) => ({
      id: c._id.toString(),
      _id: c._id.toString(),
      donation: c.donationId,
      requestedQuantity: c.requestedQuantity,
      matchScore: c.matchScore,
      status: c.status,
      claimedAt: c.claimedAt,
      confirmedAt: c.confirmedAt,
      createdAt: c.createdAt,
    })),
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * 8. Get specific claim by ID (ownership protected)
 * @param {string} claimId
 * @param {string} ngoUserId
 */
const getNgoClaimById = async (claimId, ngoUserId) => {
  validateObjectId(claimId, 'claimId');

  const claim = await Claim.findById(claimId)
    .populate({
      path: 'donationId',
      select: 'title description foodCategory quantity quantityUnit estimatedMeals foodImage status location expiryTime pickupStartTime pickupEndTime donorId',
      populate: { path: 'donorId', select: 'fullName phone' },
    })
    .lean();

  if (!claim) {
    const err = new Error('Claim not found');
    err.statusCode = 404;
    throw err;
  }

  // Verify ownership: Claim must belong to authenticated NGO
  if (claim.ngoId.toString() !== ngoUserId.toString()) {
    const err = new Error('Access denied: You are not authorized to view this claim');
    err.statusCode = 403;
    throw err;
  }

  return {
    id: claim._id.toString(),
    _id: claim._id.toString(),
    donation: claim.donationId,
    requestedQuantity: claim.requestedQuantity,
    matchScore: claim.matchScore,
    matchFactors: claim.matchFactors,
    status: claim.status,
    claimedAt: claim.claimedAt,
    confirmedAt: claim.confirmedAt,
    createdAt: claim.createdAt,
  };
};

/**
 * 9. Get real database-backed NGO dashboard metrics
 * @param {string} ngoUserId
 */
const getNgoDashboardData = async (ngoUserId) => {
  const ngoProfile = await NgoProfile.findOne({ userId: ngoUserId });

  // 1. Available published donation count
  const availableDonationCount = await Donation.countDocuments({
    status: DONATION_STATUS.PUBLISHED,
    expiryTime: { $gt: new Date() },
  });

  // 2. Active claim count (CONFIRMED or REQUESTED)
  const activeClaimCount = await Claim.countDocuments({
    ngoId: ngoUserId,
    status: { $in: [CLAIM_STATUS.CONFIRMED, CLAIM_STATUS.REQUESTED] },
  });

  // 3. Completed claim count
  const completedClaimCount = await Claim.countDocuments({
    ngoId: ngoUserId,
    status: CLAIM_STATUS.COMPLETED,
  });

  // 4. Completed claims aggregation for food quantity
  const completedClaims = await Claim.find({
    ngoId: ngoUserId,
    status: CLAIM_STATUS.COMPLETED,
  }).populate('donationId', 'quantity estimatedMeals');

  const totalFoodReceived = completedClaims.reduce((sum, c) => sum + (c.requestedQuantity || 0), 0);
  const totalMealsReceived = completedClaims.reduce(
    (sum, c) => sum + (c.donationId?.estimatedMeals || c.requestedQuantity || 0),
    0
  );

  // 5. Impact metrics from Impact model
  const impactDoc = await Impact.findOne({ userId: ngoUserId }).lean();
  const mealsReceived = impactDoc?.mealsRescued || totalMealsReceived;
  const foodRescuedKg = impactDoc?.foodSavedKg || totalFoodReceived;
  const co2AvoidedKg = impactDoc?.co2SavedKg || Math.round(foodRescuedKg * 2.5 * 10) / 10;
  const peopleServed = Math.round(mealsReceived * 1.2);

  // 6. Capacity limits
  const totalCapacity = ngoProfile?.maximumDailyCapacity || 100;
  const activeClaims = await Claim.find({
    ngoId: ngoUserId,
    status: { $in: [CLAIM_STATUS.CONFIRMED, CLAIM_STATUS.REQUESTED] },
  });
  const usedMeals = activeClaims.reduce((sum, c) => sum + (c.requestedQuantity || 0), 0);
  const availableMeals = Math.max(0, totalCapacity - usedMeals);

  // 7. Recent urgent donations (top 3 expiring soonest)
  const urgentDonations = await Donation.find({
    status: DONATION_STATUS.PUBLISHED,
    expiryTime: { $gt: new Date() },
  })
    .populate('donorId', 'fullName')
    .sort({ expiryTime: 1 })
    .limit(3)
    .lean();

  const categoryIconMap = {
    COOKED_MEALS: '🍱',
    FRUITS_VEGETABLES: '🍎',
    BAKERY: '🥐',
    PACKAGED_FOOD: '📦',
    DAIRY: '🥛',
    BEVERAGES: '🧃',
    OTHER: '🍲',
  };

  const formattedUrgent = urgentDonations.map((d) => {
    let distanceKm = 2.0;
    if (ngoProfile?.location?.coordinates && d.location?.coordinates) {
      distanceKm = matchingService.calculateDistanceKm(
        ngoProfile.location.coordinates,
        d.location.coordinates
      );
    }
    const match = ngoProfile ? matchingService.calculateMatchScore(d, ngoProfile) : { matchScore: 85 };

    const msLeft = new Date(d.expiryTime).getTime() - Date.now();
    const hoursLeft = Math.max(0, Math.floor(msLeft / 3600000));
    const minsLeft = Math.max(0, Math.floor((msLeft % 3600000) / 60000));
    const timeLeft = hoursLeft > 0 ? `${hoursLeft}h ${minsLeft}m remaining` : `${minsLeft}m remaining`;
    const urgency = hoursLeft < 3 ? 'HIGH URGENCY' : 'MEDIUM URGENCY';
    const icon = categoryIconMap[d.foodCategory] || '🍱';

    return {
      id: d._id.toString(),
      _id: d._id.toString(),
      foodName: d.title,
      quantity: `${d.quantity} ${d.quantityUnit.toLowerCase()}`,
      donorName: d.donorId?.fullName || 'Verified Donor',
      distance: `${distanceKm} km away`,
      freshness: d.freshnessStatus || 'Good',
      expiryTime: d.expiryTime,
      timeLeft,
      urgency,
      icon,
      foodCategory: d.foodCategory,
      image: d.foodImage || '',
      matchScore: match.matchScore,
    };
  });

  return {
    availableDonationCount,
    activeClaimCount,
    completedClaimCount,
    totalFoodReceived,
    totalMealsReceived,
    capacity: {
      totalCapacity,
      usedMeals,
      availableMeals,
    },
    impact: {
      mealsReceived,
      peopleServed,
      foodRescuedKg,
      co2AvoidedKg,
    },
    recentUrgentDonations: formattedUrgent,
    demandInsights: {
      highDemandCategories: ['Cooked meals', 'Fruits & Vegetables'],
      status: 'AVAILABLE',
      advisory: 'Demand predictions indicate deficit in Cooked Meals and Fresh Produce this week.',
    },
  };
};

module.exports = {
  getNgoProfile,
  updateNgoProfile,
  discoverAvailableDonations,
  getDonationMatchDetails,
  getRecommendedDonations,
  claimDonation,
  getNgoClaims,
  getNgoClaimById,
  getNgoDashboardData,
};
