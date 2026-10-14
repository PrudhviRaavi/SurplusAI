/**
 * FoodShareAI - Volunteer Route Optimization & Demo Fallback Test Suite
 *
 * Verifies:
 * 1. Two delivery requests appear as route stops in the route section.
 * 2. When real optimizer returns a valid route, it is displayed normally (isDemo: false).
 * 3. When optimizer fails or returns no route, fallback displays clearly labeled
 *    "Demo Route — Sample Route" with two static stops.
 * 4. Actual request names and addresses are reused; no real addresses invented.
 * 5. Missing coordinates use identified demo coordinates for map visualization only.
 * 6. Database models and documents are never overwritten by demo coordinates.
 * 7. Backend A* multi-stop route optimization correctly calculates sequential legs.
 */
const assert = require('assert');
const path = require('path');

// 1. Frontend Route Service & Component Contracts
const {
  volunteerRouteService,
  DEMO_COORDINATES,
  extractTaskCoordinates,
  buildDemoRoute,
  getOptimizedRouteForTasks,
  setVolunteerApiServiceProvider,
} = require('../routes/volunteerRouteService');

// 2. Backend A* Route Optimization Service
const routeOptimizationService = require('../../../backend/src/services/routeOptimizationService');

console.log('================================================================');
console.log('🧪 RUNNING VOLUNTEER ROUTE OPTIMIZATION & DEMO ROUTE TEST SUITE');
console.log('================================================================\n');

let testsPassed = 0;
let totalTests = 0;

function runTest(testName, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✓ [PASS] ${testName}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function runAsyncTest(testName, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✓ [PASS] ${testName}`);
    testsPassed++;
  } catch (err) {
    console.error(`  ❌ [FAIL] ${testName}`);
    console.error(`     Error: ${err.message}`);
    process.exitCode = 1;
  }
}

async function executeTestSuite() {
  console.log('--- [SUITE 1] MULTI-STOP ROUTE & TWO-REQUEST STOPS EXTRACTION ---');

  const mockTasks = [
    {
      id: 'task-101',
      pickupName: 'Royal Spice Kitchen',
      pickupAddress: 'Road #36, Jubilee Hills, Hyderabad',
      quantity: '30 meals',
      pickupLocation: {
        type: 'Point',
        coordinates: [78.4065, 17.4312],
      },
    },
    {
      id: 'task-102',
      pickupName: 'Artisan Sourdough Bakery',
      pickupAddress: 'Road #12, Banjara Hills, Hyderabad',
      quantity: '45 loaves',
      pickupLocation: {
        type: 'Point',
        coordinates: [78.4348, 17.4162],
      },
    },
  ];

  runTest('1.1 When 2 delivery requests are available, route contains Start, Stop 1, and Stop 2', () => {
    const demoRoute = buildDemoRoute(mockTasks);
    assert.ok(demoRoute, 'Must generate a route');
    assert.strictEqual(demoRoute.stops.length, 3, 'Must have exactly 3 stops (Start, Stop 1, Stop 2)');
    assert.strictEqual(demoRoute.stops[0].type, 'start', 'First stop must be start location');
    assert.strictEqual(demoRoute.stops[1].type, 'stop1', 'Second stop must be stop 1');
    assert.strictEqual(demoRoute.stops[2].type, 'stop2', 'Third stop must be stop 2');
  });

  runTest('1.2 Reuses actual request names and addresses from the dashboard', () => {
    const demoRoute = buildDemoRoute(mockTasks);
    assert.strictEqual(demoRoute.stops[1].name, 'Royal Spice Kitchen', 'Stop 1 must match request 1 name');
    assert.strictEqual(demoRoute.stops[1].address, 'Road #36, Jubilee Hills, Hyderabad', 'Stop 1 must match request 1 address');
    assert.strictEqual(demoRoute.stops[1].quantity, '30 meals', 'Stop 1 must include quantity');

    assert.strictEqual(demoRoute.stops[2].name, 'Artisan Sourdough Bakery', 'Stop 2 must match request 2 name');
    assert.strictEqual(demoRoute.stops[2].address, 'Road #12, Banjara Hills, Hyderabad', 'Stop 2 must match request 2 address');
    assert.strictEqual(demoRoute.stops[2].quantity, '45 loaves', 'Stop 2 must include quantity');
  });

  runTest('1.3 Reuses real coordinates when present on the requests without inventing fake coordinates', () => {
    const demoRoute = buildDemoRoute(mockTasks);
    assert.deepStrictEqual(demoRoute.stops[1].coordinates, [78.4065, 17.4312], 'Stop 1 must use real GeoJSON coordinates');
    assert.strictEqual(demoRoute.stops[1].isDemoCoordinates, false, 'Stop 1 isDemoCoordinates flag must be false when real');
    assert.deepStrictEqual(demoRoute.stops[2].coordinates, [78.4348, 17.4162], 'Stop 2 must use real GeoJSON coordinates');
    assert.strictEqual(demoRoute.stops[2].isDemoCoordinates, false, 'Stop 2 isDemoCoordinates flag must be false when real');
  });

  runTest('1.4 If actual coordinates are missing, falls back to clearly identified demo coordinates only for map display', () => {
    const tasksWithoutCoords = [
      { id: 't1', pickupName: 'Local Dhaba', pickupAddress: 'Old City, Hyderabad' },
      { id: 't2', pickupName: 'City Bakery', pickupAddress: 'Secunderabad' },
    ];
    const demoRoute = buildDemoRoute(tasksWithoutCoords);
    assert.deepStrictEqual(demoRoute.stops[1].coordinates, DEMO_COORDINATES.STOP_1, 'Stop 1 falls back to DEMO_COORDINATES.STOP_1');
    assert.strictEqual(demoRoute.stops[1].isDemoCoordinates, true, 'Stop 1 marked as demo coordinates');
    assert.deepStrictEqual(demoRoute.stops[2].coordinates, DEMO_COORDINATES.STOP_2, 'Stop 2 falls back to DEMO_COORDINATES.STOP_2');
    assert.strictEqual(demoRoute.stops[2].isDemoCoordinates, true, 'Stop 2 marked as demo coordinates');
    // Ensure task object original data was NOT modified/mutated
    assert.strictEqual(tasksWithoutCoords[0].coordinates, undefined, 'Original task object must not be mutated');
  });

  console.log('\n--- [SUITE 2] DEMO ROUTE FALLBACK & LABELS ---');

  runTest('2.1 Demo Route fallback has prominent label "Demo Route — Sample Route"', () => {
    const demoRoute = buildDemoRoute(mockTasks);
    assert.strictEqual(demoRoute.isDemo, true, 'isDemo flag must be true');
    assert.strictEqual(demoRoute.demoLabel, 'Demo Route — Sample Route', 'demoLabel must be exact required string');
    assert.strictEqual(demoRoute.algorithm, 'DEMO_SAMPLE', 'Algorithm identifier reflects demo fallback');
    assert.ok(demoRoute.demoNotice.includes('Demo Route — Sample Route'), 'Notice explains demo nature');
  });

  runTest('2.2 Generates connecting visual route LineString coordinates connecting stops', () => {
    const demoRoute = buildDemoRoute(mockTasks);
    assert.strictEqual(demoRoute.route.type, 'LineString', 'Route must be GeoJSON LineString');
    assert.ok(Array.isArray(demoRoute.route.coordinates), 'Coordinates must be array');
    assert.ok(demoRoute.route.coordinates.length >= 10, 'Must have interpolated points connecting all 3 stops');
    // First point must be start, last point must be stop 2
    const firstPt = demoRoute.route.coordinates[0];
    const lastPt = demoRoute.route.coordinates[demoRoute.route.coordinates.length - 1];
    assert.deepStrictEqual(firstPt, demoRoute.stops[0].coordinates, 'Route line starts at start location');
    assert.deepStrictEqual(lastPt, demoRoute.stops[2].coordinates, 'Route line ends at stop 2');
  });

  console.log('\n--- [SUITE 3] OPTIMIZER INTEGRATION & PRIORITY HIERARCHY ---');

  await runAsyncTest('3.1 When real route optimizer succeeds, returns real route (isDemo: false)', async () => {
    // Mock volunteerApiService.optimizeMultiStopRoute to simulate real backend response
    const mockRealResult = {
      algorithm: 'A*',
      routeSource: 'OpenStreetMap Graph',
      isOptimized: true,
      distanceKm: 4.8,
      estimatedDurationMinutes: 16,
      route: {
        type: 'LineString',
        coordinates: [
          [78.398, 17.438],
          [78.402, 17.435],
          [78.4065, 17.4312],
          [78.420, 17.424],
          [78.4348, 17.4162],
        ],
      },
      stops: [
        { index: 0, name: 'Volunteer Start' },
        { index: 1, name: 'Royal Spice Kitchen' },
        { index: 2, name: 'Artisan Sourdough Bakery' },
      ],
    };

    // Inject mock service provider
    setVolunteerApiServiceProvider({
      optimizeMultiStopRoute: async () => mockRealResult,
    });

    try {
      const result = await getOptimizedRouteForTasks(mockTasks);
      assert.strictEqual(result.isDemo, false, 'Real route must have isDemo: false');
      assert.strictEqual(result.algorithm, 'A*', 'Real route algorithm is A*');
      assert.strictEqual(result.distanceKm, 4.8, 'Real distance preserved');
      assert.strictEqual(result.stops.length, 3, 'All 3 stops preserved');
    } finally {
      setVolunteerApiServiceProvider(null);
    }
  });

  await runAsyncTest('3.2 When real optimizer fails or throws, gracefully falls back to Demo Route', async () => {
    // Inject failing service provider
    setVolunteerApiServiceProvider({
      optimizeMultiStopRoute: async () => {
        throw new Error('Connection refused / 500 Internal Server Error');
      },
    });

    try {
      const result = await getOptimizedRouteForTasks(mockTasks);
      assert.strictEqual(result.isDemo, true, 'Failed optimizer must fall back to isDemo: true');
      assert.strictEqual(result.demoLabel, 'Demo Route — Sample Route', 'Fallback must show Demo Route label');
      assert.strictEqual(result.stops.length, 3, 'Must maintain 3 stops');
      assert.strictEqual(result.stops[1].name, 'Royal Spice Kitchen', 'Stop 1 preserved');
      assert.strictEqual(result.stops[2].name, 'Artisan Sourdough Bakery', 'Stop 2 preserved');
    } finally {
      setVolunteerApiServiceProvider(null);
    }
  });

  console.log('\n--- [SUITE 4] BACKEND A* MULTI-STOP ROUTE OPTIMIZATION ENGINE ---');

  runTest('4.1 Backend generateMultiStopRoute calculates sequential A* paths between stops', () => {
    const backendStops = [
      { name: 'Volunteer Center', coordinates: [78.4000, 17.4350] },
      { name: 'Donor 1', coordinates: [78.4070, 17.4300] },
      { name: 'Donor 2', coordinates: [78.4350, 17.4156] },
    ];

    const result = routeOptimizationService.generateMultiStopRoute(backendStops);
    assert.ok(result, 'Must return route result');
    assert.strictEqual(result.algorithm, 'A*', 'Algorithm must strictly be A*');
    assert.strictEqual(result.isOptimized, true, 'isOptimized must be true');
    assert.strictEqual(result.stops.length, 3, 'Must contain 3 stops');
    assert.strictEqual(result.legs.length, 2, 'Must have 2 legs (Start->Stop1, Stop1->Stop2)');
    assert.ok(result.distanceKm > 0, 'Distance must be positive');
    assert.ok(result.estimatedDurationMinutes > 0, 'Duration must be positive');
    assert.ok(Array.isArray(result.route.coordinates), 'Coordinates must be GeoJSON array');
    assert.ok(result.route.coordinates.length >= 3, 'Must contain connected path nodes');
  });

  runTest('4.2 Backend generateMultiStopRoute rejects fewer than 2 stops with informative error', () => {
    assert.throws(
      () => routeOptimizationService.generateMultiStopRoute([{ name: 'Solo', coordinates: [78.4, 17.4] }]),
      /At least two stops/
    );
  });

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${testsPassed}/${totalTests} PASSED (${Math.round((testsPassed / totalTests) * 100)}%)`);
  console.log('================================================================\n');

  if (testsPassed !== totalTests) {
    process.exit(1);
  }
}

executeTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
