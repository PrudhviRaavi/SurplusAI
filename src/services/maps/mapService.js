/**
 * Map Service Abstraction for FoodShareAI
 * Exposes route calculations (getRoute) and waypoint mapping.
 * Currently uses mock route telemetry, ready for OpenStreetMap / OSRM routing backend.
 */
export const mapService = {
  getRoute: async (origin, destination) => {
    // Simulate routing network latency
    await new Promise((resolve) => setTimeout(resolve, 400));

    return {
      success: true,
      origin: origin || 'Jubilee Hills, Hyderabad',
      destination: destination || 'Hope Community Kitchen, Koti, Hyderabad',
      distanceKm: 4.2,
      durationMinutes: 14,
      formattedDistance: '4.2 km',
      formattedDuration: 'Approx. 14 min',
      waypoints: [
        { latitude: 17.43, longitude: 78.4 },
        { latitude: 17.41, longitude: 78.43 },
        { latitude: 17.39, longitude: 78.47 },
      ],
    };
  },
};
