/**
 * FoodShareAI - Delivery Model
 * Represents volunteer pickup, transit, and distribution tasks.
 */
const mongoose = require('mongoose');
const { DELIVERY_STATUS } = require('../utils/constants');

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
      required: [true, 'Coordinates [lng, lat] are required'],
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

const lineStringSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['LineString'],
      default: 'LineString',
      required: true,
    },
    coordinates: {
      type: [[Number]],
      default: [],
    },
  },
  { _id: false }
);

const deliverySchema = new mongoose.Schema(
  {
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation',
      required: [true, 'Donation ID reference is required'],
      index: true,
    },
    claimId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Claim',
      required: [true, 'Claim ID reference is required'],
      index: true,
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'NGO reference is required'],
      index: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Donor reference is required'],
      index: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    pickupLocation: {
      type: pointSchema,
      required: [true, 'Pickup location is required'],
    },
    deliveryLocation: {
      type: pointSchema,
      required: [true, 'Delivery destination location is required'],
    },
    route: {
      type: lineStringSchema,
      default: () => ({ type: 'LineString', coordinates: [] }),
    },
    routeDistance: {
      type: Number, // Distance in meters
      min: 0,
      default: 0,
    },
    estimatedDuration: {
      type: Number, // Duration in minutes
      min: 0,
      default: 0,
    },
    routeGeneratedAt: {
      type: Date,
      default: null,
    },
    routeAlgorithm: {
      type: String,
      default: 'A*',
    },
    currentLocation: {
      type: pointSchema,
      default: null,
    },
    lastLocationUpdateAt: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(DELIVERY_STATUS),
        message: '{VALUE} is not a valid delivery status',
      },
      default: DELIVERY_STATUS.AVAILABLE,
      index: true,
    },
    pickupConfirmedAt: {
      type: Date,
      default: null,
    },
    foodCollectedAt: {
      type: Date,
      default: null,
    },
    arrivedAt: {
      type: Date,
      default: null,
    },
    proofOfDelivery: {
      photoUrl: { type: String, default: '' },
      notes: { type: String, trim: true, default: '' },
      signatureUrl: { type: String, default: '' },
    },
    completedAt: {
      type: Date,
      default: null,
    },
    pointsAwarded: {
      type: Boolean,
      default: false,
      index: true,
    },
    impactRecorded: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

deliverySchema.index({ pickupLocation: '2dsphere' });
deliverySchema.index({ volunteerId: 1, status: 1 });
deliverySchema.index({ ngoId: 1, status: 1 });
deliverySchema.index({ status: 1, createdAt: -1 });

const Delivery = mongoose.model('Delivery', deliverySchema);

module.exports = Delivery;
