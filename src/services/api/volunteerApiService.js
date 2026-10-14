/**
 * FoodShareAI - Volunteer API Service
 * Connects frontend volunteer screens to backend endpoints:
 * profile, dashboard, available tasks, task acceptance, active delivery execution,
 * pickup confirmation, proof upload, completion, and impact analytics.
 */
import { apiClient } from './apiClient';

export const volunteerApiService = {
  /**
   * Fetch authenticated volunteer profile
   */
  getProfile: async () => {
    const res = await apiClient.get('/volunteer/profile');
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update authenticated volunteer profile
   * @param {object} profileData
   */
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/volunteer/profile', profileData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve real database-backed volunteer dashboard metrics
   */
  getDashboard: async () => {
    const res = await apiClient.get('/volunteer/dashboard');
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Discover available delivery tasks
   * @param {object} params { latitude, longitude, radius, page, limit }
   */
  getAvailableTasks: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/volunteer/tasks?${queryString}` : '/volunteer/tasks';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve details of a specific available task
   * @param {string} taskId
   */
  getTaskById: async (taskId) => {
    const res = await apiClient.get(`/volunteer/tasks/${taskId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Accept an available delivery task
   * @param {string} taskId
   */
  acceptTask: async (taskId) => {
    const res = await apiClient.post(`/volunteer/tasks/${taskId}/accept`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve active deliveries assigned to authenticated volunteer
   * @param {object} params { status, page, limit }
   */
  getMyDeliveries: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/volunteer/deliveries?${queryString}` : '/volunteer/deliveries';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve details of an assigned delivery
   * @param {string} deliveryId
   */
  getDeliveryById: async (deliveryId) => {
    const res = await apiClient.get(`/volunteer/deliveries/${deliveryId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update delivery operational status
   * @param {string} deliveryId
   * @param {string} status
   */
  updateDeliveryStatus: async (deliveryId, status) => {
    const res = await apiClient.put(`/volunteer/deliveries/${deliveryId}/status`, { status });
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Confirm food collection / pickup at donor location
   * @param {string} deliveryId
   */
  confirmPickup: async (deliveryId) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/pickup`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Submit proof of delivery photo and notes
   * @param {string} deliveryId
   * @param {object} proofData { photoUrl, proofImageUrl, notes, signatureUrl }
   */
  submitProof: async (deliveryId, proofData = {}) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/proof`, proofData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Complete delivery task and trigger donation/claim finalization
   * @param {string} deliveryId
   */
  completeDelivery: async (deliveryId) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/complete`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve volunteer impact points and metrics
   */
  getImpact: async () => {
    const res = await apiClient.get('/volunteer/impact');
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Generate or recalculate an A* optimized delivery route
   * @param {string} deliveryId
   * @param {boolean} forceRecalculate
   */
  generateRoute: async (deliveryId, forceRecalculate = false) => {
    const res = await apiClient.post(`/deliveries/${deliveryId}/route`, { forceRecalculate });
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get cached A* delivery route
   * @param {string} deliveryId
   */
  getRoute: async (deliveryId) => {
    const res = await apiClient.get(`/deliveries/${deliveryId}/route`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get latest known GPS location for active delivery
   * @param {string} deliveryId
   */
  getLocation: async (deliveryId) => {
    const res = await apiClient.get(`/deliveries/${deliveryId}/location`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Optimize multi-stop route via A* routing backend
   * @param {Array<{ name: string, coordinates: [number, number], address?: string }>} stops
   */
  optimizeMultiStopRoute: async (stops) => {
    try {
      const res = await apiClient.post('/volunteer/route/optimize', { stops });
      return res?.data !== undefined ? res.data : res;
    } catch (err) {
      console.warn('[volunteerApiService] optimizeMultiStopRoute failed, fallback enabled:', err?.message);
      return null;
    }
  },
};
