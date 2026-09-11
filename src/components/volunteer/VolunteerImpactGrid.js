import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const VolunteerImpactGrid = ({
  deliveriesCount = 14,
  mealsDelivered = 184,
  distanceKm = 42,
  hoursLogged = 18,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>YOUR VOLUNTEER IMPACT</Text>

      <Text style={styles.headlineHighlight}>
        Your efforts helped deliver <Text style={styles.boldText}>{mealsDelivered} meals.</Text>
      </Text>

      <View style={styles.grid}>
        {/* Card 1 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🚚</Text>
          <Text style={styles.statValue}>{deliveriesCount}</Text>
          <Text style={styles.statLabel}>Deliveries completed</Text>
        </View>

        {/* Card 2 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🍱</Text>
          <Text style={styles.statValue}>{mealsDelivered}</Text>
          <Text style={styles.statLabel}>Meals delivered</Text>
        </View>

        {/* Card 3 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>🚲</Text>
          <Text style={styles.statValue}>{distanceKm} km</Text>
          <Text style={styles.statLabel}>Distance traveled</Text>
        </View>

        {/* Card 4 */}
        <View style={styles.statCard}>
          <Text style={styles.statEmoji}>⏱️</Text>
          <Text style={[styles.statValue, { color: colors.gold }]}>{hoursLogged} hrs</Text>
          <Text style={styles.statLabel}>Volunteer hours</Text>
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
    marginBottom: 4,
  },
  headlineHighlight: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  boldText: {
    fontWeight: '800',
    color: colors.primary,
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
