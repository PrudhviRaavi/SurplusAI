import React from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const BentoGridFeatures = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const bentoItems = [
    {
      id: '1',
      title: 'Food Detection',
      desc: 'Deep multi-item vision recognition in < 1 second.',
      icon: 'scan-sharp',
      color: colors.glowGreen,
      span: 'large', // Top featured card
      tag: 'Vision AI',
    },
    {
      id: '2',
      title: 'Freshness Index',
      desc: 'Neural decay scoring & safe consumption hours.',
      icon: 'time-sharp',
      color: colors.accent,
      span: 'normal',
      tag: '97.8% Acc',
    },
    {
      id: '3',
      title: '3D Volume Estimate',
      desc: 'Spatial volumetric meal & weight calculation.',
      icon: 'cube-sharp',
      color: colors.secondary,
      span: 'normal',
      tag: 'Volumetric',
    },
    {
      id: '4',
      title: 'Smart NGO Matching',
      desc: 'Demand & capacity graph routing for instant dispatch.',
      icon: 'git-network-sharp',
      color: '#8B5CF6',
      span: 'large',
      tag: 'Logistics',
    },
    {
      id: '5',
      title: 'Demand Forecasting',
      desc: 'Predict surplus spikes based on weather & events.',
      icon: 'trending-up-sharp',
      color: '#F59E0B',
      span: 'normal',
      tag: 'Predictive',
    },
    {
      id: '6',
      title: 'Heatmap Analytics',
      desc: 'Real-time urban waste density mapping.',
      icon: 'flame-sharp',
      color: '#EF4444',
      span: 'normal',
      tag: 'Spatial',
    },
    {
      id: '7',
      title: 'Route Optimization',
      desc: 'Multi-stop volunteer navigation with minimal CO₂.',
      icon: 'navigate-sharp',
      color: colors.glowCyan,
      span: 'normal',
      tag: 'Green Route',
    },
    {
      id: '8',
      title: 'Fraud Detection',
      desc: 'Automated verification of non-profit recipient badges.',
      icon: 'shield-checkmark-sharp',
      color: colors.glowGreen,
      span: 'normal',
      tag: 'Security',
    },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <View style={styles.chip}>
          <Ionicons name="hardware-chip-sharp" size={12} color={colors.glowGreen} />
          <Text style={styles.chipText}>AI CAPABILITIES ARCHITECTURE</Text>
        </View>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
          Built for Scale & Intelligence
        </Text>
      </View>

      <View style={styles.bentoGrid}>
        {bentoItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            activeOpacity={0.88}
            style={[
              styles.bentoCard,
              item.span === 'large' ? styles.spanLarge : styles.spanNormal,
              { backgroundColor: themeColors.surface, borderColor: themeColors.border },
            ]}
          >
            <View style={styles.cardHeader}>
              <View style={[styles.iconBox, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={[styles.tagPill, { backgroundColor: `${item.color}12` }]}>
                <Text style={[styles.tagText, { color: item.color }]}>{item.tag}</Text>
              </View>
            </View>

            <Text style={[styles.itemTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
            <Text style={[styles.itemDesc, { color: themeColors.textSecondary }]}>{item.desc}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: 20,
    marginVertical: 28,
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 20,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 8,
  },
  chipText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.glowGreen,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
    textAlign: 'center',
  },
  bentoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  bentoCard: {
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
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
        boxShadow: '0px 4px 14px rgba(0, 0, 0, 0.05)',
      },
    }),
  },
  spanLarge: {
    width: '100%',
  },
  spanNormal: {
    width: width > 600 ? '48.5%' : '48%',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 12,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justify: 'center',
  },
  tagPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  tagText: {
    fontFamily: fontFamily.caption,
    fontSize: 9,
  },
  itemTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 15,
    marginBottom: 4,
  },
  itemDesc: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 12,
    lineHeight: 16,
  },
});
