/**
 * AI Insights Service for FoodShareAI Admin Intelligence
 * Exposes prioritized operational observations grouped by severity and domain.
 */
export const insightsService = {
  getInsights: () => {
    return [
      {
        id: 'ins-1',
        category: 'Demand',
        severity: 'High',
        title: 'High Demand Deficit in Jubilee Hills',
        description: 'Demand for cooked meals exceeds available surplus supply by 440 meals in North Jubilee Hills.',
        timestamp: '15 min ago',
        actionText: 'Broadcast Alert to Nearby Restaurants',
      },
      {
        id: 'ins-2',
        category: 'Logistics',
        severity: 'Medium',
        title: 'Volunteer Availability Drop Expected',
        description: 'Historical data indicates a 22% drop in active evening volunteers between 7:00 PM - 9:00 PM.',
        timestamp: '1 hour ago',
        actionText: 'Send Volunteer Incentive Push',
      },
      {
        id: 'ins-3',
        category: 'Supply',
        severity: 'Low',
        title: 'Bakery Surplus Excess',
        description: 'Bakery surplus listings currently exceed recorded NGO requests by 220 items.',
        timestamp: '2 hours ago',
        actionText: 'Notify Community Centers',
      },
      {
        id: 'ins-4',
        category: 'Safety',
        severity: 'Critical',
        title: 'Donation Approaching Best-Before Limit',
        description: 'Listing #DON-8842 has 45 minutes remaining in its safe consumption window.',
        timestamp: ' Just now',
        actionText: 'Fast-Track Priority Match',
      },
    ];
  },
};
