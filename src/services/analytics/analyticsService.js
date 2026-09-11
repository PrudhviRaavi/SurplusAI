/**
 * Platform Analytics Service for FoodShareAI Admin Intelligence
 * Exposes KPI telemetry, trend comparisons, and logistics performance.
 */
export const analyticsService = {
  getKPIs: (timeframe = '30 Days') => {
    return {
      activeDonations: { value: 248, change: '+12.4%', isPositive: true },
      completedDonations: { value: 1842, change: '+24.1%', isPositive: true },
      foodRescuedKg: { value: 2460, change: '+18.4%', isPositive: true, unit: 'kg' },
      mealsRedistributed: { value: 6320, change: '+21.0%', isPositive: true, unit: 'meals' },
      activeNgos: { value: 86, change: '+8.2%', isPositive: true },
      activeVolunteers: { value: 312, change: '+15.6%', isPositive: true },
      estimatedCo2AvoidedKg: { value: 840, change: '+18.4%', isPositive: true, unit: 'kg' },
    };
  },

  getLogisticsMetrics: () => {
    return {
      avgMatchTimeMinutes: 8,
      avgClaimTimeMinutes: 14,
      avgVolunteerAssignTimeMinutes: 12,
      avgPickupTimeMinutes: 22,
      avgDeliveryTimeMinutes: 18,
      completionRatePercent: 92,
      cancellationRatePercent: 4.2,
    };
  },

  getLiveActivity: () => {
    return [
      { id: 'act-1', time: '10:42 AM', title: 'Donation Created', description: 'Green Leaf Restaurant created a surplus listing (#DON-8842).' },
      { id: 'act-2', time: '10:45 AM', title: 'Donation Claimed', description: 'Hope Community Kitchen claimed 25 meals of Vegetable Biryani.' },
      { id: 'act-3', time: '10:51 AM', title: 'Volunteer Assigned', description: 'Arjun Kumar accepted the food rescue delivery task.' },
      { id: 'act-4', time: '11:02 AM', title: 'Food Collected', description: 'Arjun Kumar picked up food from Green Leaf Restaurant.' },
      { id: 'act-5', time: '11:24 AM', title: 'Delivery Completed', description: '25 meals delivered to Hope Community Kitchen.' },
    ];
  },
};
