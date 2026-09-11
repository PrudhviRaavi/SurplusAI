import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const NgoImpactGrid = ({
  mealsReceived = 380,
  peopleServed = 520,
  foodRescuedKg = 145,
  co2AvoidedKg = 310,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>COMMUNITY REDISTRIBUTION IMPACT</Text>

      <View style={styles.grid}>
        {/* Card 1 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🍱</Text>
          <Text style={styles.statValue}>{mealsReceived}+</Text>
          <Text style={styles.statLabel}>Meals received</Text>
        </View>

        {/* Card 2 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>👥</Text>
          <Text style={styles.statValue}>{peopleServed}+</Text>
          <Text style={styles.statLabel}>People served</Text>
        </View>

        {/* Card 3 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🥗</Text>
          <Text style={styles.statValue}>{foodRescuedKg} kg</Text>
          <Text style={styles.statLabel}>Food rescued</Text>
        </View>

        {/* Card 4 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🌱</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{co2AvoidedKg} kg</Text>
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
