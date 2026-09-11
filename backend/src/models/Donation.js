/**
 * FoodShareAI - Donation Model
 * Core model representing a surplus food listing.
 */
const mongoose = require('mongoose');
const {
  FOOD_CATEGORIES,
  QUANTITY_UNITS,
  FRESHNESS_STATUS,
  SAFETY_STATUS,
  DONATION_STATUS,
} = require('../utils/constants');

const pointSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
      required: true,
    },
    // [longitude, latitude]
    coordinates: {
      type: [Number],
      required: [true, 'Geographic coordinates [lng, lat] are required'],
      validate: {
        validator: function (val) {
          return (
            Array.isArray(val) &&
            val.length === 2 &&
            val[0] >= -180 &&
            val[0] <= 180 &&
            val[1] >= -90 &&
            val[1] <= 90
          );
        },
        message: 'Coordinates must be [longitude (-180 to 180), latitude (-90 to 90)]',
      },
    },
  },
  { _id: false }
);

const donationSchema = new mongoose.Schema(
  {
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor ID reference is required'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Donation title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    description: {
      type: String,
      trim: true,
      default: '',
      maxlength: [1000, 'Description cannot exceed 1000 characters'],
    },
    foodCategory: {
      type: String,
      required: [true, 'Food category is required'],
      enum: {
        values: FOOD_CATEGORIES,
        message: '{VALUE} is not a valid food category',
      },
      index: true,
    },
    quantity: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [0.1, 'Quantity must be at least 0.1'],
    },
    quantityUnit: {
      type: String,
      required: [true, 'Quantity unit is required'],
      enum: {
        values: QUANTITY_UNITS,
        message: '{VALUE} is not a valid quantity unit',
      },
    },
    estimatedMeals: {
      type: Number,
      min: [1, 'Estimated meals must be at least 1'],
      default: 1,
    },
    foodImage: {
      type: String,
      trim: true,
      default: '',
    },
    preparationTime: {
      type: Date,
      default: null,
    },
    expiryTime: {
      type: Date,
      required: [true, 'Food expiry time is required'],
      index: true,
    },
    pickupStartTime: {
      type: Date,
      required: [true, 'Pickup start time is required'],
    },
    pickupEndTime: {
      type: Date,
      required: [true, 'Pickup end time is required'],
      validate: {
        validator: function (val) {
          // If pickupStartTime is present, pickupEndTime must be after it
          return !this.pickupStartTime || val > this.pickupStartTime;
        },
        message: 'Pickup end time must be after pickup start time',
      },
    },
    freshnessStatus: {
      type: String,
      enum: {
        values: Object.values(FRESHNESS_STATUS),
        message: '{VALUE} is not a valid freshness status',
      },
      default: FRESHNESS_STATUS.UNKNOWN,
      index: true,
    },
    safetyStatus: {
      type: String,
      enum: {
        values: Object.values(SAFETY_STATUS),
        message: '{VALUE} is not a valid safety status',
      },
      default: SAFETY_STATUS.PENDING,
      index: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DONATION_STATUS),
        message: '{VALUE} is not a valid donation status',
      },
      default: DONATION_STATUS.DRAFT,
      index: true,
    },
    location: {
      type: pointSchema,
      required: [true, 'Pickup location is required'],
    },
    aiAnalysisId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIAnalysis',
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
    },
    claimedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    imageHash: {
      type: String,
      trim: true,
      default: null,
      index: true,
    },
    duplicateFlag: {
      type: Boolean,
      default: false,
      index: true,
    },
    potentialDuplicateOf: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for spatial search, expiration monitoring, duplicate queries, and status queries
donationSchema.index({ location: '2dsphere' });
donationSchema.index({ status: 1, foodCategory: 1, expiryTime: 1 });
donationSchema.index({ donorId: 1, createdAt: -1 });
donationSchema.index({ donorId: 1, foodCategory: 1, createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);

module.exports = Donation;
