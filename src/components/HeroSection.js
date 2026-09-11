import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const HeroSection = ({ onGetStarted, onExploreAI }) => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={styles.heroWrapper}>
      {/* Background Subtle Gradient Glow */}
      <LinearGradient
        colors={themeColors.gradientHero}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <View style={styles.contentContainer}>
        {/* Top AI Badge */}
        <View style={[styles.aiChip, { backgroundColor: isDarkMode ? 'rgba(22, 163, 74, 0.15)' : '#DCFCE7', borderColor: isDarkMode ? 'rgba(74, 222, 128, 0.3)' : '#BBF7D0' }]}>
          <Ionicons name="sparkles" size={14} color={colors.primary} />
          <Text style={[styles.aiChipText, { color: isDarkMode ? '#4ADE80' : colors.primaryDark }]}>
            Next-Gen AI Redistribution Engine v2.4
          </Text>
        </View>

        {/* Main Heading */}
        <Text style={[styles.heading, { color: themeColors.textPrimary }]}>
          Rescue Surplus Food.{'\n'}
          <Text style={styles.headingGradient}>Feed More People.</Text>
        </Text>

        {/* Subheading */}
        <Text style={[styles.subheading, { color: themeColors.textSecondary }]}>
          AI-powered food redistribution platform connecting donors, NGOs, and volunteers in real time.
        </Text>

        {/* Primary Buttons */}
        <View style={styles.ctaButtonGroup}>
          <TouchableOpacity activeOpacity={0.85} onPress={onGetStarted}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Ionicons name="arrow-forward-sharp" size={18} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onExploreAI}
            style={[styles.secondaryButton, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          >
            <Ionicons name="hardware-chip-outline" size={18} color={colors.accent} />
            <Text style={[styles.secondaryButtonText, { color: themeColors.textPrimary }]}>
              Explore AI Features
            </Text>
          </TouchableOpacity>
        </View>

        {/* Hero Interactive Illustration Mockup (AI Scanning Visual Graphic) */}
        <View style={[styles.heroCard, { backgroundColor: themeColors.glassBackground, borderColor: themeColors.glassBorder }]}>
          {/* Mock Header */}
          <View style={styles.cardHeader}>
            <View style={styles.cardStatusDot} />
            <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>Real-Time Food AI Scanner</Text>
            <View style={styles.liveTag}>
              <Text style={styles.liveTagText}>LIVE DETECT</Text>
            </View>
          </View>

          {/* Graphic Visualization Canvas */}
          <View style={styles.visualCanvas}>
            <LinearGradient
              colors={['#15803D', '#0F172A']}
              style={styles.canvasBackground}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              {/* Scan Reticle Overlay */}
              <View style={styles.scanReticle}>
                <View style={[styles.corner, styles.topLeft]} />
                <View style={[styles.corner, styles.topRight]} />
                <View style={[styles.corner, styles.bottomLeft]} />
                <View style={[styles.corner, styles.bottomRight]} />

                {/* Center Detected Food Icon & Badge */}
                <MaterialCommunityIcons name="food-apple-outline" size={48} color="#4ADE80" />
                
                <View style={styles.scanBadge}>
                  <Ionicons name="checkmark-circle-sharp" size={14} color="#4ADE80" />
                  <Text style={styles.scanBadgeText}>Fresh Meals • 98.4% Quality Score</Text>
                </View>
              </View>

              {/* Floating Real-time Telemetry Widgets */}
              <View style={styles.telemetryOverlay}>
                <View style={styles.widgetCard}>
                  <Ionicons name="scale-outline" size={14} color="#60A5FA" />
                  <Text style={styles.widgetText}>Est. Weight: <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodySemiBold }}>45 Kg (150 Meals)</Text></Text>
                </View>

                <View style={styles.widgetCard}>
                  <Ionicons name="navigate-outline" size={14} color="#F59E0B" />
                  <Text style={styles.widgetText}>Matching: <Text style={{ color: '#FFFFFF', fontFamily: fontFamily.bodySemiBold }}>Hope Shelter NGO (2.1 km)</Text></Text>
                </View>
              </View>
            </LinearGradient>
          </View>

          {/* Quick Metrics Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerItem}>
              <Text style={[styles.footerValue, { color: colors.primary }]}>&lt; 3 mins</Text>
              <Text style={[styles.footerLabel, { color: themeColors.textSecondary }]}>Match Speed</Text>
            </View>
            <View style={[styles.footerDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.footerItem}>
              <Text style={[styles.footerValue, { color: colors.accent }]}>Zero Waste</Text>
              <Text style={[styles.footerLabel, { color: themeColors.textSecondary }]}>Optimization Goal</Text>
            </View>
            <View style={[styles.footerDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.footerItem}>
              <Text style={[styles.footerValue, { color: colors.secondary }]}>Verified</Text>
              <Text style={[styles.footerLabel, { color: themeColors.textSecondary }]}>NGO Protocol</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroWrapper: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  contentContainer: {
    maxWidth: 960,
    width: '100%',
    alignItems: 'center',
  },
  aiChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  aiChipText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
  },
  heading: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' && width > 768 ? 44 : 32,
    lineHeight: Platform.OS === 'web' && width > 768 ? 54 : 40,
    textAlign: 'center',
    marginBottom: 16,
    letterSpacing: -0.8,
  },
  headingGradient: {
    color: colors.primary,
  },
  subheading: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: Platform.OS === 'web' && width > 768 ? 18 : 15,
    lineHeight: Platform.OS === 'web' && width > 768 ? 28 : 22,
    textAlign: 'center',
    maxWidth: 680,
    marginBottom: 28,
  },
  ctaButtonGroup: {
    flexDirection: width > 480 ? 'row' : 'column',
    gap: 12,
    width: '100%',
    maxWidth: 420,
    justifyContent: 'center',
    marginBottom: 36,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 14,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  primaryButtonText: {
    fontFamily: fontFamily.button,
    fontSize: 16,
    color: colors.white,
  },
  secondaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  secondaryButtonText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
  },
  heroCard: {
    width: '100%',
    borderRadius: 20,
    borderWidth: 1,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardStatusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginRight: 6,
  },
  cardTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 15,
    flex: 1,
  },
  liveTag: {
    backgroundColor: 'rgba(37, 99, 235, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  liveTagText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.accent,
    fontWeight: '700',
  },
  visualCanvas: {
    height: 220,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: 14,
  },
  canvasBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  scanReticle: {
    width: 140,
    height: 140,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.3)',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
  },
  corner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#4ADE80',
  },
  topLeft: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  topRight: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  bottomLeft: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  bottomRight: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  scanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    position: 'absolute',
    bottom: -12,
    borderWidth: 1,
    borderColor: 'rgba(74, 222, 128, 0.4)',
  },
  scanBadgeText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 10,
    color: '#F8FAFC',
  },
  telemetryOverlay: {
    position: 'absolute',
    bottom: 10,
    left: 10,
    right: 10,
    flexDirection: width > 500 ? 'row' : 'column',
    justifyContent: 'space-between',
    gap: 6,
  },
  widgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(15, 23, 42, 0.75)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  widgetText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#94A3B8',
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: 4,
  },
  footerItem: {
    alignItems: 'center',
  },
  footerValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: 15,
  },
  footerLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    marginTop: 2,
  },
  footerDivider: {
    width: 1,
    height: 24,
  },
});
