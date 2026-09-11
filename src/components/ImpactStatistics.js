import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { StatCard } from './StatCard';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const ImpactStatistics = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const stats = [
    {
      id: '1',
      iconName: 'restaurant-sharp',
      iconColor: colors.primary,
      value: '125,000+',
      label: 'Meals Rescued',
      growth: '+18% this month',
    },
    {
      id: '2',
      iconName: 'business-sharp',
      iconColor: colors.accent,
      value: '450+',
      label: 'Active NGOs',
      growth: 'Verified',
    },
    {
      id: '3',
      iconName: 'people-sharp',
      iconColor: colors.secondary,
      value: '12,500+',
      label: 'Volunteers',
      growth: '+2.4k new',
    },
    {
      id: '4',
      iconName: 'leaf-sharp',
      iconColor: '#F59E0B',
      value: '85 Tons',
      label: 'Food Saved',
      growth: 'Zero Waste Goal',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <Text style={[styles.sectionSubtitle, { color: colors.primary }]}>OUR REAL-TIME METRICS</Text>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Making a Measurable Difference
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {stats.map((stat) => (
          <StatCard
            key={stat.id}
            iconName={stat.iconName}
            iconColor={stat.iconColor}
            value={stat.value}
            label={stat.label}
            growth={stat.growth}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 36,
    paddingHorizontal: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.caption,
    fontSize: 12,
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' && width > 768 ? 28 : 22,
    textAlign: 'center',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    justifyContent: 'space-between',
  },
});
