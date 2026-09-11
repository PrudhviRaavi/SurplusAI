/**
 * FoodShareAI - Delivery Location History Model
 * Stores indexed GPS updates for active volunteer transit tasks.
 */
const mongoose = require('mongoose');

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

const deliveryLocationSchema = new mongoose.Schema(
  {
    deliveryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Delivery',
      required: [true, 'Delivery reference is required'],
      index: true,
    },
    volunteerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Volunteer reference is required'],
      index: true,
    },
    location: {
      type: pointSchema,
      required: [true, 'GPS Location is required'],
    },
    speed: {
      type: Number,
      default: 0,
    },
    heading: {
      type: Number,
      default: 0,
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

deliveryLocationSchema.index({ deliveryId: 1, timestamp: -1 });
deliveryLocationSchema.index({ location: '2dsphere' });

const DeliveryLocation = mongoose.model('DeliveryLocation', deliveryLocationSchema);

module.exports = DeliveryLocation;
