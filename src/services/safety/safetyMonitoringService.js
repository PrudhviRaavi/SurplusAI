import { apiClient } from '../api/apiClient';

const DEFAULT_SAFETY_ALERTS = [
  {
    id: 'safe-1',
    title: 'Safe Consumption Window Approaching',
    donationId: 'DON-8842',
    foodName: 'Vegetable Biryani',
    donorName: 'Green Leaf Restaurant',
    severity: 'Critical',
    timeRemaining: '45 mins remaining',
    issue: 'Donation published 3.5 hours ago with 4-hour max freshness window.',
    recommendedAction: 'Fast-track priority dispatch or mark for immediate review.',
  },
  {
    id: 'safe-2',
    title: 'Missing Storage Condition Details',
    donationId: 'DON-8845',
    foodName: 'Paneer Butter Masala',
    donorName: 'Spice Route Hotel',
    severity: 'Warning',
    timeRemaining: '2 hours remaining',
    issue: 'Perishable cooked dairy dish submitted without explicit refrigeration flag.',
    recommendedAction: 'Contact donor to verify thermal storage container.',
  },
];

export const safetyMonitoringService = {
  getSafetyAlerts: () => DEFAULT_SAFETY_ALERTS,

  /**
   * Asynchronously fetches live safety alerts from backend Admin Intelligence API.
   */
  fetchSafetyAlerts: async () => {
    try {
      const res = await apiClient.get('/admin/safety/alerts');
      if (res && res.data && res.data.data && Array.isArray(res.data.data.alerts) && res.data.data.alerts.length > 0) {
        return res.data.data.alerts;
      }
      return DEFAULT_SAFETY_ALERTS;
    } catch (err) {
      return DEFAULT_SAFETY_ALERTS;
    }
  },

  /**
   * Fetches deterministic safety evaluation for a single donation.
   */
  fetchDonationSafety: async (donationId) => {
    try {
      const res = await apiClient.get(`/safety/donations/${donationId}`);
      return res.data;
    } catch (err) {
      return null;
    }
  },
};
