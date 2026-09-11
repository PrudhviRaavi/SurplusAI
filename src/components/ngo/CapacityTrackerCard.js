import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const CapacityTrackerCard = ({
  usedMeals = 72,
  totalCapacity = 100,
  availableMeals = 28,
}) => {
  const progressPercent = Math.min(100, Math.round((usedMeals / totalCapacity) * 100));

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="pie-chart-outline" size={18} color={colors.primary} />
          <Text style={styles.cardTitle}>TODAY'S DISTRIBUTION CAPACITY</Text>
        </View>

        <View style={styles.availableBadge}>
          <Text style={styles.availableBadgeText}>{availableMeals} meals available space</Text>
        </View>
      </View>

      <View style={styles.numbersRow}>
        <View style={styles.mainCountGroup}>
          <Text style={styles.usedCount}>{usedMeals}</Text>
          <Text style={styles.totalCount}> / {totalCapacity} meals</Text>
        </View>
        <Text style={styles.percentText}>{progressPercent}% filled</Text>
      </View>

      {/* Visual Progress Bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progressPercent}%` }]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  cardTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  availableBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  availableBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  numbersRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  mainCountGroup: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  usedCount: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.primary,
  },
  totalCount: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  percentText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
  },
  progressTrack: {
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F6EDDF',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
});
