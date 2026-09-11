import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const badges = [
  { id: 'b1', title: 'First Delivery', icon: '🥇', desc: 'Completed 1st rescue', unlocked: true },
  { id: 'b2', title: '10 Deliveries', icon: '🏆', desc: 'Completed 10 rescues', unlocked: true },
  { id: 'b3', title: '100 Meals', icon: '🍲', desc: 'Rescued 100+ meals', unlocked: true },
  { id: 'b4', title: 'Weekend Helper', icon: '🌟', desc: 'Active on weekends', unlocked: true },
];

export const RecognitionBadgesCard = ({ level = 'Community Hero' }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.topRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="ribbon-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionHeader}>RECOGNITION & BADGES</Text>
        </View>

        <View style={styles.levelBadge}>
          <Text style={styles.levelBadgeText}>{level.toUpperCase()}</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>Volunteer Achievements</Text>

      <View style={styles.badgesGrid}>
        {badges.map((item) => (
          <View key={item.id} style={styles.badgeItem}>
            <View style={styles.iconCircle}>
              <Text style={styles.badgeEmoji}>{item.icon}</Text>
            </View>
            <Text style={styles.badgeTitle}>{item.title}</Text>
            <Text style={styles.badgeDesc}>{item.desc}</Text>
          </View>
        ))}
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  levelBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  levelBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  badgesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  badgeItem: {
    width: '48%',
    backgroundColor: '#FAF4EB',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 10,
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: colors.border,
  },
  badgeEmoji: {
    fontSize: 20,
  },
  badgeTitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '700',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  badgeDesc: {
    fontSize: 11,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
});
