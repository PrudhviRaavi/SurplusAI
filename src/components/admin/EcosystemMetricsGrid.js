import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const EcosystemMetricsGrid = ({
  activeDonations = 48,
  foodRescuedKg = 1248,
  mealsRedistributed = 12450,
  activeVolunteers = 890,
  partnerNgos = 342,
  co2ImpactKg = 8420,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>ECOSYSTEM TELEMETRY</Text>

      <View style={styles.grid}>
        {/* Card 1 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🔥</Text>
          <Text style={styles.statValue}>{activeDonations}</Text>
          <Text style={styles.statLabel}>Active donations</Text>
        </View>

        {/* Card 2 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🥗</Text>
          <Text style={styles.statValue}>{foodRescuedKg.toLocaleString()} kg</Text>
          <Text style={styles.statLabel}>Food rescued</Text>
        </View>

        {/* Card 3 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🍱</Text>
          <Text style={styles.statValue}>{mealsRedistributed.toLocaleString()}</Text>
          <Text style={styles.statLabel}>Meals redistributed</Text>
        </View>

        {/* Card 4 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🚲</Text>
          <Text style={styles.statValue}>{activeVolunteers}</Text>
          <Text style={styles.statLabel}>Active volunteers</Text>
        </View>

        {/* Card 5 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🤝</Text>
          <Text style={styles.statValue}>{partnerNgos}</Text>
          <Text style={styles.statLabel}>Partner NGOs</Text>
        </View>

        {/* Card 6 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🌱</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>
            {co2ImpactKg.toLocaleString()} kg
          </Text>
          <Text style={styles.statLabel}>CO₂ avoided</Text>
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
    fontSize: 20,
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
