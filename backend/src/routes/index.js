/**
 * FoodShareAI - API Route Aggregator
 */
const express = require('express');
const router = express.Router();

const healthRoutes = require('./healthRoutes');
const authRoutes = require('./authRoutes');
const donorRoutes = require('./donorRoutes');
const donationRoutes = require('./donationRoutes');
const ngoRoutes = require('./ngoRoutes');
const volunteerRoutes = require('./volunteerRoutes');
const deliveryRoutes = require('./deliveryRoutes');
const aiRoutes = require('./aiRoutes');
const demandRoutes = require('./demandRoutes');
const adminRoutes = require('./adminRoutes');
const safetyRoutes = require('./safetyRoutes');
const riskRoutes = require('./riskRoutes');
const notificationRoutes = require('./notificationRoutes');

// Mount routes
router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/donor', donorRoutes);
router.use('/donations', donationRoutes);
router.use('/ngo', ngoRoutes);
router.use('/volunteer', volunteerRoutes);
router.use('/deliveries', deliveryRoutes);
router.use('/ai', aiRoutes);
router.use('/demand', demandRoutes);
router.use('/admin', adminRoutes);
router.use('/safety', safetyRoutes);
router.use('/risk', riskRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;
