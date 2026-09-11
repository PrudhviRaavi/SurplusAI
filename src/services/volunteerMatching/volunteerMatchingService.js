import { mockVolunteerMatchingService } from './mockVolunteerMatchingService';

/**
 * Public Volunteer Matching Service Interface
 * UI components call volunteerMatchingService.findVolunteers(donation, ngo).
 * Currently routes to mockVolunteerMatchingService, ready for customML / backend endpoint integration.
 */
export const volunteerMatchingService = {
  findVolunteers: async (donation, ngo) => {
    try {
      const result = await mockVolunteerMatchingService.findVolunteers(donation, ngo);
      return result;
    } catch (err) {
      return {
        success: false,
        error: err.message || 'Something went wrong while finding volunteers. Please try again.',
        volunteers: [],
      };
    }
  },
};
