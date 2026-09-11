import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, ScrollView, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const ProfileScreen = () => {
  const { isDarkMode, toggleTheme } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card Header */}
        <View style={[styles.profileHeaderCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
          <View style={styles.avatarCircle}>
            <Ionicons name="restaurant-sharp" size={28} color={colors.white} />
          </View>

          <Text style={[styles.name, { color: themeColors.textPrimary }]}>Grand Royal Hotel & Suites</Text>
          <Text style={[styles.role, { color: colors.glowGreen }]}>Verified Food Donor • Tier 1 AI Partner</Text>

          {/* Quick Stats Grid */}
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.glowGreen }]}>1,420</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>Meals Saved</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.accent }]}>99.2%</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>AI Accuracy</Text>
            </View>
            <View style={[styles.statDivider, { backgroundColor: themeColors.border }]} />
            <View style={styles.statBox}>
              <Text style={[styles.statNum, { color: colors.secondary }]}>4.9 ★</Text>
              <Text style={[styles.statLabel, { color: themeColors.textSecondary }]}>NGO Rating</Text>
            </View>
          </View>
        </View>

        {/* Options */}
        <View style={styles.optionsGroup}>
          <TouchableOpacity onPress={toggleTheme} style={[styles.optionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <View style={styles.optionLeft}>
              <Ionicons name={isDarkMode ? 'moon-sharp' : 'sunny-sharp'} size={18} color={colors.glowGreen} />
              <Text style={[styles.optionText, { color: themeColors.textPrimary }]}>App Theme Mode</Text>
            </View>
            <Text style={[styles.optionVal, { color: colors.glowGreen }]}>{isDarkMode ? 'Dark Mode' : 'Light Mode'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="hardware-chip-sharp" size={18} color={colors.accent} />
              <Text style={[styles.optionText, { color: themeColors.textPrimary }]}>AI Model Sensitivity</Text>
            </View>
            <Text style={[styles.optionVal, { color: themeColors.textSecondary }]}>High (v2.4)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.optionRow, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <View style={styles.optionLeft}>
              <Ionicons name="shield-checkmark-sharp" size={18} color={colors.secondary} />
              <Text style={[styles.optionText, { color: themeColors.textPrimary }]}>Verified Organization Badge</Text>
            </View>
            <Ionicons name="checkmark-circle-sharp" size={18} color={colors.glowGreen} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContainer: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 100 },
  profileHeaderCard: { padding: 20, borderRadius: 22, borderWidth: 1, alignItems: 'center', marginBottom: 20 },
  avatarCircle: { width: 64, height: 64, borderRadius: 32, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 12 },
  name: { fontFamily: fontFamily.headingBold, fontSize: 18, textAlign: 'center' },
  role: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, marginTop: 2, marginBottom: 16 },
  statsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around', width: '100%', paddingTop: 14, borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.08)' },
  statBox: { alignItems: 'center' },
  statNum: { fontFamily: fontFamily.headingBold, fontSize: 18 },
  statLabel: { fontFamily: fontFamily.bodySmall, fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, height: 24 },
  optionsGroup: { gap: 10 },
  optionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 16, borderWidth: 1 },
  optionLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  optionText: { fontFamily: fontFamily.headingSemiBold, fontSize: 14 },
  optionVal: { fontFamily: fontFamily.bodyMedium, fontSize: 13 },
});
