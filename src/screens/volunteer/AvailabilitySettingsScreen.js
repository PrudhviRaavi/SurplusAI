import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AvailabilitySettingsScreen = ({ onBack }) => {
  const { formData, updateFormData } = useAppStore();
  const [isAvailable, setIsAvailable] = useState(true);
  const [transport, setTransport] = useState(formData.volTransport || 'Two-wheeler');
  const [radius, setRadius] = useState(formData.volTravelRadius || '15 km');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="time" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>VOLUNTEER DISPATCH AVAILABILITY</Text>
        </View>

        <Text style={styles.mainTitle}>
          Availability & <Text style={styles.italicSerif}>Preferences.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Set your active dispatch status, travel radius, and transportation preferences.
        </Text>
      </View>

      {/* Online Availability Card */}
      <View style={styles.card}>
        <View style={styles.switchRow}>
          <View style={styles.switchCol}>
            <Text style={styles.switchTitle}>Available for Delivery Dispatches</Text>
            <Text style={styles.switchSub}>
              {isAvailable ? "You're online and eligible for nearby tasks." : "Offline. You won't receive notifications."}
            </Text>
          </View>
          <Switch
            value={isAvailable}
            onValueChange={setIsAvailable}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor={colors.white}
          />
        </View>
      </View>

      {/* Transportation Preference */}
      <View style={styles.card}>
        <Text style={styles.sectionHeaderTag}>TRANSPORTATION METHOD</Text>
        <View style={styles.chipRow}>
          {['Bicycle', 'Two-wheeler', 'Car / Van'].map((t) => (
            <TouchableOpacity
              key={t}
              onPress={() => {
                setTransport(t);
                updateFormData({ volTransport: t });
              }}
              style={[styles.chip, transport === t && styles.chipActive]}
            >
              <Text style={[styles.chipText, transport === t && styles.chipTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Travel Radius */}
      <View style={styles.card}>
        <Text style={styles.sectionHeaderTag}>MAXIMUM TRAVEL RADIUS</Text>
        <View style={styles.chipRow}>
          {['5 km', '10 km', '15 km', '25 km'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => {
                setRadius(r);
                updateFormData({ volTravelRadius: r });
              }}
              style={[styles.chip, radius === r && styles.chipActive]}
            >
              <Text style={[styles.chipText, radius === r && styles.chipTextActive]}>{r}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  titleSection: {
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
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
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  switchCol: {
    flex: 1,
    paddingRight: 10,
  },
  switchTitle: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  switchSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
});
