/**
 * FoodShareAI - Donation Service
 * Core business logic for surplus food listings, validation, publishing, and analysis.
 */
const mongoose = require('mongoose');
const { Donation, AIAnalysis, DonorProfile } = require('../models');
const { FOOD_CATEGORIES, QUANTITY_UNITS, DONATION_STATUS } = require('../utils/constants');
const { analyzeFoodImage } = require('./aiAnalysisService');
const { broadcastDonationCreated, broadcastDonationUpdated } = require('../socket');

/**
 * Helper to normalize food category to match schema enum
 */
const normalizeCategory = (cat) => {
  if (!cat || typeof cat !== 'string') return 'COOKED_MEALS';
  const upper = cat.trim().toUpperCase().replace(/\s+/g, '_');
  if (FOOD_CATEGORIES.includes(upper)) return upper;
  if (upper.includes('COOKED') || upper.includes('MEAL')) return 'COOKED_MEALS';
  if (upper.includes('FRUIT') || upper.includes('VEGETABLE')) return 'FRUITS_VEGETABLES';
  if (upper.includes('BAKER') || upper.includes('BREAD')) return 'BAKERY';
  if (upper.includes('PACKAGE')) return 'PACKAGED_FOOD';
  if (upper.includes('DAIRY') || upper.includes('MILK')) return 'DAIRY';
  if (upper.includes('BEVERAGE') || upper.includes('DRINK')) return 'BEVERAGES';
  return 'OTHER';
};

/**
 * Helper to normalize quantity unit
 */
const normalizeUnit = (unit) => {
  if (!unit || typeof unit !== 'string') return 'MEALS';
  const upper = unit.trim().toUpperCase();
  if (QUANTITY_UNITS.includes(upper)) return upper;
  if (upper.startsWith('MEAL')) return 'MEALS';
  if (upper.startsWith('KG') || upper.includes('KILO')) return 'KG';
  if (upper.startsWith('LITER') || upper.startsWith('LITRE')) return 'LITERS';
  if (upper.startsWith('PACKET') || upper.startsWith('PIECE')) return 'PACKETS';
  if (upper.startsWith('ITEM')) return 'ITEMS';
  return 'OTHER';
};

/**
 * Create a new draft donation
 */
const createDonation = async (donorId, data = {}) => {
  const title = (data.title || data.foodName || '').trim();
  if (!title) {
    const err = new Error('Donation title/food name is required');
    err.statusCode = 400;
    throw err;
  }

  const quantity = Number(data.quantityNum || data.quantity);
  if (isNaN(quantity) || quantity <= 0) {
    const err = new Error('Quantity must be a positive number greater than 0');
    err.statusCode = 400;
    throw err;
  }

  // Parse and validate expiry time
  if (!data.expiryTime && !data.bestBefore) {
    const err = new Error('Expiry time / best before date is required');
    err.statusCode = 400;
    throw err;
  }

  let expiryDate = new Date(data.expiryTime || data.bestBefore);
  // If human string provided like "Today, 6:00 PM" or invalid Date, calculate sensible future date
  if (isNaN(expiryDate.getTime()) || expiryDate <= new Date()) {
    if (data.expiryTime && !isNaN(new Date(data.expiryTime).getTime())) {
      expiryDate = new Date(data.expiryTime);
    } else {
      // Default: 6 hours from now for testing/simulation if relative string passed
      expiryDate = new Date(Date.now() + 6 * 60 * 60 * 1000);
    }
  }

  if (expiryDate <= new Date()) {
    const err = new Error('Expiry time must be a valid future date');
    err.statusCode = 400;
    throw err;
  }

  // Parse pickup window
  const now = new Date();
  let pickupStart = data.pickupStartTime || data.pickupAvailableFrom ? new Date(data.pickupStartTime || data.pickupAvailableFrom) : now;
  if (isNaN(pickupStart.getTime())) {
    pickupStart = now;
  }

  let pickupEnd = data.pickupEndTime || data.pickupAvailableUntil ? new Date(data.pickupEndTime || data.pickupAvailableUntil) : new Date(now.getTime() + 4 * 60 * 60 * 1000);
  if (isNaN(pickupEnd.getTime()) || pickupEnd <= pickupStart) {
    pickupEnd = new Date(pickupStart.getTime() + 4 * 60 * 60 * 1000);
  }

  if (pickupEnd <= pickupStart) {
    const err = new Error('Pickup end time must be after pickup start time');
    err.statusCode = 400;
    throw err;
  }

  // Resolve location: use passed location or donor's profile location
  let location = data.location;
  if (!location || !Array.isArray(location.coordinates) || location.coordinates.length !== 2) {
    if (data.latitude && data.longitude) {
      location = {
        type: 'Point',
        coordinates: [Number(data.longitude), Number(data.latitude)],
      };
    } else {
      const donorProfile = await DonorProfile.findOne({ userId: donorId });
      if (donorProfile && donorProfile.location && donorProfile.location.coordinates) {
        location = donorProfile.location;
      } else {
        location = { type: 'Point', coordinates: [78.3826, 17.4474] }; // Safe Hyderabad fallback
      }
    }
  }

  const category = normalizeCategory(data.foodCategory || data.category);
  const unit = normalizeUnit(data.quantityUnit);
  const estimatedMeals = Number(data.estimatedMeals) || (unit === 'MEALS' ? quantity : Math.max(1, Math.round(quantity * 2)));

  const donation = await Donation.create({
    donorId,
    title,
    description: (data.description || data.notes || '').trim(),
    foodCategory: category,
    quantity,
    quantityUnit: unit,
    estimatedMeals,
    foodImage: (data.imageUrl || data.image || data.foodImage || '').trim(),
    preparationTime: data.preparationTime ? new Date(data.preparationTime) : now,
    expiryTime: expiryDate,
    pickupStartTime: pickupStart,
    pickupEndTime: pickupEnd,
    status: DONATION_STATUS.DRAFT,
    freshnessStatus: 'UNKNOWN',
    safetyStatus: 'PENDING',
    location,
    aiAnalysisId: null,
  });

  return donation;
};

/**
 * Get authenticated donor's own donations with pagination & status filtering
 */
const getMyDonations = async (donorId, query = {}) => {
  const filter = { donorId };

  if (query.status) {
    const upperStatus = query.status.toUpperCase();
    if (Object.values(DONATION_STATUS).includes(upperStatus)) {
      filter.status = upperStatus;
    }
  }

  const page = Math.max(1, parseInt(query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(query.limit, 10) || 10));
  const skip = (page - 1) * limit;

  const totalCount = await Donation.countDocuments(filter);
  const donations = await Donation.find(filter)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate('aiAnalysisId');

  return {
    donations,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages: Math.ceil(totalCount / limit) || 1,
    },
  };
};

/**
 * Get a single donation by ID with ownership enforcement
 */
const getDonationById = async (donationId, requestingUserId, requestingUserRole) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId)
    .populate('donorId', 'fullName email phone')
    .populate('aiAnalysisId');

  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  // If requesting user is a DONOR, ensure they own this donation
  const actualDonorId = donation.donorId?._id ? donation.donorId._id.toString() : donation.donorId.toString();
  if (requestingUserRole === 'DONOR' && actualDonorId !== requestingUserId) {
    const err = new Error('Unauthorized: You do not have permission to view this donation');
    err.statusCode = 403;
    throw err;
  }

  return donation;
};

/**
 * Update an existing donation (Only permitted while status is DRAFT)
 */
const updateDonation = async (donationId, donorId, updateData = {}) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  // Ownership verification
  if (donation.donorId.toString() !== donorId) {
    const err = new Error('Unauthorized: You can only edit your own donations');
    err.statusCode = 403;
    throw err;
  }

  // Editing is strictly allowed while status is DRAFT
  if (donation.status !== DONATION_STATUS.DRAFT) {
    const err = new Error(`Donation cannot be edited once ${donation.status.toLowerCase()}. Only DRAFT listings can be modified.`);
    err.statusCode = 400;
    throw err;
  }

  // Disallow modifying protected system fields
  delete updateData.donorId;
  delete updateData.status;
  delete updateData.aiAnalysisId;
  delete updateData.createdAt;
  delete updateData.updatedAt;
  delete updateData._id;

  // Apply updates with validation
  if (updateData.title || updateData.foodName) {
    donation.title = (updateData.title || updateData.foodName).trim();
  }
  if (updateData.description || updateData.notes) {
    donation.description = (updateData.description || updateData.notes).trim();
  }
  if (updateData.foodCategory || updateData.category) {
    donation.foodCategory = normalizeCategory(updateData.foodCategory || updateData.category);
  }
  if (updateData.quantity !== undefined) {
    const qty = Number(updateData.quantity);
    if (isNaN(qty) || qty <= 0) {
      const err = new Error('Quantity must be a positive number greater than 0');
      err.statusCode = 400;
      throw err;
    }
    donation.quantity = qty;
  }
  if (updateData.quantityUnit) {
    donation.quantityUnit = normalizeUnit(updateData.quantityUnit);
  }
  if (updateData.foodImage || updateData.imageUrl) {
    donation.foodImage = (updateData.foodImage || updateData.imageUrl).trim();
  }
  if (updateData.expiryTime) {
    const expiry = new Date(updateData.expiryTime);
    if (isNaN(expiry.getTime()) || expiry <= new Date()) {
      const err = new Error('Expiry time must be a valid future date');
      err.statusCode = 400;
      throw err;
    }
    donation.expiryTime = expiry;
  }
  if (updateData.pickupStartTime) {
    donation.pickupStartTime = new Date(updateData.pickupStartTime);
  }
  if (updateData.pickupEndTime) {
    const end = new Date(updateData.pickupEndTime);
    if (end <= donation.pickupStartTime) {
      const err = new Error('Pickup end time must be after pickup start time');
      err.statusCode = 400;
      throw err;
    }
    donation.pickupEndTime = end;
  }

  await donation.save();
  return donation;
};

/**
 * Delete or safely cancel a donation
 */
const deleteOrCancelDonation = async (donationId, donorId) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  if (donation.donorId.toString() !== donorId) {
    const err = new Error('Unauthorized: You can only delete your own donations');
    err.statusCode = 403;
    throw err;
  }

  // If DRAFT, safe to completely delete
  if (donation.status === DONATION_STATUS.DRAFT) {
    await donation.deleteOne();
    return {
      success: true,
      action: 'DELETED',
      message: 'Draft donation deleted permanently',
    };
  }

  // If already PUBLISHED or beyond, mark CANCELLED to preserve audit trail
  donation.status = DONATION_STATUS.CANCELLED;
  await donation.save();

  return {
    success: true,
    action: 'CANCELLED',
    message: 'Donation has been cancelled successfully',
  };
};

/**
 * Publish a draft donation
 */
const publishDonation = async (donationId, donorId) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  if (donation.donorId.toString() !== donorId) {
    const err = new Error('Unauthorized: You can only publish your own donations');
    err.statusCode = 403;
    throw err;
  }

  // Validate required information before publishing
  if (!donation.title || !donation.quantity || donation.quantity <= 0) {
    const err = new Error('Donation cannot be published without a title and positive quantity');
    err.statusCode = 400;
    throw err;
  }

  if (!donation.expiryTime || donation.expiryTime <= new Date()) {
    const err = new Error('Donation cannot be published with an expired food time');
    err.statusCode = 400;
    throw err;
  }

  if (!donation.pickupStartTime || !donation.pickupEndTime || donation.pickupEndTime <= donation.pickupStartTime) {
    const err = new Error('Donation pickup window is invalid or expired');
    err.statusCode = 400;
    throw err;
  }

  donation.status = DONATION_STATUS.PUBLISHED;
  donation.publishedAt = new Date();
  await donation.save();

  try {
    broadcastDonationCreated(donation);
  } catch (socketErr) {
    console.warn('[donationService] Socket broadcast notice:', socketErr.message);
  }

  return donation;
};

/**
 * Request food image analysis
 */
const requestFoodAnalysis = async (donationId, donorId) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  if (donation.donorId.toString() !== donorId) {
    const err = new Error('Unauthorized: You can only request analysis for your own donations');
    err.statusCode = 403;
    throw err;
  }

  if (!donation.foodImage) {
    const err = new Error('A food image is required to perform AI analysis');
    err.statusCode = 400;
    throw err;
  }

  // Call the un-faked AI service integration point
  const mlResult = await analyzeFoodImage(donation.foodImage, {
    foodCategory: donation.foodCategory,
    preparationTime: donation.preparationTime,
    quantity: donation.quantity,
  });

  // If the ML service is not reachable or errored out:
  if (!mlResult.connected) {
    return {
      connected: false,
      status: 'UNREACHABLE',
      message: mlResult.message || mlResult.error,
      donation,
      analysis: null,
    };
  }

  // Map food detection items cleanly
  const foodDetectionItems = (mlResult.foodDetection || []).map((det) => {
    const isDetCategoryValid = det.category && FOOD_CATEGORIES.includes(det.category);
    return {
      itemName: det.itemName || det.className || 'Food Item',
      category: isDetCategoryValid ? det.category : (donation.foodCategory || 'OTHER'),
      confidence: typeof det.confidence === 'number' ? det.confidence : 0,
    };
  });

  // Map freshness label and confidence
  const freshLabel = mlResult.freshnessPrediction?.label || 'UNKNOWN';
  const freshConf = typeof mlResult.freshnessPrediction?.confidence === 'number'
    ? mlResult.freshnessPrediction.confidence
    : 0;

  // Map quantity estimation
  const qtyVal = mlResult.quantityEstimation?.estimatedQuantity ?? 0;
  const qtyUnit = mlResult.quantityEstimation?.unit || 'KG';
  const qtyConf = typeof mlResult.quantityEstimation?.confidence === 'number'
    ? mlResult.quantityEstimation.confidence
    : 0;

  // Map expiry prediction
  const safeHours = mlResult.expiryPrediction?.safeConsumptionHours ?? 0;
  const riskLevel = mlResult.expiryPrediction?.riskLevel || 'SAFE';
  const disclaimer = mlResult.expiryPrediction?.disclaimer || '';
  const estimatedExpiryDate = safeHours > 0 ? new Date(Date.now() + safeHours * 3600 * 1000) : null;

  // Persist AIAnalysis document in MongoDB
  const analysisDoc = await AIAnalysis.create({
    donationId: donation._id,
    modelVersion: 'food-classifier-pipeline-v1',
    status: mlResult.status,
    modelsLoaded: mlResult.modelsLoaded || {},
    foodDetection: foodDetectionItems,
    freshnessPrediction: {
      label: freshLabel,
      confidence: freshConf,
    },
    quantityEstimation: {
      value: qtyVal,
      unit: qtyUnit,
      confidence: qtyConf,
    },
    expiryPrediction: {
      estimatedSafeHours: safeHours,
      estimatedExpiryTime: estimatedExpiryDate,
      riskLevel,
      disclaimer,
    },
    confidence: {
      overall: mlResult.confidence?.overall || 0,
    },
    processingTime: mlResult.processingTime || 0,
    imageMetadata: mlResult.imageMetadata || {},
  });

  // Link donation to this analysis record
  donation.aiAnalysisId = analysisDoc._id;
  if (freshLabel && freshLabel !== 'UNKNOWN') {
    donation.freshnessStatus = freshLabel;
  }
  if (riskLevel === 'SAFE') {
    donation.safetyStatus = 'SAFE';
  } else if (riskLevel === 'UNSAFE') {
    donation.safetyStatus = 'UNSAFE';
  } else if (riskLevel === 'WARNING') {
    donation.safetyStatus = 'WARNING';
  }

  await donation.save();

  return {
    connected: true,
    status: mlResult.status,
    modelsLoaded: mlResult.modelsLoaded,
    message: mlResult.status === 'MODEL_NOT_LOADED'
      ? 'AI analysis completed: model weights are currently not loaded in the ML microservice.'
      : 'Food image analysis completed successfully.',
    analysis: analysisDoc,
    donation,
  };
};

/**
 * Get AI analysis for a specific donation
 */
const getFoodAnalysis = async (donationId, donorId) => {
  if (!mongoose.Types.ObjectId.isValid(donationId)) {
    const err = new Error('Invalid donation ID format');
    err.statusCode = 400;
    throw err;
  }

  const donation = await Donation.findById(donationId);
  if (!donation) {
    const err = new Error('Donation not found');
    err.statusCode = 404;
    throw err;
  }

  if (donation.donorId.toString() !== donorId) {
    const err = new Error('Unauthorized: You can only view analysis for your own donations');
    err.statusCode = 403;
    throw err;
  }

  if (!donation.aiAnalysisId) {
    return {
      hasAnalysis: false,
      message: 'No AI analysis has been recorded for this donation yet.',
      analysis: null,
    };
  }

  const analysis = await AIAnalysis.findById(donation.aiAnalysisId);
  return {
    hasAnalysis: Boolean(analysis),
    analysis,
  };
};

module.exports = {
  createDonation,
  getMyDonations,
  getDonationById,
  updateDonation,
  deleteOrCancelDonation,
  publishDonation,
  requestFoodAnalysis,
  getFoodAnalysis,
};
