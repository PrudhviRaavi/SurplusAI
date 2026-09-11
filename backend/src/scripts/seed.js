/**
 * FoodShareAI - Development Database Seed Script
 * =========================================================================
 * NOTICE: THIS IS FOR LOCAL DEVELOPMENT AND TESTING PURPOSES ONLY.
 * ALL DATA GENERATED HERE IS STRICTLY DEMO / SIMULATION DATA.
 * IT DOES NOT REPRESENT REAL USERS, REAL ORGANIZATIONS, OR REAL ML INFERENCE.
 * =========================================================================
 */
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const connectDB = require('../config/db');
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
const {
  ROLES,
  DONOR_TYPES,
  NGO_ORGANIZATION_TYPES,
  FOOD_CATEGORIES,
  QUANTITY_UNITS,
  FRESHNESS_STATUS,
  SAFETY_STATUS,
  DONATION_STATUS,
  CLAIM_STATUS,
  DELIVERY_STATUS,
} = require('../utils/constants');
const { hashPassword } = require('../utils/password');

const seedDatabase = async () => {
  try {
    console.log('🌱 [Seed] Starting development database seeding...');

    // Generate authentic bcrypt hash for 'Password123!' so demo users can log in
    const devPasswordHash = await hashPassword('Password123!');

    await connectDB();

    if (mongoose.connection.readyState !== 1) {
      console.error('❌ [Seed] Database not connected. Please verify MONGODB_URI in backend/.env.');
      process.exit(1);
    }

    // Clean up existing collections for clean seed
    console.log('🧹 [Seed] Clearing existing demo collections...');
    await Promise.all([
      User.deleteMany({ email: /@example\.com$/ }),
      DonorProfile.deleteMany({}),
      NgoProfile.deleteMany({}),
      VolunteerProfile.deleteMany({}),
      Donation.deleteMany({}),
      AIAnalysis.deleteMany({}),
      Claim.deleteMany({}),
      Delivery.deleteMany({}),
      Notification.deleteMany({}),
      Impact.deleteMany({}),
    ]);

    console.log('👤 [Seed] Creating test users...');

    // 1. Test Admin (Securely seeded, never created via public signup)
    const adminUser = await User.create({
      fullName: '[DEMO] System Administrator',
      email: 'admin@example.com',
      phone: '+919876543210',
      passwordHash: devPasswordHash,
      role: ROLES.ADMIN,
      isEmailVerified: true,
      isPhoneVerified: true,
      profileCompleted: true,
    });

    // 2. Test Donor
    const donorUser = await User.create({
      fullName: '[DEMO] Grand Horizon Hotel & Kitchens',
      email: 'donor@example.com',
      phone: '+919876543211',
      passwordHash: devPasswordHash,
      role: ROLES.DONOR,
      isEmailVerified: true,
      isPhoneVerified: true,
      profileCompleted: true,
    });

    // Donor Profile (Located in Hitech City, Hyderabad: 78.3826° E, 17.4474° N)
    const donorProfile = await DonorProfile.create({
      userId: donorUser._id,
      donorType: 'HOTEL',
      organizationName: 'Grand Horizon Kitchens',
      contactPerson: 'Chef Rajesh Kumar',
      address: {
        street: 'Plot 42, Mindspace Madhapur',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500081',
        country: 'India',
      },
      location: {
        type: 'Point',
        coordinates: [78.3826, 17.4474], // [lng, lat]
      },
      foodCategories: ['COOKED_MEALS', 'BAKERY', 'DAIRY'],
      typicalDonationQuantity: 30,
      donationFrequency: 'DAILY',
      operatingHours: { open: '10:00', close: '23:30', notes: 'Buffet surplus packed at 22:30' },
      verificationStatus: 'VERIFIED',
    });

    // 3. Test NGO
    const ngoUser = await User.create({
      fullName: '[DEMO] Hope & Nourish Community Foundation',
      email: 'ngo@example.com',
      phone: '+919876543212',
      passwordHash: devPasswordHash,
      role: ROLES.NGO,
      isEmailVerified: true,
      isPhoneVerified: true,
      profileCompleted: true,
    });

    // NGO Profile (Located in Jubilee Hills, Hyderabad: 78.4063° E, 17.4319° N ~ 3.5 km away)
    const ngoProfile = await NgoProfile.create({
      userId: ngoUser._id,
      organizationName: 'Hope & Nourish Foundation',
      organizationType: 'FOOD_BANK',
      registrationNumber: 'NGO-TS-2024-8891',
      website: 'https://hope-nourish-demo.org',
      representativeName: 'Sunita Reddy',
      designation: 'Operations Director',
      phone: '+919876543212',
      email: 'contact@hope-nourish-demo.org',
      address: {
        street: 'Road No. 36, Jubilee Hills',
        city: 'Hyderabad',
        state: 'Telangana',
        postalCode: '500033',
        country: 'India',
      },
      location: {
        type: 'Point',
        coordinates: [78.4063, 17.4319],
      },
      foodRequirements: ['COOKED_MEALS', 'BAKERY', 'FRUITS_VEGETABLES'],
      estimatedMealsRequiredPerDay: 150,
      maximumDailyCapacity: 250,
      preferredPickupRadius: 15,
      verificationStatus: 'VERIFIED',
    });

    // 4. Test Volunteer
    const volunteerUser = await User.create({
      fullName: '[DEMO] Vikram Sharma',
      email: 'volunteer@example.com',
      phone: '+919876543213',
      passwordHash: devPasswordHash,
      role: ROLES.VOLUNTEER,
      isEmailVerified: true,
      isPhoneVerified: true,
      profileCompleted: true,
    });

    // Volunteer Profile (Located nearby in Kondapur: 78.3685° E, 17.4648° N)
    const volunteerProfile = await VolunteerProfile.create({
      userId: volunteerUser._id,
      fullName: 'Vikram Sharma',
      phone: '+919876543213',
      email: 'volunteer@example.com',
      volunteerPreferences: ['FOOD_PICKUP', 'FOOD_DELIVERY'],
      availability: ['EVENING', 'WEEKENDS'],
      preferredTravelRadius: 8,
      transportation: 'TWO_WHEELER',
      location: {
        type: 'Point',
        coordinates: [78.3685, 17.4648],
      },
      isAvailable: true,
      verificationStatus: 'VERIFIED',
      impactPoints: 120,
      completedDeliveries: 4,
    });

    console.log('🍲 [Seed] Creating sample donations...');

    const now = new Date();
    const fourHoursLater = new Date(now.getTime() + 4 * 60 * 60 * 1000);
    const sixHoursLater = new Date(now.getTime() + 6 * 60 * 60 * 1000);
    const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Donation 1: Cooked Buffet Meals (Active & Matched)
    const donation1 = await Donation.create({
      donorId: donorUser._id,
      title: '[DEMO] Fresh Biryani & Curries (Dinner Buffet Surplus)',
      description: 'Hygienically packed dinner buffet surplus containing vegetable biryani, paneer curry, and dal.',
      foodCategory: 'COOKED_MEALS',
      quantity: 25,
      quantityUnit: 'KG',
      estimatedMeals: 50,
      foodImage: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0',
      preparationTime: new Date(now.getTime() - 2 * 60 * 60 * 1000),
      expiryTime: sixHoursLater,
      pickupStartTime: now,
      pickupEndTime: fourHoursLater,
      freshnessStatus: FRESHNESS_STATUS.FRESH,
      safetyStatus: SAFETY_STATUS.SAFE,
      status: DONATION_STATUS.MATCHED,
      location: {
        type: 'Point',
        coordinates: [78.3826, 17.4474],
      },
      publishedAt: now,
    });

    // AI Analysis linked to Donation 1 (Simulating Python ML service output)
    const aiAnalysis1 = await AIAnalysis.create({
      donationId: donation1._id,
      modelVersion: 'food-classifier-v1.0-demo',
      foodDetection: [
        { itemName: 'Vegetable Biryani', category: 'COOKED_MEALS', confidence: 0.96 },
        { itemName: 'Paneer Curry', category: 'COOKED_MEALS', confidence: 0.92 },
      ],
      freshnessPrediction: {
        label: FRESHNESS_STATUS.FRESH,
        confidence: 0.94,
      },
      quantityEstimation: {
        value: 25,
        unit: 'KG',
        confidence: 0.91,
      },
      expiryPrediction: {
        estimatedSafeHours: 6,
        estimatedExpiryTime: sixHoursLater,
      },
      confidence: {
        overall: 0.93,
      },
      processingTime: 142, // ms
      imageMetadata: {
        format: 'image/jpeg',
        dimensions: { width: 1280, height: 720 },
        sizeBytes: 342000,
      },
    });

    // Update donation with AI Analysis link
    donation1.aiAnalysisId = aiAnalysis1._id;
    await donation1.save();

    // Donation 2: Artisan Breads & Pastries
    const donation2 = await Donation.create({
      donorId: donorUser._id,
      title: '[DEMO] Whole Wheat Loaves & Croissants',
      description: 'Baked fresh today, unsold shelf inventory wrapped and stored in clean crates.',
      foodCategory: 'BAKERY',
      quantity: 15,
      quantityUnit: 'PACKETS',
      estimatedMeals: 20,
      foodImage: 'https://images.unsplash.com/photo-1509440159596-0249088772ff',
      preparationTime: new Date(now.getTime() - 6 * 60 * 60 * 1000),
      expiryTime: tomorrow,
      pickupStartTime: now,
      pickupEndTime: sixHoursLater,
      freshnessStatus: FRESHNESS_STATUS.GOOD,
      safetyStatus: SAFETY_STATUS.SAFE,
      status: DONATION_STATUS.PUBLISHED,
      location: {
        type: 'Point',
        coordinates: [78.3826, 17.4474],
      },
      publishedAt: now,
    });

    // Donation 3: Fresh Apples & Bananas
    const donation3 = await Donation.create({
      donorId: donorUser._id,
      title: '[DEMO] Fresh Fruit Crates (Apples & Bananas)',
      description: 'Surplus fruit from event registration desk. Intact and ready to eat.',
      foodCategory: 'FRUITS_VEGETABLES',
      quantity: 18,
      quantityUnit: 'KG',
      estimatedMeals: 35,
      foodImage: 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b',
      preparationTime: new Date(now.getTime() - 4 * 60 * 60 * 1000),
      expiryTime: new Date(now.getTime() + 48 * 60 * 60 * 1000),
      pickupStartTime: now,
      pickupEndTime: tomorrow,
      freshnessStatus: FRESHNESS_STATUS.FRESH,
      safetyStatus: SAFETY_STATUS.SAFE,
      status: DONATION_STATUS.PUBLISHED,
      location: {
        type: 'Point',
        coordinates: [78.3826, 17.4474],
      },
      publishedAt: now,
    });

    console.log('🤝 [Seed] Creating sample claim & delivery...');

    // Sample Claim for Donation 1
    const sampleClaim = await Claim.create({
      donationId: donation1._id,
      ngoId: ngoUser._id,
      requestedQuantity: 25,
      matchScore: 94,
      matchFactors: {
        distanceScore: 92,
        foodCompatibilityScore: 98,
        quantityCapacityScore: 95,
        urgencyScore: 88,
        availabilityScore: 96,
        historicalReliabilityScore: 90,
        demandScore: 94,
        routeEfficiencyScore: 91,
      },
      status: CLAIM_STATUS.APPROVED,
      claimedAt: now,
      confirmedAt: now,
    });

    // Sample Delivery for Claim
    const sampleDelivery = await Delivery.create({
      donationId: donation1._id,
      claimId: sampleClaim._id,
      ngoId: ngoUser._id,
      donorId: donorUser._id,
      volunteerId: volunteerUser._id,
      pickupLocation: {
        type: 'Point',
        coordinates: [78.3826, 17.4474],
      },
      deliveryLocation: {
        type: 'Point',
        coordinates: [78.4063, 17.4319],
      },
      route: {
        type: 'LineString',
        coordinates: [
          [78.3826, 17.4474],
          [78.3950, 17.4400],
          [78.4063, 17.4319],
        ],
      },
      routeDistance: 3800, // meters
      estimatedDuration: 18, // minutes
      status: DELIVERY_STATUS.ASSIGNED,
    });

    console.log('📊 [Seed] Creating impact records & notifications...');

    // Create Impact Records
    await Impact.create([
      {
        userId: donorUser._id,
        role: ROLES.DONOR,
        mealsRescued: 210,
        foodSavedKg: 105,
        donationsCompleted: 8,
        impactPoints: 420,
        co2SavedKg: 262.5,
      },
      {
        userId: ngoUser._id,
        role: ROLES.NGO,
        mealsRescued: 540,
        foodSavedKg: 270,
        deliveriesCompleted: 14,
        impactPoints: 680,
        co2SavedKg: 675.0,
      },
      {
        userId: volunteerUser._id,
        role: ROLES.VOLUNTEER,
        mealsRescued: 160,
        foodSavedKg: 80,
        deliveriesCompleted: 4,
        impactPoints: 120,
        co2SavedKg: 200.0,
      },
      {
        userId: adminUser._id,
        role: ROLES.ADMIN,
        mealsRescued: 910,
        foodSavedKg: 455,
        deliveriesCompleted: 18,
        donationsCompleted: 15,
        impactPoints: 1220,
        co2SavedKg: 1137.5,
      },
    ]);

    // Create Initial Demo Notifications
    await Notification.create([
      {
        userId: donorUser._id,
        type: 'DONATION_MATCHED',
        title: 'Smart Match Found!',
        message: 'Your donation "Fresh Biryani & Curries" has been matched with Hope & Nourish Foundation (Match score: 94%).',
        data: { donationId: donation1._id, claimId: sampleClaim._id },
        isRead: false,
      },
      {
        userId: volunteerUser._id,
        type: 'VOLUNTEER_ASSIGNED',
        title: 'New Delivery Task Available',
        message: 'A pickup from Grand Horizon Kitchens is awaiting delivery to Jubilee Hills (~3.8 km).',
        data: { deliveryId: sampleDelivery._id },
        isRead: false,
      },
    ]);

    console.log('==================================================');
    console.log('✅ [Seed] Development database seeding completed!');
    console.log('==================================================');
    console.log('Demo Accounts Created (Password for all: Password123!):');
    console.log(' - Admin:     admin@example.com');
    console.log(' - Donor:     donor@example.com');
    console.log(' - NGO:       ngo@example.com');
    console.log(' - Volunteer: volunteer@example.com');
    console.log('Demo Donations: 3 sample listings created with GeoJSON points.');
    console.log('Demo Smart Match: 1 matched claim & delivery task created.');
    console.log('==================================================');

    process.exit(0);
  } catch (error) {
    console.error(`❌ [Seed] Error during seeding: ${error.message}`);
    console.error(error.stack);
    process.exit(1);
  }
};

seedDatabase();
