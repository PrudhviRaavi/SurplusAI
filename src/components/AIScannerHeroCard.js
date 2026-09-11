import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const AIScannerHeroCard = ({ onOpenScanner }) => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onOpenScanner}
      style={[styles.floatingCardContainer, { backgroundColor: themeColors.glassBackground, borderColor: themeColors.glassBorder }]}
    >
      {/* Top Header Tag */}
      <View style={styles.cardHeader}>
        <View style={styles.liveTag}>
          <View style={styles.pulsingGreenDot} />
          <Text style={styles.liveTagText}>AI VISION ACTIVE SCAN</Text>
        </View>

        <View style={styles.confidencePill}>
          <Ionicons name="sparkles-sharp" size={12} color={colors.glowGreen} />
          <Text style={styles.confidenceText}>98.7% Confidence</Text>
        </View>
      </View>

      {/* Simulated Live Viewport with Detection Box */}
      <View style={styles.viewport}>
        <LinearGradient
          colors={['#064E3B', '#0B1220', '#0F172A']}
          style={styles.viewportBg}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          {/* Animated Detection Box Overlay */}
          <View style={styles.detectionBoundingBox}>
            <View style={[styles.corner, styles.tl]} />
            <View style={[styles.corner, styles.tr]} />
            <View style={[styles.corner, styles.bl]} />
            <View style={[styles.corner, styles.br]} />

            {/* Item Graphic Icon */}
            <MaterialCommunityIcons name="bowl-mix-outline" size={44} color={colors.glowGreen} />

            {/* Food Detection Label */}
            <View style={styles.detectionLabel}>
              <Text style={styles.detectedFoodTitle}>Food Identified: <Text style={styles.boldWhite}>Biryani</Text></Text>
            </View>
          </View>

          {/* Floating Freshness Meter */}
          <View style={styles.freshnessGaugeBadge}>
            <Ionicons name="checkmark-circle-sharp" size={14} color={colors.glowGreen} />
            <Text style={styles.freshnessText}>Freshness: <Text style={{ color: colors.glowGreen, fontFamily: fontFamily.bodyBold }}>96.4%</Text></Text>
          </View>
        </LinearGradient>
      </View>

      {/* Hero Card Metrics Summary */}
      <View style={styles.cardDetailsRow}>
        <View style={styles.metricItem}>
          <Ionicons name="scale-sharp" size={16} color={colors.accentLight} />
          <View>
            <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>Est. Quantity</Text>
            <Text style={[styles.metricValue, { color: themeColors.textPrimary }]}>45 kg (150 meals)</Text>
          </View>
        </View>

        <View style={[styles.divider, { backgroundColor: themeColors.border }]} />

        <View style={styles.metricItem}>
          <Ionicons name="navigate-sharp" size={16} color={colors.glowGreen} />
          <View>
            <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>Recommended NGO</Text>
            <Text style={[styles.metricValue, { color: themeColors.textPrimary }]}>Hope Shelter (1.2 km)</Text>
          </View>
        </View>
      </View>

      {/* Tap Action Bar */}
      <View style={[styles.bottomActionBar, { backgroundColor: isDarkMode ? 'rgba(34, 197, 94, 0.12)' : '#DCFCE7' }]}>
        <Text style={[styles.actionText, { color: isDarkMode ? colors.glowGreen : colors.primaryDark }]}>
          Tap to Launch Full Screen AI Camera
        </Text>
        <Ionicons name="scan-circle-sharp" size={18} color={isDarkMode ? colors.glowGreen : colors.primaryDark} />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  floatingCardContainer: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    padding: 16,
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.glowGreen,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 6,
      },
      web: {
        boxShadow: '0px 10px 30px rgba(34, 197, 94, 0.12)',
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  pulsingGreenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.glowGreen,
  },
  liveTagText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.glowGreen,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(37, 99, 235, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    color: colors.accentLight,
  },
  viewport: {
    height: 200,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 14,
  },
  viewportBg: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
    padding: 16,
    position: 'relative',
  },
  detectionBoundingBox: {
    width: 150,
    height: 120,
    borderWidth: 1.5,
    borderColor: colors.glowGreen,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
    backgroundColor: 'rgba(5, 8, 22, 0.4)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.glowGreen,
  },
  tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  detectionLabel: {
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    position: 'absolute',
    top: -12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  detectedFoodTitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.textSecondary,
  },
  boldWhite: {
    color: colors.white,
    fontFamily: fontFamily.bodyBold,
  },
  freshnessGaugeBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  freshnessText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: colors.textPrimary,
  },
  cardDetailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  metricLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
  },
  metricValue: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
  },
  divider: {
    width: 1,
    height: 28,
    marginHorizontal: 8,
  },
  bottomActionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
  },
});
