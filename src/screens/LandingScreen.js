import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Animated,
  Easing,
  Platform,
} from 'react-native';
import {
  HeroFoodArtwork,
  OrganicCurvedDivider,
  EditorialDetectionArtwork,
  EditorialFreshnessArtwork,
  EditorialMatchingArtwork,
} from '../components/illustrations/FoodShareIllustrations';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const useNativeDriver = Platform.OS !== 'web';

const editorialFeatures = [
  {
    id: 'detection',
    Illustration: EditorialDetectionArtwork,
    title: 'AI Food Detection',
    subtitle: 'COMPUTER VISION LOGGING',
    description: 'Instant optical classification identifying meal categories, portion volumes, and nutritional metrics.',
  },
  {
    id: 'freshness',
    Illustration: EditorialFreshnessArtwork,
    title: 'Freshness Intelligence',
    subtitle: 'AUTOMATED SAFETY PREDICTION',
    description: 'Continuous predictive shelf-life estimation guaranteeing absolute food safety compliance.',
  },
  {
    id: 'matching',
    Illustration: EditorialMatchingArtwork,
    title: 'Smart NGO Matching',
    subtitle: 'REAL-TIME PROXIMITY DISPATCH',
    description: 'Algorithmic route optimization pairing surplus meals directly with local community receivers.',
  },
];

export const LandingScreen = ({ onNavigateToLogin, onNavigateToSignUp, onContinueGuest }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(25)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1.0,
        duration: 500,
        useNativeDriver,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.masterWrapper,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header Navigation */}
          <View style={styles.headerBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandName}>FoodShareAI</Text>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={onNavigateToLogin}
              style={styles.loginPill}
            >
              <Text style={styles.loginPillText}>Log In</Text>
            </TouchableOpacity>
          </View>

          {/* 1. HERO SECTION */}
          <View style={styles.heroSection}>
            <Text style={styles.heroSubLabel}>An intelligent food rescue experience</Text>

            {/* Large Magazine Editorial Headline */}
            <Text style={styles.heroMainHeadline}>
              Every meal deserves{' '}
              <Text style={styles.heroItalicSerif}>another story.</Text>
            </Text>

            <Text style={styles.heroDescription}>
              AI-powered food redistribution connecting surplus food with communities in need.
            </Text>

            {/* Hero Artwork Composition */}
            <HeroFoodArtwork />

            {/* Hero CTAs */}
            <View style={styles.heroCtaGroup}>
              <LuxuryButton
                title="Start Saving Food"
                onPress={onNavigateToSignUp}
                variant="primary"
                size="large"
                style={styles.heroPrimaryBtn}
              />
              <LuxuryButton
                title="Explore the Experience"
                onPress={onContinueGuest}
                variant="outline"
                size="medium"
                style={styles.heroSecondaryBtn}
              />
            </View>
          </View>

          {/* 2. ORGANIC CURVED DIVIDER */}
          <OrganicCurvedDivider />

          {/* 3. STORY SECTION */}
          <View style={styles.storySection}>
            <Text style={styles.sectionItalicTag}>Designed with purpose.</Text>
            <Text style={styles.storyHeadline}>Where technology meets compassion.</Text>

            <Text style={styles.storyParagraph}>
              FoodShareAI bridges the gap between surplus hospitality meals and local community hunger. Through real-time computer vision and automated proximity dispatch, every dish finds its purpose with dignity and speed.
            </Text>
          </View>

          {/* 4. PREMIUM EDITORIAL FEATURE CARDS */}
          <View style={styles.editorialSection}>
            <Text style={styles.sectionSubtitle}>CURATED INTELLIGENCE</Text>

            {editorialFeatures.map((item) => (
              <LuxuryCard key={item.id} style={styles.editorialCard} elevation="subtle">
                <item.Illustration />
                <View style={styles.cardContent}>
                  <Text style={styles.cardSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.cardTitleSerif}>{item.title}</Text>
                  <Text style={styles.cardDesc}>{item.description}</Text>
                </View>
              </LuxuryCard>
            ))}
          </View>

          {/* 5. OVERSIZED IMPACT SECTION */}
          <View style={styles.impactSection}>
            <View style={styles.impactGoldPill}>
              <Text style={styles.impactGoldPillText}>COMMUNITY IMPACT</Text>
            </View>

            <View style={styles.impactGrid}>
              <View style={styles.impactStatBox}>
                <Text style={styles.impactNumber}>125,000+</Text>
                <Text style={styles.impactLabel}>Meals rescued</Text>
              </View>

              <View style={styles.impactDivider} />

              <View style={styles.impactStatBox}>
                <Text style={styles.impactNumber}>450+</Text>
                <Text style={styles.impactLabel}>NGO partners</Text>
              </View>
            </View>
          </View>

          {/* 6. CENTERED EDITORIAL QUOTE SECTION */}
          <View style={styles.quoteSection}>
            <Text style={styles.quoteMark}>“</Text>
            <Text style={styles.quoteText}>Good food should never become waste.</Text>
            <Text style={styles.quoteAttribution}>— FoodShareAI Vision</Text>
          </View>

          {/* 7. FINAL LUXURY CTA SECTION */}
          <View style={styles.finalCtaCard}>
            <Text style={styles.finalCtaTag}>GET STARTED</Text>
            <Text style={styles.finalCtaHeadline}>Join the future of food rescue.</Text>

            <View style={styles.finalCtaButtons}>
              <LuxuryButton
                title="Create Account"
                onPress={onNavigateToSignUp}
                variant="primary"
                size="large"
                style={styles.finalPrimaryBtn}
              />
              <LuxuryButton
                title="Log In"
                onPress={onNavigateToLogin}
                variant="secondary"
                size="medium"
              />
            </View>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 60,
  },
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 8,
  },
  brandName: {
    fontFamily: 'Poppins',
    fontSize: 19,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
  },
  loginPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  loginPillText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  // Hero Section
  heroSection: {
    marginBottom: 16,
  },
  heroSubLabel: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.serif,
    color: colors.accent,
    marginBottom: 8,
  },
  heroMainHeadline: {
    fontSize: 34,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    lineHeight: 42,
    marginBottom: 12,
  },
  heroItalicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    fontWeight: '600',
    color: colors.primary,
  },
  heroDescription: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 23,
    marginBottom: 12,
  },
  heroCtaGroup: {
    marginTop: 16,
  },
  heroPrimaryBtn: {
    marginBottom: 10,
  },
  heroSecondaryBtn: {
    marginTop: 4,
  },
  // Story Section
  storySection: {
    backgroundColor: colors.surface,
    padding: 24,
    borderRadius: 30,
    marginVertical: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  sectionItalicTag: {
    fontSize: 14,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.serif,
    color: colors.gold,
    marginBottom: 6,
  },
  storyHeadline: {
    fontSize: 24,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 12,
  },
  storyParagraph: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  // Editorial Features
  editorialSection: {
    marginVertical: 16,
  },
  sectionSubtitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 1.2,
    marginBottom: 12,
    marginLeft: 4,
  },
  editorialCard: {
    padding: 16,
    borderRadius: 28,
    marginVertical: 8,
  },
  cardContent: {
    marginTop: 14,
  },
  cardSubtitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  cardTitleSerif: {
    fontSize: 22,
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  cardDesc: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
  },
  // Impact Section
  impactSection: {
    backgroundColor: '#F6EDDF',
    borderRadius: 30,
    padding: 24,
    marginVertical: 16,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  impactGoldPill: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 20,
  },
  impactGoldPillText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  impactGrid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    width: '100%',
  },
  impactStatBox: {
    alignItems: 'center',
    flex: 1,
  },
  impactNumber: {
    fontFamily: 'Poppins',
    fontSize: 30,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  impactLabel: {
    fontSize: 13,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.serif,
    color: colors.textSecondary,
  },
  impactDivider: {
    width: 1,
    height: 48,
    backgroundColor: colors.border,
  },
  // Quote Section
  quoteSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 16,
  },
  quoteMark: {
    fontSize: 48,
    fontFamily: typography.fontFamily.serif,
    color: colors.accent,
    lineHeight: 32,
  },
  quoteText: {
    fontSize: 22,
    fontStyle: 'italic',
    fontFamily: typography.fontFamily.serif,
    color: colors.textPrimary,
    textAlign: 'center',
    lineHeight: 30,
    marginBottom: 10,
  },
  quoteAttribution: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  // Final CTA
  finalCtaCard: {
    backgroundColor: colors.secondary, // #E8DCC8 Warm Beige
    borderRadius: 30,
    padding: 24,
    marginTop: 8,
    marginBottom: 24,
    alignItems: 'center',
  },
  finalCtaTag: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 1.0,
    marginBottom: 8,
  },
  finalCtaHeadline: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 33,
    marginBottom: 20,
  },
  finalCtaButtons: {
    width: '100%',
  },
  finalPrimaryBtn: {
    marginBottom: 10,
  },
});
