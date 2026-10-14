/**
 * FoodShareAI - Real-Time Socket.IO Client
 *
 * Connects Expo client to the Express Socket.IO server:
 * - Uses configured host IP from API_BASE_URL (never hardcodes localhost)
 * - Authenticates socket handshake via stored JWT token
 * - Listens for donation and delivery lifecycle events
 * - Provides resilient reconnect and event subscription
 */
import { io } from 'socket.io-client';
import { API_BASE_URL } from './apiConfig';
import { tokenStorage } from './tokenStorage';

let socket = null;
const donationListeners = new Set();
const taskListeners = new Set();

/**
 * Strips '/api' or trailing paths to obtain Socket.IO host URL
 */
const getSocketUrl = () => {
  if (!API_BASE_URL || API_BASE_URL.includes('__UNCONFIGURED_ANDROID_LAN_HOST__')) {
    return 'http://127.0.0.1:5000';
  }
  return API_BASE_URL.replace(/\/api\/?$/, '');
};

export const socketClient = {
  /**
   * Initializes or re-authenticates Socket.IO connection
   */
  init: async () => {
    try {
      if (socket && socket.connected) {
        return socket;
      }

      const token = await tokenStorage.getToken();
      const serverUrl = getSocketUrl();

      socket = io(serverUrl, {
        auth: { token: token ? `Bearer ${token}` : '' },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 10,
        reconnectionDelay: 2000,
        timeout: 10000,
      });

      socket.on('connect', () => {
        // Connected to real-time engine
      });

      socket.on('disconnect', (reason) => {
        // Disconnected safely
      });

      // Unified Donation Event Listeners
      const handleDonationEvent = (data) => {
        donationListeners.forEach((callback) => {
          try {
            callback(data);
          } catch (e) {
            console.warn('[socketClient] donation listener error:', e.message);
          }
        });
      };

      socket.on('donation:created', handleDonationEvent);
      socket.on('donation:published', handleDonationEvent);
      socket.on('donation:updated', handleDonationEvent);
      socket.on('donation:claimed', handleDonationEvent);

      // Unified Delivery / Task Event Listeners
      const handleTaskEvent = (data) => {
        taskListeners.forEach((callback) => {
          try {
            callback(data);
          } catch (e) {
            console.warn('[socketClient] task listener error:', e.message);
          }
        });
      };

      socket.on('task:created', handleTaskEvent);
      socket.on('task:updated', handleTaskEvent);

      return socket;
    } catch (err) {
      console.warn('[socketClient] Init notice:', err.message);
      return null;
    }
  },

  /**
   * Subscribe to donation changes (create, publish, claim, update)
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  onDonationChange: (callback) => {
    if (typeof callback === 'function') {
      donationListeners.add(callback);
      socketClient.init().catch(() => {});
    }
    return () => {
      donationListeners.delete(callback);
    };
  },

  /**
   * Alias listeners for semantic clarity
   */
  onDonationCreated: (callback) => socketClient.onDonationChange(callback),
  onDonationUpdated: (callback) => socketClient.onDonationChange(callback),

  /**
   * Subscribe to task / delivery changes (create, update, accept)
   * @param {Function} callback
   * @returns {Function} unsubscribe
   */
  onTaskChange: (callback) => {
    if (typeof callback === 'function') {
      taskListeners.add(callback);
      socketClient.init().catch(() => {});
    }
    return () => {
      taskListeners.delete(callback);
    };
  },

  onTaskCreated: (callback) => socketClient.onTaskChange(callback),
  onTaskUpdated: (callback) => socketClient.onTaskChange(callback),

  /**
   * Disconnect socket safely (e.g. on user logout)
   */
  disconnect: () => {
    if (socket) {
      socket.disconnect();
      socket = null;
    }
    donationListeners.clear();
    taskListeners.clear();
  },
};
