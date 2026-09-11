/**
 * FoodShareAI - Delivery Service
 * Manages delivery task creation, volunteer task discovery, atomic task acceptance,
 * multi-stage delivery execution lifecycle, proof submission, and volunteer impact.
 */
const mongoose = require('mongoose');
const {
  Delivery,
  Donation,
  Claim,
  User,
  VolunteerProfile,
  NgoProfile,
  DonorProfile,
  Impact,
} = require('../models');
const {
  DELIVERY_STATUS,
  DONATION_STATUS,
  CLAIM_STATUS,
} = require('../utils/constants');
const deliveryStatusService = require('./deliveryStatusService');
const matchingService = require('./matchingService');
const impactService = require('./impactService');
const gamificationService = require('./gamificationService');

/**
 * Validate MongoDB ObjectId
 */
const validateObjectId = (id, fieldName = 'ID') => {
  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error(`Invalid ${fieldName} format`);
    error.statusCode = 400;
    throw error;
  }
};

/**
 * 1. Create a delivery task for a confirmed claim
 * Internal / service-level operation triggered upon successful donation claim.
 * @param {object} donation
 * @param {object} claim
 * @param {object} ngoProfile
 */
const createDeliveryForClaim = async (donation, claim, ngoProfile) => {
  if (!donation || !claim) {
    throw new Error('Donation and claim are required to initialize delivery');
  }

  // Prevent duplicate deliveries for the same donation/claim
  const existingDelivery = await Delivery.findOne({
    $or: [{ donationId: donation._id }, { claimId: claim._id }],
  });
  if (existingDelivery) {
    return existingDelivery;
  }

  // Determine pickup and delivery destinations
  const pickupLocation = donation.location || {
    type: 'Point',
    coordinates: [78.4867, 17.385],
  };

  let deliveryLocation = ngoProfile?.location;
  if (!deliveryLocation || !Array.isArray(deliveryLocation.coordinates)) {
    // Fallback: fetch NGO profile if not passed
    const ngoProf = await NgoProfile.findOne({ userId: claim.ngoId });
    deliveryLocation = ngoProf?.location || {
      type: 'Point',
      coordinates: [78.4867, 17.385],
    };
  }

  // Calculate approximate straight-line distance
  const distanceKm = matchingService.calculateDistanceKm(
    pickupLocation.coordinates,
    deliveryLocation.coordinates
  );
  const routeDistance = Math.round(distanceKm * 1000); // meters
  const estimatedDuration = Math.max(10, Math.round((distanceKm / 25) * 60)); // minutes assuming ~25 km/h urban speed

  const delivery = await Delivery.create({
    donationId: donation._id,
    claimId: claim._id,
    donorId: donation.donorId,
    ngoId: claim.ngoId,
    volunteerId: null, // Open for volunteer discovery
    pickupLocation,
    deliveryLocation,
    route: {
      type: 'LineString',
      coordinates: [pickupLocation.coordinates, deliveryLocation.coordinates],
    },
    routeDistance,
    estimatedDuration,
    status: DELIVERY_STATUS.AVAILABLE,
  });

  return delivery;
};

/**
 * 2. Get delivery tasks available for volunteer assignment
 * @param {object} query
 * @param {string} volunteerUserId
 */
const getAvailableDeliveryTasks = async (query = {}, volunteerUserId) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  // Filter for available, unassigned deliveries
  const filter = {
    volunteerId: null,
    status: { $in: [DELIVERY_STATUS.AVAILABLE, DELIVERY_STATUS.PENDING, DELIVERY_STATUS.ASSIGNED] },
  };

  // Optional location-based proximity filtering
  let userLng = null;
  let userLat = null;

  if (query.longitude !== undefined && query.latitude !== undefined) {
    userLng = Number(query.longitude);
    userLat = Number(query.latitude);
  } else if (volunteerUserId) {
    const volProfile = await VolunteerProfile.findOne({ userId: volunteerUserId });
    if (volProfile?.location?.coordinates?.length === 2) {
      [userLng, userLat] = volProfile.location.coordinates;
    }
  }

  const radiusKm = Number(query.radius) || 20;

  if (userLng !== null && userLat !== null && !isNaN(userLng) && !isNaN(userLat)) {
    const EARTH_RADIUS_KM = 6378.1;
    filter.pickupLocation = {
      $geoWithin: {
        $centerSphere: [[userLng, userLat], radiusKm / EARTH_RADIUS_KM],
      },
    };
  }

  const total = await Delivery.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;

  const deliveries = await Delivery.find(filter)
    .populate({
      path: 'donationId',
      select: 'title description foodCategory quantity quantityUnit estimatedMeals foodImage freshnessStatus expiryTime pickupStartTime pickupEndTime status',
    })
    .populate('donorId', 'fullName phone')
    .populate('ngoId', 'fullName phone')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  // Format delivery tasks for presentation
  const formattedTasks = await Promise.all(
    deliveries.map(async (d) => {
      let donorOrgName = d.donorId?.fullName || 'Food Donor';
      let donorAddress = 'Jubilee Hills, Hyderabad';
      const donorProf = await DonorProfile.findOne({ userId: d.donorId?._id }).lean();
      if (donorProf) {
        donorOrgName = donorProf.organizationName || donorOrgName;
        donorAddress = donorProf.address?.street || donorAddress;
      }

      let ngoOrgName = d.ngoId?.fullName || 'Recipient NGO';
      let ngoAddress = 'Koti, Hyderabad';
      const ngoProf = await NgoProfile.findOne({ userId: d.ngoId?._id }).lean();
      if (ngoProf) {
        ngoOrgName = ngoProf.organizationName || ngoOrgName;
        ngoAddress = ngoProf.address?.street || ngoAddress;
      }

      let distanceKm = 2.5;
      if (userLng !== null && userLat !== null && d.pickupLocation?.coordinates) {
        distanceKm = matchingService.calculateDistanceKm(
          [userLng, userLat],
          d.pickupLocation.coordinates
        );
      }

      return {
        id: d._id.toString(),
        _id: d._id.toString(),
        donationId: d.donationId?._id?.toString() || '',
        foodName: d.donationId?.title || 'Surplus Food Rescue',
        foodCategory: d.donationId?.foodCategory || 'COOKED_MEALS',
        quantity: d.donationId
          ? `${d.donationId.quantity} ${d.donationId.quantityUnit?.toLowerCase() || 'meals'}`
          : '25 meals',
        quantityNum: d.donationId?.quantity || 25,
        estimatedMeals: d.donationId?.estimatedMeals || 25,
        foodImage: d.donationId?.foodImage || '',
        freshnessStatus: d.donationId?.freshnessStatus || 'GOOD',
        pickupLocation: d.pickupLocation,
        deliveryLocation: d.deliveryLocation,
        pickupWindow: d.donationId?.pickupStartTime
          ? `${new Date(d.donationId.pickupStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(d.donationId.pickupEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
          : '6:00 PM – 8:00 PM',
        expiryTime: d.donationId?.expiryTime,
        status: d.status,
        routeDistanceKm: Math.round((d.routeDistance / 1000) * 10) / 10 || 3.2,
        estimatedDurationMins: d.estimatedDuration || 15,
        distanceToPickupKm: distanceKm,
        donor: {
          organizationName: donorOrgName,
          address: donorAddress,
          phone: d.donorId?.phone || '',
        },
        ngo: {
          organizationName: ngoOrgName,
          address: ngoAddress,
          phone: d.ngoId?.phone || '',
        },
      };
    })
  );

  return {
    tasks: formattedTasks,
    pagination: {
      total,
      page,
      limit,
      totalPages,
    },
  };
};

/**
 * 3. Get single delivery task details by ID
 * @param {string} taskId
 * @param {string} volunteerUserId
 */
const getDeliveryTaskById = async (taskId, volunteerUserId) => {
  validateObjectId(taskId, 'taskId');

  const delivery = await Delivery.findById(taskId)
    .populate({
      path: 'donationId',
      select: 'title description foodCategory quantity quantityUnit estimatedMeals foodImage freshnessStatus expiryTime pickupStartTime pickupEndTime status',
    })
    .populate('donorId', 'fullName phone')
    .populate('ngoId', 'fullName phone')
    .lean();

  if (!delivery) {
    const err = new Error('Delivery task not found');
    err.statusCode = 404;
    throw err;
  }

  // Format donor and NGO operational details
  let donorOrgName = delivery.donorId?.fullName || 'Food Donor';
  let donorAddress = 'Jubilee Hills, Hyderabad';
  const donorProf = await DonorProfile.findOne({ userId: delivery.donorId?._id }).lean();
  if (donorProf) {
    donorOrgName = donorProf.organizationName || donorOrgName;
    donorAddress = donorProf.address?.street || donorAddress;
  }

  let ngoOrgName = delivery.ngoId?.fullName || 'Recipient NGO';
  let ngoAddress = 'Koti, Hyderabad';
  const ngoProf = await NgoProfile.findOne({ userId: delivery.ngoId?._id }).lean();
  if (ngoProf) {
    ngoOrgName = ngoProf.organizationName || ngoOrgName;
    ngoAddress = ngoProf.address?.street || ngoAddress;
  }

  return {
    id: delivery._id.toString(),
    _id: delivery._id.toString(),
    donationId: delivery.donationId?._id?.toString() || '',
    foodName: delivery.donationId?.title || 'Surplus Food Rescue',
    foodCategory: delivery.donationId?.foodCategory || 'COOKED_MEALS',
    quantity: delivery.donationId
      ? `${delivery.donationId.quantity} ${delivery.donationId.quantityUnit?.toLowerCase() || 'meals'}`
      : '25 meals',
    quantityNum: delivery.donationId?.quantity || 25,
    estimatedMeals: delivery.donationId?.estimatedMeals || 25,
    foodImage: delivery.donationId?.foodImage || '',
    freshnessStatus: delivery.donationId?.freshnessStatus || 'GOOD',
    pickupLocation: delivery.pickupLocation,
    deliveryLocation: delivery.deliveryLocation,
    pickupWindow: delivery.donationId?.pickupStartTime
      ? `${new Date(delivery.donationId.pickupStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} – ${new Date(delivery.donationId.pickupEndTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`
      : '6:00 PM – 8:00 PM',
    expiryTime: delivery.donationId?.expiryTime,
    status: delivery.status,
    routeDistanceKm: Math.round((delivery.routeDistance / 1000) * 10) / 10 || 3.2,
    estimatedDurationMins: delivery.estimatedDuration || 15,
    volunteerId: delivery.volunteerId?.toString() || null,
    proofOfDelivery: delivery.proofOfDelivery,
    pickupConfirmedAt: delivery.pickupConfirmedAt,
    foodCollectedAt: delivery.foodCollectedAt,
    completedAt: delivery.completedAt,
    donor: {
      organizationName: donorOrgName,
      address: donorAddress,
      phone: delivery.donorId?.phone || '',
    },
    ngo: {
      organizationName: ngoOrgName,
      address: ngoAddress,
      phone: delivery.ngoId?.phone || '',
    },
  };
};

/**
 * 4. Accept a delivery task
 * Atomic update prevents duplicate volunteer assignment race conditions.
 * @param {string} taskId
 * @param {string} volunteerUserId
 */
const acceptDeliveryTask = async (taskId, volunteerUserId) => {
  validateObjectId(taskId, 'taskId');

  // 1. Verify volunteer user is active
  const user = await User.findById(volunteerUserId);
  if (!user || !user.isActive) {
    const err = new Error('Volunteer account is not active or authorized to accept tasks');
    err.statusCode = 403;
    throw err;
  }

  // 2. Concurrency Protection: Atomic update
  // Only updates if delivery exists, volunteerId is null, and status is available/unassigned
  const acceptedDelivery = await Delivery.findOneAndUpdate(
    {
      _id: taskId,
      volunteerId: null,
      status: { $in: [DELIVERY_STATUS.AVAILABLE, DELIVERY_STATUS.PENDING, DELIVERY_STATUS.ASSIGNED] },
    },
    {
      volunteerId: volunteerUserId,
      status: DELIVERY_STATUS.ACCEPTED,
    },
    { new: true }
  );

  if (!acceptedDelivery) {
    const existing = await Delivery.findById(taskId);
    if (!existing) {
      const err = new Error('Delivery task not found');
      err.statusCode = 404;
      throw err;
    }
    // Already accepted by another volunteer -> 409 Conflict
    const err = new Error('Delivery task has already been accepted by another volunteer');
    err.statusCode = 409;
    throw err;
  }

  return {
    id: acceptedDelivery._id.toString(),
    _id: acceptedDelivery._id.toString(),
    volunteerId: acceptedDelivery.volunteerId.toString(),
    status: acceptedDelivery.status,
    updatedAt: acceptedDelivery.updatedAt,
  };
};

/**
 * 5. Get deliveries assigned to authenticated volunteer
 * @param {string} volunteerUserId
 * @param {object} query
 */
const getMyDeliveries = async (volunteerUserId, query = {}) => {
  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.max(1, Math.min(50, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const filter = { volunteerId: volunteerUserId };
  if (query.status) {
    const norm = deliveryStatusService.normalizeStatus(query.status);
    if (norm) filter.status = norm;
  }

  const total = await Delivery.countDocuments(filter);
  const totalPages = Math.ceil(total / limit) || 1;

  const deliveries = await Delivery.find(filter)
    .populate({
      path: 'donationId',
      select: 'title foodCategory quantity quantityUnit estimatedMeals foodImage status pickupStartTime pickupEndTime',
    })
    .populate('donorId', 'fullName phone')
    .populate('ngoId', 'fullName phone')
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    deliveries: deliveries.map((d) => ({
      id: d._id.toString(),
      _id: d._id.toString(),
      donation: d.donationId,
      status: d.status,
      pickupLocation: d.pickupLocation,
      deliveryLocation: d.deliveryLocation,
      pickupConfirmedAt: d.pickupConfirmedAt,
      completedAt: d.completedAt,
      donor: {
        fullName: d.donorId?.fullName || '',
        phone: d.donorId?.phone || '',
      },
      ngo: {
        fullName: d.ngoId?.fullName || '',
        phone: d.ngoId?.phone || '',
      },
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
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
 * 6. Get delivery details by ID (volunteer ownership protected)
 * @param {string} deliveryId
 * @param {string} volunteerUserId
 */
const getDeliveryById = async (deliveryId, volunteerUserId) => {
  validateObjectId(deliveryId, 'deliveryId');

  const delivery = await Delivery.findById(deliveryId)
    .populate('donationId')
    .populate('donorId', 'fullName phone')
    .populate('ngoId', 'fullName phone')
    .lean();

  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }

  // Volunteer ownership check
  if (!delivery.volunteerId || delivery.volunteerId.toString() !== volunteerUserId.toString()) {
    const err = new Error('Access denied: You are not authorized to view this delivery');
    err.statusCode = 403;
    throw err;
  }

  return {
    id: delivery._id.toString(),
    _id: delivery._id.toString(),
    donation: delivery.donationId,
    status: delivery.status,
    pickupLocation: delivery.pickupLocation,
    deliveryLocation: delivery.deliveryLocation,
    route: delivery.route,
    routeDistance: delivery.routeDistance,
    estimatedDuration: delivery.estimatedDuration,
    pickupConfirmedAt: delivery.pickupConfirmedAt,
    foodCollectedAt: delivery.foodCollectedAt,
    proofOfDelivery: delivery.proofOfDelivery,
    completedAt: delivery.completedAt,
    donor: {
      fullName: delivery.donorId?.fullName || '',
      phone: delivery.donorId?.phone || '',
    },
    ngo: {
      fullName: delivery.ngoId?.fullName || '',
      phone: delivery.ngoId?.phone || '',
    },
  };
};

/**
 * 7. Update operational delivery status
 * Validates transition rules and ownership.
 * @param {string} deliveryId
 * @param {string} volunteerUserId
 * @param {string} requestedStatus
 */
const updateDeliveryStatus = async (deliveryId, volunteerUserId, requestedStatus) => {
  validateObjectId(deliveryId, 'deliveryId');

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership verification
  if (!delivery.volunteerId || delivery.volunteerId.toString() !== volunteerUserId.toString()) {
    const err = new Error('Access denied: You are not assigned to this delivery');
    err.statusCode = 403;
    throw err;
  }

  // Validate state transition through centralized status service
  const validatedStatus = deliveryStatusService.validateTransition(
    delivery.status,
    requestedStatus
  );

  delivery.status = validatedStatus;

  if (validatedStatus === DELIVERY_STATUS.ARRIVED) {
    delivery.arrivedAt = new Date();
  }

  await delivery.save();

  return {
    id: delivery._id.toString(),
    _id: delivery._id.toString(),
    status: delivery.status,
    updatedAt: delivery.updatedAt,
  };
};

/**
 * 8. Confirm pickup of food donation by volunteer
 * Transitions delivery to PICKED_UP and sets pickup timestamps.
 * @param {string} deliveryId
 * @param {string} volunteerUserId
 */
const confirmPickup = async (deliveryId, volunteerUserId) => {
  validateObjectId(deliveryId, 'deliveryId');

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }

  if (!delivery.volunteerId || delivery.volunteerId.toString() !== volunteerUserId.toString()) {
    const err = new Error('Access denied: You are not assigned to this delivery');
    err.statusCode = 403;
    throw err;
  }

  // Validate transition to PICKED_UP
  deliveryStatusService.validateTransition(delivery.status, DELIVERY_STATUS.PICKED_UP);

  const now = new Date();
  delivery.status = DELIVERY_STATUS.PICKED_UP;
  delivery.pickupConfirmedAt = now;
  delivery.foodCollectedAt = now;
  await delivery.save();

  // Update related donation status to IN_TRANSIT
  await Donation.findByIdAndUpdate(delivery.donationId, {
    status: DONATION_STATUS.IN_TRANSIT,
  });

  return {
    id: delivery._id.toString(),
    status: delivery.status,
    pickupConfirmedAt: delivery.pickupConfirmedAt,
  };
};

/**
 * 9. Submit proof of delivery
 * @param {string} deliveryId
 * @param {string} volunteerUserId
 * @param {object} proofData { photoUrl, proofImageUrl, notes, signatureUrl }
 */
const submitProofOfDelivery = async (deliveryId, volunteerUserId, proofData = {}) => {
  validateObjectId(deliveryId, 'deliveryId');

  const delivery = await Delivery.findById(deliveryId);
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }

  if (!delivery.volunteerId || delivery.volunteerId.toString() !== volunteerUserId.toString()) {
    const err = new Error('Access denied: You are not assigned to this delivery');
    err.statusCode = 403;
    throw err;
  }

  delivery.proofOfDelivery = {
    photoUrl: proofData.proofImageUrl || proofData.photoUrl || delivery.proofOfDelivery?.photoUrl || '',
    notes: proofData.notes !== undefined ? String(proofData.notes).trim() : delivery.proofOfDelivery?.notes || '',
    signatureUrl: proofData.signatureUrl || delivery.proofOfDelivery?.signatureUrl || '',
  };

  await delivery.save();

  return {
    id: delivery._id.toString(),
    proofOfDelivery: delivery.proofOfDelivery,
  };
};

/**
 * 10. Complete delivery
 * Marks delivery COMPLETED, updates donation & claim, awards volunteer points.
 * @param {string} deliveryId
 * @param {string} volunteerUserId
 */
const completeDelivery = async (deliveryId, volunteerUserId) => {
  validateObjectId(deliveryId, 'deliveryId');

  const delivery = await Delivery.findById(deliveryId).populate('donationId');
  if (!delivery) {
    const err = new Error('Delivery not found');
    err.statusCode = 404;
    throw err;
  }

  if (!delivery.volunteerId || delivery.volunteerId.toString() !== volunteerUserId.toString()) {
    const err = new Error('Access denied: You are not assigned to this delivery');
    err.statusCode = 403;
    throw err;
  }

  // Enforce controlled completion transition
  deliveryStatusService.validateTransition(delivery.status, DELIVERY_STATUS.COMPLETED);

  const now = new Date();
  delivery.status = DELIVERY_STATUS.COMPLETED;
  delivery.completedAt = now;
  await delivery.save();

  // Update related donation
  const donation = await Donation.findByIdAndUpdate(
    delivery.donationId,
    {
      status: DONATION_STATUS.COMPLETED,
      completedAt: now,
    },
    { new: true }
  );

  // Update related claim
  if (delivery.claimId) {
    await Claim.findByIdAndUpdate(delivery.claimId, {
      status: CLAIM_STATUS.COMPLETED,
    });
  }

  // Idempotently record impact across Volunteer, Donor, and NGO
  await impactService.recordDeliveryImpact(delivery);

  // Idempotently award volunteer completion points
  const pointsResult = await gamificationService.awardDeliveryCompletionPoints(
    delivery,
    volunteerUserId
  );

  const volProfile = await VolunteerProfile.findOne({ userId: volunteerUserId }).lean();

  return {
    delivery: {
      id: delivery._id.toString(),
      status: delivery.status,
      completedAt: delivery.completedAt,
    },
    donation: {
      id: donation?._id.toString(),
      status: donation?.status,
    },
    impact: {
      pointsAwarded: pointsResult?.pointsAwarded || 0,
      totalPoints: volProfile?.impactPoints || 0,
      completedDeliveries: volProfile?.completedDeliveries || 0,
      levelInfo: pointsResult?.levelInfo || null,
    },
  };
};

/**
 * 11. Retrieve real volunteer impact analytics (centralized)
 * @param {string} volunteerUserId
 */
const getVolunteerImpact = async (volunteerUserId) => {
  return impactService.getVolunteerImpact(volunteerUserId);
};

module.exports = {
  createDeliveryForClaim,
  getAvailableDeliveryTasks,
  getDeliveryTaskById,
  acceptDeliveryTask,
  getMyDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmPickup,
  submitProofOfDelivery,
  completeDelivery,
  getVolunteerImpact,
};
