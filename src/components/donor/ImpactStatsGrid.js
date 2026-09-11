import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const ImpactStatsGrid = ({
  rescuedKg = 128,
  mealsShared = 312,
  totalDonations = 24,
  impactScore = 8.6,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>QUICK IMPACT OVERVIEW</Text>

      <View style={styles.grid}>
        {/* Card 1 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🥗</Text>
          <Text style={styles.statValue}>{rescuedKg} kg</Text>
          <Text style={styles.statLabel}>Food rescued</Text>
        </View>

        {/* Card 2 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🍱</Text>
          <Text style={styles.statValue}>{mealsShared}</Text>
          <Text style={styles.statLabel}>Meals shared</Text>
        </View>

        {/* Card 3 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>📦</Text>
          <Text style={styles.statValue}>{totalDonations}</Text>
          <Text style={styles.statLabel}>Total donations</Text>
        </View>

        {/* Card 4 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>✨</Text>
          <Text style={[styles.statValue, { color: colors.gold }]}>{impactScore}</Text>
          <Text style={styles.statLabel}>Impact score</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  statEmoji: {
    fontSize: 20,
    marginBottom: 6,
  },
  statValue: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: -0.4,
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
});
