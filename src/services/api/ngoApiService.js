/**
 * FoodShareAI - NGO API Service
 * Connects frontend NGO screens to backend endpoints:
 * profile, food discovery, smart matching, claims, and dashboard.
 */
import { apiClient } from './apiClient';

export const ngoApiService = {
  /**
   * Fetch authenticated NGO profile and user information
   */
  getProfile: async () => {
    const res = await apiClient.get('/ngo/profile');
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update authenticated NGO profile
   * @param {object} profileData
   */
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/ngo/profile', profileData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Discover available published donations
   * @param {object} params { foodCategory, latitude, longitude, radius, minQuantity, maxQuantity, page, limit }
   */
  discoverDonations: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/ngo/donations?${queryString}` : '/ngo/donations';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get smart matching factor breakdown for a specific donation
   * @param {string} donationId
   */
  getMatchDetails: async (donationId) => {
    const res = await apiClient.get(`/ngo/matches/${donationId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get ranked recommendations ordered by weighted match score
   * @param {object} params { page, limit, foodCategory, latitude, longitude, radius }
   */
  getRecommendations: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/ngo/recommendations?${queryString}` : '/ngo/recommendations';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Claim an eligible donation
   * @param {string} donationId
   * @param {object} claimData { requestedQuantity }
   */
  claimDonation: async (donationId, claimData = {}) => {
    const res = await apiClient.post(`/ngo/donations/${donationId}/claim`, claimData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve claims belonging to the authenticated NGO
   * @param {object} params { status, page, limit }
   */
  getClaims: async (params = {}) => {
    const cleanParams = Object.fromEntries(
      Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
    );
    const queryString = new URLSearchParams(cleanParams).toString();
    const endpoint = queryString ? `/ngo/claims?${queryString}` : '/ngo/claims';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve single claim details
   * @param {string} claimId
   */
  getClaimById: async (claimId) => {
    const res = await apiClient.get(`/ngo/claims/${claimId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Retrieve database-backed NGO dashboard metrics
   */
  getDashboard: async (ngoUserId) => {
    const res = await apiClient.get('/ngo/dashboard');
    return res?.data !== undefined ? res.data : res;
  },
};
