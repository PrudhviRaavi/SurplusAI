/**
 * FoodShareAI - NGO Profile Model
 * Represents recipient non-profit organizations, shelters, and food banks.
 */
const mongoose = require('mongoose');
const {
  NGO_ORGANIZATION_TYPES,
  FOOD_CATEGORIES,
  VERIFICATION_STATUS,
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

const ngoProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true,
    },
    organizationName: {
      type: String,
      required: [true, 'NGO/Organization name is required'],
      trim: true,
    },
    organizationType: {
      type: String,
      required: [true, 'Organization type is required'],
      enum: {
        values: NGO_ORGANIZATION_TYPES,
        message: '{VALUE} is not a valid organization type',
      },
      index: true,
    },
    registrationNumber: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    representativeName: {
      type: String,
      trim: true,
      default: '',
    },
    designation: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: '',
    },
    address: {
      street: { type: String, trim: true, default: '' },
      city: { type: String, trim: true, default: '' },
      state: { type: String, trim: true, default: '' },
      postalCode: { type: String, trim: true, default: '' },
      country: { type: String, trim: true, default: 'India' },
    },
    location: {
      type: pointSchema,
      required: [true, 'NGO geolocation point is required'],
    },
    foodRequirements: [
      {
        type: String,
        enum: {
          values: FOOD_CATEGORIES,
          message: '{VALUE} is not a valid food category',
        },
      },
    ],
    estimatedMealsRequiredPerDay: {
      type: Number,
      min: [0, 'Meals required cannot be negative'],
      default: 0,
    },
    maximumDailyCapacity: {
      type: Number,
      min: [0, 'Daily capacity cannot be negative'],
      default: 0,
    },
    operatingHours: {
      open: { type: String, default: '08:00' },
      close: { type: String, default: '20:00' },
      notes: { type: String, trim: true, default: '' },
    },
    preferredPickupRadius: {
      type: Number,
      min: [0, 'Pickup radius cannot be negative'],
      default: 10, // km
    },
    verificationStatus: {
      type: String,
      enum: {
        values: [
          VERIFICATION_STATUS.PENDING,
          VERIFICATION_STATUS.VERIFIED,
          VERIFICATION_STATUS.SUSPENDED,
          VERIFICATION_STATUS.REJECTED,
          VERIFICATION_STATUS.UNDER_REVIEW,
        ],
        message: '{VALUE} is not a valid verification status',
      },
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    reviewedAt: {
      type: Date,
      default: null,
    },
    reviewReason: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for proximity searches & smart matching queries
ngoProfileSchema.index({ location: '2dsphere' });
ngoProfileSchema.index({ organizationType: 1, verificationStatus: 1 });

const NgoProfile = mongoose.model('NgoProfile', ngoProfileSchema);

module.exports = NgoProfile;
