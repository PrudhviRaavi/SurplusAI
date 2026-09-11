import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { profileService } from '../../services/profile/profileService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SettingsScreen = ({ onBack }) => {
  const [settings, setSettings] = useState(profileService.getSettings());

  const toggleSetting = (key) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);
    profileService.updateSettings(updated);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>APP SETTINGS</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Settings & <Text style={styles.italicSerif}>Preferences.</Text>
          </Text>
          <Text style={styles.subtitle}>Manage notifications, theme appearance, and location controls.</Text>
        </View>

        {/* Notifications Section */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>NOTIFICATION PREFERENCES</Text>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Donation Claim Updates</Text>
            <Switch
              value={settings.donationUpdatesNotif}
              onValueChange={() => toggleSetting('donationUpdatesNotif')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Volunteer Delivery Dispatches</Text>
            <Switch
              value={settings.deliveryUpdatesNotif}
              onValueChange={() => toggleSetting('deliveryUpdatesNotif')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>

          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>Impact & Achievement Unlocks</Text>
            <Switch
              value={settings.impactAchievementsNotif}
              onValueChange={() => toggleSetting('impactAchievementsNotif')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>

        {/* Location Preferences */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>LOCATION PREFERENCES</Text>

          <View style={styles.switchRow}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={styles.switchLabel}>Location-Based Discovery</Text>
              <Text style={styles.switchSub}>Enables automatic discovery of nearby surplus food.</Text>
            </View>
            <Switch
              value={settings.locationAccessEnabled}
              onValueChange={() => toggleSetting('locationAccessEnabled')}
              trackColor={{ false: colors.border, true: colors.primary }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  switchLabel: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
