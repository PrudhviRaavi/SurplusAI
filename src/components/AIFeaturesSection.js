import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { FeatureCard } from './FeatureCard';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const AIFeaturesSection = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const features = [
    {
      id: '1',
      iconName: 'scan-sharp',
      iconColor: colors.primary,
      badgeText: 'Computer Vision',
      title: 'Food Detection from Image',
      description: 'Snap a single picture of your surplus food. Deep learning models instantly identify food items, categories, and allergen information.',
      highlight: 'Instant multi-item detection in < 1 second',
    },
    {
      id: '2',
      iconName: 'time-sharp',
      iconColor: colors.accent,
      badgeText: 'Predictive ML',
      title: 'Freshness Prediction',
      description: 'Advanced vision algorithms assess freshness indicators, calculating remaining shelf life and safe consumption timeframes.',
      highlight: '97.8% accuracy in safety window estimation',
    },
    {
      id: '3',
      iconName: 'cube-sharp',
      iconColor: colors.secondary,
      badgeText: 'Volumetric Model',
      title: 'Quantity Estimation',
      description: 'Automated 3D spatial estimation calculates estimated weight and meal serving counts without requiring manual weighing scales.',
      highlight: 'Servings & weight calculation in real-time',
    },
    {
      id: '4',
      iconName: 'git-network-sharp',
      iconColor: '#8B5CF6',
      badgeText: 'Smart Logistics',
      title: 'Smart NGO Matching',
      description: 'Dynamic graph routing matches surplus food with nearby verified NGOs based on urgency, capacity, dietary needs, and ETA.',
      highlight: 'Optimized volunteer dispatch & route mapping',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionBadgeText}>POWERED BY DEEP LEARNING</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Intelligent AI Features
        </Text>
        <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
          Cutting-edge computer vision and predictive models designed to eliminate food wastage and streamline rescue logistics.
        </Text>
      </View>

      <View style={styles.gridContainer}>
        {features.map((item) => (
          <View style={styles.gridItem} key={item.id}>
            <FeatureCard
              iconName={item.iconName}
              iconColor={item.iconColor}
              badgeText={item.badgeText}
              title={item.title}
              description={item.description}
              highlight={item.highlight}
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  sectionBadge: {
    backgroundColor: 'rgba(37, 99, 235, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    marginBottom: 10,
  },
  sectionBadgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 11,
    color: colors.accent,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' && width > 768 ? 32 : 24,
    lineHeight: Platform.OS === 'web' && width > 768 ? 40 : 30,
    textAlign: 'center',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: Platform.OS === 'web' && width > 768 ? 16 : 14,
    lineHeight: 22,
    textAlign: 'center',
    maxWidth: 620,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 20,
  },
  gridItem: {
    width: Platform.OS === 'web' && width > 700 ? '48%' : '100%',
  },
});
