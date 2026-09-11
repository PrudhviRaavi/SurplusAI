/**
 * FoodShareAI - Delivery Status Lifecycle Service
 * Enforces controlled, deterministic delivery state machine transitions.
 * Prevents arbitrary skipping or backward modifications of delivery lifecycle stages.
 */
const { DELIVERY_STATUS } = require('../utils/constants');

/**
 * Normalized status mapping for frontend lifecycle stage aliases
 */
const STATUS_ALIASES = Object.freeze({
  VOLUNTEER_ACCEPTED: DELIVERY_STATUS.ACCEPTED,
  HEADING_TO_PICKUP: DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
  ARRIVED_AT_PICKUP: DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
  PICKUP_STARTED: DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
  FOOD_COLLECTED: DELIVERY_STATUS.PICKED_UP,
  HEADING_TO_DROPOFF: DELIVERY_STATUS.IN_TRANSIT,
  ARRIVED_AT_DROPOFF: DELIVERY_STATUS.ARRIVED,
  DELIVERY_VERIFICATION: DELIVERY_STATUS.DELIVERED,
});

/**
 * Strict state machine transition rules
 */
const ALLOWED_TRANSITIONS = Object.freeze({
  [DELIVERY_STATUS.AVAILABLE]: [DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.PENDING]: [DELIVERY_STATUS.AVAILABLE, DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.ASSIGNED]: [DELIVERY_STATUS.ACCEPTED, DELIVERY_STATUS.CANCELLED],
  [DELIVERY_STATUS.ACCEPTED]: [
    DELIVERY_STATUS.ARRIVING_FOR_PICKUP,
    DELIVERY_STATUS.PICKED_UP,
    DELIVERY_STATUS.CANCELLED,
  ],
  [DELIVERY_STATUS.ARRIVING_FOR_PICKUP]: [
    DELIVERY_STATUS.PICKED_UP,
    DELIVERY_STATUS.CANCELLED,
  ],
  [DELIVERY_STATUS.PICKED_UP]: [
    DELIVERY_STATUS.IN_TRANSIT,
    DELIVERY_STATUS.ARRIVED,
    DELIVERY_STATUS.DELIVERED,
  ],
  [DELIVERY_STATUS.IN_TRANSIT]: [
    DELIVERY_STATUS.ARRIVED,
    DELIVERY_STATUS.DELIVERED,
  ],
  [DELIVERY_STATUS.ARRIVED]: [DELIVERY_STATUS.DELIVERED],
  [DELIVERY_STATUS.DELIVERED]: [DELIVERY_STATUS.COMPLETED],
  [DELIVERY_STATUS.COMPLETED]: [],
  [DELIVERY_STATUS.CANCELLED]: [],
});

/**
 * Normalize and resolve a delivery status string
 * @param {string} status
 * @returns {string}
 */
const normalizeStatus = (status) => {
  if (!status || typeof status !== 'string') return '';
  const upper = status.trim().toUpperCase();
  return STATUS_ALIASES[upper] || upper;
};

/**
 * Check whether a status transition is permitted
 * @param {string} currentStatus
 * @param {string} targetStatus
 * @returns {boolean}
 */
const isValidTransition = (currentStatus, targetStatus) => {
  const normalizedCurrent = normalizeStatus(currentStatus);
  const normalizedTarget = normalizeStatus(targetStatus);

  if (!normalizedCurrent || !normalizedTarget) return false;
  if (normalizedCurrent === normalizedTarget) return true; // Idempotent same-state update

  const allowedNext = ALLOWED_TRANSITIONS[normalizedCurrent] || [];
  return allowedNext.includes(normalizedTarget);
};

/**
 * Validate status transition and throw 409 Conflict if invalid
 * @param {string} currentStatus
 * @param {string} targetStatus
 * @returns {string} The normalized target status
 */
const validateTransition = (currentStatus, targetStatus) => {
  const normalizedCurrent = normalizeStatus(currentStatus);
  const normalizedTarget = normalizeStatus(targetStatus);

  if (!Object.values(DELIVERY_STATUS).includes(normalizedTarget)) {
    const error = new Error(`Invalid target status: '${targetStatus}' is not recognized`);
    error.statusCode = 400;
    throw error;
  }

  if (!isValidTransition(normalizedCurrent, normalizedTarget)) {
    const allowed = ALLOWED_TRANSITIONS[normalizedCurrent] || [];
    const error = new Error(
      `Invalid delivery status transition from '${normalizedCurrent}' to '${normalizedTarget}'. Permitted transitions: [${allowed.join(', ')}]`
    );
    error.statusCode = 409;
    throw error;
  }

  return normalizedTarget;
};

module.exports = {
  STATUS_ALIASES,
  ALLOWED_TRANSITIONS,
  normalizeStatus,
  isValidTransition,
  validateTransition,
};
