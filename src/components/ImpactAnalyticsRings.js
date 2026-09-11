import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const ImpactAnalyticsRings = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const metrics = [
    { id: '1', title: 'Meals Rescued', value: '125,000+', percentage: '94%', color: colors.glowGreen, icon: 'restaurant-sharp' },
    { id: '2', title: 'Food Saved', value: '85 Tons', percentage: '88%', color: colors.secondary, icon: 'leaf-sharp' },
    { id: '3', title: 'CO₂ Prevented', value: '210 Tons', percentage: '91%', color: colors.accent, icon: 'cloud-done-sharp' },
    { id: '4', title: 'Active NGOs', value: '450+', percentage: '96%', color: '#8B5CF6', icon: 'business-sharp' },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <Text style={[styles.sectionSubtitle, { color: colors.glowGreen }]}>REAL-TIME ESG METRICS</Text>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Measurable Climate & Hunger Impact
        </Text>
      </View>

      <View style={styles.ringsGrid}>
        {metrics.map((m) => (
          <View key={m.id} style={[styles.ringCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            {/* Circular Gauge Ring Visual */}
            <View style={[styles.circleRingOuter, { borderColor: `${m.color}30` }]}>
              <View style={[styles.circleRingInner, { borderColor: m.color }]}>
                <Ionicons name={m.icon} size={22} color={m.color} />
                <Text style={[styles.ringPercentText, { color: m.color }]}>{m.percentage}</Text>
              </View>
            </View>

            <Text style={[styles.metricVal, { color: themeColors.textPrimary }]}>{m.value}</Text>
            <Text style={[styles.metricLabel, { color: themeColors.textSecondary }]}>{m.title}</Text>
          </View>
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
  sectionSubtitle: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
    textAlign: 'center',
  },
  ringsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  ringCard: {
    width: width > 500 ? '48.5%' : '48%',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    alignItems: 'center',
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
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  circleRingOuter: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 5,
    alignItems: 'center',
    justify: 'center',
    marginBottom: 12,
  },
  circleRingInner: {
    alignItems: 'center',
    justify: 'center',
  },
  ringPercentText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    marginTop: 2,
  },
  metricVal: {
    fontFamily: fontFamily.headingBold,
    fontSize: 18,
    marginBottom: 2,
  },
  metricLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 12,
  },
});
