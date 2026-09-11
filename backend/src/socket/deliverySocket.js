/**
 * FoodShareAI - Delivery Socket Event Handler
 * Manages delivery rooms, throttled GPS location updates, and authorized client broadcasting.
 */
const mongoose = require('mongoose');
const { Delivery, DeliveryLocation } = require('../models');

// In-memory throttling map: deliveryId -> lastUpdateTimeMs
const lastUpdateMap = new Map();
const THROTTLE_INTERVAL_MS = parseInt(process.env.LOCATION_UPDATE_INTERVAL_MS || '3000', 10); // 3 seconds default

/**
 * Checks whether the connected socket user is authorized to participate in a delivery room
 * @param {string} deliveryId MongoDB ObjectId string
 * @param {string} userId Authenticated socket user ID
 * @param {string} role User role (ADMIN, VOLUNTEER, NGO, DONOR)
 * @returns {Promise<boolean>} true if authorized
 */
const verifyDeliveryParticipation = async (deliveryId, userId, role) => {
  if (role === 'ADMIN') return true;

  if (!mongoose.Types.ObjectId.isValid(deliveryId)) return false;

  const delivery = await Delivery.findById(deliveryId).lean();
  if (!delivery) return false;

  const vId = delivery.volunteerId ? delivery.volunteerId.toString() : null;
  const nId = delivery.ngoId ? delivery.ngoId.toString() : null;
  const dId = delivery.donorId ? delivery.donorId.toString() : null;

  return vId === userId || nId === userId || dId === userId;
};

/**
 * Attaches delivery event handlers to a socket connection
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
const registerDeliveryHandlers = (io, socket) => {
  const user = socket.user;

  /**
   * Event: delivery:join
   * Joins a specific delivery room with strict authorization
   */
  socket.on('delivery:join', async (data, callback) => {
    try {
      const deliveryId = typeof data === 'string' ? data : data?.deliveryId;

      if (!deliveryId || !mongoose.Types.ObjectId.isValid(deliveryId)) {
        if (callback) callback({ success: false, message: 'Invalid delivery ID' });
        return;
      }

      const isAuthorized = await verifyDeliveryParticipation(deliveryId, user.id, user.role);
      if (!isAuthorized) {
        if (callback) callback({ success: false, message: 'Unauthorized delivery room subscription' });
        return;
      }

      const roomName = `delivery:${deliveryId}`;
      socket.join(roomName);

      if (callback) callback({ success: true, room: roomName });
    } catch (err) {
      if (callback) callback({ success: false, message: err.message });
    }
  });

  /**
   * Event: delivery:leave
   * Leaves a delivery room
   */
  socket.on('delivery:leave', (data) => {
    const deliveryId = typeof data === 'string' ? data : data?.deliveryId;
    if (deliveryId) {
      socket.leave(`delivery:${deliveryId}`);
    }
  });

  /**
   * Event: delivery:location:update
   * Broadcasts real-time GPS coordinates to authorized delivery room participants
   */
  socket.on('delivery:location:update', async (payload, callback) => {
    try {
      const { deliveryId, latitude, longitude, speed, heading, timestamp } = payload || {};

      // 1. Validate payload presence and types
      if (!deliveryId || !mongoose.Types.ObjectId.isValid(deliveryId)) {
        if (callback) callback({ success: false, message: 'Invalid delivery ID format' });
        return;
      }

      const lat = Number(latitude);
      const lng = Number(longitude);

      if (isNaN(lat) || lat < -90 || lat > 90) {
        if (callback) callback({ success: false, message: 'Invalid latitude (-90 to 90)' });
        return;
      }

      if (isNaN(lng) || lng < -180 || lng > 180) {
        if (callback) callback({ success: false, message: 'Invalid longitude (-180 to 180)' });
        return;
      }

      // 2. Validate role: Only VOLUNTEER (or ADMIN) can transmit location
      if (user.role !== 'VOLUNTEER' && user.role !== 'ADMIN') {
        if (callback) callback({ success: false, message: 'Only assigned volunteers can transmit delivery location' });
        return;
      }

      // 3. Verify delivery assignment and active state
      const delivery = await Delivery.findById(deliveryId);
      if (!delivery) {
        if (callback) callback({ success: false, message: 'Delivery not found' });
        return;
      }

      if (user.role !== 'ADMIN' && delivery.volunteerId?.toString() !== user.id) {
        if (callback) callback({ success: false, message: 'Unauthorized: You are not the assigned volunteer for this delivery' });
        return;
      }

      // 4. Validate tracking status: Do not track completed or cancelled deliveries
      const inactiveStatuses = ['COMPLETED', 'CANCELLED'];
      if (inactiveStatuses.includes(delivery.status)) {
        if (callback) callback({ success: false, message: `Tracking inactive: Delivery is ${delivery.status}` });
        return;
      }

      // 5. Throttling: coalesce rapid updates to protect server & mobile bandwidth
      const now = Date.now();
      const lastUpdate = lastUpdateMap.get(deliveryId) || 0;
      if (now - lastUpdate < THROTTLE_INTERVAL_MS) {
        if (callback) callback({ success: true, throttled: true });
        return;
      }
      lastUpdateMap.set(deliveryId, now);

      // 6. Broadcast to authorized room
      const locationPayload = {
        deliveryId,
        volunteerId: user.id,
        latitude: lat,
        longitude: lng,
        speed: speed || 0,
        heading: heading || 0,
        timestamp: timestamp || new Date().toISOString(),
      };

      io.to(`delivery:${deliveryId}`).emit('delivery:location', locationPayload);

      // 7. Update latest location on Delivery document asynchronously
      delivery.currentLocation = {
        type: 'Point',
        coordinates: [lng, lat],
      };
      delivery.lastLocationUpdateAt = new Date();
      await delivery.save();

      // Periodically log to DeliveryLocation collection (every ~15s)
      try {
        await DeliveryLocation.create({
          deliveryId: delivery._id,
          volunteerId: user.id,
          location: { type: 'Point', coordinates: [lng, lat] },
          speed: speed || 0,
          heading: heading || 0,
          timestamp: new Date(),
        });
      } catch (logErr) {
        // Safe continuation
      }

      if (callback) callback({ success: true, broadcasted: true });
    } catch (err) {
      if (callback) callback({ success: false, message: err.message });
    }
  });
};

module.exports = {
  registerDeliveryHandlers,
  verifyDeliveryParticipation,
};
