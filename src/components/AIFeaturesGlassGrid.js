import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const { width } = Dimensions.get('window');

export const AIFeaturesGlassGrid = () => {
  const features = [
    { id: '1', title: 'Food Detection', desc: 'Deep learning vision identifies meal types in < 1 second.', icon: 'scan-sharp', gradient: colors.gradientPurpleBlue },
    { id: '2', title: 'Freshness Analysis', desc: 'Neural decay scoring & remaining safe consumption window.', icon: 'time-sharp', gradient: colors.gradientCyanBlue },
    { id: '3', title: '3D Quantity Estimation', desc: 'Spatial volumetric estimation computes weight & serving count.', icon: 'cube-sharp', gradient: colors.gradientPurpleBlue },
    { id: '4', title: 'Smart NGO Matching', desc: 'Capacity & proximity graph matching for instant dispatch.', icon: 'git-network-sharp', gradient: colors.gradientCyanBlue },
    { id: '5', title: 'Demand Forecasting', desc: 'Predictive models forecast urban surplus spikes by weather & event.', icon: 'trending-up-sharp', gradient: colors.gradientPurpleBlue },
    { id: '6', title: 'Heatmap Analytics', desc: 'High-density urban waste mapping with real-time zone alerts.', icon: 'flame-sharp', gradient: colors.gradientCyanBlue },
    { id: '7', title: 'Route Optimization', desc: 'Multi-point volunteer dispatch with zero carbon overhead.', icon: 'navigate-sharp', gradient: colors.gradientSuccess },
    { id: '8', title: 'Fraud Detection', desc: 'Automated verification of non-profit recipient badges.', icon: 'shield-checkmark-sharp', gradient: colors.gradientPurpleBlue },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <View style={styles.badgePill}>
          <Ionicons name="hardware-chip-sharp" size={12} color={colors.primaryPurple} />
          <Text style={styles.badgeText}>AI ARCHITECTURE ENGINE</Text>
        </View>
        <Text style={styles.sectionTitle}>Intelligent Capabilities</Text>
      </View>

      <View style={styles.grid}>
        {features.map((f) => (
          <TouchableOpacity key={f.id} activeOpacity={0.88} style={styles.featureCard}>
            <View style={styles.cardHeader}>
              <View style={styles.iconBox}>
                <LinearGradient colors={f.gradient} style={StyleSheet.absoluteFillObject} />
                <Ionicons name={f.icon} size={18} color={colors.white} />
              </View>
            </View>

            <Text style={styles.cardTitle}>{f.title}</Text>
            <Text style={styles.cardDesc}>{f.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    marginVertical: 24,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.primaryPurple,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  featureCard: {
    width: width > 500 ? '48.5%' : '48%',
    borderRadius: 18,
    padding: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  cardHeader: {
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justify: 'center',
    overflow: 'hidden',
  },
  cardTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 14,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  cardDesc: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 15,
  },
});
