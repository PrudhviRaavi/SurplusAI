/**
 * Mock Volunteer Matching Service for FoodShareAI
 * Implements weighted 7-factor scoring engine:
 * 1. Distance to pickup (25%)
 * 2. Availability & Window Match (20%)
 * 3. Transportation Suitability (15%)
 * 4. Travel Radius (15%)
 * 5. Current Workload (10%)
 * 6. Reliability & Completion History (10%)
 * 7. Pickup Timing Compatibility (5%)
 */

const mockVolunteers = [
  {
    volunteerId: 'VOL-001',
    name: 'Arjun Kumar',
    phone: '+91 98765 11223',
    transportation: 'Two-wheeler',
    transportIcon: '🛵',
    distanceToPickupKm: 1.8,
    travelRadiusKm: 15,
    availabilityWindow: '5:30 PM – 9:00 PM',
    activeTasks: 0,
    completionRate: '97%',
    isVerified: true,
  },
  {
    volunteerId: 'VOL-002',
    name: 'Priya Sharma',
    phone: '+91 98765 33445',
    transportation: 'Car',
    transportIcon: '🚗',
    distanceToPickupKm: 3.2,
    travelRadiusKm: 12,
    availabilityWindow: '5:00 PM – 9:30 PM',
    activeTasks: 0,
    completionRate: '99%',
    isVerified: true,
  },
  {
    volunteerId: 'VOL-003',
    name: 'Rahul Kumar',
    phone: '+91 98765 55667',
    transportation: 'Bicycle',
    transportIcon: '🚲',
    distanceToPickupKm: 4.6,
    travelRadiusKm: 8,
    availabilityWindow: '6:00 PM – 8:30 PM',
    activeTasks: 1,
    completionRate: '92%',
    isVerified: true,
  },
];

export const mockVolunteerMatchingService = {
  findVolunteers: async (donation, ngo) => {
    // Simulate ML matching calculation delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const scoredVolunteers = mockVolunteers
      .map((vol) => {
        // Eligibility check 1: Workload (cannot be overloaded > 1)
        if (vol.activeTasks > 1) return null;

        // 1. Distance Score (25%)
        let distScore = 25;
        if (vol.distanceToPickupKm > 5) distScore = 12;
        else if (vol.distanceToPickupKm > 3) distScore = 18;

        // 2. Availability Score (20%)
        const availScore = 20;

        // 3. Transportation Score (15%)
        const transportScore = vol.transportation === 'Two-wheeler' || vol.transportation === 'Car' ? 15 : 10;

        // 4. Travel Radius (15%)
        const radiusScore = vol.distanceToPickupKm <= vol.travelRadiusKm ? 15 : 5;

        // 5. Workload Score (10%)
        const workloadScore = vol.activeTasks === 0 ? 10 : 4;

        // 6. Reliability Score (10%)
        const reliabilityScore = 9;

        // 7. Pickup Timing (5%)
        const timingScore = 5;

        const totalScore = Math.min(
          98,
          distScore +
            availScore +
            transportScore +
            radiusScore +
            workloadScore +
            reliabilityScore +
            timingScore
        );

        // Transparent recommendation reasons
        const reasons = [
          'Available during pickup window (6:00 PM – 8:00 PM)',
          `${vol.distanceToPickupKm} km from donor location`,
          `Has suitable transportation (${vol.transportation})`,
          `Within preferred travel radius (${vol.travelRadiusKm} km)`,
          vol.activeTasks === 0 ? 'No active delivery tasks' : `${vol.activeTasks} active delivery`,
          `${vol.completionRate} historical completion rate`,
        ];

        return {
          volunteerId: vol.volunteerId,
          name: vol.name,
          phone: vol.phone,
          transportation: vol.transportation,
          transportIcon: vol.transportIcon,
          matchScore: Math.round(totalScore),
          matchLabel: totalScore >= 90 ? 'Excellent match' : 'Strong match',
          isVerified: vol.isVerified,
          distanceToPickupKm: vol.distanceToPickupKm,
          travelRadiusKm: vol.travelRadiusKm,
          availabilityWindow: vol.availabilityWindow,
          activeTasks: vol.activeTasks,
          completionRate: vol.completionRate,
          reasons,
        };
      })
      .filter(Boolean)
      .sort((a, b) => b.matchScore - a.matchScore);

    return {
      success: true,
      donationId: donation?.id || 'DON-8842',
      foodName: donation?.foodName || 'Vegetable Biryani',
      volunteers: scoredVolunteers,
    };
  },
};
