/**
 * FoodShareAI - Volunteer Route Service
 *
 * Coordinates multi-stop dispatch routing for volunteer requests:
 * 1. Reuses the 2 delivery requests currently displayed on the dashboard as route stops.
 * 2. Attempts real A* route optimization via volunteerApiService.optimizeMultiStopRoute.
 * 3. If real route optimizer returns a valid route, displays that route normally (isDemo: false).
 * 4. If the optimizer fails, network fails, or returns no route, displays a clearly labeled
 *    "Demo Route — Sample Route" with two static stops using the two requests already displayed.
 * 5. Reuses the actual request names and addresses/coordinates when available.
 * 6. Never overwrites the real donation or delivery locations in the database.
 */
// Provider reference for volunteerApiService (supports testing and dynamic loading)
let volunteerApiServiceInstance = null;

export const setVolunteerApiServiceProvider = (provider) => {
  volunteerApiServiceInstance = provider;
};

const getVolunteerApiService = () => {
  if (volunteerApiServiceInstance) return volunteerApiServiceInstance;
  try {
    const mod = require('../api/volunteerApiService');
    return mod?.volunteerApiService || mod;
  } catch (err) {
    return null;
  }
};

// Clearly identified demo coordinates used strictly for fallback map visualization
export const DEMO_COORDINATES = {
  START: [78.398, 17.438], // Jubilee Hills Volunteer Starting Position
  STOP_1: [78.407, 17.43], // Stop 1 Demo Coordinate (Jubilee Hills)
  STOP_2: [78.435, 17.4156], // Stop 2 Demo Coordinate (Banjara Hills)
};

/**
 * Generates an interpolated multi-point path connecting coordinates for visual polyline
 */
const generateInterpolatedPath = (start, stop1, stop2) => {
  const points = [];

  const interpolate = (p1, p2, steps = 5) => {
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const curvature = Math.sin(t * Math.PI);
      const jitterLng = curvature * 0.002;
      const jitterLat = curvature * 0.0015;
      const lng = i === 0 ? p1[0] : i === steps ? p2[0] : p1[0] + (p2[0] - p1[0]) * t + jitterLng;
      const lat = i === 0 ? p1[1] : i === steps ? p2[1] : p1[1] + (p2[1] - p1[1]) * t + jitterLat;
      points.push([Math.round(lng * 10000) / 10000, Math.round(lat * 10000) / 10000]);
    }
  };

  interpolate(start, stop1, 6);
  points.pop();
  interpolate(stop1, stop2, 6);
  return points;
};

/**
 * Safely extracts coordinates [longitude, latitude] from a delivery task if available
 */
export const extractTaskCoordinates = (task) => {
  if (!task) return null;

  // Check GeoJSON Point [lng, lat]
  const pickupLoc = task.pickupLocation || task.rawTask?.pickupLocation || task.location;
  if (pickupLoc && Array.isArray(pickupLoc.coordinates) && pickupLoc.coordinates.length >= 2) {
    const [lng, lat] = pickupLoc.coordinates;
    if (!isNaN(lng) && !isNaN(lat) && lng !== 0 && lat !== 0) {
      return [Number(lng), Number(lat)];
    }
  }

  // Check { latitude, longitude }
  const directLat = task.latitude || task.pickupLat;
  const directLng = task.longitude || task.pickupLng;
  if (directLat !== undefined && directLng !== undefined && !isNaN(directLat) && !isNaN(directLng)) {
    return [Number(directLng), Number(directLat)];
  }

  return null;
};

/**
 * Builds the clearly labeled "Demo Route — Sample Route" with two static stops
 * using the actual requests displayed on the dashboard.
 */
export const buildDemoRoute = (tasks = [], userCoords = null) => {
  const task1 = tasks[0] || null;
  const task2 = tasks[1] || null;

  // Start Location
  const startCoords =
    userCoords && typeof userCoords.longitude === 'number' && typeof userCoords.latitude === 'number'
      ? [userCoords.longitude, userCoords.latitude]
      : DEMO_COORDINATES.START;

  const startStop = {
    index: 0,
    name: 'Current Location (Volunteer Start)',
    address: 'Jubilee Hills Dispatch Hub, Hyderabad',
    type: 'start',
    label: 'START LOCATION',
    coordinates: startCoords,
    isDemoCoordinates: !userCoords,
  };

  // Stop 1: First available request
  const realStop1Coords = extractTaskCoordinates(task1);
  const stop1 = {
    index: 1,
    name: task1?.pickupName || task1?.foodName || 'First Delivery Request',
    address:
      task1?.pickupAddress ||
      task1?.donorAddress ||
      task1?.rawTask?.pickupLocation?.address ||
      'Jubilee Hills, Road #36',
    quantity: task1?.quantity || '25 meals',
    type: 'stop1',
    label: 'STOP 1 (FIRST REQUEST)',
    coordinates: realStop1Coords || DEMO_COORDINATES.STOP_1,
    isDemoCoordinates: !realStop1Coords,
    rawTask: task1,
  };

  // Stop 2: Second available request
  const realStop2Coords = extractTaskCoordinates(task2);
  const stop2 = {
    index: 2,
    name: task2?.pickupName || task2?.foodName || 'Second Delivery Request',
    address:
      task2?.pickupAddress ||
      task2?.donorAddress ||
      task2?.rawTask?.pickupLocation?.address ||
      'Banjara Hills, Road #12',
    quantity: task2?.quantity || '40 loaves',
    type: 'stop2',
    label: 'STOP 2 (SECOND REQUEST)',
    coordinates: realStop2Coords || DEMO_COORDINATES.STOP_2,
    isDemoCoordinates: !realStop2Coords,
    rawTask: task2,
  };

  const stops = [startStop, stop1, stop2];
  const routePoints = generateInterpolatedPath(startStop.coordinates, stop1.coordinates, stop2.coordinates);

  return {
    isDemo: true,
    algorithm: 'DEMO_SAMPLE',
    demoLabel: 'Demo Route — Sample Route',
    demoNotice: 'Demo Route — Sample Route (Sample visual guidance connecting the 2 displayed requests)',
    isOptimized: false,
    distanceKm: 5.5,
    estimatedDurationMinutes: 20,
    route: {
      type: 'LineString',
      coordinates: routePoints,
    },
    stops,
    generatedAt: new Date(),
  };
};

/**
 * Resolves route for available requests:
 * 1. Tries real A* route optimization via backend
 * 2. If valid, returns normal optimized route
 * 3. If optimizer fails or returns no route, falls back to clearly labeled Demo Route
 */
export const getOptimizedRouteForTasks = async (tasks = [], userCoords = null) => {
  const safeTasks = Array.isArray(tasks) ? tasks.slice(0, 2) : [];

  // When tasks are available, formulate stop candidates
  const demoFallback = buildDemoRoute(safeTasks, userCoords);

  // Attempt real route optimizer
  try {
    const stopsPayload = demoFallback.stops.map((s) => ({
      name: s.name,
      address: s.address,
      coordinates: s.coordinates,
    }));

    const apiService = getVolunteerApiService();
    const realResult = apiService ? await apiService.optimizeMultiStopRoute(stopsPayload) : null;

    if (
      realResult &&
      realResult.isOptimized &&
      realResult.route &&
      Array.isArray(realResult.route.coordinates) &&
      realResult.route.coordinates.length >= 2
    ) {
      return {
        ...realResult,
        isDemo: false,
        demoLabel: null,
        demoNotice: null,
        stops: demoFallback.stops.map((s, idx) => ({
          ...s,
          ...(realResult.stops?.[idx] || {}),
        })),
      };
    }
  } catch (err) {
    // Expected fallback path when optimizer service fails or is unreachable
    console.warn('[volunteerRouteService] Real optimizer failed, using Demo Route fallback:', err?.message);
  }

  // Fallback: Clearly labeled Demo Route
  return demoFallback;
};

export const volunteerRouteService = {
  DEMO_COORDINATES,
  extractTaskCoordinates,
  buildDemoRoute,
  getOptimizedRouteForTasks,
  setVolunteerApiServiceProvider,
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    DEMO_COORDINATES,
    extractTaskCoordinates,
    buildDemoRoute,
    getOptimizedRouteForTasks,
    setVolunteerApiServiceProvider,
    volunteerRouteService,
  };
}
