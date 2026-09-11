import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const Footer = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <View style={[styles.footer, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
      <View style={styles.footerContent}>
        {/* Brand */}
        <View style={styles.brandRow}>
          <View style={styles.logoBadge}>
            <Ionicons name="leaf-sharp" size={18} color={colors.white} />
          </View>
          <Text style={[styles.brandTitle, { color: themeColors.textPrimary }]}>
            FoodShare<Text style={{ color: colors.primary }}>AI</Text>
          </Text>
        </View>

        <Text style={[styles.tagline, { color: themeColors.textSecondary }]}>
          B.Tech Capstone Project • AI Food Redistribution Engine
        </Text>

        <View style={styles.linksRow}>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={[styles.linkText, { color: themeColors.textSecondary }]}>Privacy Policy</Text>
          </TouchableOpacity>
          <Text style={[styles.dot, { color: themeColors.textMuted }]}>•</Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={[styles.linkText, { color: themeColors.textSecondary }]}>Terms of Service</Text>
          </TouchableOpacity>
          <Text style={[styles.dot, { color: themeColors.textMuted }]}>•</Text>
          <TouchableOpacity style={styles.linkButton}>
            <Text style={[styles.linkText, { color: themeColors.textSecondary }]}>API Docs</Text>
          </TouchableOpacity>
        </View>

        <Text style={[styles.copyright, { color: themeColors.textMuted }]}>
          © {new Date().getFullYear()} FoodShareAI Inc. Built with React Native & Expo.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    paddingVertical: 32,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    alignItems: 'center',
  },
  footerContent: {
    maxWidth: 960,
    width: '100%',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  logoBadge: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justify: 'center',
  },
  brandTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 18,
  },
  tagline: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 13,
    marginBottom: 16,
    textAlign: 'center',
  },
  linksRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  linkButton: {
    paddingVertical: 4,
  },
  linkText: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 13,
  },
  dot: {
    fontSize: 12,
  },
  copyright: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 12,
    textAlign: 'center',
  },
});
