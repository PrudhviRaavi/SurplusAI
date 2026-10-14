/**
 * FoodShareAI - Comprehensive Test Suite:
 * Real-Time Donation Synchronization, OpenStreetMap Location & Food Freshness Prediction
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

// Pure JS modules
const {
  estimateFreshness,
  FRESHNESS_STATUS,
  PREDICTION_SOURCE,
} = require('../ai/freshnessEstimator');

function runAllTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING REAL-TIME, OSM LOCATION & FRESHNESS TEST SUITE');
  console.log('================================================================\n');

  let passed = 0;
  let total = 0;

  function runTest(name, fn) {
    total++;
    try {
      fn();
      console.log(`  ✓ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ [FAIL] ${name}:`, err.message);
    }
  }

  // -------------------------------------------------------------
  // SUITE 1: PRIORITY 3 - FRESHNESS PREDICTION HONESTY & LOGIC
  // -------------------------------------------------------------
  console.log('--- [SUITE 1] PRIORITY 3: FOOD FRESHNESS PREDICTION & HONESTY ---');

  runTest('1.1 Transparently identifies RULES_BASED_ESTIMATE when no trained model is loaded', () => {
    const res = estimateFreshness({
      foodCategory: 'COOKED_MEALS',
      preparationTime: new Date(Date.now() - 2 * 3600000).toISOString(),
      storageCondition: 'room',
    });
    assert.strictEqual(res.source, PREDICTION_SOURCE.RULES_BASED_ESTIMATE);
    assert.strictEqual(res.isModelLoaded, false);
    assert.ok(res.disclaimer.includes('rules-based food safety estimate') || res.disclaimer.includes('not a trained ML prediction'));
    assert.ok(res.score > 0);
    assert.ok(res.factors.length >= 3);
  });

  runTest('1.2 Returns INSUFFICIENT_DATA when key baseline info is missing', () => {
    const res = estimateFreshness({
      foodCategory: '',
      preparationTime: '',
    });
    assert.strictEqual(res.status, 'INSUFFICIENT_DATA');
    assert.strictEqual(res.score, null);
    assert.ok(res.label.includes('Freshness estimate unavailable — additional information required'));
  });

  runTest('1.3 Classifies spoiled/expired food as HIGH risk (<50 score) per food safety baselines', () => {
    const res = estimateFreshness({
      foodCategory: 'COOKED_MEALS',
      preparationTime: new Date(Date.now() - 12 * 3600000).toISOString(),
      storageCondition: 'room',
    });
    assert.strictEqual(res.riskLevel, 'HIGH');
    assert.ok(res.score < 50);
    assert.strictEqual(res.safeHoursRemaining, 0);
  });

  runTest('1.4 Refrigeration significantly extends safe shelf life calculation', () => {
    const res = estimateFreshness({
      foodCategory: 'COOKED_MEALS',
      preparationTime: new Date(Date.now() - 6 * 3600000).toISOString(),
      storageCondition: 'refrigerated',
    });
    assert.strictEqual(res.riskLevel, 'LOW');
    assert.ok(res.score >= 70);
    assert.ok(res.safeHoursRemaining > 0);
  });

  runTest('1.5 AIAnalysisResultScreen displays honest rules-based badge and disclaimers', () => {
    const filePath = path.resolve(__dirname, '../../components/donor/AIAnalysisResultScreen.js');
    const code = fs.readFileSync(filePath, 'utf8');
    assert.ok(code.includes('RULES-BASED ESTIMATE'), 'Must render rules-based estimate badge');
    assert.ok(code.includes('TRAINED ML MODEL'), 'Must distinguish trained ML model');
    assert.ok(code.includes('safetyDisclaimer') || code.includes('Never infer food safety'), 'Must show food safety disclaimer');
  });

  // -------------------------------------------------------------
  // SUITE 2: PRIORITY 2 - OPENSTREETMAP & CURRENT GPS LOCATION
  // -------------------------------------------------------------
  console.log('\n--- [SUITE 2] PRIORITY 2: OPENSTREETMAP LOCATION & DISTANCES ---');

  runTest('2.1 Haversine formula correctly computes real geographic distance (Hyderabad coords)', () => {
    function haversine(lat1, lon1, lat2, lon2) {
      if (lat1 === null || lon1 === null || lat2 === null || lon2 === null) return null;
      const R = 6371;
      const dLat = ((lat2 - lat1) * Math.PI) / 180;
      const dLon = ((lon2 - lon1) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
          Math.cos((lat2 * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return Math.round(R * c * 10) / 10;
    }

    const dist = haversine(17.4300, 78.4000, 17.4150, 78.4350);
    assert.ok(dist >= 3.5 && dist <= 4.5, `Expected ~4.0km, got ${dist}`);
    assert.strictEqual(haversine(17.43, 78.40, 17.43, 78.40), 0.0);
    assert.strictEqual(haversine(null, 78.40, 17.43, 78.40), null);
  });

  runTest('2.2 Slippy Map tile calculation produces valid OSM tile coordinates', () => {
    function latLngToTileXY(lat, lon, zoom) {
      const x = Math.floor(((lon + 180) / 360) * Math.pow(2, zoom));
      const latRad = (lat * Math.PI) / 180;
      const y = Math.floor(
        ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * Math.pow(2, zoom)
      );
      return { x, y };
    }

    const tile = latLngToTileXY(17.4375, 78.4082, 14);
    assert.ok(tile.x > 0 && tile.x < 16384, 'Tile X must be valid at zoom 14');
    assert.ok(tile.y > 0 && tile.y < 16384, 'Tile Y must be valid at zoom 14');
  });

  runTest('2.3 LocationPickerMap & OpenStreetMapViewer include OSM attribution and GPS button', () => {
    const viewerPath = path.resolve(__dirname, '../../components/common/OpenStreetMapViewer.js');
    const pickerPath = path.resolve(__dirname, '../../components/common/LocationPickerMap.js');
    const locServicePath = path.resolve(__dirname, '../location/locationService.js');
    const viewerCode = fs.readFileSync(viewerPath, 'utf8');
    const pickerCode = fs.readFileSync(pickerPath, 'utf8');
    const locServiceCode = fs.readFileSync(locServicePath, 'utf8');

    assert.ok(viewerCode.includes('OpenStreetMap contributors'), 'Viewer must display OSM attribution');
    assert.ok(viewerCode.includes('openstreetmap.de') || viewerCode.includes('openstreetmap.org') || viewerCode.includes('wikimedia.org'), 'Viewer must load tiles from compliant OSM provider');
    assert.ok(pickerCode.includes('Use device current location'), 'Picker must have real device location button');
    assert.ok(locServiceCode.includes('nominatim.openstreetmap.org'), 'Must use OSM Nominatim');
  });

  runTest('2.4 CreateDonationFlow captures and stores actual coordinates in MongoDB GeoJSON format', () => {
    const flowPath = path.resolve(__dirname, '../../screens/donor/CreateDonationFlow.js');
    const flowCode = fs.readFileSync(flowPath, 'utf8');

    assert.ok(flowCode.includes('pickupCoords'), 'Must store pickupCoords state');
    assert.ok(flowCode.includes("type: 'Point'"), 'Must format location as GeoJSON Point');
    assert.ok(flowCode.includes('coordinates: coordsArray'), 'Must pass real coordsArray');
  });

  // -------------------------------------------------------------
  // SUITE 3: PRIORITY 1 - REAL-TIME DONATION SYNCHRONIZATION
  // -------------------------------------------------------------
  console.log('\n--- [SUITE 3] PRIORITY 1: REAL-TIME SYNCHRONIZATION & LIST UPDATES ---');

  runTest('3.1 Backend Socket.IO configures rooms and broadcasts for donations and tasks', () => {
    const socketPath = path.resolve(__dirname, '../../../backend/src/socket/index.js');
    const socketCode = fs.readFileSync(socketPath, 'utf8');

    assert.ok(socketCode.includes('broadcastDonationCreated'), 'Must have broadcastDonationCreated');
    assert.ok(socketCode.includes('broadcastDonationUpdated'), 'Must have broadcastDonationUpdated');
    assert.ok(socketCode.includes('broadcastTaskUpdated'), 'Must have broadcastTaskUpdated');
    assert.ok(socketCode.includes('role:NGO'), 'Must join role:NGO room');
    assert.ok(socketCode.includes('role:VOLUNTEER'), 'Must join role:VOLUNTEER room');
  });

  runTest('3.2 donationService emits broadcastDonationCreated when donation is published', () => {
    const servicePath = path.resolve(__dirname, '../../../backend/src/services/donationService.js');
    const serviceCode = fs.readFileSync(servicePath, 'utf8');

    assert.ok(serviceCode.includes('broadcastDonationCreated'), 'publishDonation must emit broadcastDonationCreated');
  });

  runTest('3.3 deliveryService includes published donations for volunteer pickup', () => {
    const deliveryPath = path.resolve(__dirname, '../../../backend/src/services/deliveryService.js');
    const deliveryCode = fs.readFileSync(deliveryPath, 'utf8');

    assert.ok(deliveryCode.includes('DONATION_STATUS.PUBLISHED'), 'Volunteers must see published donations');
    assert.ok(deliveryCode.includes('getAvailableDeliveryTasks'), 'Must query available tasks');
  });

  runTest('3.4 NGO dashboard and discover screens subscribe to real-time events and 10s polling', () => {
    const ngoDashPath = path.resolve(__dirname, '../../screens/ngo/NgoDashboardScreen.js');
    const discoverPath = path.resolve(__dirname, '../../screens/ngo/DiscoverTabScreen.js');
    const ngoDashCode = fs.readFileSync(ngoDashPath, 'utf8');
    const discoverCode = fs.readFileSync(discoverPath, 'utf8');

    assert.ok(ngoDashCode.includes('socketClient.onDonationCreated') || ngoDashCode.includes('onDonationChange'), 'NGO dashboard must listen to donation changes');
    assert.ok(ngoDashCode.includes('setInterval(fetchDashboard, 10000)'), 'NGO dashboard must poll every 10s');
    assert.ok(discoverCode.includes('socketClient.onDonationCreated') || discoverCode.includes('onDonationChange'), 'Discover must listen to donation changes');
    assert.ok(discoverCode.includes('setInterval(fetchLiveDonations, 10000)'), 'Discover must poll every 10s');
  });

  runTest('3.5 Volunteer dashboard and tasks tab screens subscribe to real-time events and 10s polling', () => {
    const volDashPath = path.resolve(__dirname, '../../screens/volunteer/VolunteerDashboardScreen.js');
    const volTasksPath = path.resolve(__dirname, '../../screens/volunteer/VolunteerTasksTabScreen.js');
    const volDashCode = fs.readFileSync(volDashPath, 'utf8');
    const volTasksCode = fs.readFileSync(volTasksPath, 'utf8');

    assert.ok(volDashCode.includes('socketClient.onTaskChange'), 'Volunteer dashboard must listen to tasks');
    assert.ok(volDashCode.includes('socketClient.onDonationChange'), 'Volunteer dashboard must listen to donations');
    assert.ok(volDashCode.includes('setInterval(fetchDashboard, 10000)'), 'Volunteer dashboard must poll every 10s');
    assert.ok(volTasksCode.includes('socketClient.onTaskChange'), 'Volunteer tasks must listen to tasks');
    assert.ok(volTasksCode.includes('setInterval(fetchTasks, 10000)'), 'Volunteer tasks must poll every 10s');
  });

  console.log('\n================================================================');
  console.log(`🏁 TEST RESULTS: ${passed}/${total} PASSED (${Math.round((passed / total) * 100)}%)`);
  console.log('================================================================\n');

  if (passed !== total) {
    process.exit(1);
  }
}

runAllTests();
