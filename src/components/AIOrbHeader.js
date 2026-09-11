import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const AIOrbHeader = ({ onProfilePress }) => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={[styles.container, { backgroundColor: themeColors.glassBackground, borderColor: themeColors.border }]}>
      {/* Brand & Glowing AI Orb */}
      <View style={styles.brandRow}>
        <View style={styles.orbContainer}>
          <View style={styles.outerGlowRing} />
          <View style={styles.innerOrb}>
            <Ionicons name="sparkles" size={16} color={colors.white} />
          </View>
        </View>
        
        <View>
          <Text style={[styles.brandTitle, { color: themeColors.textPrimary }]}>
            FoodShare<Text style={{ color: colors.glowGreen }}>AI</Text>
          </Text>
          <View style={styles.statusPill}>
            <View style={styles.activeDot} />
            <Text style={styles.statusText}>2.4k Active AI Nodes</Text>
          </View>
        </View>
      </View>

      {/* Header Actions */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          onPress={toggleTheme}
          style={[styles.iconButton, { backgroundColor: themeColors.surfaceSubtle, borderColor: themeColors.border }]}
          activeOpacity={0.7}
        >
          <Ionicons
            name={isDarkMode ? 'sunny-sharp' : 'moon-sharp'}
            size={18}
            color={isDarkMode ? '#F59E0B' : colors.accent}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onProfilePress}
          style={[styles.profileAvatar, { borderColor: colors.glowGreen }]}
          activeOpacity={0.8}
        >
          <Ionicons name="person-sharp" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    zIndex: 90,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  orbContainer: {
    width: 38,
    height: 38,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
  },
  outerGlowRing: {
    position: 'absolute',
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(34, 197, 94, 0.25)',
  },
  innerOrb: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justify: 'center',
    shadowColor: colors.glowGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 6,
  },
  brandTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 19,
    letterSpacing: -0.5,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.glowGreen,
  },
  statusText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.glowGreen,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justify: 'center',
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: colors.surfaceSubtle || '#131E32',
    borderWidth: 1.5,
    alignItems: 'center',
    justify: 'center',
  },
});
