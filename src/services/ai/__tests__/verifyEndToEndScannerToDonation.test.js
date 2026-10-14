/**
 * End-to-end verification:
 * Real AI Candidate Inference (Port 8002) -> Scanner Result -> Backend API (Port 5000) -> MongoDB Persistence
 */
const http = require('http');
const fs = require('fs');
const path = require('path');
const mongoose = require(path.resolve(__dirname, '../../../../backend/node_modules/mongoose'));

const BACKEND_BASE = 'http://127.0.0.1:5000/api';
const ML_SERVICE_BASE = 'http://127.0.0.1:8002';
const MONGODB_URI = 'mongodb://127.0.0.1:27017/foodshareai';

async function verifyEndToEnd() {
  console.log('================================================================');
  console.log('🚀 RUNNING END-TO-END SCANNER -> BACKEND -> MONGODB VERIFICATION');
  console.log('================================================================\n');

  // STEP 1: Candidate ML Inference
  console.log('[STEP 1] Running candidate YOLOv8 inference on port 8002...');
  const samplePath = path.resolve(__dirname, '../../../../ml-service/datasets/food_detection/images/val/00101a0160a05d31.jpg');
  const imgBuffer = fs.readFileSync(samplePath);
  const dataUri = `data:image/jpeg;base64,${imgBuffer.toString('base64')}`;

  const mlRes = await fetch(`${ML_SERVICE_BASE}/api/ml/analyze/json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ imageData: dataUri, foodCategory: 'OTHER' }),
  });

  if (!mlRes.ok) throw new Error(`ML inference failed: HTTP ${mlRes.status}`);
  const mlData = await mlRes.json();
  const detections = mlData.foodDetection?.detections || [];
  console.log(`✓ ML inference succeeded with ${detections.length} detections:`);
  detections.forEach(d => console.log(`   - ${d.className} (${d.category}): ${(d.confidence * 100).toFixed(1)}%`));

  const primary = detections[0];
  if (!primary) throw new Error('No detections returned by model');

  // STEP 2: Scanner Simulation - Donor review & selection
  console.log('\n[STEP 2] Simulating Donor Review & Manual Edit in AIScanModalScreen:');
  const verifiedDonationPayload = {
    foodName: `${primary.itemName} Bottles`,
    category: primary.category, // 'BEVERAGES'
    quantity: 20,
    quantityUnit: 'servings',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=800',
    preparationTime: new Date().toISOString(),
    bestBefore: new Date(Date.now() + 8 * 3600000).toISOString(),
    pickupStartTime: new Date().toISOString(),
    pickupEndTime: new Date(Date.now() + 4 * 3600000).toISOString(),
    notes: `Verified via YOLOv8 candidate detection (${primary.className}, ${(primary.confidence * 100).toFixed(1)}% confidence).`,
    location: { type: 'Point', coordinates: [78.4867, 17.3850] },
  };
  console.log('✓ Prepared Donation Payload:', JSON.stringify({
    foodName: verifiedDonationPayload.foodName,
    category: verifiedDonationPayload.category,
    quantity: verifiedDonationPayload.quantity,
    notes: verifiedDonationPayload.notes,
  }, null, 2));

  // STEP 3: Authenticate Donor with Backend on Port 5000
  console.log('\n[STEP 3] Authenticating test donor via Backend (Port 5000)...');
  let token = null;

  // Try login first or register
  const loginRes = await fetch(`${BACKEND_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'donor_scanner_test@foodshare.org', password: 'Password@123' }),
  });

  if (loginRes.ok) {
    const loginData = await loginRes.json();
    token = loginData.data?.tokens?.accessToken || loginData.data?.token;
  } else {
    // Register
    const regRes = await fetch(`${BACKEND_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Scanner Test Donor',
        email: 'donor_scanner_test@foodshare.org',
        password: 'Password@123',
        role: 'DONOR',
        phone: '+919876543210',
      }),
    });
    const regData = await regRes.json();
    token = regData.data?.tokens?.accessToken || regData.data?.token;
  }

  if (!token) throw new Error('Could not obtain donor access token from backend');
  console.log('✓ Donor authenticated successfully.');

  // STEP 4: Save Donation via POST /api/donations
  console.log('\n[STEP 4] Sending donation to backend POST /api/donations...');
  const createRes = await fetch(`${BACKEND_BASE}/donations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(verifiedDonationPayload),
  });

  if (!createRes.ok) {
    const errText = await createRes.text();
    throw new Error(`Failed to create donation: HTTP ${createRes.status} - ${errText}`);
  }

  const createData = await createRes.json();
  const createdDonation = createData.data;
  console.log(`✓ Donation created successfully with ID: ${createdDonation._id}`);
  console.log(`✓ Status: ${createdDonation.status}`);

  // STEP 5: Publish Donation
  console.log('\n[STEP 5] Publishing donation via POST /api/donations/:id/publish...');
  const pubRes = await fetch(`${BACKEND_BASE}/donations/${createdDonation._id}/publish`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!pubRes.ok) throw new Error(`Publish failed: HTTP ${pubRes.status}`);
  const pubData = await pubRes.json();
  console.log(`✓ Published successfully! Status: ${pubData.data.status}`);

  // STEP 6: Direct MongoDB Persistence Verification
  console.log('\n[STEP 6] Querying MongoDB directly to verify database persistence...');
  await mongoose.connect(MONGODB_URI);
  const donationDoc = await mongoose.connection.collection('donations').findOne({
    _id: new mongoose.Types.ObjectId(createdDonation._id),
  });

  if (!donationDoc) {
    throw new Error('Donation record NOT found in MongoDB!');
  }

  console.log('✓ Found donation record in MongoDB:');
  console.log(`   - _id: ${donationDoc._id}`);
  console.log(`   - title: ${donationDoc.title}`);
  console.log(`   - foodCategory: ${donationDoc.foodCategory}`);
  console.log(`   - quantity: ${donationDoc.quantity} ${donationDoc.quantityUnit}`);
  console.log(`   - status: ${donationDoc.status}`);
  console.log(`   - donorId: ${donationDoc.donorId}`);
  console.log(`   - description: ${donationDoc.description}`);

  await mongoose.disconnect();

  console.log('\n================================================================');
  console.log('🎉 END-TO-END VERIFICATION COMPLETED AND CONFIRMED IN MONGODB!');
  console.log('================================================================\n');
}

verifyEndToEnd().catch(err => {
  console.error('\n❌ E2E Verification Failure:', err.message);
  process.exit(1);
});
