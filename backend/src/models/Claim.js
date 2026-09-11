/**
 * FoodShareAI - Claim Model
 * Represents an NGO request or allocation for a food donation.
 */
const mongoose = require('mongoose');
const { CLAIM_STATUS } = require('../utils/constants');

const matchFactorsSchema = new mongoose.Schema(
  {
    distanceScore: { type: Number, min: 0, max: 100, default: 0 },
    foodCompatibilityScore: { type: Number, min: 0, max: 100, default: 0 },
    quantityCapacityScore: { type: Number, min: 0, max: 100, default: 0 },
    urgencyScore: { type: Number, min: 0, max: 100, default: 0 },
    availabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    historicalReliabilityScore: { type: Number, min: 0, max: 100, default: 0 },
    demandScore: { type: Number, min: 0, max: 100, default: 0 },
    routeEfficiencyScore: { type: Number, min: 0, max: 100, default: 0 },
  },
  { _id: false }
);

const claimSchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: [true, 'Donation ID reference is required'],
      index: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'NGO user reference is required'],
      index: true,
    },
    requestedQuantity: {
      type: Number,
      required: [true, 'Requested quantity is required'],
      min: [0.1, 'Requested quantity must be greater than 0'],
    },
    matchScore: {
      type: Number,
      min: [0, 'Match score cannot be less than 0'],
      max: [100, 'Match score cannot exceed 100'],
      default: 0,
    },
    matchFactors: {
      type: matchFactorsSchema,
      default: () => ({}),
    },
    status: {
      type: String,
      enum: {
        values: Object.values(CLAIM_STATUS),
        message: '{VALUE} is not a valid claim status',
      },
      default: CLAIM_STATUS.REQUESTED,
      index: true,
    },
    claimedAt: {
      type: Date,
      default: Date.now,
    },
    confirmedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound indexes for fast lookups
claimSchema.index({ donationId: 1, ngoId: 1 });
claimSchema.index({ status: 1, createdAt: -1 });

const Claim = mongoose.model('Claim', claimSchema);

module.exports = Claim;
