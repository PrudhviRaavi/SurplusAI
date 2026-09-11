/**
 * FoodShareAI - Frontend Admin API Service
 * Centralized client for Admin Operational Intelligence Center.
 * Exclusively restricted to ADMIN role (JWT automatically attached by apiClient).
 */
import { apiClient } from './apiClient';

export const adminApiService = {
  // 1. Dashboard Overview
  getDashboardOverview: async () => {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  },

  // 2. Operational KPIs
  getOperationalKpis: async (timeframe = '30 Days') => {
    const response = await apiClient.get(`/admin/intelligence/kpis?timeframe=${encodeURIComponent(timeframe)}`);
    return response.data;
  },

  // 3. Geographic Map Intelligence
  getMapIntelligence: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/intelligence/map?${query}` : '/admin/intelligence/map';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  // 4. NGO Verification Queue & Management
  getPendingNgos: async (page = 1, limit = 20) => {
    const response = await apiClient.get(`/admin/ngos/pending?page=${page}&limit=${limit}`);
    return response.data;
  },

  getNgos: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/ngos?${query}` : '/admin/ngos';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getNgoById: async (id) => {
    const response = await apiClient.get(`/admin/ngos/${id}`);
    return response.data;
  },

  verifyNgo: async (id, status, reason = '') => {
    const response = await apiClient.put(`/admin/ngos/${id}/verification`, { status, reason });
    return response.data;
  },

  // 5. User Management & Governance
  getUsers: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/users?${query}` : '/admin/users';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getUserById: async (id) => {
    const response = await apiClient.get(`/admin/users/${id}`);
    return response.data;
  },

  updateUserStatus: async (id, isActive, reason = '') => {
    const response = await apiClient.put(`/admin/users/${id}/status`, { isActive, reason });
    return response.data;
  },

  // 6. Donations Oversight
  getDonations: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/donations?${query}` : '/admin/donations';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getDonationById: async (id) => {
    const response = await apiClient.get(`/admin/donations/${id}`);
    return response.data;
  },

  // 7. Claims & Deliveries Monitoring
  getClaims: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/claims?${query}` : '/admin/claims';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  getDeliveries: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/deliveries?${query}` : '/admin/deliveries';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  // 8. Impact & Demand Summary
  getImpactSummary: async () => {
    const response = await apiClient.get('/admin/intelligence/impact');
    return response.data;
  },

  getDemandIntelligence: async (foodCategory = 'ALL', period = 'ALL') => {
    const response = await apiClient.get(
      `/admin/intelligence/demand?foodCategory=${encodeURIComponent(foodCategory)}&period=${encodeURIComponent(period)}`
    );
    return response.data;
  },

  // 9. Safety & Risk
  getSafetyAlerts: async () => {
    const response = await apiClient.get('/admin/safety/alerts');
    return response.data;
  },

  getRiskAssessments: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/risk/assessments?${query}` : '/admin/risk/assessments';
    const response = await apiClient.get(endpoint);
    return response.data;
  },

  reviewRiskAssessment: async (id, status, reviewNotes = '') => {
    const response = await apiClient.put(`/admin/risk/assessments/${id}/review`, { status, reviewNotes });
    return response.data;
  },

  // 10. Audit Logs
  getAuditLogs: async (filters = {}) => {
    const query = new URLSearchParams(filters).toString();
    const endpoint = query ? `/admin/audit-logs?${query}` : '/admin/audit-logs';
    const response = await apiClient.get(endpoint);
    return response.data;
  },
};
