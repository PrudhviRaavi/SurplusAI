/**
 * FoodShareAI - Models Index
 * Central export hub for all Mongoose data models.
 */
const User = require('./User');
const DonorProfile = require('./DonorProfile');
const NgoProfile = require('./NgoProfile');
const VolunteerProfile = require('./VolunteerProfile');
const Donation = require('./Donation');
const AIAnalysis = require('./AIAnalysis');
const Claim = require('./Claim');
const Delivery = require('./Delivery');
const Notification = require('./Notification');
const Impact = require('./Impact');
const DemandForecast = require('./DemandForecast');
const DeliveryLocation = require('./DeliveryLocation');
const RiskAssessment = require('./RiskAssessment');
const AuditLog = require('./AuditLog');

module.exports = {
  User,
  DonorProfile,
  NgoProfile,
  VolunteerProfile,
  Donation,
  AIAnalysis,
  Claim,
  Delivery,
  Notification,
  Impact,
  DemandForecast,
  DeliveryLocation,
  RiskAssessment,
  AuditLog,
};
