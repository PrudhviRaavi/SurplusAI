/**
 * FoodShareAI - Donor & Donation API Service
 * Connects frontend donor dashboard and create-donation flows to real backend endpoints.
 */
import { apiClient } from './apiClient';

export const donorApiService = {
  /**
   * Fetch authenticated donor profile
   */
  getProfile: async () => {
    const res = await apiClient.get('/donor/profile');
    return res.data;
  },

  /**
   * Update authenticated donor profile
   */
  updateProfile: async (profileData) => {
    const res = await apiClient.put('/donor/profile', profileData);
    return res.data;
  },

  /**
   * Retrieve calculated real donor impact metrics
   */
  getImpact: async () => {
    const res = await apiClient.get('/donor/impact');
    return res.data;
  },

  /**
   * Create a new draft donation
   */
  createDonation: async (donationData) => {
    const res = await apiClient.post('/donations', donationData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Fetch donor's own donations
   */
  getMyDonations: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/donations/my?${queryString}` : '/donations/my';
    const res = await apiClient.get(endpoint);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Get single donation details by ID
   */
  getDonationById: async (donationId) => {
    const res = await apiClient.get(`/donations/${donationId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Update draft donation
   */
  updateDonation: async (donationId, updateData) => {
    const res = await apiClient.put(`/donations/${donationId}`, updateData);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Delete draft or cancel active donation
   */
  deleteOrCancelDonation: async (donationId) => {
    const res = await apiClient.delete(`/donations/${donationId}`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Publish a draft donation
   */
  publishDonation: async (donationId) => {
    const res = await apiClient.post(`/donations/${donationId}/publish`);
    return res?.data !== undefined ? res.data : res;
  },

  /**
   * Request food image analysis from ML service
   */
  requestFoodAnalysis: async (donationId) => {
    const res = await apiClient.post(`/donations/${donationId}/analyze`);
    return res.data;
  },

  /**
   * Directly analyze an image during the donation creation flow
   */
  analyzeImage: async (imagePayload) => {
    const res = await apiClient.post('/ai/analyze', imagePayload);
    return res.data;
  },

  /**
   * Get food analysis details
   */
  getFoodAnalysis: async (donationId) => {
    const res = await apiClient.get(`/donations/${donationId}/analysis`);
    return res.data;
  },
};
