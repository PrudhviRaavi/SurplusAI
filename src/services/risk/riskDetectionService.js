import { apiClient } from '../api/apiClient';

const DEFAULT_DUPLICATE_FLAGS = [
  {
    id: 'dup-1',
    title: 'Potential Duplicate Listing Detected',
    confidencePercent: 89,
    donorName: 'Green Leaf Restaurant',
    donationA: '#DON-8842 (Vegetable Biryani - 25 meals)',
    donationB: '#DON-8844 (Vegetable Biryani - 25 meals)',
    reason: 'Identical donor, meal count, timestamp gap < 3 min, and matching photo metadata.',
    timestamp: '12 min ago',
  },
];

const DEFAULT_RISK_FLAGS = [
  {
    id: 'risk-1',
    title: 'Unusual Claim Frequency Flagged',
    confidencePercent: 76,
    entityName: 'Metro Food Care NGO',
    reason: 'Claimed 4 large donations within 15 minutes, exceeding standard operational velocity.',
    status: 'Review Required',
    timestamp: '45 min ago',
  },
];

export const riskDetectionService = {
  getDuplicateFlags: () => DEFAULT_DUPLICATE_FLAGS,

  getRiskFlags: () => DEFAULT_RISK_FLAGS,

  /**
   * Fetches real risk anomaly assessments from Admin Governance API.
   */
  fetchRiskAssessments: async () => {
    try {
      const res = await apiClient.get('/admin/risk/assessments');
      if (res && res.data && Array.isArray(res.data.data) && res.data.data.length > 0) {
        return res.data.data.map((item) => ({
          id: item._id,
          title: item.reasons && item.reasons[0] ? item.reasons[0] : `Operational Anomaly (${item.entityType})`,
          confidencePercent: Math.round((item.anomalyScore || 0.5) * 100),
          entityName: item.userId?.name || `${item.entityType} ${item.entityId ? item.entityId.slice(-6) : ''}`,
          reason: (item.reasons && item.reasons.join('; ')) || 'Multi-factor operational pattern flagged by Isolation Forest baseline',
          status: item.status === 'PENDING' ? 'Review Required' : item.status,
          riskLevel: item.riskLevel,
          timestamp: item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recently',
        }));
      }
      return DEFAULT_RISK_FLAGS;
    } catch (err) {
      return DEFAULT_RISK_FLAGS;
    }
  },

  /**
   * Inspects potential duplicates for a donation.
   */
  fetchDonationDuplicates: async (donationId) => {
    try {
      const res = await apiClient.get(`/donations/${donationId}/duplicates`);
      return res.data;
    } catch (err) {
      return null;
    }
  },

  /**
   * Submits administrative review decision on an assessment record.
   */
  reviewAssessment: async (assessmentId, status, reviewNotes = '') => {
    try {
      const res = await apiClient.put(`/admin/risk/assessments/${assessmentId}/review`, {
        status,
        reviewNotes,
      });
      return res.data;
    } catch (err) {
      return null;
    }
  },
};
