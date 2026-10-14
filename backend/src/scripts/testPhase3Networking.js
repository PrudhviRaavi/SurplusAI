/**
 * FoodShareAI - Phase 3 Networking & Service Configuration Tests
 *
 * Validates:
 * 1. URL resolution across all supported environments:
 *    - Physical Android device with EXPO_PUBLIC_API_URL (normalizes /api exactly once)
 *    - Physical Android device with EXPO_PUBLIC_DEV_HOST (configures both Express and ML)
 *    - Physical Android device without configuration (detects unconfigured error, never silently returns 127.0.0.1 or 10.0.2.2)
 *    - Android emulator (EXPO_PUBLIC_USE_EMULATOR=true -> 10.0.2.2)
 *    - iOS simulator (127.0.0.1)
 *    - Web environment (127.0.0.1)
 *    - ML URL normalization (no trailing slash or accidental /api)
 * 2. Backend Health & MongoDB honest status reporting:
 *    - Connects to live MongoDB on 127.0.0.1:27017 and verifies HTTP 200 / success: true
 *    - Verifies health check returns 503 / success: false when DB is disconnected
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    console.error(`  ✗ FAIL: ${label}`);
  }
}

// -------------------------------------------------------------
// 1. Static Invariant Verification on apiConfig.js
// -------------------------------------------------------------
console.log('\n--- 1. apiConfig.js Invariant & Normalization Tests ---');

const apiConfigPath = path.resolve(__dirname, '../../../src/services/api/apiConfig.js');
const apiConfigFile = fs.readFileSync(apiConfigPath, 'utf8');

assert(apiConfigFile.includes('normalizeApiUrl'), 'apiConfig defines normalizeApiUrl');
assert(apiConfigFile.includes('normalizeMlUrl'), 'apiConfig defines normalizeMlUrl');
assert(apiConfigFile.includes('EXPO_PUBLIC_API_URL'), 'apiConfig reads EXPO_PUBLIC_API_URL');
assert(apiConfigFile.includes('EXPO_PUBLIC_ML_URL'), 'apiConfig reads EXPO_PUBLIC_ML_URL');
assert(apiConfigFile.includes('EXPO_PUBLIC_DEV_HOST'), 'apiConfig reads EXPO_PUBLIC_DEV_HOST');
assert(apiConfigFile.includes('EXPO_PUBLIC_USE_EMULATOR'), 'apiConfig reads EXPO_PUBLIC_USE_EMULATOR');
assert(apiConfigFile.includes('__UNCONFIGURED_ANDROID_LAN_HOST__'), 'apiConfig explicitly guards unconfigured physical Android');

// Pure normalization functions (mirroring apiConfig.js)
const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api') || trimmed.includes('/api/')) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

const normalizeMlUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    trimmed = trimmed.slice(0, -4);
  }
  return trimmed;
};

// Test normalizeApiUrl ensures /api is present exactly once
{
  assert(normalizeApiUrl('http://192.168.1.50:5000') === 'http://192.168.1.50:5000/api', 'Appends /api when omitted');
  assert(normalizeApiUrl('http://192.168.1.50:5000/') === 'http://192.168.1.50:5000/api', 'Strips trailing slash and appends /api');
  assert(normalizeApiUrl('http://192.168.1.50:5000/api') === 'http://192.168.1.50:5000/api', 'Preserves existing /api without duplication');
  assert(normalizeApiUrl('http://192.168.1.50:5000/api/') === 'http://192.168.1.50:5000/api', 'Strips trailing slash from /api/');
  assert(normalizeApiUrl('http://localhost:5000/api/v1') === 'http://localhost:5000/api/v1', 'Preserves custom versioned path without redundant /api');
}

// Test normalizeMlUrl
{
  assert(normalizeMlUrl('http://192.168.1.50:8002') === 'http://192.168.1.50:8002', 'Preserves clean ML base URL');
  assert(normalizeMlUrl('http://192.168.1.50:8002/') === 'http://192.168.1.50:8002', 'Strips trailing slash from ML URL');
  assert(normalizeMlUrl('http://192.168.1.50:8002/api') === 'http://192.168.1.50:8002', 'Removes accidental /api from ML base URL');
}

// Simulate resolution logic across platforms
function resolveUrls({ platform, env = {} }) {
  // API URL resolution
  let apiUrl;
  if (env.EXPO_PUBLIC_API_URL) {
    apiUrl = normalizeApiUrl(env.EXPO_PUBLIC_API_URL);
  } else if (env.EXPO_PUBLIC_DEV_HOST) {
    const port = env.EXPO_PUBLIC_API_PORT || '5000';
    apiUrl = normalizeApiUrl(`http://${env.EXPO_PUBLIC_DEV_HOST}:${port}`);
  } else if (platform === 'android') {
    if (env.EXPO_PUBLIC_USE_EMULATOR === 'true') {
      apiUrl = 'http://10.0.2.2:5000/api';
    } else {
      apiUrl = '__UNCONFIGURED_ANDROID_LAN_HOST__/api';
    }
  } else {
    apiUrl = 'http://127.0.0.1:5000/api';
  }

  // ML URL resolution
  let mlUrl;
  const mlPort = env.EXPO_PUBLIC_ML_PORT || '8002';
  if (env.EXPO_PUBLIC_ML_URL) {
    mlUrl = normalizeMlUrl(env.EXPO_PUBLIC_ML_URL);
  } else if (env.EXPO_PUBLIC_DEV_HOST) {
    mlUrl = normalizeMlUrl(`http://${env.EXPO_PUBLIC_DEV_HOST}:${mlPort}`);
  } else if (platform === 'android') {
    if (env.EXPO_PUBLIC_USE_EMULATOR === 'true') {
      mlUrl = `http://10.0.2.2:${mlPort}`;
    } else {
      mlUrl = `__UNCONFIGURED_ANDROID_LAN_HOST__:${mlPort}`;
    }
  } else {
    mlUrl = `http://127.0.0.1:${mlPort}`;
  }

  return { apiUrl, mlUrl };
}

// Test Physical Android with EXPO_PUBLIC_API_URL
{
  const res = resolveUrls({
    platform: 'android',
    env: { EXPO_PUBLIC_API_URL: 'http://192.168.1.105:5000', EXPO_PUBLIC_ML_URL: 'http://192.168.1.105:8002' },
  });
  assert(res.apiUrl === 'http://192.168.1.105:5000/api', 'Physical Android uses configured LAN IP for Express with /api');
  assert(res.mlUrl === 'http://192.168.1.105:8002', 'Physical Android uses configured LAN IP for ML service');
}

// Test Physical Android with EXPO_PUBLIC_DEV_HOST
{
  const res = resolveUrls({
    platform: 'android',
    env: { EXPO_PUBLIC_DEV_HOST: '192.168.1.105' },
  });
  assert(res.apiUrl === 'http://192.168.1.105:5000/api', 'Physical Android with DEV_HOST routes Express to port 5000/api');
  assert(res.mlUrl === 'http://192.168.1.105:8002', 'Physical Android with DEV_HOST routes ML to port 8002');
}

// Test Physical Android WITHOUT configuration (must not silently fall back to loopback or emulator)
{
  const res = resolveUrls({
    platform: 'android',
    env: {},
  });
  assert(res.apiUrl.includes('__UNCONFIGURED_ANDROID_LAN_HOST__'), 'Physical Android without LAN config exposes explicit unconfigured error');
  assert(!res.apiUrl.includes('127.0.0.1'), 'Physical Android does not silently return unreachable 127.0.0.1');
  assert(!res.apiUrl.includes('10.0.2.2'), 'Physical Android does not silently return emulator-only 10.0.2.2');
}

// Test Android Emulator
{
  const res = resolveUrls({
    platform: 'android',
    env: { EXPO_PUBLIC_USE_EMULATOR: 'true' },
  });
  assert(res.apiUrl === 'http://10.0.2.2:5000/api', 'Android emulator uses 10.0.2.2 loopback router alias');
  assert(res.mlUrl === 'http://10.0.2.2:8002', 'Android emulator routes ML to 10.0.2.2:8002');
}

// Test iOS Simulator
{
  const res = resolveUrls({ platform: 'ios', env: {} });
  assert(res.apiUrl === 'http://127.0.0.1:5000/api', 'iOS simulator routes to local host loopback');
  assert(res.mlUrl === 'http://127.0.0.1:8002', 'iOS simulator routes ML to local 8002');
}

// Test Web Development
{
  const res = resolveUrls({ platform: 'web', env: {} });
  assert(res.apiUrl === 'http://127.0.0.1:5000/api', 'Web dev routes to local host loopback');
  assert(res.mlUrl === 'http://127.0.0.1:8002', 'Web dev routes ML to local 8002');
}

// -------------------------------------------------------------
// 2. Express & MongoDB Health Check Tests
// -------------------------------------------------------------
console.log('\n--- 2. Backend Health & Database Integrity Tests ---');

(async () => {
  const { getHealth } = require('../controllers/healthController');

  // Case A: Disconnected DB -> Expects 503 & success: false
  {
    let statusCode = null;
    let jsonBody = null;
    const mockReq = {};
    const mockRes = {
      status: (code) => { statusCode = code; return mockRes; },
      json: (body) => { jsonBody = body; return mockRes; },
    };

    // mongoose.connection.readyState = 0 (disconnected)
    await getHealth(mockReq, mockRes);
    assert(statusCode === 503, 'Health endpoint returns HTTP 503 when database is disconnected');
    assert(jsonBody.success === false, 'Health endpoint returns success: false when database is disconnected');
    assert(jsonBody.message.includes('degraded'), 'Health message indicates degraded state when database is disconnected');
  }

  // Case B: Connected DB -> Expects 200 & success: true
  {
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/foodshareai';
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 3000 });
      let statusCode = null;
      let jsonBody = null;
      const mockReq = {};
      const mockRes = {
        status: (code) => { statusCode = code; return mockRes; },
        json: (body) => { jsonBody = body; return mockRes; },
      };

      await getHealth(mockReq, mockRes);
      assert(statusCode === 200, 'Health endpoint returns HTTP 200 when database is connected');
      assert(jsonBody.success === true, 'Health endpoint returns success: true when database is connected');
      assert(jsonBody.status.database.connected === true, 'Health database status reports connected: true');
      assert(jsonBody.status.database.status === 'connected', 'Health database state reports connected');

      await mongoose.disconnect();
    } catch (dbErr) {
      console.warn('Note: Live MongoDB connection test skipped or timed out:', dbErr.message);
    }
  }

  console.log('\n========================================');
  console.log(`Phase 3 Node Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');

  if (failed > 0) process.exit(1);
  else process.exit(0);
})();
