import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const FeatureCard = ({ iconName, iconColor, badgeText, title, description, highlight }) => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}
    >
      {/* Icon and Tag Badge */}
      <View style={styles.cardTop}>
        <View style={[styles.iconBox, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={iconName} size={24} color={iconColor} />
        </View>
        <View style={[styles.aiTag, { backgroundColor: isDarkMode ? 'rgba(37, 99, 235, 0.2)' : '#EFF6FF' }]}>
          <Ionicons name="hardware-chip-sharp" size={12} color={colors.accent} />
          <Text style={styles.aiTagText}>{badgeText}</Text>
        </View>
      </View>

      {/* Feature Title */}
      <Text style={[styles.title, { color: themeColors.textPrimary }]}>{title}</Text>

      {/* Description */}
      <Text style={[styles.description, { color: themeColors.textSecondary }]}>{description}</Text>

      {/* Footer Feature Metric / Highlight */}
      <View style={[styles.highlightRow, { backgroundColor: themeColors.surfaceSubtle }]}>
        <Ionicons name="checkmark-done-sharp" size={14} color={colors.primary} />
        <Text style={[styles.highlightText, { color: themeColors.textPrimary }]}>{highlight}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '100%',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.06,
        shadowRadius: 10,
      },
      android: {
        elevation: 3,
      },
      web: {
        boxShadow: '0px 6px 16px rgba(15, 23, 42, 0.05)',
        transition: 'all 0.2s ease-in-out',
      },
    }),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justify: 'center',
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  aiTagText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.accent,
  },
  title: {
    fontFamily: fontFamily.headingBold,
    fontSize: 18,
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 10,
  },
  highlightText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
  },
});
