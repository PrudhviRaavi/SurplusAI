import React from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import Svg, {
  Path,
  Circle,
  Rect,
  G,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';
import { colors } from '../../theme/colors';

const AnimatedG = Animated.createAnimatedComponent(G);

// Ambient Floating Particles for Splash Screen
export const FloatingDustParticles = ({ animValue }) => {
  const p1Y = animValue ? animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -25] }) : 0;
  const p2Y = animValue ? animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -40] }) : 0;
  const p3Y = animValue ? animValue.interpolate({ inputRange: [0, 1], outputRange: [0, -18] }) : 0;

  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 320 500" fill="none">
        <AnimatedG style={{ transform: [{ translateY: p1Y }] }}>
          <Circle cx="60" cy="180" r="4" fill="#D98F5C" opacity={0.35} />
          <Circle cx="260" cy="240" r="6" fill="#A8B5A2" opacity={0.3} />
        </AnimatedG>

        <AnimatedG style={{ transform: [{ translateY: p2Y }] }}>
          <Circle cx="240" cy="140" r="5" fill="#E8DCC8" opacity={0.5} />
          <Circle cx="80" cy="320" r="7" fill="#4B6355" opacity={0.15} />
        </AnimatedG>

        <AnimatedG style={{ transform: [{ translateY: p3Y }] }}>
          <Circle cx="160" cy="80" r="3" fill="#D98F5C" opacity={0.4} />
          <Circle cx="290" cy="380" r="5" fill="#E8DCC8" opacity={0.4} />
        </AnimatedG>
      </Svg>
    </View>
  );
};

// Organic Curved Section Transition Divider
export const OrganicCurvedDivider = () => (
  <View style={styles.curveWrapper}>
    <Svg width="100%" height={48} viewBox="0 0 360 48" fill="none">
      <Path
        d="M0 48 C120 0, 240 0, 360 48 V48 H0 Z"
        fill="#FFFFFF"
      />
    </Svg>
  </View>
);

// 1. Geometric Bowl + Spark Monogram Logo (Minimal Premium Apple/Notion/Airbnb Aesthetic)
export const MinimalBowlSparkLogo = ({
  size = 96,
  glowOpacity = 0.5,
  glowScale = 1.0,
  logoStyle,
}) => {
  return (
    <View style={[styles.splashContainer, { width: size + 24, height: size + 24 }]}>
      {/* Animated Logo Body */}
      <Animated.View style={[logoStyle]}>
        <Svg width={size} height={size} viewBox="0 0 100 100" fill="none">
          <Defs>
            <SvgGradient id="bowlGrad" x1="0" y1="0" x2="100" y2="100">
              <Stop offset="0%" stopColor="#4B6355" />
              <Stop offset="100%" stopColor="#35493E" />
            </SvgGradient>
            <SvgGradient id="sparkGrad" x1="0" y1="0" x2="40" y2="40">
              <Stop offset="0%" stopColor="#D98F5C" />
              <Stop offset="100%" stopColor="#E8DCC8" />
            </SvgGradient>
          </Defs>

          {/* Soft Rounded Card Container */}
          <Rect x="4" y="4" width="92" height="92" rx="28" fill="url(#bowlGrad)" />
          <Rect x="4" y="4" width="92" height="92" rx="28" stroke="#FFFFFF" strokeWidth="1.5" strokeOpacity="0.2" />

          {/* Geometric Bowl + Spark Combined Monogram Mark */}
          <G transform="translate(20, 20)">
            <Path
              d="M10 26 C10 46, 50 46, 50 26 H10 Z"
              fill="#FEF7EB"
              opacity={0.95}
            />
            <Path
              d="M8 24 H52"
              stroke="#E8DCC8"
              strokeWidth="3.5"
              strokeLinecap="round"
            />
            <Path
              d="M30 4 L33.5 15 L44.5 18.5 L33.5 22 L30 33 L26.5 22 L15.5 18.5 L26.5 15 Z"
              fill="url(#sparkGrad)"
            />
            <Circle cx="44" cy="10" r="3" fill="#FEF7EB" />
          </G>
        </Svg>
      </Animated.View>
    </View>
  );
};

// Legacy compatibility export
export const SplashLogoWithGlow = MinimalBowlSparkLogo;

// Editorial Feature Artworks
export const EditorialDetectionArtwork = () => (
  <Svg width="100%" height={160} viewBox="0 0 300 160" fill="none">
    <Rect width="300" height="160" rx="20" fill="#F6EDDF" />
    <Circle cx="150" cy="80" r="55" fill="#FFFFFF" />
    <Circle cx="150" cy="80" r="44" fill="#4B6355" />
    <Circle cx="138" cy="72" r="16" fill="#D98F5C" />
    <Circle cx="162" cy="72" r="14" fill="#C9A96E" />
    <Circle cx="150" cy="94" r="15" fill="#FEF7EB" />
    <Rect x="20" y="20" width="84" height="26" rx="13" fill="#FFFFFF" />
    <Circle cx="33" cy="33" r="5" fill="#4B6355" />
  </Svg>
);

export const EditorialFreshnessArtwork = () => (
  <Svg width="100%" height={160} viewBox="0 0 300 160" fill="none">
    <Rect width="300" height="160" rx="20" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="1" />
    <G transform="translate(90, 20)">
      <Circle cx="60" cy="60" r="50" fill="#E8DCC8" fillOpacity={0.6} />
      <Circle cx="60" cy="60" r="40" fill="#4B6355" />
      <Path d="M60 25 V60 H90" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" />
    </G>
    <G transform="translate(160, 20)">
      <Rect width="110" height="34" rx="17" fill="#4B6355" />
      <Circle cx="17" cy="17" r="7" fill="#FFFFFF" />
    </G>
  </Svg>
);

export const EditorialMatchingArtwork = () => (
  <Svg width="100%" height={160} viewBox="0 0 300 160" fill="none">
    <Rect width="300" height="160" rx="20" fill="#FEF7EB" />
    <Path d="M40 120 C100 80 200 140 260 40" stroke="#E8DCC8" strokeWidth="16" strokeLinecap="round" fill="none" />
    <Path d="M40 120 C100 80 200 140 260 40" stroke="#4B6355" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" fill="none" />
    <Circle cx="60" cy="105" r="12" fill="#4B6355" />
    <Circle cx="240" cy="55" r="14" fill="#D98F5C" />
  </Svg>
);

// 2. Onboarding Slide 1 Illustration
export const Onboarding1Illustration = () => (
  <Svg width="100%" height={260} viewBox="0 0 320 260" fill="none">
    <Defs>
      <SvgGradient id="bgGrad1" x1="0" y1="0" x2="320" y2="260">
        <Stop offset="0%" stopColor="#FFFFFF" />
        <Stop offset="100%" stopColor="#F6EDDF" />
      </SvgGradient>
    </Defs>
    
    <Rect width="320" height="260" rx="30" fill="url(#bgGrad1)" stroke="#ECE0CF" strokeWidth="1.5" />

    <G transform="translate(60, 40)">
      <Circle cx="100" cy="90" r="80" fill="#E8DCC8" />
      <Circle cx="100" cy="90" r="68" fill="#4B6355" />
      <Circle cx="80" cy="80" r="26" fill="#D98F5C" />
      <Circle cx="120" cy="80" r="22" fill="#A8B5A2" />
      <Circle cx="100" cy="112" r="24" fill="#FEF7EB" />
      <Circle cx="100" cy="90" r="68" stroke="#FEF7EB" strokeWidth="2.5" strokeDasharray="120 18" strokeOpacity={0.7} />
    </G>

    <G transform="translate(20, 20)">
      <Rect width="125" height="34" rx="17" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="1" />
      <Circle cx="17" cy="17" r="8" fill="#4B6355" />
      <Path d="M13 17 L16 20 L21 14" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
    </G>
  </Svg>
);

// 3. Onboarding Slide 2 Illustration
export const Onboarding2Illustration = () => (
  <Svg width="100%" height={260} viewBox="0 0 320 260" fill="none">
    <Defs>
      <SvgGradient id="scanGrad" x1="0" y1="0" x2="0" y2="260">
        <Stop offset="0%" stopColor="rgba(75, 99, 85, 0.12)" />
        <Stop offset="50%" stopColor="rgba(217, 143, 92, 0.15)" />
        <Stop offset="100%" stopColor="rgba(75, 99, 85, 0.02)" />
      </SvgGradient>
    </Defs>

    <Rect width="320" height="260" rx="30" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="1.5" />

    <Path d="M40 0 V260 M120 0 V260 M200 0 V260 M280 0 V260" stroke="#F6EDDF" strokeWidth="1" strokeDasharray="4 4" />
    <Path d="M0 60 H320 M0 130 H320 M0 200 H320" stroke="#F6EDDF" strokeWidth="1" strokeDasharray="4 4" />

    <G transform="translate(110, 80)">
      <Circle cx="50" cy="50" r="44" fill="#E8DCC8" />
      <Circle cx="50" cy="50" r="36" fill="#4B6355" opacity={0.9} />
      <Circle cx="44" cy="46" r="16" fill="#D98F5C" />
    </G>

    <G transform="translate(85, 55)">
      <Rect x="0" y="0" width="150" height="150" rx="24" stroke="#4B6355" strokeWidth="2" strokeDasharray="8 6" fill="url(#scanGrad)" />
      <Path d="M0 24 V0 H24 M126 0 H150 V24 M150 126 V150 H126 M24 150 H0 V126" stroke="#4B6355" strokeWidth="3.5" strokeLinecap="round" />
      <Path d="M10 75 H140" stroke="#D98F5C" strokeWidth="3" strokeLinecap="round" />
    </G>

    <G transform="translate(170, 35)">
      <Rect width="128" height="38" rx="19" fill="#4B6355" />
      <Circle cx="20" cy="19" r="10" fill="#FFFFFF" />
      <Path d="M16 19 L19 22 L25 16" stroke="#4B6355" strokeWidth="2" strokeLinecap="round" />
    </G>

    <G transform="translate(30, 190)">
      <Rect width="130" height="34" rx="17" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="1.5" />
      <Circle cx="17" cy="17" r="8" fill="#D98F5C" />
    </G>
  </Svg>
);

// 4. Onboarding Slide 3 Illustration
export const Onboarding3Illustration = () => (
  <Svg width="100%" height={260} viewBox="0 0 320 260" fill="none">
    <Defs>
      <SvgGradient id="mapBg" x1="0" y1="0" x2="320" y2="260">
        <Stop offset="0%" stopColor="#FFFFFF" />
        <Stop offset="100%" stopColor="#FEF7EB" />
      </SvgGradient>
    </Defs>

    <Rect width="320" height="260" rx="30" fill="url(#mapBg)" stroke="#ECE0CF" strokeWidth="1.5" />

    <Path d="M30 200 C80 160 140 220 200 150 C240 105 280 120 300 80" stroke="#E8DCC8" strokeWidth="20" strokeLinecap="round" fill="none" />
    <Path d="M30 200 C80 160 140 220 200 150 C240 105 280 120 300 80" stroke="#FFFFFF" strokeWidth="12" strokeLinecap="round" fill="none" />
    <Path d="M30 200 C80 160 140 220 200 150 C240 105 280 120 300 80" stroke="#4B6355" strokeWidth="3" strokeDasharray="8 6" strokeLinecap="round" fill="none" />

    <G transform="translate(45, 155)">
      <Circle cx="18" cy="18" r="22" fill="#4B6355" fillOpacity={0.15} />
      <Circle cx="18" cy="18" r="14" fill="#4B6355" />
      <Circle cx="18" cy="18" r="5" fill="#FFFFFF" />
    </G>

    <G transform="translate(245, 60)">
      <Circle cx="18" cy="18" r="24" fill="#D98F5C" fillOpacity={0.2} />
      <Circle cx="18" cy="18" r="14" fill="#D98F5C" />
      <Path d="M18 13 C16 10 12 13 18 18 C24 13 20 10 18 13 Z" fill="#FFFFFF" />
    </G>

    <G transform="translate(135, 135)">
      <Rect x="0" y="0" width="56" height="32" rx="14" fill="#1F1F1F" />
      <Circle cx="14" cy="32" r="6" fill="#4B6355" />
      <Circle cx="42" cy="32" r="6" fill="#4B6355" />
      <Circle cx="14" cy="32" r="2.5" fill="#FFFFFF" />
      <Circle cx="42" cy="32" r="2.5" fill="#FFFFFF" />
    </G>
  </Svg>
);

// 5. Hero Editorial Artwork Composition
export const HeroFoodArtwork = () => (
  <View style={styles.heroArtworkWrapper}>
    <Svg width="100%" height={260} viewBox="0 0 340 260" fill="none">
      <Defs>
        <SvgGradient id="heroBg" x1="0" y1="0" x2="340" y2="260">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="100%" stopColor="#F6EDDF" />
        </SvgGradient>
      </Defs>

      <Rect width="340" height="260" rx="32" fill="url(#heroBg)" stroke="#ECE0CF" strokeWidth="1.5" />

      <Circle cx="170" cy="130" r="105" fill="#4B6355" fillOpacity={0.06} />
      <Circle cx="170" cy="130" r="80" fill="#E8DCC8" fillOpacity={0.5} />

      <G transform="translate(95, 55)">
        <Circle cx="75" cy="75" r="68" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="2" />
        <Circle cx="75" cy="75" r="56" fill="#4B6355" />
        <Circle cx="60" cy="65" r="24" fill="#D98F5C" />
        <Circle cx="90" cy="65" r="20" fill="#C9A96E" />
        <Circle cx="75" cy="94" r="22" fill="#FEF7EB" />
      </G>

      <G transform="translate(20, 24)">
        <Rect width="135" height="36" rx="18" fill="#FFFFFF" stroke="#ECE0CF" strokeWidth="1" />
        <Circle cx="18" cy="18" r="8" fill="#4B6355" />
      </G>

      <G transform="translate(190, 190)">
        <Rect width="130" height="36" rx="18" fill="#4B6355" />
        <Circle cx="18" cy="18" r="8" fill="#D98F5C" />
      </G>
    </Svg>
  </View>
);

// 6. Role Selection Icons
export const RoleDonorIllustration = () => (
  <Svg width={54} height={54} viewBox="0 0 54 54" fill="none">
    <Rect width="54" height="54" rx="18" fill="#4B6355" fillOpacity="0.1" />
    <Path d="M17 22H37M17 22V36C17 38 18 40 21 40H33C36 40 37 38 37 36V22M17 22L20 14H34L37 22" stroke="#4B6355" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
    <Circle cx="27" cy="30" r="3" fill="#D98F5C" />
  </Svg>
);

export const RoleReceiverIllustration = () => (
  <Svg width={54} height={54} viewBox="0 0 54 54" fill="none">
    <Rect width="54" height="54" rx="18" fill="#D98F5C" fillOpacity="0.12" />
    <Path d="M27 16 C22 10 14 16 27 28 C40 16 32 10 27 16 Z" fill="#D98F5C" />
    <Path d="M16 34 H38 C40 34 41 36 40 38 L38 42 H16 L14 38 C13 36 14 34 16 34 Z" fill="#4B6355" />
  </Svg>
);

export const RoleVolunteerIllustration = () => (
  <Svg width={54} height={54} viewBox="0 0 54 54" fill="none">
    <Rect width="54" height="54" rx="18" fill="#A8B5A2" fillOpacity="0.25" />
    <Circle cx="27" cy="20" r="7" stroke="#1F1F1F" strokeWidth="2.5" />
    <Path d="M15 38 C15 31 20 29 27 29 C34 29 39 31 39 38" stroke="#1F1F1F" strokeWidth="2.5" strokeLinecap="round" />
  </Svg>
);

const styles = StyleSheet.create({
  curveWrapper: {
    width: '100%',
    marginVertical: -1,
  },
  splashContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    backgroundColor: '#4B6355',
  },
  heroArtworkWrapper: {
    width: '100%',
    marginVertical: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 3,
  },
});
