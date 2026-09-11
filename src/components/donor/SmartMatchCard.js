import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SmartMatchCard = ({
  ngoName = 'Green Hope Foundation',
  matchScore = '94%',
  distance = '2.1 km away',
  reasons = ['Accepts cooked meals', 'Currently has open capacity', 'High community urgency'],
  onViewMatch,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.aiTag}>
          <Ionicons name="hardware-chip-outline" size={12} color={colors.gold} />
          <Text style={styles.aiTagText}>SMART MATCHING ENGINE</Text>
        </View>

        <View style={styles.matchPill}>
          <Text style={styles.matchScoreText}>{matchScore} MATCH</Text>
        </View>
      </View>

      <Text style={styles.cardTitle}>
        Recommended for your <Text style={styles.italicSerif}>next donation.</Text>
      </Text>

      <View style={styles.ngoRow}>
        <Text style={styles.ngoName}>{ngoName}</Text>
        <Text style={styles.distanceText}>· {distance}</Text>
      </View>

      <View style={styles.reasonsList}>
        {reasons.map((reason, idx) => (
          <View key={idx} style={styles.reasonRow}>
            <Ionicons name="checkmark-circle" size={14} color={colors.primary} />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onViewMatch}
        style={styles.viewMatchBtn}
      >
        <Text style={styles.viewMatchText}>View Match Details →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
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
    marginBottom: 10,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  aiTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  matchPill: {
    backgroundColor: 'rgba(75, 99, 85, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.2)',
  },
  matchScoreText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.6,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  ngoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  ngoName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  distanceText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginLeft: 4,
  },
  reasonsList: {
    gap: 6,
    marginBottom: 16,
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  viewMatchBtn: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.15)',
  },
  viewMatchText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
