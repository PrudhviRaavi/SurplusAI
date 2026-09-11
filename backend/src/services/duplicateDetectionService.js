/**
 * FoodShareAI - Duplicate Donation Detection Service
 * Deterministic multi-factor duplicate detection analyzing donor history,
 * category, title similarity, quantity, pickup coordinates, timestamps, and image fingerprinting.
 * Strictly explainable without random or black-box probability generation.
 */
const crypto = require('crypto');
const { Donation } = require('../models');

/**
 * Computes an MD5 or normalized perceptual content hash for an image string/URI.
 */
const computeImageHash = (imageStr) => {
  if (!imageStr || typeof imageStr !== 'string') return null;
  // If base64, hash content bytes; if URL, normalize and hash
  return crypto.createHash('md5').update(imageStr.trim()).digest('hex');
};

/**
 * Calculates string similarity using word token overlap (Jaccard coefficient).
 */
const calculateTextSimilarity = (strA, strB) => {
  if (!strA || !strB) return 0;
  const tokensA = new Set(strA.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  const tokensB = new Set(strB.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(Boolean));
  if (tokensA.size === 0 || tokensB.size === 0) return 0;

  const intersection = new Set([...tokensA].filter((x) => tokensB.has(x)));
  const union = new Set([...tokensA, ...tokensB]);
  return intersection.size / union.size;
};

/**
 * Computes Haversine distance in meters between two GeoJSON points [lng, lat].
 */
const calculateDistanceMeters = (coordsA, coordsB) => {
  if (!coordsA || !coordsB || coordsA.length < 2 || coordsB.length < 2) return Infinity;
  const toRad = (deg) => (deg * Math.PI) / 180;
  const [lng1, lat1] = coordsA;
  const [lng2, lat2] = coordsB;
  const R = 6371000; // Earth radius in meters
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Calculates deterministic similarity score (0 to 100) between two donations with factor breakdown.
 */
const calculateDuplicateSimilarity = (donationA, donationB) => {
  let totalScore = 0;
  const reasons = [];

  // 1. Same Donor Check (Prerequisite for high-confidence duplicate)
  const isSameDonor = donationA.donorId && donationB.donorId && donationA.donorId.toString() === donationB.donorId.toString();

  // 2. Image Hash Check (Up to 35 points)
  const hashA = donationA.imageHash || computeImageHash(donationA.foodImage);
  const hashB = donationB.imageHash || computeImageHash(donationB.foodImage);
  if (hashA && hashB && hashA === hashB) {
    totalScore += 35;
    reasons.push('Identical image fingerprint match');
  }

  // 3. Title & Food Category Similarity (Up to 25 points)
  const categoryMatch = donationA.foodCategory === donationB.foodCategory;
  const titleSim = calculateTextSimilarity(donationA.title, donationB.title);
  if (categoryMatch && titleSim > 0.6) {
    const textScore = Math.round(15 + titleSim * 10);
    totalScore += textScore;
    reasons.push(`High title similarity (${Math.round(titleSim * 100)}%) in identical category (${donationA.foodCategory})`);
  } else if (categoryMatch) {
    totalScore += 5;
  }

  // 4. Quantity & Unit Compatibility (Up to 15 points)
  if (donationA.quantityUnit === donationB.quantityUnit && donationA.quantity > 0) {
    const qtyDiffRatio = Math.abs(donationA.quantity - donationB.quantity) / Math.max(donationA.quantity, donationB.quantity);
    if (qtyDiffRatio < 0.05) {
      totalScore += 15;
      reasons.push(`Identical quantity (${donationA.quantity} ${donationA.quantityUnit})`);
    } else if (qtyDiffRatio < 0.2) {
      totalScore += 8;
      reasons.push(`Similar quantity within 20% (${donationA.quantity} vs ${donationB.quantity} ${donationA.quantityUnit})`);
    }
  }

  // 5. Geographic Location Proximity (Up to 15 points)
  const coordsA = donationA.location && donationA.location.coordinates;
  const coordsB = donationB.location && donationB.location.coordinates;
  if (coordsA && coordsB) {
    const distMeters = calculateDistanceMeters(coordsA, coordsB);
    if (distMeters <= 50) {
      totalScore += 15;
      reasons.push('Matching pickup location coordinates (< 50m)');
    } else if (distMeters <= 300) {
      totalScore += 8;
      reasons.push(`Near identical pickup location (< ${Math.round(distMeters)}m)`);
    }
  }

  // 6. Creation Timestamp Velocity (Up to 10 points)
  const timeA = new Date(donationA.createdAt || Date.now()).getTime();
  const timeB = new Date(donationB.createdAt || Date.now()).getTime();
  const timeDiffMinutes = Math.abs(timeA - timeB) / (1000 * 60);

  if (isSameDonor && timeDiffMinutes <= 15) {
    totalScore += 10;
    reasons.push(`Rapid sequential submission (${Math.round(timeDiffMinutes)} min gap)`);
  } else if (isSameDonor && timeDiffMinutes <= 120) {
    totalScore += 5;
  }

  // If donors are different, cap duplicate score unless image hash is 100% identical
  if (!isSameDonor) {
    totalScore = hashA && hashB && hashA === hashB ? Math.min(totalScore, 60) : Math.min(totalScore, 40);
  }

  const confidencePercent = Math.min(100, Math.max(0, Math.round(totalScore)));

  return {
    confidencePercent,
    isPotentialDuplicate: confidencePercent >= 70,
    reasons,
  };
};

/**
 * Searches MongoDB for existing donations matching the given candidate to find potential duplicates.
 */
const findPotentialDuplicates = async (donationId) => {
  const targetDonation = await Donation.findById(donationId).lean();
  if (!targetDonation) {
    const error = new Error('Donation not found');
    error.statusCode = 404;
    throw error;
  }

  // Look for other donations by the same donor or recent active donations in same category (past 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const candidates = await Donation.find({
    _id: { $ne: targetDonation._id },
    $or: [
      { donorId: targetDonation.donorId },
      { foodCategory: targetDonation.foodCategory, createdAt: { $gte: sevenDaysAgo } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(20)
    .lean();

  const potentialDuplicates = [];
  let highestSimilarity = 0;

  for (const candidate of candidates) {
    const result = calculateDuplicateSimilarity(targetDonation, candidate);
    if (result.confidencePercent > highestSimilarity) {
      highestSimilarity = result.confidencePercent;
    }

    if (result.isPotentialDuplicate) {
      potentialDuplicates.push({
        donationId: candidate._id,
        title: candidate.title,
        foodCategory: candidate.foodCategory,
        quantity: candidate.quantity,
        quantityUnit: candidate.quantityUnit,
        createdAt: candidate.createdAt,
        confidencePercent: result.confidencePercent,
        reasons: result.reasons,
      });
    }
  }

  // Sort descending by confidence
  potentialDuplicates.sort((a, b) => b.confidencePercent - a.confidencePercent);

  const status = potentialDuplicates.length > 0 ? 'POTENTIAL_DUPLICATE' : 'CLEAR';

  return {
    donationId: targetDonation._id,
    potentialDuplicates,
    similarity: highestSimilarity,
    status,
    checkedAt: new Date().toISOString(),
  };
};

module.exports = {
  computeImageHash,
  calculateTextSimilarity,
  calculateDistanceMeters,
  calculateDuplicateSimilarity,
  findPotentialDuplicates,
};
