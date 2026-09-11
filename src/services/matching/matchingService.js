import { mockMatchingService } from './mockMatchingService';
import { ngoApiService } from '../api/ngoApiService';

/**
 * Public Matching Service Interface
 * UI components call matchingService.findMatches(donation).
 * Attempts live backend smart matching with graceful offline/mock fallback.
 */
export const matchingService = {
  findMatches: async (donation) => {
    try {
      if (donation && (donation.id || donation._id)) {
        const donationId = donation.id || donation._id;
        try {
          const res = await ngoApiService.getMatchDetails(donationId);
          if (res && res.data) {
            return {
              success: true,
              matches: [res.data],
              source: 'api',
            };
          }
        } catch (_) {
          // Fall through to fallback
        }
      }

      const result = await mockMatchingService.findMatches(donation);
      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Something went wrong while finding matches. Please try again.',
        matches: [],
      };
    }
  },
};
