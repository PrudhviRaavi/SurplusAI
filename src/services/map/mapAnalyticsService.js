/**
 * Map Analytics Service for FoodShareAI Admin Intelligence
 * Exposes geographic coordinates for Surplus Hotspots (Restaurants/Hotels)
 * and Demand Hotspots (NGO clusters).
 */
export const mapAnalyticsService = {
  getSurplusHotspots: () => {
    return [
      { id: 'hs-1', name: 'Jubilee Hills Restaurant Corridor', intensity: 'High', count: 42, lat: 17.4326, lng: 78.4071 },
      { id: 'hs-2', name: 'Banjara Hills Hotel Hub', intensity: 'High', count: 38, lat: 17.4156, lng: 78.4347 },
      { id: 'hs-3', name: 'Hitec City IT Park Canteens', intensity: 'Medium', count: 24, lat: 17.4435, lng: 78.3772 },
    ];
  },

  getDemandHotspots: () => {
    return [
      { id: 'dh-1', name: 'Koti Community Care Cluster', demandLevel: 'Critical', requiredMeals: 680, lat: 17.385, lng: 78.4867 },
      { id: 'dh-2', name: 'Secunderabad Outreach Hub', demandLevel: 'High', requiredMeals: 450, lat: 17.4399, lng: 78.4983 },
      { id: 'dh-3', name: 'Old City Relief Network', demandLevel: 'High', requiredMeals: 520, lat: 17.3616, lng: 78.4747 },
    ];
  },
};
