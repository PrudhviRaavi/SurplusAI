import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {
  Onboarding1Illustration,
  Onboarding2Illustration,
  Onboarding3Illustration,
} from '../components/illustrations/FoodShareIllustrations';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { colors } from '../theme/colors';

const useNativeDriver = Platform.OS !== 'web';

const slides = [
  {
    id: 1,
    headline: 'Rescue Good Food Before It’s Wasted',
    description: 'Connect restaurants, hotels, and communities with NGOs through intelligent food redistribution.',
    Illustration: Onboarding1Illustration,
  },
  {
    id: 2,
    headline: 'Your Food, Decoded by AI',
    description: 'Scan food, estimate freshness, calculate quantity, and match with nearby NGOs automatically.',
    Illustration: Onboarding2Illustration,
  },
  {
    id: 3,
    headline: 'Every Donation Creates Real Impact',
    description: 'Track meals served, food saved, and environmental impact through one intelligent platform.',
    Illustration: Onboarding3Illustration,
  },
];

export const OnboardingScreen = ({ onComplete, initialSlideIndex = 0 }) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(initialSlideIndex);
  const isLastSlide = currentSlideIndex === slides.length - 1;
  const slide = slides[currentSlideIndex];

  // Entry Animation Drivers (Scale 95% -> 100%, Slide Up 80 -> 0)
  const entryCardScale = useRef(new Animated.Value(0.95)).current;
  const entryIllustrationY = useRef(new Animated.Value(80)).current;
  const entryTextOpacity = useRef(new Animated.Value(0)).current;

  // Exit Animation Drivers for Smooth Transition to Landing
  const exitOpacity = useRef(new Animated.Value(1)).current;
  const exitY = useRef(new Animated.Value(0)).current;
  const exitScale = useRef(new Animated.Value(1.0)).current;

  // Slide Parallax Animation Drivers
  const headlineX = useRef(new Animated.Value(0)).current;
  const descY = useRef(new Animated.Value(0)).current;
  const descOpacity = useRef(new Animated.Value(1)).current;
  const parallaxX = useRef(new Animated.Value(0)).current;

  // Dot Width Animations (Slide 1, Slide 2, Slide 3)
  const dotWidths = useRef(slides.map((_, i) => new Animated.Value(i === initialSlideIndex ? 28 : 8))).current;

  useEffect(() => {
    // Initial Entrance Scale & Slide Up
    Animated.parallel([
      Animated.timing(entryCardScale, {
        toValue: 1.0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(entryIllustrationY, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(entryTextOpacity, {
        toValue: 1.0,
        duration: 400,
        useNativeDriver,
      }),
    ]).start();
  }, []);

  const triggerSmoothComplete = () => {
    // Smooth Apple-Style Dissolve & Lift Transition to Landing Page
    Animated.parallel([
      Animated.timing(exitOpacity, {
        toValue: 0.0,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(exitY, {
        toValue: -28,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(exitScale, {
        toValue: 0.96,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver,
      }),
    ]).start(() => {
      if (onComplete) onComplete();
    });
  };

  const animateToSlide = (newIndex) => {
    if (newIndex === currentSlideIndex) return;
    const direction = newIndex > currentSlideIndex ? 1 : -1;

    // Reset slide transition drivers
    headlineX.setValue(60 * direction);
    descY.setValue(20);
    descOpacity.setValue(0);
    parallaxX.setValue(25 * direction);

    // Update state
    setCurrentSlideIndex(newIndex);

    // Animate pagination dots with ease-in-out cubic curves
    slides.forEach((_, i) => {
      Animated.timing(dotWidths[i], {
        toValue: i === newIndex ? 28 : 8,
        duration: 350,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: false,
      }).start();
    });

    // Execute Apple Parallax & Stagger Animations
    Animated.parallel([
      Animated.timing(parallaxX, {
        toValue: 0,
        duration: 450,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.timing(headlineX, {
        toValue: 0,
        duration: 400,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
      Animated.parallel([
        Animated.timing(descY, {
          toValue: 0,
          duration: 450,
          easing: Easing.out(Easing.cubic),
          useNativeDriver,
        }),
        Animated.timing(descOpacity, {
          toValue: 1.0,
          duration: 450,
          useNativeDriver,
        }),
      ]),
    ]).start();
  };

  const handleNext = () => {
    if (isLastSlide) {
      triggerSmoothComplete();
    } else {
      animateToSlide(currentSlideIndex + 1);
    }
  };

  const handleSkip = () => {
    triggerSmoothComplete();
  };

  return (
    <Animated.View
      style={[
        styles.masterWrapper,
        {
          opacity: exitOpacity,
          transform: [{ translateY: exitY }, { scale: exitScale }],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        
        {/* Top Header Bar */}
        <View style={styles.topBar}>
          <View style={styles.stepBadge}>
            <Text style={styles.stepBadgeText}>{`0${currentSlideIndex + 1} / 03`}</Text>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={handleSkip} style={styles.skipButton}>
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        </View>

        {/* Main Content Card (Scales 95% -> 100%) */}
        <Animated.View
          style={[
            styles.contentCard,
            {
              transform: [{ scale: entryCardScale }],
            },
          ]}
        >
          {/* Parallax Illustration Canvas */}
          <Animated.View
            style={[
              styles.illustrationWrapper,
              {
                transform: [
                  { translateY: entryIllustrationY },
                  { translateX: parallaxX },
                ],
              },
            ]}
          >
            <slide.Illustration />
          </Animated.View>

          {/* Staggered Text Container */}
          <Animated.View style={[styles.textWrapper, { opacity: entryTextOpacity }]}>
            <Animated.Text
              style={[
                styles.headline,
                {
                  transform: [{ translateX: headlineX }],
                },
              ]}
            >
              {slide.headline}
            </Animated.Text>

            <Animated.Text
              style={[
                styles.description,
                {
                  opacity: descOpacity,
                  transform: [{ translateY: descY }],
                },
              ]}
            >
              {slide.description}
            </Animated.Text>
          </Animated.View>
        </Animated.View>

        {/* Footer Navigation */}
        <View style={styles.footer}>
          {/* Pagination Dots (Ease-in-Out Expansion) */}
          <View style={styles.paginationRow}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => animateToSlide(index)}
                activeOpacity={0.8}
              >
                <Animated.View
                  style={[
                    styles.dot,
                    {
                      width: dotWidths[index],
                      backgroundColor:
                        index === currentSlideIndex ? colors.primary : colors.border,
                    },
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>

          {/* Button Morphing Animation */}
          <LuxuryButton
            title={isLastSlide ? 'Get Started' : 'Next'}
            onPress={handleNext}
            variant="primary"
            size="large"
          />
        </View>
      </SafeAreaView>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  masterWrapper: {
    flex: 1,
    backgroundColor: colors.background, // #FEF7EB
  },
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  stepBadge: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  stepBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.5,
  },
  skipButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  contentCard: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
  },
  illustrationWrapper: {
    width: '100%',
    marginBottom: 32,
    alignItems: 'center',
  },
  textWrapper: {
    paddingHorizontal: 4,
  },
  headline: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 35,
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 23,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 16,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});
