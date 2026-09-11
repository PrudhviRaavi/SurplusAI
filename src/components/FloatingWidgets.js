import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const FloatingWidgets = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const widgets = [
    {
      id: '1',
      icon: 'restaurant-sharp',
      color: colors.glowGreen,
      title: 'Active Donations',
      value: '24 Live',
      badge: 'Real-time',
    },
    {
      id: '2',
      icon: 'business-sharp',
      color: colors.accent,
      title: 'Nearby NGOs',
      value: '18 Verified',
      badge: '< 5 km radius',
    },
    {
      id: '3',
      icon: 'car-sport-sharp',
      color: colors.secondary,
      title: 'Volunteer Drivers',
      value: '42 On Route',
      badge: 'Avg. ETA 8m',
    },
    {
      id: '4',
      icon: 'trending-up-sharp',
      color: '#F59E0B',
      title: 'AI Predictions',
      value: '+350 Meals',
      badge: 'Demand Peak 9PM',
    },
    {
      id: '5',
      icon: 'flame-sharp',
      color: '#EF4444',
      title: 'Heatmap Activity',
      value: 'High Density',
      badge: 'Downtown Zone',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Live AI Telemetry</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {widgets.map((w) => (
          <TouchableOpacity
            key={w.id}
            activeOpacity={0.85}
            style={[styles.widgetCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
          >
            <View style={styles.topRow}>
              <View style={[styles.iconBox, { backgroundColor: `${w.color}15` }]}>
                <Ionicons name={w.icon} size={18} color={w.color} />
              </View>
              <View style={[styles.badgePill, { backgroundColor: `${w.color}10` }]}>
                <Text style={[styles.badgeText, { color: w.color }]}>{w.badge}</Text>
              </View>
            </View>

            <Text style={[styles.widgetValue, { color: themeColors.textPrimary }]}>{w.value}</Text>
            <Text style={[styles.widgetTitle, { color: themeColors.textSecondary }]}>{w.title}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 16,
    marginBottom: 12,
    paddingHorizontal: 20,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  widgetCard: {
    width: 150,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
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
        boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.08)',
      },
    }),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
  },
  badgePill: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 9,
  },
  widgetValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: 16,
    marginBottom: 2,
  },
  widgetTitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
  },
});
