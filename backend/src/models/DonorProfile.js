/**
 * FoodShareAI - Donor Profile Model
 * Represents specialized organization & operational data for food donors.
 */
const mongoose = require('mongoose');
const {
  DONOR_TYPES,
  FOOD_CATEGORIES,
  DONATION_FREQUENCIES,
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

const donorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true,
    },
    donorType: {
      type: String,
      required: [true, 'Donor type is required'],
      enum: {
        values: DONOR_TYPES,
        message: '{VALUE} is not a recognized donor type',
      },
      index: true,
    },
    organizationName: {
      type: String,
      trim: true,
      default: '',
    },
    contactPerson: {
      type: String,
      trim: true,
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
      required: [true, 'Donor geolocation point is required'],
    },
    foodCategories: [
      {
        type: String,
        enum: {
          values: FOOD_CATEGORIES,
          message: '{VALUE} is not a recognized food category',
        },
      },
    ],
    typicalDonationQuantity: {
      type: Number,
      min: [0, 'Typical donation quantity cannot be negative'],
      default: 0,
    },
    donationFrequency: {
      type: String,
      enum: {
        values: DONATION_FREQUENCIES,
        message: '{VALUE} is not a valid donation frequency',
      },
      default: 'AS_AVAILABLE',
    },
    operatingHours: {
      open: { type: String, default: '09:00' },
      close: { type: String, default: '22:00' },
      notes: { type: String, trim: true, default: '' },
    },
    verificationStatus: {
      type: String,
      enum: {
        values: [
          VERIFICATION_STATUS.PENDING,
          VERIFICATION_STATUS.VERIFIED,
          VERIFICATION_STATUS.REJECTED,
        ],
        message: '{VALUE} is not a valid verification status',
      },
      default: VERIFICATION_STATUS.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for proximity searches & spatial queries
donorProfileSchema.index({ location: '2dsphere' });

const DonorProfile = mongoose.model('DonorProfile', donorProfileSchema);

module.exports = DonorProfile;
