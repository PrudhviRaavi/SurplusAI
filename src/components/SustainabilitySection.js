import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

const { width } = Dimensions.get('window');

export const SustainabilitySection = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const items = [
    {
      id: '1',
      icon: 'trash-bin-outline',
      value: '85,000 kg',
      title: 'Food Waste Reduced',
      description: 'Landfill diversion of perishable food items through rapid AI distribution.',
      color: colors.primary,
    },
    {
      id: '2',
      icon: 'cloud-done-outline',
      value: '210 Tons',
      title: 'CO₂ Emissions Prevented',
      description: 'Mitigation of methane & greenhouse gas emissions from organic decomposition.',
      color: colors.secondary,
    },
    {
      id: '3',
      icon: 'heart-dislike-outline', // or 'heart-outline'
      value: '125,000+',
      title: 'Meals Delivered',
      description: 'Directly nourishing vulnerable communities and shelter homes in real-time.',
      color: colors.accent,
    },
  ];

  return (
    <View style={[styles.wrapper, { backgroundColor: isDarkMode ? '#064E3B15' : '#F0FDF4' }]}>
      <View style={styles.contentContainer}>
        {/* Section Header */}
        <View style={styles.headerArea}>
          <View style={styles.leafTag}>
            <Ionicons name="leaf-sharp" size={14} color={colors.primary} />
            <Text style={styles.leafTagText}>SUSTAINABILITY & ESG</Text>
          </View>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>
            Environmental Impact
          </Text>
          <Text style={[styles.sectionSubtitle, { color: themeColors.textSecondary }]}>
            Every meal rescued directly reduces landfill waste and greenhouse gas footprint.
          </Text>
        </View>

        {/* Impact Cards Grid */}
        <View style={styles.cardsRow}>
          {items.map((item) => (
            <View
              key={item.id}
              style={[
                styles.card,
                {
                  backgroundColor: themeColors.surface,
                  borderColor: themeColors.border,
                },
              ]}
            >
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}18` }]}>
                <Ionicons name={item.icon === 'heart-dislike-outline' ? 'heart-outline' : item.icon} size={24} color={item.color} />
              </View>
              <Text style={[styles.cardValue, { color: item.color }]}>{item.value}</Text>
              <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
              <Text style={[styles.cardDesc, { color: themeColors.textSecondary }]}>{item.description}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(22, 163, 74, 0.15)',
  },
  contentContainer: {
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  headerArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  leafTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    marginBottom: 10,
  },
  leafTagText: {
    fontFamily: fontFamily.caption,
    fontSize: 11,
    color: colors.primaryDark,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' && width > 768 ? 32 : 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: Platform.OS === 'web' && width > 768 ? 16 : 14,
    textAlign: 'center',
    maxWidth: 580,
  },
  cardsRow: {
    flexDirection: width > 700 ? 'row' : 'column',
    gap: 16,
    justifyContent: 'space-between',
  },
  card: {
    flex: 1,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    alignItems: 'flex-start',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.04,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 14px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  cardValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: 26,
    lineHeight: 32,
    marginBottom: 4,
  },
  cardTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 16,
    marginBottom: 6,
  },
  cardDesc: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 13,
    lineHeight: 18,
  },
});
