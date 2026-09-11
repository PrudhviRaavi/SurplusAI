import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const { width } = Dimensions.get('window');

export const AnalyticsBentoGrid = () => {
  const cards = [
    { id: '1', title: 'Meals Rescued', value: '125,000+', trend: '+18.4%', icon: 'restaurant-sharp', gradient: colors.gradientPurpleBlue },
    { id: '2', title: 'Food Saved', value: '85 Tons', trend: 'Zero Waste', icon: 'leaf-sharp', gradient: colors.gradientCyanBlue },
    { id: '3', title: 'CO₂ Prevented', value: '210 Tons', trend: '-340t ESG', icon: 'cloud-done-sharp', gradient: colors.gradientSuccess },
    { id: '4', title: 'Active NGOs', value: '450+', trend: 'Verified', icon: 'business-sharp', gradient: colors.gradientPurpleBlue },
    { id: '5', title: 'Volunteers Online', value: '1,240 Drivers', trend: 'Avg. ETA 6m', icon: 'car-sport-sharp', gradient: colors.gradientCyanBlue },
    { id: '6', title: 'AI Accuracy', value: '99.2%', trend: 'Neural v2.4', icon: 'hardware-chip-sharp', gradient: colors.gradientPurpleBlue },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.headerArea}>
        <View style={styles.badgePill}>
          <Ionicons name="stats-chart-sharp" size={12} color={colors.cyanAccent} />
          <Text style={styles.badgeText}>REAL-TIME PLATFORM ANALYTICS</Text>
        </View>
        <Text style={styles.sectionTitle}>Command Analytics</Text>
      </View>

      <View style={styles.bentoContainer}>
        {cards.map((c) => (
          <View key={c.id} style={styles.glassCard}>
            <View style={styles.cardTop}>
              <View style={styles.iconBadge}>
                <LinearGradient colors={c.gradient} style={StyleSheet.absoluteFillObject} />
                <Ionicons name={c.icon} size={18} color={colors.white} />
              </View>
              <View style={styles.trendPill}>
                <Text style={styles.trendText}>{c.trend}</Text>
              </View>
            </View>

            <Text style={styles.cardVal}>{c.value}</Text>
            <Text style={styles.cardTitle}>{c.title}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingHorizontal: 20,
    marginVertical: 20,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 16,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.cyanAccent,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  bentoContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  glassCard: {
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
        shadowOpacity: 0.08,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.1)',
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 12,
  },
  iconBadge: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
    overflow: 'hidden',
  },
  trendPill: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trendText: {
    fontFamily: fontFamily.caption,
    fontSize: 9,
    color: colors.cyanAccent,
  },
  cardVal: {
    fontFamily: fontFamily.headingBold,
    fontSize: 18,
    color: colors.textPrimary,
    marginBottom: 2,
  },
  cardTitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: colors.textSecondary,
  },
});
