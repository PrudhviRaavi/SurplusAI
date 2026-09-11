import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const Header = ({ onExplorePress, onGetStartedPress }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={[styles.headerContainer, { backgroundColor: themeColors.glassBackground, borderColor: themeColors.border }]}>
      {/* Brand / Logo */}
      <View style={styles.brandContainer}>
        <View style={styles.logoBadge}>
          <Ionicons name="leaf-sharp" size={22} color={colors.white} />
          <View style={styles.aiDot} />
        </View>
        <View style={styles.titleWrapper}>
          <Text style={[styles.brandTitle, { color: themeColors.textPrimary }]}>
            FoodShare<Text style={{ color: colors.primary }}>AI</Text>
          </Text>
          <View style={styles.betaBadge}>
            <Text style={styles.betaText}>STARTUP PLATFORM</Text>
          </View>
        </View>
      </View>

      {/* Navigation & Theme Actions */}
      <View style={styles.actionsContainer}>
        {/* Navigation Links - Web & Tablet view */}
        <View style={styles.navLinks}>
          <TouchableOpacity onPress={onExplorePress} style={styles.navLinkButton}>
            <Text style={[styles.navLinkText, { color: themeColors.textSecondary }]}>AI Tech</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onGetStartedPress} style={styles.navLinkButton}>
            <Text style={[styles.navLinkText, { color: themeColors.textSecondary }]}>Impact</Text>
          </TouchableOpacity>
        </View>

        {/* Dark/Light Mode Toggle Switch */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.themeToggleButton, { backgroundColor: themeColors.surfaceSubtle, borderColor: themeColors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDarkMode ? 'sunny-sharp' : 'moon-sharp'}
            size={18}
            color={isDarkMode ? '#F59E0B' : colors.accent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    zIndex: 100,
    ...Platform.select({
      web: {
        position: 'sticky',
        top: 0,
        backdropFilter: 'blur(12px)',
      },
    }),
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justify: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },
  aiDot: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accentLight,
    borderWidth: 1.5,
    borderColor: colors.primary,
  },
  titleWrapper: {
    flexDirection: 'column',
  },
  brandTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 20,
    letterSpacing: -0.5,
  },
  betaBadge: {
    backgroundColor: colors.badgeBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginTop: -2,
  },
  betaText: {
    fontFamily: fontFamily.caption,
    fontSize: 9,
    color: colors.primaryDark,
    letterSpacing: 0.6,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navLinks: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    display: Platform.OS === 'web' ? 'flex' : 'none',
  },
  navLinkButton: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  navLinkText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 14,
  },
  themeToggleButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
