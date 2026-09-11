/**
 * FoodShareAI - Smart Matching Service
 * Foundation for the deterministic, explainable smart matching engine.
 * Computes multi-factor weighted compatibility between food donations and recipient NGOs.
 *
 * NOTE: KNN here is strictly for candidate NGO proximity/similarity selection,
 * NOT route optimization (which will be implemented with A* in future phases).
 */
const { MATCHING_WEIGHTS, SCORING_PARAMS } = require('../utils/matchingWeights');

/**
 * Convert degrees to radians
 */
const deg2rad = (deg) => deg * (Math.PI / 180);

/**
 * Extract [longitude, latitude] array from various coordinate formats
 * @param {Array|object} coord
 * @returns {[number, number]|null} [longitude, latitude]
 */
const parseCoordinates = (coord) => {
  if (!coord) return null;

  // GeoJSON object format { type: 'Point', coordinates: [lng, lat] }
  if (coord.type === 'Point' && Array.isArray(coord.coordinates) && coord.coordinates.length === 2) {
    return [Number(coord.coordinates[0]), Number(coord.coordinates[1])];
  }

  // Array format [lng, lat]
  if (Array.isArray(coord) && coord.length === 2) {
    return [Number(coord[0]), Number(coord[1])];
  }

  // Object format { latitude, longitude } or { lat, lng }
  const lat = coord.latitude !== undefined ? coord.latitude : coord.lat;
  const lng = coord.longitude !== undefined ? coord.longitude : coord.lng;

  if (lat !== undefined && lng !== undefined && !isNaN(Number(lat)) && !isNaN(Number(lng))) {
    return [Number(lng), Number(lat)];
  }

  return null;
};

/**
 * Calculate great-circle distance between two geographic coordinates using Haversine formula
 * @param {Array|object} coordA [longitude, latitude] or { latitude, longitude }
 * @param {Array|object} coordB [longitude, latitude] or { latitude, longitude }
 * @returns {number} Distance in kilometers (rounded to 2 decimals)
 */
const calculateDistanceKm = (coordA, coordB) => {
  const pointA = parseCoordinates(coordA);
  const pointB = parseCoordinates(coordB);

  if (!pointA || !pointB) {
    return 999; // Fallback large distance if coordinates unavailable
  }

  const [lng1, lat1] = pointA;
  const [lng2, lat2] = pointB;

  const EARTH_RADIUS_KM = 6371;
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = EARTH_RADIUS_KM * c;

  return Math.round(distance * 100) / 100;
};

/**
 * 1. Distance Compatibility Score (0 - 100)
 * Proximity to the donation pickup location.
 * @param {number} distanceKm
 * @param {number} preferredRadius
 */
const calculateDistanceScore = (distanceKm, preferredRadius = 10) => {
  if (distanceKm <= 1.0) {
    return 100;
  }
  if (distanceKm <= preferredRadius) {
    // Linear scale between 1km (100) and preferredRadius (50)
    const decay = ((distanceKm - 1.0) / (preferredRadius - 1.0)) * 50;
    return Math.round(100 - decay);
  }
  // Beyond preferred radius down to MAX_CONSIDERED_DISTANCE_KM
  const maxDist = SCORING_PARAMS.MAX_CONSIDERED_DISTANCE_KM;
  if (distanceKm >= maxDist) {
    return 10;
  }
  const excess = (distanceKm - preferredRadius) / (maxDist - preferredRadius);
  return Math.max(10, Math.round(50 - excess * 40));
};

/**
 * 2. Food Category Compatibility Score (0 - 100)
 * Checks if the food category aligns with what the NGO accepts.
 * @param {string} donationCategory
 * @param {string[]} ngoRequirements
 */
const calculateFoodCompatibility = (donationCategory, ngoRequirements = []) => {
  if (!Array.isArray(ngoRequirements) || ngoRequirements.length === 0) {
    return 85; // Open to all food categories
  }

  const normalizedCategory = String(donationCategory || '').toUpperCase();
  const normalizedReqs = ngoRequirements.map((r) => String(r).toUpperCase());

  if (normalizedReqs.includes(normalizedCategory)) {
    return 100;
  }

  // Cross-category synergy (e.g. Cooked meals vs Bakery)
  return 30;
};

/**
 * 3. Quantity / Capacity Compatibility Score (0 - 100)
 * Evaluates whether the NGO has the daily handling capacity to receive this volume.
 * @param {number} donationQuantity
 * @param {number} ngoCapacity
 * @param {number} mealsRequired
 */
const calculateQuantityCompatibility = (donationQuantity = 0, ngoCapacity = 0, mealsRequired = 0) => {
  const effectiveCapacity = ngoCapacity > 0 ? ngoCapacity : (mealsRequired > 0 ? mealsRequired : 100);

  if (donationQuantity <= 0) return 50;

  const ratio = donationQuantity / effectiveCapacity;

  // Sweet spot: donation takes 20% - 80% of daily capacity
  if (ratio >= 0.1 && ratio <= 0.8) {
    return 100;
  }
  // Fits capacity exactly or close to full capacity
  if (ratio <= 1.0) {
    return 85;
  }
  // Exceeds daily capacity: score decays based on degree of overflow
  if (ratio <= 1.5) {
    return 60;
  }
  if (ratio <= 2.0) {
    return 35;
  }
  return 15;
};

/**
 * 4. NGO Food Requirement Score (0 - 100)
 * Specific demand alignment from the NGO profile.
 * @param {object} donation
 * @param {object} ngoProfile
 */
const calculateRequirementScore = (donation = {}, ngoProfile = {}) => {
  const reqs = ngoProfile.foodRequirements || [];
  if (!reqs.length) {
    return 80;
  }

  const donationCategory = String(donation.foodCategory || '').toUpperCase();
  const matched = reqs.some((r) => String(r).toUpperCase() === donationCategory);

  if (matched) {
    return 100;
  }

  return 40;
};

/**
 * 5. Urgency Score (0 - 100)
 * Deterministic calculation based on remaining shelf-life until expiry or pickup window closure.
 * Shorter shelf-life = Higher urgency to dispatch immediately.
 * @param {object} donation
 */
const calculateUrgencyScore = (donation = {}) => {
  const now = Date.now();
  const expiryTime = donation.expiryTime ? new Date(donation.expiryTime).getTime() : null;
  const pickupEndTime = donation.pickupEndTime ? new Date(donation.pickupEndTime).getTime() : null;

  // Use the earlier of expiry or pickup end
  const criticalDeadline = Math.min(
    expiryTime || Number.MAX_SAFE_INTEGER,
    pickupEndTime || Number.MAX_SAFE_INTEGER
  );

  if (criticalDeadline === Number.MAX_SAFE_INTEGER) {
    return 50; // Default moderate urgency if timestamps absent
  }

  const msRemaining = criticalDeadline - now;
  const hoursRemaining = msRemaining / (1000 * 60 * 60);

  if (hoursRemaining <= 0) {
    return 0; // Already expired
  }
  if (hoursRemaining <= SCORING_PARAMS.CRITICAL_URGENCY_HOURS) {
    return 100; // Critical: <= 2 hours left
  }
  if (hoursRemaining <= SCORING_PARAMS.HIGH_URGENCY_HOURS) {
    return 90; // High: <= 4 hours left
  }
  if (hoursRemaining <= SCORING_PARAMS.MODERATE_URGENCY_HOURS) {
    return 75; // Moderate: <= 8 hours left
  }
  if (hoursRemaining <= SCORING_PARAMS.STANDARD_URGENCY_HOURS) {
    return 60; // Standard: <= 24 hours left
  }
  return 40; // Low urgency: > 24 hours left
};

/**
 * 6. Service Area Score (0 - 100)
 * Evaluates if the donation falls squarely within the NGO's designated operating radius.
 * @param {number} distanceKm
 * @param {number} preferredRadius
 */
const calculateServiceAreaScore = (distanceKm, preferredRadius = 10) => {
  const radius = preferredRadius > 0 ? preferredRadius : 10;

  if (distanceKm <= radius) {
    return 100;
  }
  if (distanceKm <= radius * 1.5) {
    return 70;
  }
  if (distanceKm <= radius * 2.0) {
    return 40;
  }
  return 15;
};

/**
 * Calculate the overall weighted match score between a donation and an NGO profile
 * @param {object} donation
 * @param {object} ngoProfile
 * @returns {{ matchScore: number, matchFactors: object, distanceKm: number }}
 */
const calculateMatchScore = (donation, ngoProfile) => {
  if (!donation || !ngoProfile) {
    return {
      matchScore: 0,
      matchFactors: {
        distance: 0,
        foodCompatibility: 0,
        quantityCompatibility: 0,
        requirementMatch: 0,
        urgency: 0,
        serviceArea: 0,
      },
      distanceKm: 999,
    };
  }

  // 1. Compute distance
  const donationLocation = donation.location;
  const ngoLocation = ngoProfile.location;
  const distanceKm = calculateDistanceKm(donationLocation, ngoLocation);

  const preferredRadius = ngoProfile.preferredPickupRadius || 10;
  const ngoCapacity = ngoProfile.maximumDailyCapacity || 0;
  const mealsRequired = ngoProfile.estimatedMealsRequiredPerDay || 0;

  // 2. Compute individual sub-scores
  const distanceScore = calculateDistanceScore(distanceKm, preferredRadius);
  const foodCompatibilityScore = calculateFoodCompatibility(
    donation.foodCategory,
    ngoProfile.foodRequirements
  );
  const quantityCapacityScore = calculateQuantityCompatibility(
    donation.quantity,
    ngoCapacity,
    mealsRequired
  );
  const requirementScore = calculateRequirementScore(donation, ngoProfile);
  const urgencyScore = calculateUrgencyScore(donation);
  const serviceAreaScore = calculateServiceAreaScore(distanceKm, preferredRadius);

  // 3. Compute weighted aggregate
  const rawScore =
    distanceScore * MATCHING_WEIGHTS.DISTANCE_WEIGHT +
    foodCompatibilityScore * MATCHING_WEIGHTS.FOOD_WEIGHT +
    quantityCapacityScore * MATCHING_WEIGHTS.QUANTITY_WEIGHT +
    requirementScore * MATCHING_WEIGHTS.REQUIREMENT_WEIGHT +
    urgencyScore * MATCHING_WEIGHTS.URGENCY_WEIGHT +
    serviceAreaScore * MATCHING_WEIGHTS.SERVICE_AREA_WEIGHT;

  const matchScore = Math.min(
    SCORING_PARAMS.MAX_MATCH_SCORE,
    Math.max(SCORING_PARAMS.MIN_MATCH_SCORE, Math.round(rawScore))
  );

  return {
    matchScore,
    matchFactors: {
      distance: distanceScore,
      foodCompatibility: foodCompatibilityScore,
      quantityCompatibility: quantityCapacityScore,
      requirementMatch: requirementScore,
      urgency: urgencyScore,
      serviceArea: serviceAreaScore,
    },
    distanceKm,
  };
};

/**
 * Rank a list of candidate donations for a given NGO profile
 * @param {Array} donations
 * @param {object} ngoProfile
 * @returns {Array} Ranked donations with matchScore, matchFactors, and distanceKm
 */
const rankMatches = (donations = [], ngoProfile) => {
  if (!Array.isArray(donations) || !ngoProfile) return [];

  const evaluated = donations.map((donation) => {
    const match = calculateMatchScore(donation, ngoProfile);
    const donationObj = typeof donation.toObject === 'function' ? donation.toObject() : { ...donation };

    return {
      donation: donationObj,
      distanceKm: match.distanceKm,
      matchScore: match.matchScore,
      matchFactors: match.matchFactors,
    };
  });

  // Sort descending by matchScore; if equal, sort by distance ascending
  return evaluated.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distanceKm - b.distanceKm;
  });
};

/**
 * KNN Component: Select top K candidate NGOs for a given donation based on geographic proximity
 * and multi-factor similarity.
 *
 * NOTE: This is purely for candidate selection and candidate ranking, NOT route optimization.
 *
 * @param {object} donation
 * @param {Array} candidateNgos Array of NGO profile documents
 * @param {number} k Number of nearest/best candidate NGOs to return
 * @returns {Array} Top K candidate NGOs sorted by match score
 */
const getCandidateNGOs = (donation, candidateNgos = [], k = 5) => {
  if (!donation || !Array.isArray(candidateNgos) || candidateNgos.length === 0) {
    return [];
  }

  const scoredCandidates = candidateNgos.map((ngo) => {
    const match = calculateMatchScore(donation, ngo);
    const ngoObj = typeof ngo.toObject === 'function' ? ngo.toObject() : { ...ngo };

    return {
      ngo: ngoObj,
      distanceKm: match.distanceKm,
      matchScore: match.matchScore,
      matchFactors: match.matchFactors,
    };
  });

  // Rank by matchScore descending (and distance ascending)
  scoredCandidates.sort((a, b) => {
    if (b.matchScore !== a.matchScore) {
      return b.matchScore - a.matchScore;
    }
    return a.distanceKm - b.distanceKm;
  });

  return scoredCandidates.slice(0, Math.max(1, k));
};

/**
 * Clean integration point for future operational demand-driven matching priorities.
 * Provides advisory demand signal without breaking or hard-depending on the ML service.
 * @param {object} donation Donation listing document
 * @param {object} ngo NGO profile document
 * @param {object} demandForecast Optional active DemandForecast record
 * @returns {object} Advisory demand recommendation signal
 */
const getDemandSignal = (donation, ngo, demandForecast = null) => {
  if (!donation || !ngo) {
    return { hasSignal: false, priorityBoost: 0, reason: 'Insufficient context' };
  }

  const category = donation.foodCategory || 'OTHER';
  let isHighDemand = false;
  let gapMeals = 0;

  if (demandForecast && demandForecast.categoryBreakdown) {
    const matched = demandForecast.categoryBreakdown.find(
      (c) => c.category && c.category.toUpperCase().includes(category.substring(0, 4))
    );
    if (matched && matched.status === 'Deficit') {
      isHighDemand = true;
      gapMeals = Math.abs(matched.gap || 0);
    }
  }

  return {
    hasSignal: isHighDemand,
    priorityBoost: isHighDemand ? 5 : 0,
    category,
    gapMeals,
    advisoryNote: isHighDemand
      ? `High regional demand detected for ${category}. Priority allocation recommended.`
      : 'Standard distribution priority.',
  };
};

module.exports = {
  calculateDistanceKm,
  calculateDistanceScore,
  calculateFoodCompatibility,
  calculateQuantityCompatibility,
  calculateRequirementScore,
  calculateUrgencyScore,
  calculateServiceAreaScore,
  calculateMatchScore,
  rankMatches,
  getCandidateNGOs,
  getDemandSignal,
};
