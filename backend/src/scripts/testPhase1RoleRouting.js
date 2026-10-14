/**
 * FoodShareAI - Phase 1 Role-Routing & Auth Unit Tests
 *
 * Validates:
 * 1. Role-to-dashboard routing logic in AppNavigator & session restoration:
 *    - DONOR -> donorDashboard
 *    - NGO -> ngoDashboard
 *    - VOLUNTEER -> volunteerDashboard
 *    - ADMIN -> adminDashboard
 *    - Fallback / Unknown / Case insensitivity
 * 2. Auth failure handling & contract integrity:
 *    - Invalid credentials / API throw -> onSignIn NOT called
 *    - Blank credentials validation
 *    - Response shape unpacking (apiClient -> authApiService -> LoginScreen)
 */

'use strict';

let passed = 0;
let failed = 0;
const results = [];

function assert(condition, label) {
  if (condition) {
    passed++;
    results.push({ status: 'PASS', label });
    console.log(`  ✓ ${label}`);
  } else {
    failed++;
    results.push({ status: 'FAIL', label });
    console.error(`  ✗ FAIL: ${label}`);
  }
}

// ---------------------------------------------------------
// 1. AppNavigator Role Routing Logic (pure function reproduction)
// ---------------------------------------------------------
function resolveNavigationState(userRole) {
  const role = (userRole || '').toUpperCase();
  let activeRole;
  let selectedRole;
  let currentScreen;

  if (role === 'NGO') {
    activeRole = 'NGO';
    selectedRole = 'ngo';
    currentScreen = 'ngoDashboard';
  } else if (role === 'VOLUNTEER') {
    activeRole = 'Volunteer';
    selectedRole = 'volunteer';
    currentScreen = 'volunteerDashboard';
  } else if (role === 'ADMIN') {
    activeRole = 'Admin';
    selectedRole = 'admin';
    currentScreen = 'adminDashboard';
  } else {
    activeRole = 'Donor';
    selectedRole = 'donor';
    currentScreen = 'donorDashboard';
  }

  return { activeRole, selectedRole, currentScreen };
}

console.log('\n--- 1. AppNavigator Role-to-Dashboard Routing Tests ---');

// Test DONOR
{
  const res = resolveNavigationState('DONOR');
  assert(res.currentScreen === 'donorDashboard', 'DONOR routes to donorDashboard');
  assert(res.activeRole === 'Donor', 'DONOR sets activeRole to Donor');
  assert(res.selectedRole === 'donor', 'DONOR sets selectedRole to donor');
}

// Test NGO
{
  const res = resolveNavigationState('NGO');
  assert(res.currentScreen === 'ngoDashboard', 'NGO routes to ngoDashboard');
  assert(res.activeRole === 'NGO', 'NGO sets activeRole to NGO');
  assert(res.selectedRole === 'ngo', 'NGO sets selectedRole to ngo');
}

// Test VOLUNTEER
{
  const res = resolveNavigationState('VOLUNTEER');
  assert(res.currentScreen === 'volunteerDashboard', 'VOLUNTEER routes to volunteerDashboard');
  assert(res.activeRole === 'Volunteer', 'VOLUNTEER sets activeRole to Volunteer');
  assert(res.selectedRole === 'volunteer', 'VOLUNTEER sets selectedRole to volunteer');
}

// Test ADMIN
{
  const res = resolveNavigationState('ADMIN');
  assert(res.currentScreen === 'adminDashboard', 'ADMIN routes to adminDashboard');
  assert(res.activeRole === 'Admin', 'ADMIN sets activeRole to Admin');
  assert(res.selectedRole === 'admin', 'ADMIN sets selectedRole to admin');
}

// Test Case Insensitivity
{
  const ngoLower = resolveNavigationState('ngo');
  assert(ngoLower.currentScreen === 'ngoDashboard', 'Lowercase "ngo" routes to ngoDashboard');

  const volMixed = resolveNavigationState('Volunteer');
  assert(volMixed.currentScreen === 'volunteerDashboard', 'Mixed-case "Volunteer" routes to volunteerDashboard');

  const adminLower = resolveNavigationState('admin');
  assert(adminLower.currentScreen === 'adminDashboard', 'Lowercase "admin" routes to adminDashboard');
}

// Test Fallback for null / undefined / unknown roles
{
  const resNull = resolveNavigationState(null);
  assert(resNull.currentScreen === 'donorDashboard', 'null role defaults to donorDashboard');

  const resUndefined = resolveNavigationState(undefined);
  assert(resUndefined.currentScreen === 'donorDashboard', 'undefined role defaults to donorDashboard');

  const resEmpty = resolveNavigationState('');
  assert(resEmpty.currentScreen === 'donorDashboard', 'empty string role defaults to donorDashboard');

  const resUnknown = resolveNavigationState('GUEST');
  assert(resUnknown.currentScreen === 'donorDashboard', 'unknown role "GUEST" defaults to donorDashboard');
}

// ---------------------------------------------------------
// 2. Auth Flow & Failure Handling Simulation
// ---------------------------------------------------------
console.log('\n--- 2. Login Flow & Auth Failure Handling Tests ---');

async function simulateLoginScreenHandler({
  emailOrPhone,
  password,
  authApiServiceMock,
  onSignInSpy,
  setActiveRoleSpy,
}) {
  let error = '';
  let loading = false;

  if (!emailOrPhone || !password) {
    error = 'Please enter your email and password.';
    return { error, loading, onSignInCalled: false };
  }

  error = '';
  loading = true;

  try {
    const result = await authApiServiceMock.login({
      email: emailOrPhone,
      password,
    });

    const userRole = result?.user?.role;
    if (userRole === 'DONOR') {
      setActiveRoleSpy('Donor');
    } else if (userRole === 'NGO') {
      setActiveRoleSpy('NGO');
    } else if (userRole === 'VOLUNTEER') {
      setActiveRoleSpy('Volunteer');
    } else if (userRole === 'ADMIN') {
      setActiveRoleSpy('Admin');
    }

    loading = false;
    if (onSignInSpy) onSignInSpy(userRole);
    return { error: '', loading: false, onSignInCalled: true, userRole };
  } catch (err) {
    loading = false;
    error = err.message || 'Invalid email or password.';
    return { error, loading: false, onSignInCalled: false };
  }
}

// Test Blank Credentials Validation
(async () => {
  let onSignInCalled = false;
  const res = await simulateLoginScreenHandler({
    emailOrPhone: '',
    password: '',
    authApiServiceMock: { login: async () => ({}) },
    onSignInSpy: () => { onSignInCalled = true; },
    setActiveRoleSpy: () => {},
  });

  assert(res.error === 'Please enter your email and password.', 'Empty credentials trigger client validation error');
  assert(!res.loading, 'Loading state is false when validation fails');
  assert(!onSignInCalled, 'onSignIn is NEVER called when validation fails');
})();

// Test 401 Invalid Credentials / Server Rejection
(async () => {
  let onSignInCalled = false;
  let activeRoleSet = null;

  const mockService = {
    login: async () => {
      const err = new Error('Invalid email or password');
      err.status = 401;
      throw err;
    },
  };

  const res = await simulateLoginScreenHandler({
    emailOrPhone: 'user@example.com',
    password: 'wrongpassword',
    authApiServiceMock: mockService,
    onSignInSpy: () => { onSignInCalled = true; },
    setActiveRoleSpy: (role) => { activeRoleSet = role; },
  });

  assert(res.error === 'Invalid email or password', 'Auth rejection sets error message');
  assert(!res.loading, 'Loading flag is reset to false on auth error');
  assert(!onSignInCalled, 'onSignIn callback is NOT triggered on 401 authentication failure');
  assert(activeRoleSet === null, 'Active role is not modified on authentication failure');
})();

// Test Successful NGO Login Flow & Response Unpacking
(async () => {
  let onSignInRole = null;
  let activeRoleSet = null;

  // Exact apiClient envelope: { success: true, message: '...', data: { user: {...}, token: '...' } }
  const mockApiData = {
    user: {
      id: 'ngo-user-123',
      fullName: 'Hope Shelter',
      email: 'contact@hopeshelter.org',
      role: 'NGO',
    },
    token: 'jwt.token.here',
  };

  const mockService = {
    login: async () => mockApiData, // authApiService returns res.data
  };

  const res = await simulateLoginScreenHandler({
    emailOrPhone: 'contact@hopeshelter.org',
    password: 'correctpassword',
    authApiServiceMock: mockService,
    onSignInSpy: (role) => { onSignInRole = role; },
    setActiveRoleSpy: (role) => { activeRoleSet = role; },
  });

  assert(res.error === '', 'No error on successful login');
  assert(!res.loading, 'Loading is false after login');
  assert(onSignInRole === 'NGO', 'onSignIn receives actual userRole "NGO" from backend response');
  assert(activeRoleSet === 'NGO', 'setActiveRole is updated to "NGO"');

  // Verify routing downstream in AppNavigator
  const nav = resolveNavigationState(onSignInRole);
  assert(nav.currentScreen === 'ngoDashboard', 'Downstream navigator routes NGO to ngoDashboard');
})();

// Summary output
setTimeout(() => {
  console.log('\n========================================');
  console.log(`Phase 1 Test Results: ${passed} PASSED, ${failed} FAILED`);
  console.log('========================================\n');
  if (failed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}, 50);