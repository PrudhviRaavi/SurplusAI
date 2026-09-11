import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const StatCard = ({ iconName, iconColor, value, label, growth }) => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={[styles.card, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
      <View style={styles.headerRow}>
        <View style={[styles.iconContainer, { backgroundColor: `${iconColor}15` }]}>
          <Ionicons name={iconName} size={22} color={iconColor} />
        </View>
        {growth && (
          <View style={styles.growthBadge}>
            <Ionicons name="trending-up-sharp" size={12} color={colors.primary} />
            <Text style={styles.growthText}>{growth}</Text>
          </View>
        )}
      </View>

      <Text style={[styles.valueText, { color: themeColors.textPrimary }]}>{value}</Text>
      <Text style={[styles.labelText, { color: themeColors.textSecondary }]}>{label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flex: 1,
    minWidth: 150,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
      web: {
        boxShadow: '0px 4px 12px rgba(15, 23, 42, 0.04)',
      },
    }),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  iconContainer: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  growthBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  growthText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.primaryDark,
  },
  valueText: {
    fontFamily: fontFamily.headingBold,
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  labelText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    marginTop: 2,
  },
});
