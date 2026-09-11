import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

export const AICommandCard = ({ onOpenScanner }) => {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      current += 3.2;
      if (current >= 98.7) {
        setAnimatedConfidence(98.7);
        clearInterval(interval);
      } else {
        setAnimatedConfidence(Number(current.toFixed(1)));
      }
    }, 40);

    return () => clearInterval(interval);
  }, []);

  return (
    <TouchableOpacity
      activeOpacity={0.92}
      onPress={onOpenScanner}
      style={styles.cardContainer}
    >
      <LinearGradient
        colors={['rgba(124, 58, 237, 0.15)', 'rgba(59, 130, 246, 0.08)', 'rgba(15, 23, 42, 0.9)']}
        style={styles.cardGradientBg}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Top Floating Badge Bar */}
        <View style={styles.cardHeader}>
          <View style={styles.liveScanBadge}>
            <View style={styles.pulseDot} />
            <Text style={styles.liveScanText}>LIVE AI CAMERA VISION</Text>
          </View>

          <View style={styles.confidencePill}>
            <Ionicons name="sparkles" size={12} color={colors.primaryPurple} />
            <Text style={styles.confidenceScoreText}>{animatedConfidence}% AI CONFIDENCE</Text>
          </View>
        </View>

        {/* Viewport Canvas Overlay */}
        <View style={styles.viewport}>
          <LinearGradient
            colors={['#0B1220', '#050816']}
            style={styles.viewportInner}
          >
            {/* Viewfinder Target Reticle */}
            <View style={styles.reticleBox}>
              <View style={[styles.corner, styles.tl]} />
              <View style={[styles.corner, styles.tr]} />
              <View style={[styles.corner, styles.bl]} />
              <View style={[styles.corner, styles.br]} />

              <MaterialCommunityIcons name="food-turkey" size={42} color={colors.cyanAccent} />

              <View style={styles.detectionLabel}>
                <Ionicons name="checkmark-circle-sharp" size={12} color={colors.emeraldAccent} />
                <Text style={styles.detectionText}>Food Detected: <Text style={styles.boldText}>Biryani & Meals</Text></Text>
              </View>
            </View>

            {/* Circular Progress Indicator for Freshness */}
            <View style={styles.freshnessBadge}>
              <View style={styles.ringMini}>
                <Text style={styles.freshnessVal}>96.4%</Text>
              </View>
              <Text style={styles.freshnessLabel}>Freshness Index</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Command Telemetry Grid */}
        <View style={styles.telemetryRow}>
          <View style={styles.telemetryItem}>
            <Ionicons name="cube-outline" size={16} color={colors.primaryBlue} />
            <View>
              <Text style={styles.itemLabel}>Quantity Est.</Text>
              <Text style={styles.itemVal}>45 kg (150 meals)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.telemetryItem}>
            <Ionicons name="navigate-outline" size={16} color={colors.cyanAccent} />
            <View>
              <Text style={styles.itemLabel}>Nearest NGO</Text>
              <Text style={styles.itemVal}>Hope Shelter (1.2 km)</Text>
            </View>
          </View>
        </View>

        {/* Action Footer Bar */}
        <View style={styles.actionBar}>
          <Text style={styles.actionText}>Launch AI Vision Scanner</Text>
          <Ionicons name="arrow-forward-sharp" size={16} color={colors.white} />
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    width: '100%',
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    overflow: 'hidden',
    marginVertical: 16,
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryPurple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.25,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0px 10px 30px rgba(124, 58, 237, 0.2)',
      },
    }),
  },
  cardGradientBg: {
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 12,
  },
  liveScanBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(6, 182, 212, 0.3)',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyanAccent,
  },
  liveScanText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.cyanAccent,
  },
  confidencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  confidenceScoreText: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 10,
    color: colors.primaryPurple,
  },
  viewport: {
    height: 190,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.glassBorder,
    marginBottom: 14,
  },
  viewportInner: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
    padding: 16,
  },
  reticleBox: {
    width: 140,
    height: 110,
    borderWidth: 1.5,
    borderColor: colors.primaryPurple,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
    backgroundColor: 'rgba(5, 8, 22, 0.6)',
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderColor: colors.primaryPurple,
  },
  tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  detectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 8, 22, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    position: 'absolute',
    bottom: -12,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },
  detectionText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.textSecondary,
  },
  boldText: {
    color: colors.white,
    fontFamily: fontFamily.bodyBold,
  },
  freshnessBadge: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  ringMini: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  freshnessVal: {
    fontFamily: fontFamily.bodyBold,
    fontSize: 10,
    color: colors.emeraldAccent,
  },
  freshnessLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.textPrimary,
  },
  telemetryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 14,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  itemLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemVal: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    color: colors.textPrimary,
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.glassBorder,
    marginHorizontal: 8,
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 6,
    backgroundColor: colors.primaryPurple,
    paddingVertical: 10,
    borderRadius: 12,
  },
  actionText: {
    fontFamily: fontFamily.button,
    fontSize: 13,
    color: colors.white,
  },
});
