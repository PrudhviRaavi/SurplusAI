/**
 * FoodShareAI - Operational Map & Geographic Intelligence Service
 * Consolidates real geographic locations for surplus listings, NGO demand clusters,
 * active deliveries, and volunteer telemetry for the Admin Operational Intelligence Center.
 * Strictly adheres to GeoJSON conventions: [longitude, latitude].
 * Zero fabricated coordinates.
 */
const mongoose = require('mongoose');
const { Donation, NgoProfile, VolunteerProfile, Delivery } = require('../models');
const { DONATION_STATUS, DELIVERY_STATUS, VERIFICATION_STATUS } = require('../utils/constants');

/**
 * Derives demand intensity label from required daily meals
 */
const getDemandLevel = (meals) => {
  if (meals >= 500) return 'Critical';
  if (meals >= 250) return 'High';
  if (meals >= 100) return 'Medium';
  return 'Normal';
};

/**
 * Derives surplus intensity label from listing count
 */
const getSurplusIntensity = (count) => {
  if (count >= 20) return 'High';
  if (count >= 10) return 'Medium';
  return 'Low';
};

/**
 * Fetches real operational geographic data for Admin Map Intelligence
 */
const getOperationalMapData = async ({
  dateRange,
  foodCategory,
  donationStatus,
  claimStatus,
  deliveryStatus,
  startDate,
  endDate,
} = {}) => {
  if (mongoose.connection && mongoose.connection.readyState !== 1) {
    return {
      surplusHotspots: [],
      demandHotspots: [],
      donationLocations: [],
      ngoLocations: [],
      deliveryActivity: [],
      volunteerActivity: [],
      summary: {
        activeListingsCount: 0,
        ngoCount: 0,
        activeDeliveriesCount: 0,
        activeVolunteersCount: 0,
      },
      generatedAt: new Date().toISOString(),
    };
  }

  // 1. Build Donation Filter
  const donationQuery = {};

  if (foodCategory && foodCategory !== 'ALL') {
    donationQuery.foodCategory = foodCategory;
  }

  if (donationStatus && donationStatus !== 'ALL') {
    donationQuery.status = donationStatus;
  } else {
    // Default active operational statuses
    donationQuery.status = {
      $in: [
        DONATION_STATUS.PUBLISHED,
        DONATION_STATUS.MATCHED,
        DONATION_STATUS.CLAIMED,
        DONATION_STATUS.PICKUP_PENDING,
        DONATION_STATUS.IN_TRANSIT,
      ],
    };
  }

  if (startDate || endDate) {
    donationQuery.createdAt = {};
    if (startDate) donationQuery.createdAt.$gte = new Date(startDate);
    if (endDate) donationQuery.createdAt.$lte = new Date(endDate);
  }

  // 2. Build Delivery Filter
  const deliveryQuery = {};
  if (deliveryStatus && deliveryStatus !== 'ALL') {
    deliveryQuery.status = deliveryStatus;
  } else {
    deliveryQuery.status = {
      $in: [
        DELIVERY_STATUS.AVAILABLE,
        DELIVERY_STATUS.ASSIGNED,
        DELIVERY_STATUS.ACCEPTED,
        DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
        DELIVERY_STATUS.PICKED_UP,
        DELIVERY_STATUS.IN_TRANSIT,
        DELIVERY_STATUS.ARRIVED,
      ],
    };
  }

  // 3. Parallel Query Execution
  const [activeDonations, ngoProfiles, activeDeliveries, activeVolunteers] = await Promise.all([
    Donation.find(donationQuery)
      .select('title foodCategory quantity quantityUnit freshnessStatus safetyStatus status location expiryTime createdAt')
      .populate('donorId', 'fullName email')
      .lean(),

    NgoProfile.find({
      verificationStatus: { $in: [VERIFICATION_STATUS.VERIFIED, VERIFICATION_STATUS.PENDING] },
    })
      .select('organizationName organizationType estimatedMealsRequiredPerDay foodRequirements location verificationStatus address')
      .lean(),

    Delivery.find(deliveryQuery)
      .select('pickupLocation deliveryLocation currentLocation route status estimatedDuration routeDistance lastLocationUpdateAt')
      .populate('volunteerId', 'fullName phone')
      .lean(),

    VolunteerProfile.find({ isAvailable: true })
      .select('fullName phone transportation location impactPoints')
      .lean(),
  ]);

  // 4. Transform Donations to Map GeoJSON Points
  const donationLocations = activeDonations
    .filter((d) => d.location && Array.isArray(d.location.coordinates) && d.location.coordinates.length === 2)
    .map((d) => {
      const [lng, lat] = d.location.coordinates;
      return {
        id: d._id.toString(),
        name: d.title,
        foodCategory: d.foodCategory,
        quantity: `${d.quantity} ${d.quantityUnit}`,
        freshnessStatus: d.freshnessStatus,
        safetyStatus: d.safetyStatus,
        status: d.status,
        donorName: d.donorId?.fullName || 'Anonymous Donor',
        coordinates: [lng, lat],
        lng,
        lat,
      };
    });

  // 5. Aggregate Surplus Hotspots
  // Group donations by rough geographic rounding (~1-2 km grids)
  const surplusClusterMap = {};
  for (const d of donationLocations) {
    const gridKey = `${d.lat.toFixed(2)},${d.lng.toFixed(2)}`;
    if (!surplusClusterMap[gridKey]) {
      surplusClusterMap[gridKey] = {
        id: `hs-${gridKey}`,
        name: `${d.foodCategory} Surplus Cluster (${d.lat.toFixed(2)}°, ${d.lng.toFixed(2)}°)`,
        count: 0,
        lat: d.lat,
        lng: d.lng,
      };
    }
    surplusClusterMap[gridKey].count += 1;
  }

  const surplusHotspots = Object.values(surplusClusterMap).map((hs) => ({
    ...hs,
    intensity: getSurplusIntensity(hs.count),
  }));

  // 6. Transform NGOs & Demand Hotspots
  const ngoLocations = ngoProfiles
    .filter((ngo) => ngo.location && Array.isArray(ngo.location.coordinates) && ngo.location.coordinates.length === 2)
    .map((ngo) => {
      const [lng, lat] = ngo.location.coordinates;
      return {
        id: ngo._id.toString(),
        name: ngo.organizationName,
        type: ngo.organizationType,
        requiredMeals: ngo.estimatedMealsRequiredPerDay || 0,
        demandLevel: getDemandLevel(ngo.estimatedMealsRequiredPerDay || 0),
        verificationStatus: ngo.verificationStatus,
        city: ngo.address?.city || '',
        coordinates: [lng, lat],
        lng,
        lat,
      };
    });

  const demandHotspots = ngoLocations
    .filter((ngo) => ngo.requiredMeals > 0)
    .map((ngo) => ({
      id: `dh-${ngo.id}`,
      name: `${ngo.name} Care Cluster`,
      demandLevel: ngo.demandLevel,
      requiredMeals: ngo.requiredMeals,
      lat: ngo.lat,
      lng: ngo.lng,
      coordinates: [ngo.lng, ngo.lat],
    }));

  // 7. Transform Deliveries Activity
  const deliveryActivity = activeDeliveries.map((del) => {
    const pickupCoords = del.pickupLocation?.coordinates || null;
    const dropCoords = del.deliveryLocation?.coordinates || null;
    const currentCoords = del.currentLocation?.coordinates || pickupCoords;

    return {
      id: del._id.toString(),
      status: del.status,
      volunteerName: del.volunteerId?.fullName || 'Unassigned',
      pickupCoordinates: pickupCoords,
      dropCoordinates: dropCoords,
      currentCoordinates: currentCoords,
      route: del.route?.coordinates || [],
      estimatedDurationMinutes: del.estimatedDuration || 0,
      distanceMeters: del.routeDistance || 0,
    };
  });

  // 8. Transform Volunteer Locations
  const volunteerActivity = activeVolunteers
    .filter((v) => v.location && Array.isArray(v.location.coordinates) && v.location.coordinates.length === 2)
    .map((v) => {
      const [lng, lat] = v.location.coordinates;
      return {
        id: v._id.toString(),
        name: v.fullName || 'Volunteer',
        transportation: v.transportation,
        coordinates: [lng, lat],
        lng,
        lat,
      };
    });

  return {
    surplusHotspots,
    demandHotspots,
    donationLocations,
    ngoLocations,
    deliveryActivity,
    volunteerActivity,
    summary: {
      activeListingsCount: donationLocations.length,
      ngoCount: ngoLocations.length,
      activeDeliveriesCount: deliveryActivity.length,
      activeVolunteersCount: volunteerActivity.length,
    },
    generatedAt: new Date().toISOString(),
  };
};

module.exports = {
  getOperationalMapData,
};
