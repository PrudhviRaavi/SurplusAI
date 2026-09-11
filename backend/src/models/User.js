/**
 * FoodShareAI - User Model
 * Represents core authentication identity for all platform actors.
 */
const mongoose = require('mongoose');
const { ROLES } = require('../utils/constants');

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Full name is required'],
      trim: true,
      minlength: [2, 'Full name must be at least 2 characters'],
      maxlength: [100, 'Full name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email address is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [emailRegex, 'Please provide a valid email address'],
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      sparse: true,
      unique: true,
      index: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password hash is required'],
      select: false, // Prevents leaking password hash in standard queries
    },
    role: {
      type: String,
      required: [true, 'User role is required'],
      enum: {
        values: Object.values(ROLES),
        message: '{VALUE} is not a valid role. Allowed roles: ' + Object.values(ROLES).join(', '),
      },
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    isPhoneVerified: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
    lastLoginAt: {
      type: Date,
      default: null,
    },
    resetPasswordToken: {
      type: String,
      default: null,
      select: false,
    },
    resetPasswordExpires: {
      type: Date,
      default: null,
      select: false,
    },
    pushTokens: {
      type: [String],
      default: [],
      index: true,
    },
    notificationPreferences: {
      donations: { type: Boolean, default: true },
      claims: { type: Boolean, default: true },
      deliveries: { type: Boolean, default: true },
      safety: { type: Boolean, default: true },
      ai: { type: Boolean, default: true },
      demand: { type: Boolean, default: true },
      recommendations: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

// Strip passwordHash and internal fields when serializing to JSON
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
