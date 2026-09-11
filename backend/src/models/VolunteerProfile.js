/**
 * FoodShareAI - Volunteer Profile Model
 * Represents delivery and community outreach volunteers.
 */
const mongoose = require('mongoose');
const {
  VOLUNTEER_PREFERENCES,
  TRANSPORTATION_TYPES,
  AVAILABILITY_SLOTS,
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

const volunteerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID reference is required'],
      unique: true,
      index: true,
    },
    fullName: {
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
    volunteerPreferences: [
      {
        type: String,
        enum: {
          values: VOLUNTEER_PREFERENCES,
          message: '{VALUE} is not a valid volunteer preference',
        },
      },
    ],
    availability: [
      {
        type: String,
        enum: {
          values: AVAILABILITY_SLOTS,
          message: '{VALUE} is not a valid availability slot',
        },
      },
    ],
    preferredTravelRadius: {
      type: Number,
      min: [0, 'Travel radius cannot be negative'],
      default: 5, // km
    },
    transportation: {
      type: String,
      enum: {
        values: TRANSPORTATION_TYPES,
        message: '{VALUE} is not a valid transportation mode',
      },
      default: 'TWO_WHEELER',
    },
    location: {
      type: pointSchema,
      required: [true, 'Volunteer current or base location is required'],
    },
    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
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
    impactPoints: {
      type: Number,
      min: 0,
      default: 0,
    },
    completedDeliveries: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// 2dsphere index for locating nearby volunteers
volunteerProfileSchema.index({ location: '2dsphere' });
volunteerProfileSchema.index({ isAvailable: 1, verificationStatus: 1 });
volunteerProfileSchema.index({ impactPoints: -1, completedDeliveries: -1 });

const VolunteerProfile = mongoose.model('VolunteerProfile', volunteerProfileSchema);

module.exports = VolunteerProfile;
