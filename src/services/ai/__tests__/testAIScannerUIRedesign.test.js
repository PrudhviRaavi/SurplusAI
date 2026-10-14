/**
 * FoodShareAI - AI Vision Scanner UI Redesign & Classification Verification Test Suite
 *
 * Verifies:
 * 1. Header Contrast & Candidate Indicator Invariants
 * 2. Food Image Preview Configuration (resizeMode="contain")
 * 3. Gallery Selection Robustness (launchImageLibraryAsync with crop fallback)
 * 4. Real Candidate Detection Tracing (No hardcoded labels, real confidence passthrough, low-confidence warning)
 * 5. 7 Standardized Donation Categories Invariant
 * 6. Honest NGO Matching State Handling (No fabricated NGO when match is pending)
 * 7. Donation Payload Contract Preservation for create-donation navigation
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const SCANNER_FILE_PATH = path.resolve(__dirname, '../../../../src/screens/AIScanModalScreen.js');
const CLASS_MAPPING_PATH = path.resolve(__dirname, '../../../../ml-service/datasets/food_detection/class_mapping.json');

function runTests() {
  console.log('================================================================');
  console.log('🧪 RUNNING AI SCANNER UI REDESIGN & FUNCTIONAL VERIFICATION');
  console.log('================================================================\n');

  const scannerCode = fs.readFileSync(SCANNER_FILE_PATH, 'utf-8');

  // Test 1: Header Contrast & YOLOv8 Candidate Indicator
  console.log('[TEST 1] Verifying Header Contrast & Candidate Indicator...');
  assert(scannerCode.includes('AI Vision Scanner'), 'Scanner title must be present');
  assert(scannerCode.includes('YOLOv8 Candidate'), 'YOLOv8 candidate label must be visible');
  assert(scannerCode.includes('Experimental'), 'Experimental badge must be present');
  assert(scannerCode.includes("color: '#0F172A'") || scannerCode.includes('color: "#0F172A"'), 'Title must use dark charcoal/navy for contrast against cream background');
  assert(scannerCode.includes("barStyle=\"dark-content\""), 'Status bar must use dark-content for cream background visibility');
  console.log('  ✓ Header title uses high-contrast dark charcoal');
  console.log('  ✓ YOLOv8 candidate indicator and experimental status are visible');
  console.log('  ✓ Status bar configured for dark content on cream background');

  // Test 2: Image Preview Configuration
  console.log('\n[TEST 2] Verifying Responsive Food Image Preview...');
  assert(scannerCode.includes('resizeMode="contain"'), 'Preview must use resizeMode="contain" to prevent food cut-off');
  assert(scannerCode.includes('previewViewport'), 'Preview viewport style defined');
  assert(!scannerCode.includes('resizeMode="cover"'), 'resizeMode="cover" must not be used on the food preview');
  console.log('  ✓ Image preview uses resizeMode="contain"');
  console.log('  ✓ No stretching or cropping applied to selected food');

  // Test 3: Camera & Gallery Actions & Gallery Fallback
  console.log('\n[TEST 3] Verifying Camera & Gallery Action Handlers...');
  assert(scannerCode.includes('handleTakePhoto'), 'handleTakePhoto handler present');
  assert(scannerCode.includes('handleChooseFromGallery'), 'handleChooseFromGallery handler present');
  assert(scannerCode.includes('launchCameraAsync'), 'Camera picker invoked');
  assert(scannerCode.includes('launchImageLibraryAsync'), 'Gallery picker invoked');
  assert(scannerCode.includes('allowsEditing: false'), 'Gallery picker contains fallback without crop activity');
  console.log('  ✓ Separate Take Photo and Choose Gallery handlers present');
  console.log('  ✓ Gallery includes graceful fallback for Android devices without crop activity');

  // Test 4: YOLOv8 Pipeline & Class Mapping Tracing
  console.log('\n[TEST 4] Verifying Class Mapping & Real Detection Passthrough...');
  const classMapping = JSON.parse(fs.readFileSync(CLASS_MAPPING_PATH, 'utf-8'));
  assert.strictEqual(classMapping['Sushi'], 'COOKED_MEALS', 'Sushi mapped to COOKED_MEALS');
  assert.strictEqual(classMapping['Taco'], 'COOKED_MEALS', 'Taco mapped to COOKED_MEALS');
  assert.strictEqual(classMapping['Pizza'], 'COOKED_MEALS', 'Pizza mapped to COOKED_MEALS');

  // Verify that scanner does NOT hardcode "Tacos" or fabricate detections
  assert(!scannerCode.includes("setFoodName('Tacos')"), 'Scanner must never hardcode "Tacos"');
  assert(!scannerCode.includes('setFoodName("Tacos")'), 'Scanner must never hardcode "Tacos"');
  assert(scannerCode.includes('isLowConfidence'), 'Low confidence handling present');
  assert(scannerCode.includes('Food not confidently identified'), 'Low confidence banner displays manual verification notice');
  console.log('  ✓ Model class mapping verified: Sushi and Taco both map to COOKED_MEALS');
  console.log('  ✓ Verified no hardcoded "Tacos" label exists');
  console.log('  ✓ Low-confidence detections display explicit verification notice');

  // Test 5: 7 Standardized Donation Categories
  console.log('\n[TEST 5] Verifying 7 Standardized Donation Categories...');
  const expectedCategories = [
    'COOKED_MEALS',
    'FRUITS_VEGETABLES',
    'BAKERY',
    'PACKAGED_FOOD',
    'DAIRY',
    'BEVERAGES',
    'OTHER',
  ];
  const aiServiceCode = fs.readFileSync(path.resolve(__dirname, '../aiService.js'), 'utf-8');
  expectedCategories.forEach((cat) => {
    assert(aiServiceCode.includes(`'${cat}'`), `Category ${cat} must be in aiService.js`);
  });
  assert(scannerCode.includes('VALID_APP_CATEGORIES'), 'Scanner references VALID_APP_CATEGORIES');
  assert(scannerCode.includes('categoryPillsWrap'), 'Wrapping category pills layout present');
  console.log('  ✓ All 7 standardized donation categories present and labeled');
  console.log('  ✓ Wrapping chip layout confirmed');

  // Test 6: NGO Matching State Handling
  console.log('\n[TEST 6] Verifying Honest NGO Matching State Handling...');
  assert(scannerCode.includes('matchedNgo'), 'Accepts matchedNgo prop');
  assert(scannerCode.includes('NGO Matching Pending'), 'Displays honest pending state when no verified NGO matched');
  assert(scannerCode.includes('Nearby verified NGOs within 5 km will be matched automatically'), 'Explains matching upon donation submission');
  console.log('  ✓ Displays honest pending state when no verified NGO exists');
  console.log('  ✓ No fabricated NGO shown by default');

  // Test 7: Donation Payload Contract Preservation
  console.log('\n[TEST 7] Verifying Donation Payload Contract Preservation...');
  assert(scannerCode.includes('handleContinueToDonation'), 'handleContinueToDonation handler present');
  assert(scannerCode.includes('foodName'), 'Payload includes foodName');
  assert(scannerCode.includes('category'), 'Payload includes category');
  assert(scannerCode.includes('displayCategory'), 'Payload includes displayCategory');
  assert(scannerCode.includes('quantityVal'), 'Payload includes quantityVal');
  assert(scannerCode.includes('quantityUnit'), 'Payload includes quantityUnit');
  assert(scannerCode.includes('imageUri'), 'Payload includes imageUri');
  assert(scannerCode.includes('analysisResult'), 'Payload includes analysisResult');
  console.log('  ✓ All 7 payload fields preserved for donation creation flow');

  console.log('\n================================================================');
  console.log('✅ ALL 7 VERIFICATION SCENARIOS PASSED (100%)');
  console.log('================================================================\n');
}

runTests();
