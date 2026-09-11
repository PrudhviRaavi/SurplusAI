import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const EmotionalImpactBanner = ({ mealsServed = 312, co2AvoidedKg = 284 }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.heartCircle}>
          <Ionicons name="heart" size={20} color={colors.accent} />
        </View>
        <Text style={styles.tagText}>COMMUNITY & PLANET IMPACT</Text>
      </View>

      <Text style={styles.headline}>
        Your food is making a <Text style={styles.italicSerif}>difference.</Text>
      </Text>

      <Text style={styles.impactHighlight}>
        <Text style={styles.boldNumber}>{mealsServed} meals</Text> found a new table instead of going to waste.
      </Text>

      <View style={styles.co2Box}>
        <Ionicons name="leaf-outline" size={16} color="#10B981" />
        <Text style={styles.co2Text}>
          Estimated <Text style={styles.co2Bold}>{co2AvoidedKg} kg CO₂</Text> emissions avoided
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F6EDDF', // Warm Sand Muted Base
    borderRadius: 28,
    padding: 22,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  heartCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(217, 143, 92, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  tagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.accent,
    letterSpacing: 1.0,
  },
  headline: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  impactHighlight: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 14,
  },
  boldNumber: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  co2Box: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.25)',
  },
  co2Text: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 6,
  },
  co2Bold: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#065F46',
  },
});
