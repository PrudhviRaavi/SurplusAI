/**
 * FoodShareAI - Demand Routes
 * Endpoints for retrieving food demand forecasts.
 */
const express = require('express');
const router = express.Router();

const demandController = require('../controllers/demandController');
const { authenticate } = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');

// Accessible to NGOs and Admins
router.use(authenticate);
router.use(authorizeRoles('NGO', 'ADMIN'));

router.get('/forecast', demandController.getDemandForecast);

module.exports = router;
