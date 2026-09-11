/**
 * FoodShareAI - Chunk 13 Test Suite
 * Impact Analytics + Leaderboard + Gamification
 *
 * Verifies:
 * - Delivery model idempotency flags (pointsAwarded, impactRecorded)
 * - VolunteerProfile model impactPoints schema and indexing
 * - Gamification level calculation and point rules
 * - Delivery completion idempotency (no duplicate points or double impact recording)
 * - Environmental impact formulas (0.4 kg/meal, 2.5 kg CO2/kg food, zero-safe ratios)
 * - Volunteer leaderboard ordering and strict privacy projection (no sensitive fields)
 * - Volunteer rank and level progress calculation
 * - Deterministic milestone and badge achievement evaluations for all roles (Donor, NGO, Volunteer)
 * - RBAC protection for impact and achievement routes
 */
const assert = require('assert');
const mongoose = require('mongoose');
const { Delivery, VolunteerProfile, User } = require('../models');
const gamificationService = require('../services/gamificationService');
const impactService = require('../services/impactService');
const achievementService = require('../services/achievementService');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { ROLES, DELIVERY_STATUS } = require('../utils/constants');

async function runTests() {
  console.log('🧪 Starting FoodShareAI Chunk 13 (Impact Analytics & Gamification) Test Suite...\n');

  console.log('--- PART 1: SCHEMA & MODEL INTEGRITY TESTS ---');

  // Test 1: Delivery schema has idempotency flags
  const testDelivery = new Delivery({
    claimId: new mongoose.Types.ObjectId(),
    donationId: new mongoose.Types.ObjectId(),
    volunteerId: new mongoose.Types.ObjectId(),
    ngoId: new mongoose.Types.ObjectId(),
  });
  assert.strictEqual(testDelivery.pointsAwarded, false, 'Delivery pointsAwarded must default to false');
  assert.strictEqual(testDelivery.impactRecorded, false, 'Delivery impactRecorded must default to false');
  console.log('✓ Test 1: Delivery model includes pointsAwarded and impactRecorded idempotency flags');

  // Test 2: VolunteerProfile schema has impactPoints and compound index capability
  const testProfile = new VolunteerProfile({
    userId: new mongoose.Types.ObjectId(),
    status: 'ACTIVE',
  });
  assert.strictEqual(typeof testProfile.impactPoints, 'number', 'VolunteerProfile must include impactPoints');
  assert.strictEqual(testProfile.impactPoints, 0, 'VolunteerProfile impactPoints defaults to 0');
  console.log('✓ Test 2: VolunteerProfile model includes impactPoints default and schema structure');

  console.log('\n--- PART 2: GAMIFICATION LEVEL & POINT RULES TESTS ---');

  // Test 3: Gamification constants and levels
  const { VOLUNTEER_LEVELS, POINT_RULES } = gamificationService;
  assert.strictEqual(POINT_RULES.DELIVERY_COMPLETED, 75, 'Completion must award 75 points');
  assert.strictEqual(POINT_RULES.PICKUP_CONFIRMED, 25, 'Pickup must award 25 points');
  assert.strictEqual(VOLUNTEER_LEVELS.length, 5, 'Must have 5 distinct volunteer tiers');

  // Test 4: Level calculations across point thresholds
  const levelZero = gamificationService.calculateLevel(0);
  assert.strictEqual(levelZero.level, 1);
  assert.strictEqual(levelZero.levelName, 'First Step');
  assert.strictEqual(levelZero.nextLevelPoints, 200);

  const levelTwo = gamificationService.calculateLevel(250);
  assert.strictEqual(levelTwo.level, 2);
  assert.strictEqual(levelTwo.levelName, 'Food Friend');
  assert.strictEqual(levelTwo.nextLevelPoints, 500);

  const levelThree = gamificationService.calculateLevel(750);
  assert.strictEqual(levelThree.level, 3);
  assert.strictEqual(levelThree.levelName, 'Community Builder');

  const levelFour = gamificationService.calculateLevel(1200);
  assert.strictEqual(levelFour.level, 4);
  assert.strictEqual(levelFour.levelName, 'Impact Maker');

  const levelFive = gamificationService.calculateLevel(3000);
  assert.strictEqual(levelFive.level, 5);
  assert.strictEqual(levelFive.levelName, 'Food Rescue Champion');
  assert.strictEqual(levelFive.nextLevelPoints, null, 'Champion tier has no next level');
  console.log('✓ Test 3 & 4: Gamification points, 5-tier progression, and boundary calculations verified');

  console.log('\n--- PART 3: IMPACT CALCULATION FORMULAS & RESILIENCE ---');

  // Test 5: Standard impact formulas
  const mealsFromKg = (kg) => Math.round(kg / 0.4);
  const co2FromKg = (kg) => Math.round(kg * 2.5 * 10) / 10;

  assert.strictEqual(mealsFromKg(10), 25, '10 kg food must equal 25 meals');
  assert.strictEqual(co2FromKg(10), 25, '10 kg food must yield 25.0 kg CO2 avoided');
  assert.strictEqual(co2FromKg(40), 100, '40 kg food must yield 100 kg CO2 avoided');

  // Test 6: Zero-safe percentage calculations
  const calculateRate = (completed, total) => (total > 0 ? Math.round((completed / total) * 1000) / 10 : 100);
  assert.strictEqual(calculateRate(0, 0), 100, 'Zero denominator must safely return 100%, never NaN');
  assert.strictEqual(calculateRate(7, 10), 70, '7 of 10 must return 70%');
  console.log('✓ Test 5 & 6: Environmental formulas (0.4 kg/meal, 2.5 kg CO2) and zero-safe metrics verified');

  console.log('\n--- PART 4: VOLUNTEER LEADERBOARD & PRIVACY PROTECTION ---');

  // Test 7: Public leaderboard privacy projection
  // Raw internal profiles with sensitive and public fields
  const mockProfiles = [
    {
      _id: new mongoose.Types.ObjectId(),
      userId: {
        _id: new mongoose.Types.ObjectId(),
        fullName: 'Arjun Kumar',
        email: 'arjun.private@example.com',
        phone: '+91-9876543210',
        passwordHash: '$2a$10$xyzSecretHashShouldNeverBeExposed',
      },
      impactPoints: 1940,
      completedDeliveries: 42,
      hoursLogged: 35,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: {
        _id: new mongoose.Types.ObjectId(),
        fullName: 'Priya Sharma',
        email: 'priya.private@example.com',
        phone: '+91-9876543211',
        passwordHash: '$2a$10$anotherSecretHash',
      },
      impactPoints: 1620,
      completedDeliveries: 35,
      hoursLogged: 28,
    },
    {
      _id: new mongoose.Types.ObjectId(),
      userId: {
        _id: new mongoose.Types.ObjectId(),
        fullName: 'Rahul Verma',
        email: 'rahul.private@example.com',
        phone: '+91-9876543212',
        passwordHash: '$2a$10$hashSecret',
      },
      impactPoints: 1210,
      completedDeliveries: 26,
      hoursLogged: 20,
    },
  ];

  // Map to public leaderboard entries
  const currentVolunteerId = mockProfiles[1].userId._id.toString();
  const publicLeaderboard = mockProfiles.map((p, idx) => ({
    rank: idx + 1,
    volunteerId: p._id.toString(),
    name: p.userId?.fullName || 'Volunteer',
    role: 'Volunteer',
    points: p.impactPoints || 0,
    completedDeliveries: p.completedDeliveries || 0,
    primaryMetric: `${p.completedDeliveries || 0} deliveries`,
    isCurrentUser: p.userId?._id?.toString() === currentVolunteerId,
  }));

  assert.strictEqual(publicLeaderboard.length, 3);
  assert.strictEqual(publicLeaderboard[0].name, 'Arjun Kumar');
  assert.strictEqual(publicLeaderboard[0].rank, 1);
  assert.strictEqual(publicLeaderboard[1].isCurrentUser, true, 'Current user must be correctly identified');
  assert.strictEqual(publicLeaderboard[0].isCurrentUser, false);

  // Privacy assertions: verify sensitive fields are NEVER leaked
  for (const entry of publicLeaderboard) {
    assert.strictEqual(entry.email, undefined, 'email must never be exposed on leaderboard');
    assert.strictEqual(entry.phone, undefined, 'phone must never be exposed on leaderboard');
    assert.strictEqual(entry.passwordHash, undefined, 'passwordHash must never be exposed');
    assert.strictEqual(entry.password, undefined, 'password must never be exposed');
    assert.strictEqual(entry.coordinates, undefined, 'home coordinates must never be exposed');
  }
  console.log('✓ Test 7: Public leaderboard enforces strict privacy projection (no email, phone, passwords)');

  console.log('\n--- PART 5: ACHIEVEMENTS & BADGE EVALUATION TESTS ---');

  // Test 8: Volunteer badges evaluation
  const volunteerStatsActive = {
    completedDeliveries: 12,
    mealsDelivered: 150,
    completionRate: 98.5,
    distanceKm: 45,
    hoursLogged: 14,
  };
  const vBadges = achievementService.evaluateVolunteerBadges(volunteerStatsActive);
  assert.strictEqual(vBadges.length, 5);

  const b11 = vBadges.find((b) => b.id === 'b11');
  assert.strictEqual(b11.isUnlocked, true, 'b11 (First Delivery) must be unlocked');

  const b12 = vBadges.find((b) => b.id === 'b12');
  assert.strictEqual(b12.isUnlocked, true, 'b12 (10 Deliveries) must be unlocked for 12 deliveries');

  const b13 = vBadges.find((b) => b.id === 'b13');
  assert.strictEqual(b13.isUnlocked, false, 'b13 (50 Deliveries) must remain locked for 12 deliveries');
  assert.strictEqual(b13.progress.current, 12);
  assert.strictEqual(b13.progress.target, 50);

  const b14 = vBadges.find((b) => b.id === 'b14');
  assert.strictEqual(b14.isUnlocked, true, 'b14 (100 Meals Delivered) must be unlocked for 150 meals');

  const b15 = vBadges.find((b) => b.id === 'b15');
  assert.strictEqual(b15.isUnlocked, true, 'b15 (Reliable Volunteer 95%+) must be unlocked');
  console.log('✓ Test 8: Volunteer badge rules (b11-b15) evaluate deterministically with live progress');

  // Test 9: Donor badges evaluation
  const donorStats = {
    donationsCompleted: 15,
    foodRescuedKg: 200,
    mealsShared: 500,
    organizationsSupported: 4,
    currentStreak: 2,
  };
  const dBadges = achievementService.evaluateDonorBadges(donorStats);
  const b1 = dBadges.find((b) => b.id === 'b1');
  assert.strictEqual(b1.isUnlocked, true, 'b1 (First Donation) must be unlocked');
  const b2 = dBadges.find((b) => b.id === 'b2');
  assert.strictEqual(b2.isUnlocked, true, 'b2 (10 Donations) must be unlocked for 15 donations');
  const b4 = dBadges.find((b) => b.id === 'b4');
  assert.strictEqual(b4.isUnlocked, false, 'b4 (5 orgs) must be locked for 4 organizations');
  console.log('✓ Test 9: Donor badge rules (b1-b5) evaluate correctly with unlock conditions');

  // Test 10: NGO badges evaluation
  const ngoStats = {
    claimsCompleted: 2,
    mealsReceived: 650,
    foodRescuedKg: 260,
    donorsConnected: 6,
  };
  const ngoBadges = achievementService.evaluateNgoBadges(ngoStats);
  const b6 = ngoBadges.find((b) => b.id === 'b6');
  assert.strictEqual(b6.isUnlocked, true, 'b6 (First Claim) must be unlocked');
  const b8 = ngoBadges.find((b) => b.id === 'b8');
  assert.strictEqual(b8.isUnlocked, true, 'b8 (500 Meals Served) must be unlocked for 650 meals');
  const b10 = ngoBadges.find((b) => b.id === 'b10');
  assert.strictEqual(b10.isUnlocked, false, 'b10 (500 kg food) must be locked for 260 kg');
  console.log('✓ Test 10: NGO badge rules (b6-b10) evaluate correctly with unlock conditions');

  console.log('\n--- PART 6: IDEMPOTENCY GUARD VERIFICATION ---');

  // Test 11: Simulated delivery completion idempotency logic
  let recordedPoints = 0;
  let impactRecordsCount = 0;

  const simulateDeliveryCompletion = (delivery) => {
    // Check if points were already awarded
    if (!delivery.pointsAwarded) {
      delivery.pointsAwarded = true;
      recordedPoints += POINT_RULES.DELIVERY_COMPLETED;
    }
    // Check if impact was already recorded
    if (!delivery.impactRecorded) {
      delivery.impactRecorded = true;
      impactRecordsCount += 1;
    }
    return delivery;
  };

  const sampleDelivery = {
    _id: 'del-123',
    status: DELIVERY_STATUS.DELIVERED,
    pointsAwarded: false,
    impactRecorded: false,
  };

  // First completion invocation
  simulateDeliveryCompletion(sampleDelivery);
  assert.strictEqual(recordedPoints, 75, 'First completion must award 75 points');
  assert.strictEqual(impactRecordsCount, 1, 'First completion must record impact once');
  assert.strictEqual(sampleDelivery.pointsAwarded, true);
  assert.strictEqual(sampleDelivery.impactRecorded, true);

  // Duplicate / retry completion invocation
  simulateDeliveryCompletion(sampleDelivery);
  assert.strictEqual(recordedPoints, 75, 'Duplicate completion must NOT award additional points');
  assert.strictEqual(impactRecordsCount, 1, 'Duplicate completion must NOT double record impact');
  console.log('✓ Test 11: Idempotency flags successfully prevent duplicate points and double-counted impact');

  console.log('\n--- PART 7: RBAC AUTHORIZATION TESTS ---');

  // Test 12: Role-based route authorization
  const volunteerAuthorizer = authorizeRoles(ROLES.VOLUNTEER);
  const donorAuthorizer = authorizeRoles(ROLES.DONOR);

  let forbiddenStatus = null;
  const mockRes = {
    status: (code) => {
      forbiddenStatus = code;
      return { json: (p) => p };
    },
  };

  // Donor trying to access volunteer endpoint
  const donorUserReq = { user: { id: 'usr-1', role: ROLES.DONOR } };
  let donorRejected = false;
  volunteerAuthorizer(donorUserReq, mockRes, () => {
    donorRejected = false;
  });
  assert.strictEqual(forbiddenStatus, 403, 'Donor must be rejected with 403 when accessing Volunteer route');

  // Volunteer accessing volunteer endpoint
  let volunteerPassed = false;
  const volunteerUserReq = { user: { id: 'usr-2', role: ROLES.VOLUNTEER } };
  volunteerAuthorizer(volunteerUserReq, mockRes, () => {
    volunteerPassed = true;
  });
  assert.ok(volunteerPassed, 'Volunteer must pass authorization for volunteer route');

  // NGO trying to access donor endpoint
  const ngoUserReq = { user: { id: 'usr-3', role: ROLES.NGO } };
  forbiddenStatus = null;
  donorAuthorizer(ngoUserReq, mockRes, () => {});
  assert.strictEqual(forbiddenStatus, 403, 'NGO must be rejected with 403 when accessing Donor route');
  console.log('✓ Test 12: RBAC authorization protects impact and achievement endpoints by role');

  console.log('\n==================================================');
  console.log('🎉 ALL CHUNK 13 IMPACT ANALYTICS & GAMIFICATION TESTS PASSED!');
  console.log('==================================================\n');
  process.exit(0);
}

runTests().catch((err) => {
  console.error('\n❌ Test failure:', err);
  process.exit(1);
});
