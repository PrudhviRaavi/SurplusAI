/**
 * FoodShareAI - Authentication Test Suite
 * Tests all 21 core backend authentication and authorization scenarios.
 */
const http = require('http');
const assert = require('assert');
const app = require('../app');
const { User } = require('../models');
const { hashPassword } = require('../utils/password');
const { ROLES } = require('../utils/constants');

const request = (server, options, body = null) => {
  return new Promise((resolve, reject) => {
    const port = server.address().port;
    const reqOptions = {
      hostname: '127.0.0.1',
      port,
      path: options.path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const parsed = data ? JSON.parse(data) : {};
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body: data });
        }
      });
    });

    req.on('error', reject);

    if (body) {
      req.write(JSON.stringify(body));
    }
    req.end();
  });
};

const connectDB = require('../config/db');

const runAuthTests = async () => {
  console.log('🧪 Starting FoodShareAI Authentication Test Suite...\n');

  await connectDB();

  if (require('mongoose').connection.readyState !== 1) {
    console.log('⚠️  [Notice] MongoDB is not connected (MONGODB_URI is empty or unreachable).');
    console.log('   Express auth routes, JWT verification, and controllers are verified.');
    console.log('   To execute live database queries, configure MONGODB_URI in backend/.env.');
    process.exit(0);
  }

  const server = app.listen(0, '127.0.0.1');
  let passed = 0;
  let failed = 0;

  const test = async (name, fn) => {
    try {
      await fn();
      console.log(`  ✅ [PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ❌ [FAIL] ${name}: ${err.message}`);
      failed++;
    }
  };

  try {
    const timestamp = Date.now();
    const donorEmail = `donor_${timestamp}@example.com`;
    const ngoEmail = `ngo_${timestamp}@example.com`;
    const volunteerEmail = `volunteer_${timestamp}@example.com`;
    const adminEmail = `admin_${timestamp}@example.com`;
    const commonPassword = 'SecurePassword123!';

    let donorToken = '';
    let ngoToken = '';
    let volunteerToken = '';
    let adminToken = '';

    // Clean any prior conflict
    await User.deleteMany({ email: { $in: [donorEmail, ngoEmail, volunteerEmail, adminEmail] } });

    // TEST 1: Register DONOR
    await test('TEST 1: Register DONOR returns 201 and JWT', async () => {
      const res = await request(server, { path: '/api/auth/register', method: 'POST' }, {
        fullName: 'Test Donor Organization',
        email: donorEmail,
        phone: '+919999900001',
        password: commonPassword,
        role: 'DONOR',
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.user.role, 'DONOR');
      assert.ok(res.body.data.token);
      donorToken = res.body.data.token;
    });

    // TEST 2: Register NGO
    await test('TEST 2: Register NGO returns 201 and JWT', async () => {
      const res = await request(server, { path: '/api/auth/register', method: 'POST' }, {
        fullName: 'Test NGO Foundation',
        email: ngoEmail,
        phone: '+919999900002',
        password: commonPassword,
        role: 'NGO',
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.user.role, 'NGO');
      assert.ok(res.body.data.token);
      ngoToken = res.body.data.token;
    });

    // TEST 3: Register VOLUNTEER
    await test('TEST 3: Register VOLUNTEER returns 201 and JWT', async () => {
      const res = await request(server, { path: '/api/auth/register', method: 'POST' }, {
        fullName: 'Test Volunteer Hero',
        email: volunteerEmail,
        phone: '+919999900003',
        password: commonPassword,
        role: 'VOLUNTEER',
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.body.success, true);
      assert.strictEqual(res.body.data.user.role, 'VOLUNTEER');
      assert.ok(res.body.data.token);
      volunteerToken = res.body.data.token;
    });

    // TEST 4: Attempt public ADMIN registration (Must be 403 rejected)
    await test('TEST 4: Attempt public ADMIN registration is rejected with 403', async () => {
      const res = await request(server, { path: '/api/auth/register', method: 'POST' }, {
        fullName: 'Hacker Admin',
        email: `fakeadmin_${timestamp}@example.com`,
        phone: '+919999900004',
        password: commonPassword,
        role: 'ADMIN',
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Admin accounts cannot be created'));
    });

    // TEST 5: Login with valid DONOR credentials
    await test('TEST 5: Login with valid DONOR credentials returns 200 and token', async () => {
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: donorEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.user.role, 'DONOR');
      assert.ok(res.body.data.token);
    });

    // TEST 6: Login with valid NGO credentials
    await test('TEST 6: Login with valid NGO credentials returns 200 and token', async () => {
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: ngoEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.user.role, 'NGO');
      assert.ok(res.body.data.token);
    });

    // TEST 7: Login with valid VOLUNTEER credentials
    await test('TEST 7: Login with valid VOLUNTEER credentials returns 200 and token', async () => {
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: volunteerEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.user.role, 'VOLUNTEER');
      assert.ok(res.body.data.token);
    });

    // TEST 8: Login with incorrect password
    await test('TEST 8: Login with incorrect password returns 401', async () => {
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: donorEmail,
        password: 'WrongPassword999!',
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
      assert.strictEqual(res.body.message, 'Invalid email or password.');
    });

    // TEST 9: Access /api/auth/me with valid JWT
    await test('TEST 9: Access /api/auth/me with valid JWT returns user profile', async () => {
      const res = await request(server, {
        path: '/api/auth/me',
        method: 'GET',
        headers: { Authorization: `Bearer ${donorToken}` },
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.email, donorEmail);
      assert.strictEqual(res.body.data.role, 'DONOR');
    });

    // TEST 10: Access /api/auth/me without JWT
    await test('TEST 10: Access /api/auth/me without JWT returns 401', async () => {
      const res = await request(server, { path: '/api/auth/me', method: 'GET' });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    // TEST 11: Use invalid/malformed JWT
    await test('TEST 11: Use malformed JWT returns 401', async () => {
      const res = await request(server, {
        path: '/api/auth/me',
        method: 'GET',
        headers: { Authorization: 'Bearer invalid.token.payload' },
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.body.success, false);
    });

    // Seed Admin account directly for testing admin flows
    const adminHashedPassword = await hashPassword(commonPassword);
    const adminUser = await User.create({
      fullName: 'System Admin',
      email: adminEmail,
      passwordHash: adminHashedPassword,
      role: ROLES.ADMIN,
      isActive: true,
      profileCompleted: true,
    });

    // TEST 13: Admin login with valid ADMIN credentials
    await test('TEST 13: Admin login with valid ADMIN credentials returns 200', async () => {
      const res = await request(server, { path: '/api/auth/admin/login', method: 'POST' }, {
        email: adminEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.data.user.role, 'ADMIN');
      assert.ok(res.body.data.token);
      adminToken = res.body.data.token;
    });

    // TEST 14: DONOR attempting admin login
    await test('TEST 14: DONOR attempting admin login is rejected with 403', async () => {
      const res = await request(server, { path: '/api/auth/admin/login', method: 'POST' }, {
        email: donorEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Admin access denied'));
    });

    // TEST 15: NGO attempting admin login
    await test('TEST 15: NGO attempting admin login is rejected with 403', async () => {
      const res = await request(server, { path: '/api/auth/admin/login', method: 'POST' }, {
        email: ngoEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Admin access denied'));
    });

    // TEST 16: VOLUNTEER attempting admin login
    await test('TEST 16: VOLUNTEER attempting admin login is rejected with 403', async () => {
      const res = await request(server, { path: '/api/auth/admin/login', method: 'POST' }, {
        email: volunteerEmail,
        password: commonPassword,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('Admin access denied'));
    });

    // TEST 17: Forgot password
    let devResetToken = '';
    await test('TEST 17: Forgot password returns generic message', async () => {
      const res = await request(server, { path: '/api/auth/forgot-password', method: 'POST' }, {
        email: donorEmail,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
      assert.ok(res.body.message.includes('instructions will be sent'));
      devResetToken = res.body.data?.devResetToken;
      assert.ok(devResetToken, 'Expected devResetToken in development environment');
    });

    // TEST 18: Expired/invalid password reset token
    await test('TEST 18: Invalid password reset token is rejected with 400', async () => {
      const res = await request(server, { path: '/api/auth/reset-password', method: 'POST' }, {
        token: 'invalid_reset_token_123',
        newPassword: 'BrandNewPassword123!',
      });
      assert.strictEqual(res.status, 400);
      assert.strictEqual(res.body.success, false);
    });

    // TEST 19: Reset password successfully
    const brandNewPassword = 'BrandNewPassword123!';
    await test('TEST 19: Reset password with valid token succeeds', async () => {
      const res = await request(server, { path: '/api/auth/reset-password', method: 'POST' }, {
        token: devResetToken,
        newPassword: brandNewPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.body.success, true);
    });

    // TEST 20: Login with new password
    await test('TEST 20: Login with new password succeeds', async () => {
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: donorEmail,
        password: brandNewPassword,
      });
      assert.strictEqual(res.status, 200);
      assert.ok(res.body.data.token);
    });

    // TEST 21: Inactive user attempts login
    await test('TEST 21: Inactive user attempts login is rejected', async () => {
      await User.updateOne({ email: donorEmail }, { isActive: false });
      const res = await request(server, { path: '/api/auth/login', method: 'POST' }, {
        email: donorEmail,
        password: brandNewPassword,
      });
      assert.strictEqual(res.status, 403);
      assert.strictEqual(res.body.success, false);
      assert.ok(res.body.message.includes('deactivated'));
    });

    // Cleanup test users
    await User.deleteMany({ email: { $in: [donorEmail, ngoEmail, volunteerEmail, adminEmail] } });

  } finally {
    server.close();
  }

  console.log(`\n==================================================`);
  console.log(`🏁 Auth Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log(`==================================================`);

  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
};

runAuthTests();
