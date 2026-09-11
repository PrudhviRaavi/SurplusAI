/**
 * FoodShareAI - Delivery Controller
 * Handles delivery task discovery, assignment acceptance, delivery stage execution,
 * pickup confirmation, proof upload, and completion.
 */
const deliveryService = require('../services/deliveryService');
const { sendSuccess } = require('../utils/apiResponse');

/**
 * GET /api/volunteer/tasks
 * Discover available unassigned delivery tasks
 */
const getAvailableTasks = async (req, res, next) => {
  try {
    const tasksData = await deliveryService.getAvailableDeliveryTasks(req.query, req.user.id);
    return sendSuccess(res, 'Available delivery tasks retrieved', tasksData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/tasks/:id
 * Retrieve details of a specific available task
 */
const getTaskById = async (req, res, next) => {
  try {
    const task = await deliveryService.getDeliveryTaskById(req.params.id, req.user.id);
    return sendSuccess(res, 'Delivery task details retrieved', task, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/volunteer/tasks/:id/accept
 * Accept an available delivery task
 */
const acceptTask = async (req, res, next) => {
  try {
    const accepted = await deliveryService.acceptDeliveryTask(req.params.id, req.user.id);
    return sendSuccess(res, 'Delivery task accepted successfully', accepted, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/deliveries
 * Retrieve deliveries assigned to authenticated volunteer
 */
const getMyDeliveries = async (req, res, next) => {
  try {
    const deliveriesData = await deliveryService.getMyDeliveries(req.user.id, req.query);
    return sendSuccess(res, 'Active deliveries retrieved', deliveriesData, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/volunteer/deliveries/:id
 * Retrieve details of a specific assigned delivery
 */
const getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await deliveryService.getDeliveryById(req.params.id, req.user.id);
    return sendSuccess(res, 'Delivery details retrieved', delivery, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * PUT /api/volunteer/deliveries/:id/status
 * Controlled status progression
 */
const updateDeliveryStatus = async (req, res, next) => {
  try {
    const updated = await deliveryService.updateDeliveryStatus(
      req.params.id,
      req.user.id,
      req.body.status
    );
    return sendSuccess(res, 'Delivery status updated', updated, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/volunteer/deliveries/:id/pickup
 * Confirm collection of food at donor location
 */
const confirmPickup = async (req, res, next) => {
  try {
    const result = await deliveryService.confirmPickup(req.params.id, req.user.id);
    return sendSuccess(res, 'Food pickup confirmed successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/volunteer/deliveries/:id/proof
 * Submit proof of delivery photo and notes
 */
const uploadProof = async (req, res, next) => {
  try {
    const result = await deliveryService.submitProofOfDelivery(
      req.params.id,
      req.user.id,
      req.body
    );
    return sendSuccess(res, 'Proof of delivery recorded', result, 200);
  } catch (error) {
    next(error);
  }
};

/**
 * POST /api/volunteer/deliveries/:id/complete
 * Mark delivery completed and update related donation/claim/impact
 */
const completeDelivery = async (req, res, next) => {
  try {
    const result = await deliveryService.completeDelivery(req.params.id, req.user.id);
    return sendSuccess(res, 'Delivery completed successfully', result, 200);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableTasks,
  getTaskById,
  acceptTask,
  getMyDeliveries,
  getDeliveryById,
  updateDeliveryStatus,
  confirmPickup,
  uploadProof,
  completeDelivery,
};
