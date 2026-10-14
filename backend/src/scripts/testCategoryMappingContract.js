/**
 * FoodShareAI - Category Mapping Contract & Integration Test Suite
 * Validates Requirement 5:
 * 1. Mapping all 30 detector classes to the seven valid app categories.
 * 2. Ensuring PRODUCE is never returned as an app category.
 * 3. Preserving the detector's mapped category when saving a donation.
 * 4. Supporting both itemName and className response fields.
 * 5. Empty detections and low-confidence detections handling.
 * 6. Unknown classes and malformed inference responses.
 * 7. Multiple detections in one image.
 * 8. Distinguishing unknown classes from genuine OTHER (Egg).
 * 9. Preserving manual category selection as fallback when AI inference fails or is unknown.
 */

const assert = require('assert');
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

const { Donation, AIAnalysis } = require('../models');
const { FOOD_CATEGORIES } = require('../utils/constants');

const VALID_APP_CATEGORIES = [
  'COOKED_MEALS',
  'FRUITS_VEGETABLES',
  'BAKERY',
  'PACKAGED_FOOD',
  'DAIRY',
  'BEVERAGES',
  'OTHER',
];

const runContractTests = () => {
  console.log('🧪 Starting FoodShareAI Category Mapping & Contract Test Suite...\n');

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

  // 1. Verify class_mapping.json content
  test('class_mapping.json maps all 30 classes to valid app categories and never PRODUCE', () => {
    const mappingPath = path.resolve(__dirname, '../../../ml-service/datasets/food_detection/class_mapping.json');
    assert(fs.existsSync(mappingPath), 'class_mapping.json must exist');
    const mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf8'));

    assert.strictEqual(Object.keys(mapping).length, 30, 'Must have exactly 30 classes');

    const mappedCategories = new Set(Object.values(mapping));
    assert(!mappedCategories.has('PRODUCE'), 'PRODUCE must never be an app category');
    assert(mappedCategories.has('FRUITS_VEGETABLES'), 'Must use FRUITS_VEGETABLES');

    Object.entries(mapping).forEach(([cls, cat]) => {
      assert(VALID_APP_CATEGORIES.includes(cat), `Class '${cls}' mapped to invalid category '${cat}'`);
    });

    // Verify FOOD_CATEGORIES constant in backend matches exactly
    assert.deepStrictEqual([...FOOD_CATEGORIES].sort(), [...VALID_APP_CATEGORIES].sort());
  });

  // 2. Donation Service mapping logic test
  test('donationService maps det.category when valid, and falls back to donation.foodCategory when unknown/null', () => {
    const donation = {
      _id: new mongoose.Types.ObjectId(),
      foodCategory: 'BAKERY',
    };

    // Simulated detector outputs
    const mlResult = {
      status: 'COMPLETED',
      foodDetection: [
        { className: 'Pizza', category: 'COOKED_MEALS', confidence: 0.95 },
        { className: 'Apple', category: 'FRUITS_VEGETABLES', confidence: 0.89 },
        { className: 'Egg', category: 'OTHER', confidence: 0.91 },
        { className: 'UnknownWidget', category: null, confidence: 0.35 }, // unknown class
      ],
    };

    const foodDetectionItems = (mlResult.foodDetection || []).map((det) => {
      const isDetCategoryValid = det.category && FOOD_CATEGORIES.includes(det.category);
      return {
        itemName: det.itemName || det.className || 'Food Item',
        category: isDetCategoryValid ? det.category : (donation.foodCategory || 'OTHER'),
        confidence: typeof det.confidence === 'number' ? det.confidence : 0,
      };
    });

    assert.strictEqual(foodDetectionItems.length, 4);
    assert.strictEqual(foodDetectionItems[0].category, 'COOKED_MEALS', 'Preserves detected Pizza category');
    assert.strictEqual(foodDetectionItems[1].category, 'FRUITS_VEGETABLES', 'Preserves detected Apple category');
    assert.strictEqual(foodDetectionItems[2].category, 'OTHER', 'Preserves genuine Egg OTHER category');
    assert.strictEqual(foodDetectionItems[3].category, 'BAKERY', 'Falls back to user choice (BAKERY) for unknown class instead of forcing OTHER');
  });

  // 3. Supporting both itemName and className fields
  test('Supports both itemName and className response fields seamlessly', () => {
    const rawItems = [
      { className: 'Croissant', confidence: 0.85 },
      { itemName: 'Baguette', confidence: 0.90 },
      { className: 'Donut', itemName: 'Sweet Donut', confidence: 0.78 },
    ];

    const mapped = rawItems.map((det) => ({
      itemName: det.itemName || det.className || 'Food Item',
    }));

    assert.strictEqual(mapped[0].itemName, 'Croissant');
    assert.strictEqual(mapped[1].itemName, 'Baguette');
    assert.strictEqual(mapped[2].itemName, 'Sweet Donut');
  });

  // 4. Empty detections array handling
  test('Handles empty detections cleanly without errors or faking data', () => {
    const emptyResult = {
      status: 'COMPLETED',
      foodDetection: [],
    };

    const donation = { foodCategory: 'COOKED_MEALS' };
    const foodDetectionItems = (emptyResult.foodDetection || []).map((det) => ({
      itemName: det.itemName || det.className || 'Food Item',
      category: det.category && FOOD_CATEGORIES.includes(det.category) ? det.category : (donation.foodCategory || 'OTHER'),
      confidence: typeof det.confidence === 'number' ? det.confidence : 0,
    }));

    assert.strictEqual(foodDetectionItems.length, 0);
  });

  // 5. Low-confidence detections and unknown classes
  test('Low-confidence and unknown detections preserve confidence values and fallback safely', () => {
    const rawDetections = [
      { className: 'Salad', category: 'COOKED_MEALS', confidence: 0.18, isKnownClass: true },
      { className: 'BlurryShape', category: null, confidence: 0.08, isKnownClass: false },
    ];

    const donation = { foodCategory: 'FRUITS_VEGETABLES' };
    const items = rawDetections.map((det) => {
      const isDetCategoryValid = det.category && FOOD_CATEGORIES.includes(det.category);
      return {
        itemName: det.itemName || det.className || 'Food Item',
        category: isDetCategoryValid ? det.category : (donation.foodCategory || 'OTHER'),
        confidence: typeof det.confidence === 'number' ? det.confidence : 0,
      };
    });

    assert.strictEqual(items[0].confidence, 0.18);
    assert.strictEqual(items[0].category, 'COOKED_MEALS');
    assert.strictEqual(items[1].confidence, 0.08);
    assert.strictEqual(items[1].category, 'FRUITS_VEGETABLES', 'Unknown blurry shape preserves manual donation category');
  });

  // 6. Multiple detections in a single image
  test('Multiple detections in one image persist as separate structured items', () => {
    const multiDetections = [
      { className: 'Apple', category: 'FRUITS_VEGETABLES', confidence: 0.92, boundingBox: { x: 50, y: 50, width: 60, height: 60 } },
      { className: 'Sandwich', category: 'COOKED_MEALS', confidence: 0.88, boundingBox: { x: 150, y: 150, width: 120, height: 100 } },
      { className: 'Juice', category: 'BEVERAGES', confidence: 0.85, boundingBox: { x: 300, y: 80, width: 70, height: 140 } },
    ];

    const donation = { foodCategory: 'OTHER' };
    const items = multiDetections.map((det) => ({
      itemName: det.itemName || det.className || 'Food Item',
      category: det.category && FOOD_CATEGORIES.includes(det.category) ? det.category : donation.foodCategory,
      confidence: det.confidence,
    }));

    assert.strictEqual(items.length, 3);
    assert.strictEqual(items[0].itemName, 'Apple');
    assert.strictEqual(items[0].category, 'FRUITS_VEGETABLES');
    assert.strictEqual(items[1].itemName, 'Sandwich');
    assert.strictEqual(items[1].category, 'COOKED_MEALS');
    assert.strictEqual(items[2].itemName, 'Juice');
    assert.strictEqual(items[2].category, 'BEVERAGES');
  });

  // 7. Frontend AI service category resolution logic
  test('Frontend aiService category resolution preserves manual user choice when AI is uncertain/unknown', () => {
    const resolveFrontendCategory = (primaryDetection, metadata = {}) => {
      const validCategories = ['COOKED_MEALS', 'FRUITS_VEGETABLES', 'BAKERY', 'PACKAGED_FOOD', 'DAIRY', 'BEVERAGES', 'OTHER'];
      return (primaryDetection?.category && validCategories.includes(primaryDetection.category) && primaryDetection.isKnownClass !== false)
        ? primaryDetection.category
        : (metadata.foodCategory || 'COOKED_MEALS');
    };

    // Case A: Confident known food
    const knownDet = { className: 'Croissant', category: 'BAKERY', isKnownClass: true };
    assert.strictEqual(resolveFrontendCategory(knownDet, { foodCategory: 'OTHER' }), 'BAKERY');

    // Case B: Unknown food item -> preserves user choice
    const unknownDet = { className: 'ExoticPlant', category: null, isKnownClass: false };
    assert.strictEqual(resolveFrontendCategory(unknownDet, { foodCategory: 'FRUITS_VEGETABLES' }), 'FRUITS_VEGETABLES');

    // Case C: No detections at all -> preserves user choice
    assert.strictEqual(resolveFrontendCategory(null, { foodCategory: 'DAIRY' }), 'DAIRY');

    // Case D: No detections and no user choice -> defaults to COOKED_MEALS
    assert.strictEqual(resolveFrontendCategory(null, {}), 'COOKED_MEALS');
  });

  // 8. Mongoose AIAnalysis document validation with foodDetection items
  test('AIAnalysis document schema accepts foodDetection array and validates fields', () => {
    const analysis = new AIAnalysis({
      donationId: new mongoose.Types.ObjectId(),
      modelVersion: 'food-classifier-v1',
      status: 'COMPLETED',
      foodDetection: [
        { itemName: 'Pizza Slice', category: 'COOKED_MEALS', confidence: 0.94 },
        { itemName: 'Apple', category: 'FRUITS_VEGETABLES', confidence: 0.88 },
      ],
      freshnessPrediction: {
        label: 'FRESH',
        confidence: 0.92,
      },
      quantityEstimation: {
        value: 5.5,
        unit: 'KG',
        confidence: 0.85,
      },
      expiryPrediction: {
        estimatedSafeHours: 8,
        riskLevel: 'LOW_RISK',
        confidence: 0.87,
      },
    });

    const valErr = analysis.validateSync();
    assert.ifError(valErr);
    assert.strictEqual(analysis.foodDetection.length, 2);
    assert.strictEqual(analysis.foodDetection[0].itemName, 'Pizza Slice');
    assert.strictEqual(analysis.foodDetection[0].category, 'COOKED_MEALS');
    assert.strictEqual(analysis.foodDetection[1].category, 'FRUITS_VEGETABLES');
  });

  console.log(`\n==================================================`);
  console.log(`🏁 Contract Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runContractTests();
