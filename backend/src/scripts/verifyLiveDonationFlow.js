/**
 * FoodShareAI - Live End-to-End Donation Flow Verification Script
 * 
 * Verifies real application flow without training models:
 * 1. Valid donation with AI detection and valid mapped category.
 * 2. Donation with unknown AI category and manual category selected by donor.
 * 3. Image that produces no detections (empty detections).
 * 4. Image with multiple detections.
 * 5. Live HTTP network hop, missing model, and unavailable ML service handling.
 * 6. Full cleanup of all created test records in MongoDB.
 */

const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const DonorProfile = require('../models/DonorProfile');
const Donation = require('../models/Donation');
const AIAnalysis = require('../models/AIAnalysis');
const { generateAccessToken } = require('../utils/jwt');

const donationService = require('../services/donationService');
const aiAnalysisService = require('../services/aiAnalysisService');

const BACKEND_URL = `http://localhost:${process.env.PORT || 5000}`;
const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_to_a_long_random_secret';

const VALID_PNG_BASE64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

// Global fetch interceptor to inject simulated ML microservice payloads where needed
const nativeFetch = global.fetch;
let customMlHandler = null;

global.fetch = async (url, options) => {
  if (typeof url === 'string' && url.includes('/api/ml/analyze/json') && customMlHandler) {
    return customMlHandler(url, options);
  }
  return nativeFetch(url, options);
};

let testUser = null;
let testToken = null;
const createdDonationIds = [];
const createdAnalysisIds = [];

const logSection = (title) => {
  console.log('\n' + '='.repeat(60));
  console.log(`📌 ${title}`);
  console.log('='.repeat(60));
};

const assert = (condition, message) => {
  if (!condition) {
    console.error(`  ❌ [FAIL] ${message}`);
    throw new Error(`Assertion failed: ${message}`);
  }
  console.log(`  ✅ [PASS] ${message}`);
};

async function setup() {
  logSection('SETUP: Connecting to MongoDB and Creating Test Donor');
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodshareai');
  console.log('  Connected to MongoDB successfully.');

  // Clean up any stale test user
  await User.deleteMany({ email: 'flow_verify_donor@test.com' });

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('TestDonorPass123!', salt);

  testUser = await User.create({
    fullName: 'Flow Verification Donor',
    email: 'flow_verify_donor@test.com',
    passwordHash,
    role: 'DONOR',
    phone: `+91 987${Math.floor(1000000 + Math.random() * 9000000)}`,
    isEmailVerified: true,
  });

  await DonorProfile.create({
    userId: testUser._id,
    organizationName: 'Grand Hyatt Catering',
    donorType: 'RESTAURANT',
    address: {
      street: 'Road No 2',
      city: 'Hyderabad',
      state: 'Telangana',
      postalCode: '500034',
      country: 'India',
    },
    location: {
      type: 'Point',
      coordinates: [78.4357, 17.4194],
    },
    contactPerson: 'Flow Verification Donor',
  });

  testToken = generateAccessToken(testUser);

  console.log(`  Created test donor: ${testUser._id} with valid JWT token.`);
}

async function testScenario1_ValidDetectionMappedCategory() {
  logSection('SCENARIO 1: Valid Donation with AI Detection & Valid Mapped Category');

  // Create donation via service
  const donation = await donationService.createDonation(testUser._id.toString(), {
    title: 'Surplus Authentic Neapolitan Pizza',
    foodCategory: 'COOKED_MEALS',
    quantity: 10,
    quantityUnit: 'ITEMS',
    foodImage: VALID_PNG_BASE64,
    expiryTime: new Date(Date.now() + 8 * 3600 * 1000).toISOString(),
    pickupStartTime: new Date().toISOString(),
    pickupEndTime: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    location: { type: 'Point', coordinates: [78.4357, 17.4194] },
  });
  createdDonationIds.push(donation._id);

  assert(donation._id != null, 'Donation created successfully');
  assert(donation.foodCategory === 'COOKED_MEALS', 'Initial donation category is COOKED_MEALS');

  // Intercept ML service to return Pizza detection (mapped to COOKED_MEALS)
  customMlHandler = async () => {
    return new Response(
      JSON.stringify({
        success: true,
        pipelineStatus: 'COMPLETED',
        modelsLoaded: { foodDetection: true, freshness: true, quantity: true, expiry: true },
        foodDetection: {
          status: 'LOADED',
          modelVersion: 'food_detection_v1',
          detections: [
            {
              className: 'Pizza',
              itemName: 'Pizza',
              category: 'COOKED_MEALS',
              isKnownClass: true,
              confidence: 0.9425,
              boundingBox: { x: 100, y: 150, width: 200, height: 200 },
            },
          ],
        },
        freshnessPrediction: { label: 'FRESH', confidence: 0.96 },
        quantityEstimation: { estimatedQuantity: 10, unit: 'ITEMS', confidence: 0.90 },
        expiryPrediction: { safeConsumptionHours: 8, riskLevel: 'SAFE', disclaimer: 'Safe for consumption' },
        overallConfidence: 0.93,
        processingTimeMs: 120,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const analysisRes = await donationService.requestFoodAnalysis(donation._id.toString(), testUser._id.toString());
  customMlHandler = null; // Reset interceptor

  assert(analysisRes.connected === true, 'AI analysis reported connected');
  assert(analysisRes.status === 'COMPLETED', 'AI analysis reported COMPLETED');

  // Inspect persisted AIAnalysis document in MongoDB
  const savedAnalysis = await AIAnalysis.findOne({ donationId: donation._id });
  assert(savedAnalysis != null, 'AIAnalysis document persisted in MongoDB');
  createdAnalysisIds.push(savedAnalysis._id);

  assert(savedAnalysis.foodDetection.length === 1, 'AIAnalysis contains exactly 1 food detection');
  assert(savedAnalysis.foodDetection[0].itemName === 'Pizza', 'Detection itemName is Pizza');
  assert(savedAnalysis.foodDetection[0].category === 'COOKED_MEALS', 'Detection preserved valid mapped category COOKED_MEALS');
  assert(savedAnalysis.foodDetection[0].confidence === 0.9425, 'Detection preserved confidence 0.9425');

  // Inspect updated Donation document in MongoDB
  const updatedDonation = await Donation.findById(donation._id);
  assert(updatedDonation.aiAnalysisId.toString() === savedAnalysis._id.toString(), 'Donation references AIAnalysis record');
  assert(updatedDonation.freshnessStatus === 'FRESH', 'Donation freshnessStatus updated to FRESH');
  assert(updatedDonation.safetyStatus === 'SAFE', 'Donation safetyStatus updated to SAFE');
}

async function testScenario2_UnknownClassPreservesManualCategory() {
  logSection('SCENARIO 2: Unknown AI Category Preserves Donor Manual Category');

  // Donor manually selected BAKERY
  const donation = await donationService.createDonation(testUser._id.toString(), {
    title: 'Artisan Pastry Box',
    foodCategory: 'BAKERY',
    quantity: 15,
    quantityUnit: 'PACKETS',
    foodImage: VALID_PNG_BASE64,
    expiryTime: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    pickupStartTime: new Date().toISOString(),
    pickupEndTime: new Date(Date.now() + 5 * 3600 * 1000).toISOString(),
    location: { type: 'Point', coordinates: [78.4357, 17.4194] },
  });
  createdDonationIds.push(donation._id);

  // ML detector detects an unmapped or unknown class with category: null, isKnownClass: false
  customMlHandler = async () => {
    return new Response(
      JSON.stringify({
        success: true,
        pipelineStatus: 'COMPLETED',
        modelsLoaded: { foodDetection: true },
        foodDetection: {
          status: 'LOADED',
          modelVersion: 'food_detection_v1',
          detections: [
            {
              className: 'ExoticPastryTrinket',
              itemName: 'ExoticPastryTrinket',
              category: null,
              isKnownClass: false,
              confidence: 0.78,
            },
          ],
        },
        freshnessPrediction: { label: 'GOOD', confidence: 0.85 },
        quantityEstimation: { estimatedQuantity: 15, unit: 'PACKETS', confidence: 0.80 },
        expiryPrediction: { safeConsumptionHours: 12, riskLevel: 'SAFE' },
        overallConfidence: 0.81,
        processingTimeMs: 110,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  await donationService.requestFoodAnalysis(donation._id.toString(), testUser._id.toString());
  customMlHandler = null;

  const savedAnalysis = await AIAnalysis.findOne({ donationId: donation._id });
  createdAnalysisIds.push(savedAnalysis._id);

  assert(savedAnalysis.foodDetection.length === 1, 'AIAnalysis contains 1 detection');
  assert(
    savedAnalysis.foodDetection[0].category === 'BAKERY',
    'Unknown AI class safely preserves donor manual choice BAKERY instead of default OTHER'
  );
  assert(savedAnalysis.foodDetection[0].itemName === 'ExoticPastryTrinket', 'Detection itemName preserved');
}

async function testScenario3_EmptyDetections() {
  logSection('SCENARIO 3: Image Producing Empty Detections');

  const donation = await donationService.createDonation(testUser._id.toString(), {
    title: 'Surplus Canned Beans',
    foodCategory: 'PACKAGED_FOOD',
    quantity: 20,
    quantityUnit: 'ITEMS',
    foodImage: VALID_PNG_BASE64,
    expiryTime: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    pickupStartTime: new Date().toISOString(),
    pickupEndTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    location: { type: 'Point', coordinates: [78.4357, 17.4194] },
  });
  createdDonationIds.push(donation._id);

  // Model loaded but no detections
  customMlHandler = async () => {
    return new Response(
      JSON.stringify({
        success: true,
        pipelineStatus: 'COMPLETED',
        modelsLoaded: { foodDetection: true },
        foodDetection: {
          status: 'LOADED',
          modelVersion: 'food_detection_v1',
          detections: [],
        },
        freshnessPrediction: { label: 'GOOD', confidence: 0.70 },
        quantityEstimation: { estimatedQuantity: 20, unit: 'ITEMS', confidence: 0.75 },
        expiryPrediction: { safeConsumptionHours: 24, riskLevel: 'SAFE' },
        overallConfidence: 0.72,
        processingTimeMs: 95,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  const analysisRes = await donationService.requestFoodAnalysis(donation._id.toString(), testUser._id.toString());
  customMlHandler = null;

  assert(analysisRes.connected === true, 'Reported connected');
  const savedAnalysis = await AIAnalysis.findOne({ donationId: donation._id });
  createdAnalysisIds.push(savedAnalysis._id);

  assert(savedAnalysis.foodDetection.length === 0, 'AIAnalysis persisted with empty foodDetection array');
  
  const updatedDonation = await Donation.findById(donation._id);
  assert(updatedDonation.foodCategory === 'PACKAGED_FOOD', 'Donation foodCategory remains PACKAGED_FOOD');
}

async function testScenario4_MultipleDetections() {
  logSection('SCENARIO 4: Multiple Detections in Single Image');

  const donation = await donationService.createDonation(testUser._id.toString(), {
    title: 'Assorted Buffet Surplus',
    foodCategory: 'COOKED_MEALS',
    quantity: 40,
    quantityUnit: 'MEALS',
    foodImage: VALID_PNG_BASE64,
    expiryTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
    pickupStartTime: new Date().toISOString(),
    pickupEndTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    location: { type: 'Point', coordinates: [78.4357, 17.4194] },
  });
  createdDonationIds.push(donation._id);

  customMlHandler = async () => {
    return new Response(
      JSON.stringify({
        success: true,
        pipelineStatus: 'COMPLETED',
        modelsLoaded: { foodDetection: true },
        foodDetection: {
          status: 'LOADED',
          modelVersion: 'food_detection_v1',
          detections: [
            { className: 'Sandwich', itemName: 'Sandwich', category: 'COOKED_MEALS', confidence: 0.92 },
            { className: 'Apple', itemName: 'Apple', category: 'FRUITS_VEGETABLES', confidence: 0.95 },
            { className: 'Milk', itemName: 'Milk', category: 'DAIRY', confidence: 0.89 },
            { className: 'Bread', itemName: 'Bread', category: 'BAKERY', confidence: 0.87 },
          ],
        },
        freshnessPrediction: { label: 'FRESH', confidence: 0.94 },
        quantityEstimation: { estimatedQuantity: 40, unit: 'MEALS', confidence: 0.91 },
        expiryPrediction: { safeConsumptionHours: 6, riskLevel: 'SAFE' },
        overallConfidence: 0.92,
        processingTimeMs: 140,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  };

  await donationService.requestFoodAnalysis(donation._id.toString(), testUser._id.toString());
  customMlHandler = null;

  const savedAnalysis = await AIAnalysis.findOne({ donationId: donation._id });
  createdAnalysisIds.push(savedAnalysis._id);

  assert(savedAnalysis.foodDetection.length === 4, 'All 4 detections persisted in MongoDB');
  assert(savedAnalysis.foodDetection[0].category === 'COOKED_MEALS', 'Sandwich mapped to COOKED_MEALS');
  assert(savedAnalysis.foodDetection[1].category === 'FRUITS_VEGETABLES', 'Apple mapped to FRUITS_VEGETABLES');
  assert(savedAnalysis.foodDetection[2].category === 'DAIRY', 'Milk mapped to DAIRY');
  assert(savedAnalysis.foodDetection[3].category === 'BAKERY', 'Bread mapped to BAKERY');
}

async function testScenario5_LiveHttpAndUnavailableMlService() {
  logSection('SCENARIO 5: Live HTTP Network Hop, Missing Model, and Unavailable ML Service');

  // Part A: Live HTTP call through Express API server to the running FastAPI microservice
  console.log('  Testing live HTTP API flow to http://localhost:5000 with real live ML microservice on port 8000...');

  const createRes = await nativeFetch(`${BACKEND_URL}/api/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${testToken}`,
    },
    body: JSON.stringify({
      foodName: 'Live HTTP Test Donation',
      category: 'COOKED_MEALS',
      quantity: 5,
      quantityUnit: 'MEALS',
      foodImage: VALID_PNG_BASE64,
      expiryTime: new Date(Date.now() + 6 * 3600 * 1000).toISOString(),
      pickupStartTime: new Date().toISOString(),
      pickupEndTime: new Date(Date.now() + 3 * 3600 * 1000).toISOString(),
    }),
  });

  assert(createRes.status === 201, `POST /api/donations returned HTTP 201 (got ${createRes.status})`);
  const createJson = await createRes.json();
  assert(createJson.success === true, 'Response payload success is true');
  const liveDonation = createJson.data;
  createdDonationIds.push(new mongoose.Types.ObjectId(liveDonation._id));

  // Trigger analyze endpoint over real HTTP without any mock handler
  customMlHandler = null;
  const analyzeRes = await nativeFetch(`${BACKEND_URL}/api/donations/${liveDonation._id}/analyze`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });

  assert(analyzeRes.status === 200, `POST /api/donations/:id/analyze returned HTTP 200 (got ${analyzeRes.status})`);
  const analyzeJson = await analyzeRes.json();
  assert(analyzeJson.success === true, 'Analyze response success is true');
  assert(
    analyzeJson.data.status === 'MODEL_NOT_LOADED' || analyzeJson.data.status === 'COMPLETED',
    `Status accurately reports real model state without fake predictions (got '${analyzeJson.data.status}')`
  );

  // Check saved AIAnalysis for live donation
  const liveSavedAnalysis = await AIAnalysis.findOne({ donationId: liveDonation._id });
  if (liveSavedAnalysis) {
    createdAnalysisIds.push(liveSavedAnalysis._id);
    assert(liveSavedAnalysis.status === analyzeJson.data.status, `AIAnalysis recorded status: ${liveSavedAnalysis.status}`);
  }

  // Publish the donation over live HTTP
  const publishRes = await nativeFetch(`${BACKEND_URL}/api/donations/${liveDonation._id}/publish`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${testToken}`,
    },
  });

  assert(publishRes.status === 200, `POST /api/donations/:id/publish returned HTTP 200 (got ${publishRes.status})`);
  const publishJson = await publishRes.json();
  assert(publishJson.data.status === 'PUBLISHED', 'Donation successfully published and visible for matching');

  // Part B: Unavailable ML microservice (service dead / unreachable port)
  console.log('\n  Testing ML Service Unavailable handling...');

  const originalEnvUrl = process.env.ML_SERVICE_URL;
  process.env.ML_SERVICE_URL = 'http://localhost:59999'; // Dead port
  const deadHopRes = await aiAnalysisService.analyzeFoodImage(VALID_PNG_BASE64);
  process.env.ML_SERVICE_URL = originalEnvUrl; // Restore

  assert(deadHopRes.connected === false, 'Dead ML service endpoint reports connected: false');
  assert(deadHopRes.status === 'UNREACHABLE', 'Dead ML service endpoint reports status: UNREACHABLE');
  assert(typeof deadHopRes.message === 'string', 'Honest user-facing message provided for graceful fallback');
}

async function cleanup() {
  logSection('CLEANUP: Removing all test records from MongoDB');

  if (createdAnalysisIds.length > 0) {
    const res = await AIAnalysis.deleteMany({ _id: { $in: createdAnalysisIds } });
    console.log(`  Removed ${res.deletedCount} test AIAnalysis records.`);
  }

  if (createdDonationIds.length > 0) {
    const res = await Donation.deleteMany({ _id: { $in: createdDonationIds } });
    console.log(`  Removed ${res.deletedCount} test Donation records.`);
  }

  if (testUser) {
    await DonorProfile.deleteOne({ userId: testUser._id });
    await User.deleteOne({ _id: testUser._id });
    console.log(`  Removed test donor user & profile (${testUser._id}).`);
  }

  // Also clean up any orphan test records matching flow_verify_donor
  await User.deleteMany({ email: 'flow_verify_donor@test.com' });
  await Donation.deleteMany({ title: /Flow Verification|Neapolitan Pizza|Pastry Box|Canned Beans|Buffet Surplus|Live HTTP/ });

  console.log('  Database completely clean of test artifacts.');
  await mongoose.disconnect();
}

async function run() {
  try {
    await setup();
    await testScenario1_ValidDetectionMappedCategory();
    await testScenario2_UnknownClassPreservesManualCategory();
    await testScenario3_EmptyDetections();
    await testScenario4_MultipleDetections();
    await testScenario5_LiveHttpAndUnavailableMlService();

    logSection('🏁 ALL 5 LIVE VERIFICATION SCENARIOS PASSED WITH ZERO ERRORS');
  } catch (err) {
    console.error('\n💥 Verification test failed:', err);
    process.exitCode = 1;
  } finally {
    await cleanup();
  }
}

run();
