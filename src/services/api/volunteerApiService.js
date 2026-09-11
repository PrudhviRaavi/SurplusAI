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
    return res.data;
  },

  /**
   * Update authenticated volunteer profile
   * @param {object} profileData
   */
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/volunteer/profile', profileData);
    return res.data;
  },

  /**
   * Retrieve real database-backed volunteer dashboard metrics
   */
  getDashboard: async () => {
    const res = await apiClient.get('/volunteer/dashboard');
    return res.data;
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
    return res.data;
  },

  /**
   * Retrieve details of a specific available task
   * @param {string} taskId
   */
  getTaskById: async (taskId) => {
    const res = await apiClient.get(`/volunteer/tasks/${taskId}`);
    return res.data;
  },

  /**
   * Accept an available delivery task
   * @param {string} taskId
   */
  acceptTask: async (taskId) => {
    const res = await apiClient.post(`/volunteer/tasks/${taskId}/accept`);
    return res.data;
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
    return res.data;
  },

  /**
   * Retrieve details of an assigned delivery
   * @param {string} deliveryId
   */
  getDeliveryById: async (deliveryId) => {
    const res = await apiClient.get(`/volunteer/deliveries/${deliveryId}`);
    return res.data;
  },

  /**
   * Update delivery operational status
   * @param {string} deliveryId
   * @param {string} status
   */
  updateDeliveryStatus: async (deliveryId, status) => {
    const res = await apiClient.put(`/volunteer/deliveries/${deliveryId}/status`, { status });
    return res.data;
  },

  /**
   * Confirm food collection / pickup at donor location
   * @param {string} deliveryId
   */
  confirmPickup: async (deliveryId) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/pickup`);
    return res.data;
  },

  /**
   * Submit proof of delivery photo and notes
   * @param {string} deliveryId
   * @param {object} proofData { photoUrl, proofImageUrl, notes, signatureUrl }
   */
  submitProof: async (deliveryId, proofData = {}) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/proof`, proofData);
    return res.data;
  },

  /**
   * Complete delivery task and trigger donation/claim finalization
   * @param {string} deliveryId
   */
  completeDelivery: async (deliveryId) => {
    const res = await apiClient.post(`/volunteer/deliveries/${deliveryId}/complete`);
    return res.data;
  },

  /**
   * Retrieve volunteer impact points and metrics
   */
  getImpact: async () => {
    const res = await apiClient.get('/volunteer/impact');
    return res.data;
  },

  /**
   * Generate or recalculate an A* optimized delivery route
   * @param {string} deliveryId
   * @param {boolean} forceRecalculate
   */
  generateRoute: async (deliveryId, forceRecalculate = false) => {
    const res = await apiClient.post(`/deliveries/${deliveryId}/route`, { forceRecalculate });
    return res.data;
  },

  /**
   * Get cached A* delivery route
   * @param {string} deliveryId
   */
  getRoute: async (deliveryId) => {
    const res = await apiClient.get(`/deliveries/${deliveryId}/route`);
    return res.data;
  },

  /**
   * Get latest known GPS location for active delivery
   * @param {string} deliveryId
   */
  getLocation: async (deliveryId) => {
    const res = await apiClient.get(`/deliveries/${deliveryId}/location`);
    return res.data;
  },
};
