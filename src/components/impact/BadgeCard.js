import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const BadgeCard = ({ badge, onPress }) => {
  const isUnlocked = badge?.isUnlocked;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => onPress && onPress(badge)}
      style={[
        styles.card,
        isUnlocked ? styles.unlockedCard : styles.lockedCard,
      ]}
    >
      <View style={[styles.iconCircle, isUnlocked ? styles.unlockedIconCircle : styles.lockedIconCircle]}>
        <Text style={styles.iconEmoji}>{badge.icon || '🏆'}</Text>
      </View>

      <Text style={[styles.title, !isUnlocked && styles.lockedText]}>{badge.title}</Text>
      <Text style={styles.subText}>
        {isUnlocked ? `Unlocked · ${badge.unlockedAt}` : badge.unlockRequirement || 'Locked'}
      </Text>

      {!isUnlocked && (
        <View style={styles.lockBadge}>
          <Ionicons name="lock-closed" size={10} color={colors.textMuted} />
          <Text style={styles.lockText}>LOCKED</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    marginBottom: 10,
    alignItems: 'center',
  },
  unlockedCard: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  lockedCard: {
    backgroundColor: '#FAF4EB',
    borderColor: colors.border,
    opacity: 0.7,
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  unlockedIconCircle: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  lockedIconCircle: {
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconEmoji: {
    fontSize: 22,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  lockedText: {
    color: colors.textMuted,
  },
  subText: {
    fontSize: 10,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 2,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 6,
    backgroundColor: 'rgba(0,0,0,0.04)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  lockText: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
  },
});
