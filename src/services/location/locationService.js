/**
 * Location Service Abstraction for FoodShareAI
 * Exposes getCurrentLocation() and watchLocation().
 * Prepared for React Native Expo Location / GPS tracking API integration.
 */
export const locationService = {
  getCurrentLocation: async () => {
    return {
      latitude: 17.4326,
      longitude: 78.4071,
      address: 'Jubilee Hills Checkpost, Hyderabad',
      timestamp: new Date().toISOString(),
    };
  },

  watchLocation: (callback) => {
    const interval = setInterval(async () => {
      const loc = await locationService.getCurrentLocation();
      if (callback) callback(loc);
    }, 5000);

    return () => clearInterval(interval);
  },
};
