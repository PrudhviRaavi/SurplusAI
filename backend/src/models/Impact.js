/**
 * FoodShareAI - Impact Model
 * Powers gamification, metrics, sustainability reporting, and dashboards.
 */
const mongoose = require('mongoose');
const { ROLES } = require('../utils/constants');

const impactSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      unique: true,
      index: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: Object.values(ROLES),
        message: '{VALUE} is not a valid role',
      },
      index: true,
    },
    mealsRescued: {
      type: Number,
      min: [0, 'Meals rescued cannot be negative'],
      default: 0,
    },
    foodSavedKg: {
      type: Number,
      min: [0, 'Food saved cannot be negative'],
      default: 0,
    },
    deliveriesCompleted: {
      type: Number,
      min: [0, 'Deliveries completed cannot be negative'],
      default: 0,
    },
    donationsCompleted: {
      type: Number,
      min: [0, 'Donations completed cannot be negative'],
      default: 0,
    },
    impactPoints: {
      type: Number,
      min: [0, 'Impact points cannot be negative'],
      default: 0,
      index: true,
    },
    co2SavedKg: {
      type: Number,
      min: [0, 'CO2 saved cannot be negative'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

impactSchema.index({ role: 1, impactPoints: -1 });

const Impact = mongoose.model('Impact', impactSchema);

module.exports = Impact;
