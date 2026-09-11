/**
 * FoodShareAI - Delivery Route Controller
 * Handles A* shortest route calculation, retrieval, and live location lookups.
 */
const mongoose = require('mongoose');
const { Delivery, DeliveryLocation } = require('../models');
const routeOptimizationService = require('../services/routeOptimizationService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * Helper to verify authorization to view or manage a delivery route
 */
const checkDeliveryAccess = (delivery, userId, role) => {
  if (role === 'ADMIN') return true;

  const vId = delivery.volunteerId ? delivery.volunteerId.toString() : null;
  const nId = delivery.ngoId ? delivery.ngoId.toString() : null;
  const dId = delivery.donorId ? delivery.donorId.toString() : null;

  if (vId === userId || nId === userId || dId === userId) {
    return true;
  }
  return false;
};

/**
 * POST /api/deliveries/:id/route
 * Generates or recalculates an A* optimized route for the delivery
 */
const generateDeliveryRoute = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { forceRecalculate } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid delivery ID format');
      err.statusCode = 400;
      throw err;
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      const err = new Error('Delivery not found');
      err.statusCode = 404;
      throw err;
    }

    // Role and ownership check: Only assigned volunteer (or admin) can generate/recalculate route
    if (req.user.role !== 'ADMIN') {
      if (!delivery.volunteerId || delivery.volunteerId.toString() !== req.user.id) {
        const err = new Error('Unauthorized: Only the assigned volunteer can generate routes for this delivery');
        err.statusCode = 403;
        throw err;
      }
    }

    // Reuse existing route if valid and not explicitly forced
    if (
      !forceRecalculate &&
      delivery.route &&
      delivery.route.coordinates &&
      delivery.route.coordinates.length >= 2
    ) {
      return sendSuccess(
        res,
        'Existing optimized route retrieved',
        {
          deliveryId: delivery._id,
          algorithm: delivery.routeAlgorithm || 'A*',
          routeSource: 'OpenStreetMap Graph (Cached)',
          route: delivery.route,
          distanceKm: Math.round((delivery.routeDistance / 1000) * 100) / 100,
          estimatedDurationMinutes: delivery.estimatedDuration,
          reused: true,
        },
        200
      );
    }

    const pickupCoords = delivery.pickupLocation?.coordinates;
    const dropoffCoords = delivery.deliveryLocation?.coordinates;

    if (!pickupCoords || !dropoffCoords) {
      const err = new Error('Delivery pickup and dropoff coordinates are required for route generation');
      err.statusCode = 400;
      throw err;
    }

    // Execute A* route optimization
    const routePlan = routeOptimizationService.generateRoute(pickupCoords, dropoffCoords);

    // Persist to Delivery document
    delivery.route = routePlan.route;
    delivery.routeDistance = routePlan.distanceMeters;
    delivery.estimatedDuration = routePlan.estimatedDurationMinutes;
    delivery.routeAlgorithm = 'A*';
    delivery.routeGeneratedAt = new Date();
    await delivery.save();

    return sendSuccess(
      res,
      'Optimized route generated successfully using A*',
      {
        deliveryId: delivery._id,
        algorithm: 'A*',
        routeSource: routePlan.routeSource,
        route: delivery.route,
        distanceKm: routePlan.distanceKm,
        estimatedDurationMinutes: delivery.estimatedDuration,
        reused: false,
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/deliveries/:id/route
 * Retrieves stored delivery route
 */
const getDeliveryRoute = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid delivery ID format');
      err.statusCode = 400;
      throw err;
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      const err = new Error('Delivery not found');
      err.statusCode = 404;
      throw err;
    }

    if (!checkDeliveryAccess(delivery, req.user.id, req.user.role)) {
      const err = new Error('Unauthorized: You do not have permission to view this delivery route');
      err.statusCode = 403;
      throw err;
    }

    if (!delivery.route || !delivery.route.coordinates || delivery.route.coordinates.length < 2) {
      // If not yet generated, auto-generate route if coordinates exist
      const pickupCoords = delivery.pickupLocation?.coordinates;
      const dropoffCoords = delivery.deliveryLocation?.coordinates;

      if (pickupCoords && dropoffCoords) {
        const routePlan = routeOptimizationService.generateRoute(pickupCoords, dropoffCoords);
        delivery.route = routePlan.route;
        delivery.routeDistance = routePlan.distanceMeters;
        delivery.estimatedDuration = routePlan.estimatedDurationMinutes;
        delivery.routeAlgorithm = 'A*';
        delivery.routeGeneratedAt = new Date();
        await delivery.save();
      }
    }

    return sendSuccess(
      res,
      'Delivery route retrieved successfully',
      {
        deliveryId: delivery._id,
        algorithm: delivery.routeAlgorithm || 'A*',
        route: delivery.route,
        distanceKm: Math.round((delivery.routeDistance / 1000) * 100) / 100,
        estimatedDurationMinutes: delivery.estimatedDuration,
        pickupLocation: delivery.pickupLocation,
        deliveryLocation: delivery.deliveryLocation,
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/deliveries/:id/location
 * Retrieves latest known GPS location for an active delivery
 */
const getDeliveryLocation = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error('Invalid delivery ID format');
      err.statusCode = 400;
      throw err;
    }

    const delivery = await Delivery.findById(id);
    if (!delivery) {
      const err = new Error('Delivery not found');
      err.statusCode = 404;
      throw err;
    }

    if (!checkDeliveryAccess(delivery, req.user.id, req.user.role)) {
      const err = new Error('Unauthorized: You do not have permission to track this delivery');
      err.statusCode = 403;
      throw err;
    }

    // Return currentLocation from Delivery or latest DeliveryLocation log
    let location = delivery.currentLocation;
    let timestamp = delivery.lastLocationUpdateAt;

    if (!location) {
      const latestLog = await DeliveryLocation.findOne({ deliveryId: delivery._id }).sort({ timestamp: -1 });
      if (latestLog) {
        location = latestLog.location;
        timestamp = latestLog.timestamp;
      }
    }

    return sendSuccess(
      res,
      'Current delivery location retrieved',
      {
        deliveryId: delivery._id,
        volunteerId: delivery.volunteerId,
        status: delivery.status,
        currentLocation: location,
        lastUpdate: timestamp,
        isActive: !['COMPLETED', 'CANCELLED'].includes(delivery.status),
      },
      200
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generateDeliveryRoute,
  getDeliveryRoute,
  getDeliveryLocation,
};
