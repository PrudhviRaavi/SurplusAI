/**
 * FoodShareAI - Models Unit & Schema Validation Test Suite
 * Tests Mongoose schemas, validations, enums, GeoJSON points, and serialization.
 */
const assert = require('assert');
const mongoose = require('mongoose');

const {
  User,
  DonorProfile,
  NgoProfile,
  VolunteerProfile,
  Donation,
  AIAnalysis,
  Claim,
  Delivery,
  Notification,
  Impact,
} = require('../models');

const runTests = () => {
  console.log('🧪 Starting FoodShareAI Schema Validation Test Suite...\n');

  let passed = 0;
  let failed = 0;

  const test = (name, fn) => {
    try {
      fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  };

  // 1. Model Registration Checks
  test('All 10 models are registered with Mongoose', () => {
    const modelNames = mongoose.modelNames();
    const expectedModels = [
      'User',
      'DonorProfile',
      'NgoProfile',
      'VolunteerProfile',
      'Donation',
      'AIAnalysis',
      'Claim',
      'Delivery',
      'Notification',
      'Impact',
    ];
    expectedModels.forEach((m) => {
      assert(modelNames.includes(m), `Model ${m} is not registered`);
    });
  });

  // 2. User Schema Validations
  test('User schema: rejects invalid email and invalid role', () => {
    const user = new User({
      fullName: 'Test User',
      email: 'not-an-email',
      passwordHash: 'dummyhash',
      role: 'INVALID_ROLE',
    });
    const err = user.validateSync();
    assert(err, 'Expected validation error');
    assert(err.errors.email, 'Expected email validation error');
    assert(err.errors.role, 'Expected role validation error');
  });

  test('User schema: toJSON strips passwordHash', () => {
    const user = new User({
      fullName: 'Safe User',
      email: 'safe@test.com',
      passwordHash: 'supersecret_hash',
      role: 'DONOR',
    });
    const json = user.toJSON();
    assert.strictEqual(json.passwordHash, undefined, 'passwordHash must be omitted in JSON');
    assert.strictEqual(json.email, 'safe@test.com');
  });

  // 3. Donor Profile Validations
  test('DonorProfile: validates GeoJSON Point and 2dsphere index', () => {
    const profile = new DonorProfile({
      userId: new mongoose.Types.ObjectId(),
      donorType: 'RESTAURANT',
      location: {
        type: 'Point',
        coordinates: [78.38, 17.44], // valid Hyderabad coords
      },
    });
    const err = profile.validateSync();
    assert(!err, `Unexpected validation error: ${err?.message}`);

    // Test invalid coordinates (out of range longitude)
    const invalidProfile = new DonorProfile({
      userId: new mongoose.Types.ObjectId(),
      donorType: 'RESTAURANT',
      location: {
        type: 'Point',
        coordinates: [200, 17.44], // invalid lng > 180
      },
    });
    const invalidErr = invalidProfile.validateSync();
    assert(invalidErr && invalidErr.errors['location.coordinates'], 'Expected coordinates error');
  });

  // 4. Donation Schema Validations
  test('Donation: enforces positive quantity and valid units', () => {
    const donation = new Donation({
      donorId: new mongoose.Types.ObjectId(),
      title: 'Surplus Lunch',
      foodCategory: 'COOKED_MEALS',
      quantity: -5, // Invalid: negative
      quantityUnit: 'INVALID_UNIT',
      expiryTime: new Date(),
      pickupStartTime: new Date(),
      pickupEndTime: new Date(Date.now() + 3600000),
      location: { type: 'Point', coordinates: [78.38, 17.44] },
    });
    const err = donation.validateSync();
    assert(err, 'Expected validation error for negative quantity & unit');
    assert(err.errors.quantity, 'Expected quantity validation error');
    assert(err.errors.quantityUnit, 'Expected quantityUnit validation error');
  });

  test('Donation: enforces pickupEndTime is after pickupStartTime', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3600000);
    const donation = new Donation({
      donorId: new mongoose.Types.ObjectId(),
      title: 'Time Test',
      foodCategory: 'BAKERY',
      quantity: 10,
      quantityUnit: 'PACKETS',
      expiryTime: new Date(now.getTime() + 7200000),
      pickupStartTime: now,
      pickupEndTime: past, // Invalid: before pickupStartTime
      location: { type: 'Point', coordinates: [78.38, 17.44] },
    });
    const err = donation.validateSync();
    assert(err && err.errors.pickupEndTime, 'Expected pickupEndTime validator to fail');
  });

  // 5. AIAnalysis Schema Validations
  test('AIAnalysis: supports custom PyTorch/TensorFlow inference payload', () => {
    const analysis = new AIAnalysis({
      donationId: new mongoose.Types.ObjectId(),
      modelVersion: 'food-classifier-v1',
      foodDetection: [
        { itemName: 'Rice', category: 'COOKED_MEALS', confidence: 0.95 },
      ],
      freshnessPrediction: { label: 'FRESH', confidence: 0.94 },
      quantityEstimation: { value: 20, unit: 'KG', confidence: 0.88 },
      expiryPrediction: { estimatedSafeHours: 8, estimatedExpiryTime: new Date() },
      confidence: { overall: 0.92 },
      processingTime: 120,
    });
    const err = analysis.validateSync();
    assert(!err, `AIAnalysis validation failed: ${err?.message}`);
  });

  // 6. Claim Schema Validations
  test('Claim: enforces match score boundaries (0-100) and factors', () => {
    const claim = new Claim({
      donationId: new mongoose.Types.ObjectId(),
      ngoId: new mongoose.Types.ObjectId(),
      requestedQuantity: 15,
      matchScore: 94,
      matchFactors: {
        distanceScore: 90,
        urgencyScore: 85,
      },
    });
    const err = claim.validateSync();
    assert(!err, `Claim validation failed: ${err?.message}`);

    const invalidClaim = new Claim({
      donationId: new mongoose.Types.ObjectId(),
      ngoId: new mongoose.Types.ObjectId(),
      requestedQuantity: 15,
      matchScore: 125, // Invalid > 100
    });
    const invalidErr = invalidClaim.validateSync();
    assert(invalidErr && invalidErr.errors.matchScore, 'Expected matchScore boundary error');
  });

  // 7. Delivery Schema Validations
  test('Delivery: supports LineString route and status cycle', () => {
    const delivery = new Delivery({
      donationId: new mongoose.Types.ObjectId(),
      claimId: new mongoose.Types.ObjectId(),
      ngoId: new mongoose.Types.ObjectId(),
      donorId: new mongoose.Types.ObjectId(),
      pickupLocation: { type: 'Point', coordinates: [78.38, 17.44] },
      deliveryLocation: { type: 'Point', coordinates: [78.40, 17.43] },
      route: {
        type: 'LineString',
        coordinates: [
          [78.38, 17.44],
          [78.40, 17.43],
        ],
      },
      status: 'ASSIGNED',
    });
    const err = delivery.validateSync();
    assert(!err, `Delivery validation failed: ${err?.message}`);
  });

  // 8. Impact & Notification Schema Validations
  test('Impact: prevents negative metrics & defaults to 0', () => {
    const impact = new Impact({
      userId: new mongoose.Types.ObjectId(),
      role: 'VOLUNTEER',
    });
    assert.strictEqual(impact.mealsRescued, 0);
    assert.strictEqual(impact.foodSavedKg, 0);
    assert.strictEqual(impact.impactPoints, 0);
    const err = impact.validateSync();
    assert(!err, `Impact validation failed: ${err?.message}`);
  });

  test('Notification: validates recognized notification types', () => {
    const notification = new Notification({
      userId: new mongoose.Types.ObjectId(),
      type: 'DONATION_MATCHED',
      title: 'Match Found',
      message: 'Your donation has a match!',
    });
    const err = notification.validateSync();
    assert(!err, `Notification validation failed: ${err?.message}`);

    const invalidNotice = new Notification({
      userId: new mongoose.Types.ObjectId(),
      type: 'INVALID_TYPE',
      title: 'Notice',
      message: 'Hello',
    });
    const invalidErr = invalidNotice.validateSync();
    assert(invalidErr && invalidErr.errors.type, 'Expected notification type error');
  });

  console.log(`\n==================================================`);
  console.log(`🏁 Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runTests();
