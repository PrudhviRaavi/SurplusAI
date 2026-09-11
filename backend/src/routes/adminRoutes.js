/**
 * FoodShareAI - Admin Operational Intelligence Routes
 * Exclusively restricted to ADMIN role.
 * Non-admin roles (DONOR, NGO, VOLUNTEER) and public unauthenticated requests are strictly rejected.
 */
const express = require('express');
const router = express.Router();

const adminController = require('../controllers/adminController');
const demandController = require('../controllers/demandController');
const safetyController = require('../controllers/safetyController');
const riskController = require('../controllers/riskController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// All admin routes strictly require JWT and ADMIN role
router.use(authenticate);
router.use(authorizeRoles('ADMIN'));

// 1. Operational Overview Dashboard
router.get('/dashboard', adminController.getDashboard);

// 2. User Management & Governance
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserById);
router.put('/users/:id/status', adminController.updateUserStatus);

// 3. NGO Verification Queue & Management
router.get('/ngos/pending', adminController.getPendingNgos);
router.get('/ngos', adminController.getNgos);
router.get('/ngos/:id', adminController.getNgoById);
router.put('/ngos/:id/verification', adminController.updateNgoVerification);

// 4. Donation Oversight
router.get('/donations', adminController.getDonations);
router.get('/donations/:id', adminController.getDonationById);

// 5. Claim Monitoring
router.get('/claims', adminController.getClaims);
router.get('/claims/:id', adminController.getClaimById);

// 6. Delivery Monitoring
router.get('/deliveries', adminController.getDeliveries);
router.get('/deliveries/:id', adminController.getDeliveryById);

// 7. Operational Intelligence APIs
router.get('/intelligence/map', adminController.getMapIntelligence);
router.get('/intelligence/kpis', adminController.getOperationalKpis);
router.get('/intelligence/impact', adminController.getImpactSummary);
router.get('/intelligence/demand', demandController.getAdminDemandIntelligence);

// 8. Food Safety Alerts
router.get('/safety/alerts', safetyController.getAdminSafetyAlerts);

// 9. Risk & Anomaly Assessments & Review
router.get('/risk/assessments', riskController.getAdminRiskAssessments);
router.put('/risk/assessments/:id/review', riskController.reviewRiskAssessment);

// 10. Audit Logging
router.get('/audit-logs', adminController.getAuditLogs);

module.exports = router;
