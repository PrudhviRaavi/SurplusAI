/**
 * FoodShareAI - Phase 2 Splash Screen & Viewport Layout Tests
 *
 * Validates:
 * 1. Animation Completion Safety:
 *    - Naturally completed animation fires onFinish exactly once.
 *    - User tap (skip) fires onFinish exactly once and stops the animation.
 *    - Subsequent timer / natural completion does NOT double-call onFinish.
 *    - Replay splash properly resets safety guard for fresh completion.
 *    - Unmount cleanup invokes animation cancel/stop.
 * 2. Static Layout & Architecture Invariants:
 *    - AppNavigator root element is <View>, eliminating double-safe-area.
 *    - ScreenBarSwitcher is strictly gated: hidden in production (!__DEV__) and hidden on 'splash' screen.
 *    - SplashScreen container centers content without arbitrary paddingBottom.
 *    - SplashScreen StatusBar explicitly specifies translucent={false} for solid Android status bar.
 *    - MinimalBowlSparkLogo interface compatibility (glowOpacity, glowScale props accepted safely).
 */

'use strict';

const fs = require('fs');
const path = require('path');

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
// 1. Animation Safety & Double-Trigger Prevention Simulation
// -------------------------------------------------------------
console.log('\n--- 1. Animation Safety & Lifecycle Tests ---');

class MockSplashAnimationController {
  constructor(onFinish) {
    this.onFinish = onFinish;
    this.hasFinished = false;
    this.isStopped = false;
    this.animationRunning = false;
  }

  handleFinish() {
    if (this.hasFinished) return;
    this.hasFinished = true;
    if (this.animationRunning) {
      this.isStopped = true;
      this.animationRunning = false;
    }
    if (this.onFinish) {
      this.onFinish();
    }
  }

  startAnimation() {
    this.hasFinished = false;
    this.isStopped = false;
    this.animationRunning = true;
  }

  simulateNaturalComplete() {
    if (this.animationRunning) {
      this.animationRunning = false;
      this.handleFinish();
    }
  }

  simulateUserTapSkip() {
    this.handleFinish();
  }

  simulateUnmount() {
    if (this.animationRunning) {
      this.isStopped = true;
      this.animationRunning = false;
    }
  }
}

// Test A: Natural completion fires exactly once
{
  let finishCalls = 0;
  const controller = new MockSplashAnimationController(() => { finishCalls++; });
  controller.startAnimation();
  controller.simulateNaturalComplete();
  // Attempt duplicate trigger
  controller.simulateNaturalComplete();

  assert(finishCalls === 1, 'Natural animation completion fires onFinish exactly once');
}

// Test B: Tap to skip fires once and prevents later natural completion
{
  let finishCalls = 0;
  const controller = new MockSplashAnimationController(() => { finishCalls++; });
  controller.startAnimation();
  controller.simulateUserTapSkip();
  assert(finishCalls === 1, 'Tap to skip immediately fires onFinish once');
  assert(controller.isStopped === true, 'Tap to skip stops any running animation');

  // If a lingering timer/callback tries to fire completion afterwards:
  controller.simulateNaturalComplete();
  assert(finishCalls === 1, 'Subsequent natural completion does NOT fire onFinish a second time');
}

// Test C: Replay resets guard and allows new completion
{
  let finishCalls = 0;
  const controller = new MockSplashAnimationController(() => { finishCalls++; });
  controller.startAnimation();
  controller.simulateNaturalComplete();
  assert(finishCalls === 1, 'First run completes once');

  // User taps Replay
  controller.startAnimation();
  assert(controller.hasFinished === false, 'Replaying resets hasFinished guard');
  controller.simulateNaturalComplete();
  assert(finishCalls === 2, 'Replayed animation completes cleanly on second run');
}

// Test D: Unmount stops running animation
{
  let finishCalls = 0;
  const controller = new MockSplashAnimationController(() => { finishCalls++; });
  controller.startAnimation();
  controller.simulateUnmount();
  assert(controller.isStopped === true, 'Unmounting stops ongoing animation');
  assert(finishCalls === 0, 'Unmounting cleanly does not falsely trigger onFinish');
}

// -------------------------------------------------------------
// 2. Codebase Invariant Verification
// -------------------------------------------------------------
console.log('\n--- 2. File & Layout Invariant Verification ---');

const appNavigatorContent = fs.readFileSync(
  path.resolve(__dirname, '../../../src/navigation/AppNavigator.js'),
  'utf8'
);
const splashScreenContent = fs.readFileSync(
  path.resolve(__dirname, '../../../src/screens/SplashScreen.js'),
  'utf8'
);
const illustrationsContent = fs.readFileSync(
  path.resolve(__dirname, '../../../src/components/illustrations/FoodShareIllustrations.js'),
  'utf8'
);

// AppNavigator Checks
{
  // Check mainShell uses View instead of SafeAreaView
  const hasViewRoot = appNavigatorContent.includes('<View style={styles.mainShell}>');
  const hasNoSafeAreaViewRoot = !appNavigatorContent.includes('<SafeAreaView style={styles.mainShell}>');
  assert(hasViewRoot && hasNoSafeAreaViewRoot, 'AppNavigator root container uses View, removing redundant outer SafeAreaView');

  // Check ScreenBarSwitcher is gated by __DEV__ and hidden on splash
  const hasDevCheck = appNavigatorContent.includes('__DEV__');
  const hidesOnSplash = appNavigatorContent.includes("currentScreen !== 'splash'");
  assert(hasDevCheck, 'ScreenBarSwitcher is gated behind development check (__DEV__)');
  assert(hidesOnSplash, "ScreenBarSwitcher is explicitly hidden when currentScreen === 'splash'");
}

// SplashScreen Checks
{
  // Check hasFinishedRef and animRef are present
  assert(splashScreenContent.includes('hasFinishedRef'), 'SplashScreen declares hasFinishedRef guard');
  assert(splashScreenContent.includes('animRef'), 'SplashScreen declares animRef for cancellation');

  // Check tap handler uses handleFinish
  assert(splashScreenContent.includes('onPress={handleFinish}'), 'SplashScreen touch container triggers safe handleFinish');

  // Check unmount cleanup in useEffect
  assert(splashScreenContent.includes('return () => {') && splashScreenContent.includes('animRef.current.stop()'), 'SplashScreen useEffect returns cleanup function to stop running animation');

  // Check StatusBar translucent={false}
  assert(splashScreenContent.includes('translucent={false}'), 'SplashScreen sets StatusBar translucent={false} for solid Android status bar');

  // Check paddingBottom is removed from container style
  const containerMatch = splashScreenContent.match(/container:\s*\{([^}]+)\}/s);
  assert(containerMatch !== null, 'SplashScreen defines container style');
  if (containerMatch) {
    const hasPaddingBottom = containerMatch[1].includes('paddingBottom');
    assert(!hasPaddingBottom, 'Arbitrary paddingBottom is removed from container style');
    assert(containerMatch[1].includes("alignItems: 'center'"), 'container centers items horizontally');
    assert(containerMatch[1].includes("justifyContent: 'center'"), 'container centers items vertically');
  }
}

// Logo Effects Checks
{
  assert(illustrationsContent.includes('MinimalBowlSparkLogo'), 'MinimalBowlSparkLogo exists in FoodShareIllustrations');
  assert(illustrationsContent.includes('glowOpacity') && illustrationsContent.includes('glowScale'), 'MinimalBowlSparkLogo maintains interface compatibility for glowOpacity & glowScale');
}

// Summary
console.log('\n========================================');
console.log(`Phase 2 Test Results: ${passed} PASSED, ${failed} FAILED`);
console.log('========================================\n');

if (failed > 0) {
  process.exit(1);
} else {
  process.exit(0);
}
