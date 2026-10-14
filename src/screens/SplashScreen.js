import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  MinimalBowlSparkLogo,
  FloatingDustParticles,
} from '../components/illustrations/FoodShareIllustrations';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

export const SplashScreen = ({ onFinish }) => {
  // Master Fade Dissolve (2.6s - 3.0s)
  const screenOpacity = useRef(new Animated.Value(1)).current;

  // Completion & Cleanup Safety Refs
  const hasFinishedRef = useRef(false);
  const animRef = useRef(null);
  const isMountedRef = useRef(true);
  const runIdRef = useRef(0);

  // Timeline Animation Drivers
  const glowOpacity = useRef(new Animated.Value(0)).current;
  const glowScale = useRef(new Animated.Value(0.7)).current;

  const logoScale = useRef(new Animated.Value(0)).current;
  const logoRotate = useRef(new Animated.Value(-4)).current;
  const logoPulse = useRef(new Animated.Value(1)).current;

  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleY = useRef(new Animated.Value(20)).current;

  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const subtitleY = useRef(new Animated.Value(10)).current;

  const particleProgress = useRef(new Animated.Value(0)).current;

  const handleFinish = () => {
    if (hasFinishedRef.current) return;
    hasFinishedRef.current = true;
    if (animRef.current) {
      animRef.current.stop();
    }
    if (onFinish) {
      onFinish();
    }
  };

  const startAnimation = () => {
    hasFinishedRef.current = false;
    runIdRef.current += 1;
    const currentRunId = runIdRef.current;

    if (animRef.current) {
      animRef.current.stop();
    }

    // Reset values
    screenOpacity.setValue(1);
    glowOpacity.setValue(0);
    glowScale.setValue(0.7);
    logoScale.setValue(0);
    logoRotate.setValue(-4);
    logoPulse.setValue(1);
    titleOpacity.setValue(0);
    titleY.setValue(20);
    subtitleOpacity.setValue(0);
    subtitleY.setValue(10);
    particleProgress.setValue(0);

    // Expanded Timeline Sequences (4.8s Total for Luxurious Cinematic Pace)
    const animSequence = Animated.sequence([
      // 0.0s – 0.6s: Soft blurred ambient entrance
      Animated.parallel([
        Animated.timing(glowOpacity, {
          toValue: 0.7,
          duration: 600,
          useNativeDriver,
        }),
        Animated.timing(glowScale, {
          toValue: 1.0,
          duration: 600,
          useNativeDriver,
        }),
      ]),

      // 0.6s – 1.8s: Logo scales 0% to 110% with 4deg rotation & smooth spring
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1.1,
          friction: 7,
          tension: 30,
          useNativeDriver,
        }),
        Animated.timing(logoRotate, {
          toValue: 0,
          duration: 1200,
          useNativeDriver,
        }),
        Animated.timing(glowOpacity, {
          toValue: 0.9,
          duration: 1200,
          useNativeDriver,
        }),
      ]),

      // 1.8s – 2.8s: Staggered text fade-in ("FoodShareAI" and subheadline)
      Animated.stagger(250, [
        Animated.parallel([
          Animated.timing(titleOpacity, {
            toValue: 1.0,
            duration: 650,
            useNativeDriver,
          }),
          Animated.timing(titleY, {
            toValue: 0,
            duration: 650,
            useNativeDriver,
          }),
        ]),
        Animated.parallel([
          Animated.timing(subtitleOpacity, {
            toValue: 1.0,
            duration: 650,
            useNativeDriver,
          }),
          Animated.timing(subtitleY, {
            toValue: 0,
            duration: 650,
            useNativeDriver,
          }),
        ]),
      ]),

      // 2.8s – 4.2s: Luxurious logo pulse & drifting particle movement
      Animated.parallel([
        Animated.sequence([
          Animated.timing(logoPulse, {
            toValue: 1.05,
            duration: 700,
            useNativeDriver,
          }),
          Animated.timing(logoPulse, {
            toValue: 1.0,
            duration: 700,
            useNativeDriver,
          }),
        ]),
        Animated.timing(glowScale, {
          toValue: 1.3,
          duration: 1400,
          useNativeDriver,
        }),
        Animated.timing(particleProgress, {
          toValue: 1.0,
          duration: 1400,
          useNativeDriver,
        }),
      ]),

      // 4.2s – 4.8s: Dissolve fade-out into Onboarding 1
      Animated.timing(screenOpacity, {
        toValue: 0.0,
        duration: 600,
        useNativeDriver,
      }),
    ]);

    animRef.current = animSequence;
    animSequence.start(({ finished }) => {
      console.log(
        `[SplashScreen] animSequence callback fired (finished: ${finished}, currentRunId: ${currentRunId}, activeRunId: ${runIdRef.current}, isMounted: ${isMountedRef.current}, hasFinished: ${hasFinishedRef.current})`
      );

      // Guard against stopped/replayed prior generations and unmounted lifecycle
      if (!isMountedRef.current) return;
      if (currentRunId !== runIdRef.current) return;
      if (hasFinishedRef.current) return;

      handleFinish();
    });
  };

  useEffect(() => {
    isMountedRef.current = true;
    startAnimation();
    return () => {
      isMountedRef.current = false;
      runIdRef.current += 1;
      if (animRef.current) {
        animRef.current.stop();
      }
    };
  }, []);

  const combinedLogoScale = Animated.multiply(logoScale, logoPulse);
  const logoRotationString = logoRotate.interpolate({
    inputRange: [-4, 0],
    outputRange: ['-4deg', '0deg'],
  });

  const logoAnimatedStyle = {
    transform: [
      { scale: combinedLogoScale },
      { rotate: logoRotationString },
    ],
  };

  return (
    <Animated.View style={[styles.masterWrapper, { opacity: screenOpacity }]}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor={colors.background}
          translucent={false}
        />

        {/* Ambient Particle Layer */}
        <FloatingDustParticles animValue={particleProgress} />

        {/* Center Dedicated Splash Area */}
        <TouchableOpacity
          activeOpacity={0.95}
          onPress={handleFinish}
          style={styles.container}
        >
          {/* Logo with Soft Glow */}
          <MinimalBowlSparkLogo
            size={108}
            glowOpacity={glowOpacity}
            glowScale={glowScale}
            logoStyle={logoAnimatedStyle}
          />

          {/* Staggered Text Container */}
          <View style={styles.textContainer}>
            <Animated.Text
              style={[
                styles.brandTitle,
                {
                  opacity: titleOpacity,
                  transform: [{ translateY: titleY }],
                },
              ]}
            >
              FoodShareAI
            </Animated.Text>

            <Animated.Text
              style={[
                styles.subtitle,
                {
                  opacity: subtitleOpacity,
                  transform: [{ translateY: subtitleY }],
                },
              ]}
            >
              AI-powered food redistribution
            </Animated.Text>
          </View>
        </TouchableOpacity>

        {/* Replay 3s Launch Sequence Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={startAnimation}
          style={styles.replayButton}
        >
          <Text style={styles.replayButtonText}>↺ Replay Splash Sequence</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  masterWrapper: {
    flex: 1,
    backgroundColor: colors.background, // #FEF7EB Cream
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  brandTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary, // #1F1F1F
    letterSpacing: -0.8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary, // #6B7280
    letterSpacing: 0.1,
    marginTop: 6,
    textAlign: 'center',
  },
  replayButton: {
    position: 'absolute',
    bottom: 24,
    alignSelf: 'center',
    backgroundColor: '#2A3B31',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  replayButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#E8DCC8',
    letterSpacing: 0.4,
  },
});
