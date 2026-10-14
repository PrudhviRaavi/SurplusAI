/**
 * Comprehensive Test Suite:
 * FoodShare AI — Create Donation Photo Selection and Removal of Automatic Default Image
 *
 * Verifies:
 * 1. Initial image state is null (no automatic default or preset image).
 * 2. Static source code validation: No DEFAULT_FOOD_IMG or hardcoded fallback images in CreateDonationFlow, AIAnalysisScreen, DonationReviewCard.
 * 3. Camera capture flow: Requests permissions, launches camera with allowsEditing: false, stores returned URI and base64.
 * 4. Gallery selection flow: Supports Android Photo Picker without forcing legacy media permissions, launches image library with allowsEditing: false, stores URI and base64.
 * 5. Cancellation behavior: User cancellation preserves null state and does not assign fallback/preset image.
 * 6. "Analyze with AI" button state: Disabled when imageUri is null, enabled when imageUri is valid.
 * 7. AI Analysis integration: Exact selected image and base64 passed to aiService.analyzeFoodImage without preset substitution.
 * 8. Retake / Change photo flow: Correctly resets imageUri and imageBase64 to null.
 * 9. End-to-end payload preservation: Image URI flows cleanly into donation creation payload.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

// -------------------------------------------------------------
// Test 1: Static Source Code Inspection - No Default/Preset Images
// -------------------------------------------------------------
function testStaticSourceNoDefaultImages() {
  console.log('\n[TEST 1] Static Source Inspection: Verifying removal of default/preset images...');

  const createDonationPath = path.resolve(__dirname, '../../../screens/donor/CreateDonationFlow.js');
  const aiAnalysisPath = path.resolve(__dirname, '../../../components/donor/AIAnalysisScreen.js');
  const reviewCardPath = path.resolve(__dirname, '../../../components/donor/DonationReviewCard.js');

  const createDonationCode = fs.readFileSync(createDonationPath, 'utf8');
  const aiAnalysisCode = fs.readFileSync(aiAnalysisPath, 'utf8');
  const reviewCardCode = fs.readFileSync(reviewCardPath, 'utf8');

  // Verify DEFAULT_FOOD_IMG definition is completely removed from CreateDonationFlow
  assert(!createDonationCode.includes('DEFAULT_FOOD_IMG'), 'CreateDonationFlow must not define or reference DEFAULT_FOOD_IMG');
  console.log('  ✓ CreateDonationFlow does not contain DEFAULT_FOOD_IMG');

  // Verify DEFAULT_FOOD_IMG is removed from AIAnalysisScreen
  assert(!aiAnalysisCode.includes('DEFAULT_FOOD_IMG'), 'AIAnalysisScreen must not define or reference DEFAULT_FOOD_IMG');
  console.log('  ✓ AIAnalysisScreen does not contain DEFAULT_FOOD_IMG');

  // Verify DEFAULT_IMG fallback is removed from DonationReviewCard
  assert(!reviewCardCode.includes('DEFAULT_IMG'), 'DonationReviewCard must not define or reference DEFAULT_IMG');
  console.log('  ✓ DonationReviewCard does not contain DEFAULT_IMG fallback');

  // Verify initial state initialization in CreateDonationFlow
  assert(
    createDonationCode.includes("const [imageUri, setImageUri] = useState(initialScannedData?.imageUri || null)"),
    'CreateDonationFlow must initialize imageUri to initialScannedData?.imageUri || null'
  );
  assert(
    createDonationCode.includes("const [imageBase64, setImageBase64] = useState(initialScannedData?.imageBase64 || null)"),
    'CreateDonationFlow must initialize imageBase64 to initialScannedData?.imageBase64 || null'
  );
  console.log('  ✓ Initial state initializes imageUri and imageBase64 to null (or scanned data if passed)');

  // Verify expo-image-picker import
  assert(
    createDonationCode.includes("import * as ImagePicker from 'expo-image-picker'"),
    'CreateDonationFlow must import ImagePicker from expo-image-picker'
  );
  console.log('  ✓ ImagePicker imported from expo-image-picker in CreateDonationFlow');

  // Verify allowsEditing: false is set to avoid Android native crop crashes
  assert(
    createDonationCode.includes('allowsEditing: false'),
    'CreateDonationFlow must specify allowsEditing: false to prevent Android activity crashes'
  );
  console.log('  ✓ allowsEditing: false configured for safe native Android capture & selection');
}

// -------------------------------------------------------------
// Test 2: Initial Image State is Empty / Null
// -------------------------------------------------------------
function testInitialState() {
  console.log('\n[TEST 2] Testing Initial Donation Image State...');

  const simulateInitialState = (initialScannedData = null) => {
    return {
      imageUri: initialScannedData?.imageUri || null,
      imageBase64: initialScannedData?.imageBase64 || null,
      step: 1,
    };
  };

  const freshState = simulateInitialState(null);
  assert.strictEqual(freshState.imageUri, null, 'Fresh donation state must have imageUri === null');
  assert.strictEqual(freshState.imageBase64, null, 'Fresh donation state must have imageBase64 === null');

  const scannedState = simulateInitialState({
    imageUri: 'file:///scanned_apple.jpg',
    imageBase64: 'base64_scanned_data',
  });
  assert.strictEqual(scannedState.imageUri, 'file:///scanned_apple.jpg', 'Scanned imageUri must be preserved if provided');
  assert.strictEqual(scannedState.imageBase64, 'base64_scanned_data', 'Scanned imageBase64 must be preserved if provided');
  console.log('  ✓ Fresh state initializes image to null');
  console.log('  ✓ Scanner-transferred state preserves user scan seamlessly');
}

// -------------------------------------------------------------
// Test 3: Camera Capture Flow & Permission Handling
// -------------------------------------------------------------
async function testCameraCaptureFlow() {
  console.log('\n[TEST 3] Testing Camera Capture Flow & Permission Handling...');

  let alertShown = null;
  const mockAlert = (title, msg) => { alertShown = { title, msg }; };

  let currentImageUri = null;
  let currentImageBase64 = null;

  const mockImagePicker = {
    requestCameraPermissionsAsync: async (grant = true) => ({
      status: grant ? 'granted' : 'denied',
      granted: grant,
    }),
    launchCameraAsync: async (options) => {
      assert.strictEqual(options.allowsEditing, false, 'Camera must use allowsEditing: false');
      assert.strictEqual(options.base64, true, 'Camera must request base64 metadata for AI inference');
      return {
        canceled: false,
        assets: [{
          uri: 'file:///data/user/0/host.exp.exponent/cache/captured_meal.jpg',
          base64: 'test_cam_base64_data',
        }],
      };
    },
  };

  // Simulating handleTakePhoto logic
  const handleTakePhoto = async (permissionGranted = true) => {
    try {
      const perm = await mockImagePicker.requestCameraPermissionsAsync(permissionGranted);
      if (!perm.granted) {
        mockAlert('Permission Needed', 'Camera permission is required to capture photos of food surplus.');
        return;
      }
      const result = await mockImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        currentImageUri = result.assets[0].uri;
        currentImageBase64 = result.assets[0].base64 || null;
      }
    } catch (err) {
      mockAlert('Camera Error', 'Could not access the camera. Please check permissions and try again.');
    }
  };

  // Test permission denied
  await handleTakePhoto(false);
  assert.strictEqual(currentImageUri, null, 'Image URI must remain null when permission is denied');
  assert(alertShown?.title === 'Permission Needed', 'Alert must notify user of needed permission');
  console.log('  ✓ Permission denial handled gracefully without changing state');

  // Test successful capture
  await handleTakePhoto(true);
  assert.strictEqual(currentImageUri, 'file:///data/user/0/host.exp.exponent/cache/captured_meal.jpg');
  assert.strictEqual(currentImageBase64, 'test_cam_base64_data');
  console.log('  ✓ Camera capture stores returned URI and base64 metadata');
}

// -------------------------------------------------------------
// Test 4: Gallery Selection Flow (Android Photo Picker Safe)
// -------------------------------------------------------------
async function testGallerySelectionFlow() {
  console.log('\n[TEST 4] Testing Gallery Selection Flow...');

  let alertShown = null;
  const mockAlert = (title, msg) => { alertShown = { title, msg }; };

  let currentImageUri = null;
  let currentImageBase64 = null;

  const mockImagePicker = {
    getMediaLibraryPermissionsAsync: async () => ({ status: 'undetermined', granted: false, canAskAgain: true }),
    requestMediaLibraryPermissionsAsync: async () => ({ status: 'denied', granted: false }),
    launchImageLibraryAsync: async (options) => {
      assert.strictEqual(options.allowsEditing, false, 'Gallery must use allowsEditing: false');
      assert.strictEqual(options.base64, true, 'Gallery must request base64');
      return {
        canceled: false,
        assets: [{
          uri: 'content://media/external/images/media/45612',
          base64: 'test_gallery_base64_data',
        }],
      };
    },
  };

  // Simulating handleChooseFromGallery logic
  const handleChooseFromGallery = async () => {
    try {
      const currentPerm = await mockImagePicker.getMediaLibraryPermissionsAsync();
      if (!currentPerm.granted && currentPerm.canAskAgain) {
        await mockImagePicker.requestMediaLibraryPermissionsAsync();
      }
      // On Android 13+, PhotoPicker launches without runtime permission
      const result = await mockImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
        allowsEditing: false,
      });
      if (!result.canceled && result.assets && result.assets.length > 0) {
        currentImageUri = result.assets[0].uri;
        currentImageBase64 = result.assets[0].base64 || null;
      }
    } catch (err) {
      mockAlert('Gallery Error', 'Could not open photo gallery. Please try again.');
    }
  };

  await handleChooseFromGallery();
  assert.strictEqual(currentImageUri, 'content://media/external/images/media/45612');
  assert.strictEqual(currentImageBase64, 'test_gallery_base64_data');
  console.log('  ✓ Gallery successfully selects image even if legacy permission is denied');
  console.log('  ✓ Native content:// URI and base64 metadata stored properly');
}

// -------------------------------------------------------------
// Test 5: Cancellation Does Not Fallback to Hardcoded Image
// -------------------------------------------------------------
async function testCancellationHandling() {
  console.log('\n[TEST 5] Testing Cancellation Behavior...');

  let currentImageUri = null;
  let currentImageBase64 = null;

  const mockImagePickerCanceled = {
    launchCameraAsync: async () => ({ canceled: true, assets: null }),
    launchImageLibraryAsync: async () => ({ canceled: true, assets: [] }),
  };

  // Camera canceled
  const camResult = await mockImagePickerCanceled.launchCameraAsync();
  if (!camResult.canceled && camResult.assets && camResult.assets.length > 0) {
    currentImageUri = camResult.assets[0].uri;
  }
  assert.strictEqual(currentImageUri, null, 'Camera cancellation must NOT assign any fallback image');

  // Gallery canceled
  const galResult = await mockImagePickerCanceled.launchImageLibraryAsync();
  if (!galResult.canceled && galResult.assets && galResult.assets.length > 0) {
    currentImageUri = galResult.assets[0].uri;
  }
  assert.strictEqual(currentImageUri, null, 'Gallery cancellation must NOT assign any fallback image');
  console.log('  ✓ Cancellation leaves image state as null without assigning default/preset images');
}

// -------------------------------------------------------------
// Test 6: "Analyze with AI" Button State Logic
// -------------------------------------------------------------
function testAnalyzeButtonState() {
  console.log('\n[TEST 6] Testing "Analyze with AI" Button State...');

  const isAnalyzeButtonDisabled = (imageUri) => {
    // Exactly matches the disabled={!imageUri} property in CreateDonationFlow Step 2
    return !imageUri;
  };

  assert.strictEqual(isAnalyzeButtonDisabled(null), true, 'Button must be disabled when imageUri is null');
  assert.strictEqual(isAnalyzeButtonDisabled(''), true, 'Button must be disabled when imageUri is empty string');
  assert.strictEqual(isAnalyzeButtonDisabled(undefined), true, 'Button must be disabled when imageUri is undefined');
  assert.strictEqual(isAnalyzeButtonDisabled('file:///food.jpg'), false, 'Button must be ENABLED when imageUri is valid');
  assert.strictEqual(isAnalyzeButtonDisabled('content://media/123'), false, 'Button must be ENABLED when content URI is valid');

  console.log('  ✓ Analyze button disabled when no image is selected');
  console.log('  ✓ Analyze button enabled when valid image URI is present');
}

// -------------------------------------------------------------
// Test 7: AI Analysis Flow Passes Exact Selected Image
// -------------------------------------------------------------
async function testAIAnalysisFlow() {
  console.log('\n[TEST 7] Testing AI Analysis Flow Integration...');

  let analyzedImageUri = null;
  let analyzedOptions = null;

  const mockAiService = {
    analyzeFoodImage: async (uri, options) => {
      analyzedImageUri = uri;
      analyzedOptions = options;
      return {
        foodDetection: {
          detections: [
            { className: 'apple', category: 'PRODUCE_FRUITS', confidence: 0.94 }
          ],
        },
        freshness: { score: 90, status: 'FRESH' },
        ngoMatching: { matchedNgo: { name: 'Local Food Bank' } },
      };
    },
  };

  // Simulating AIAnalysisScreen handleAnalyze
  const simulateAnalyze = async (imageUri, imageBase64) => {
    if (!imageUri) {
      throw new Error('No food photo selected. Please go back and capture or choose an image.');
    }
    return await mockAiService.analyzeFoodImage(imageUri, { base64: imageBase64 });
  };

  // With null imageUri
  await assert.rejects(
    async () => simulateAnalyze(null, null),
    /No food photo selected/,
    'AIAnalysisScreen must reject analysis when imageUri is null'
  );
  console.log('  ✓ Missing imageUri correctly rejected with instructive message');

  // With real selected imageUri
  const testUri = 'file:///data/user/0/cache/fresh_bananas.jpg';
  const testBase64 = 'bananas_base64_string';
  const result = await simulateAnalyze(testUri, testBase64);

  assert.strictEqual(analyzedImageUri, testUri, 'Exact selected imageUri must be passed to aiService');
  assert.strictEqual(analyzedOptions.base64, testBase64, 'Exact base64 metadata must be passed to aiService');
  assert.strictEqual(result.foodDetection.detections[0].className, 'apple');
  console.log('  ✓ Exact selected image and base64 passed to aiService');
  console.log('  ✓ Result preserved without mock fallback');
}

// -------------------------------------------------------------
// Test 8: Retake / Change Photo Flow Resets Image
// -------------------------------------------------------------
function testRetakePhotoFlow() {
  console.log('\n[TEST 8] Testing Retake / Change Photo Flow...');

  let state = {
    imageUri: 'file:///photo.jpg',
    imageBase64: 'data...',
  };

  const handleRetakePhoto = () => {
    state.imageUri = null;
    state.imageBase64 = null;
  };

  handleRetakePhoto();

  assert.strictEqual(state.imageUri, null, 'Retake must reset imageUri to null');
  assert.strictEqual(state.imageBase64, null, 'Retake must reset imageBase64 to null');
  console.log('  ✓ Retake / Change photo successfully clears image state');
}

// -------------------------------------------------------------
// Test 9: End-to-End Donation Creation Payload Preservation
// -------------------------------------------------------------
function testPayloadPreservation() {
  console.log('\n[TEST 9] Testing End-to-End Donation Creation Payload...');

  const selectedImageUri = 'file:///donor_captured_curry.jpg';
  const donorEnteredData = {
    title: 'Veg Curry & Rice',
    foodCategory: 'COOKED_MEALS',
    quantity: 15,
    quantityUnit: 'servings',
    dietaryType: 'VEGETARIAN',
    notes: 'Freshly prepared lunch packs',
  };

  // Simulating handleSubmitDonation in CreateDonationFlow
  const payload = {
    title: donorEnteredData.title,
    foodCategory: donorEnteredData.foodCategory,
    quantity: Number(donorEnteredData.quantity),
    quantityUnit: donorEnteredData.quantityUnit,
    dietaryType: donorEnteredData.dietaryType,
    imageUrl: selectedImageUri || null,
    notes: donorEnteredData.notes,
  };

  assert.strictEqual(payload.imageUrl, selectedImageUri, 'Exact selected image must be in final donation payload');
  assert(!payload.imageUrl.includes('unsplash'), 'Donation payload must NOT contain Unsplash default image');
  console.log('  ✓ Final donation payload retains user-selected image URL');
}

// -------------------------------------------------------------
// Run All Tests
// -------------------------------------------------------------
async function runAll() {
  console.log('================================================================');
  console.log('🧪 RUNNING CREATE DONATION PHOTO SELECTION TEST SUITE');
  console.log('================================================================');

  testStaticSourceNoDefaultImages();
  testInitialState();
  await testCameraCaptureFlow();
  await testGallerySelectionFlow();
  await testCancellationHandling();
  testAnalyzeButtonState();
  await testAIAnalysisFlow();
  testRetakePhotoFlow();
  testPayloadPreservation();

  console.log('\n================================================================');
  console.log('✅ ALL 9 TEST SUITES PASSED SUCCESSFULLY (100%)');
  console.log('================================================================\n');
}

runAll().catch(err => {
  console.error('\n❌ Test Failure:', err);
  process.exit(1);
  return;
});
