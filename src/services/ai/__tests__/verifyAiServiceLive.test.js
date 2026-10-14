/**
 * Focused verification script for live AI Service integration with Candidate ML Service (Port 8002)
 */
const fs = require('fs');
const path = require('path');

// Simulate environment
process.env.EXPO_PUBLIC_ML_URL = 'http://127.0.0.1:8002';

const VALID_APP_CATEGORIES = [
  'COOKED_MEALS',
  'FRUITS_VEGETABLES',
  'BAKERY',
  'PACKAGED_FOOD',
  'DAIRY',
  'BEVERAGES',
  'OTHER',
];

async function runLiveVerification() {
  console.log('--- [TEST 1] Checking Candidate ML Health on Port 8002 ---');
  const healthRes = await fetch('http://127.0.0.1:8002/health');
  if (!healthRes.ok) {
    throw new Error(`Health check failed with HTTP ${healthRes.status}`);
  }
  const healthData = await healthRes.json();
  console.log('✓ Health status:', healthData.status);
  console.log('✓ Candidate loaded:', healthData.modelsStatus.foodDetection.loaded);
  console.log('✓ Candidate path:', healthData.modelsStatus.foodDetection.path);
  console.log('✓ Freshness loaded:', healthData.modelsStatus.freshness.loaded);
  console.log('✓ Quantity loaded:', healthData.modelsStatus.quantity.loaded);

  if (!healthData.modelsStatus.foodDetection.loaded) {
    throw new Error('Candidate model is not loaded!');
  }
  if (healthData.modelsStatus.freshness.loaded !== false) {
    throw new Error('Freshness model should be unloaded!');
  }

  console.log('\n--- [TEST 2] Executing Real Inference via /api/ml/analyze/json ---');
  const sampleImgPath = path.resolve(__dirname, '../../../../ml-service/datasets/food_detection/images/val/00101a0160a05d31.jpg');
  const imgBuffer = fs.readFileSync(sampleImgPath);
  const base64DataUri = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

  const analyzeRes = await fetch('http://127.0.0.1:8002/api/ml/analyze/json', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      imageData: base64DataUri,
      foodCategory: 'OTHER',
    }),
  });

  if (!analyzeRes.ok) {
    throw new Error(`Analyze call failed with HTTP ${analyzeRes.status}`);
  }
  const analyzeData = await analyzeRes.json();
  console.log('✓ HTTP Status: 200 OK');
  console.log('✓ Pipeline status:', analyzeData.pipelineStatus);
  console.log('✓ Detection status:', analyzeData.foodDetection.status);

  const rawDetections = analyzeData.foodDetection.detections || [];
  console.log(`✓ Detected objects count: ${rawDetections.length}`);

  for (const det of rawDetections) {
    console.log(`   - Class: ${det.className} | Category: ${det.category} | Confidence: ${(det.confidence * 100).toFixed(1)}%`);
    if (!VALID_APP_CATEGORIES.includes(det.category)) {
      throw new Error(`Invalid category "${det.category}"! Must be one of: ${VALID_APP_CATEGORIES.join(', ')}`);
    }
  }

  console.log('\n--- [TEST 3] Auxiliary Model Honesty Assertions ---');
  console.log('✓ Freshness status:', analyzeData.freshnessPrediction.status);
  console.log('✓ Freshness label:', analyzeData.freshnessPrediction.label);
  console.log('✓ Quantity status:', analyzeData.quantityEstimation.status);
  console.log('✓ Quantity estimated:', analyzeData.quantityEstimation.estimatedQuantity);
  console.log('✓ Expiry status:', analyzeData.expiryPrediction.status);

  if (analyzeData.freshnessPrediction.status !== 'MODEL_NOT_LOADED') {
    throw new Error('Freshness status must be MODEL_NOT_LOADED');
  }
  if (analyzeData.quantityEstimation.status !== 'MODEL_NOT_LOADED') {
    throw new Error('Quantity status must be MODEL_NOT_LOADED');
  }
  if (analyzeData.expiryPrediction.status !== 'MODEL_NOT_LOADED') {
    throw new Error('Expiry status must be MODEL_NOT_LOADED');
  }

  console.log('\n======================================================');
  console.log('  ALL INTEGRATION VERIFICATION CHECKS PASSED (100%)');
  console.log('======================================================\n');
}

runLiveVerification().catch((err) => {
  console.error('❌ Verification failed:', err.message);
  process.exit(1);
});
