import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const NgoAIRecommendationCard = ({
  foodName = '25 meals of Vegetable Biryani',
  matchScore = '96%',
  reasons = [
    'Matches your food requirements',
    '1.8 km away',
    'Within your capacity',
    'High urgency',
  ],
  onClaimDonation,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.aiTag}>
          <Ionicons name="sparkles-sharp" size={12} color={colors.gold} />
          <Text style={styles.aiTagText}>RECOMMENDED FOOD NEAR YOU</Text>
        </View>

        <View style={styles.matchBadge}>
          <Text style={styles.matchScoreText}>{matchScore} MATCH</Text>
        </View>
      </View>

      <Text style={styles.titleHeader}>
        Recommended for your <Text style={styles.italicSerif}>organization.</Text>
      </Text>

      <Text style={styles.foodHeadline}>{foodName}</Text>

      <View style={styles.reasonsList}>
        {reasons.map((reason, idx) => (
          <View key={idx} style={styles.reasonItem}>
            <Ionicons name="checkmark-circle-sharp" size={14} color="#10B981" />
            <Text style={styles.reasonText}>{reason}</Text>
          </View>
        ))}
      </View>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onClaimDonation}
        style={styles.claimBtn}
      >
        <Text style={styles.claimBtnText}>View Donation →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FAF4EB',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
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
  matchBadge: {
    backgroundColor: 'rgba(75, 99, 85, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.25)',
  },
  matchScoreText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  titleHeader: {
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
  foodHeadline: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
  },
  reasonsList: {
    gap: 6,
    marginBottom: 16,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  reasonText: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  claimBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 13,
    borderRadius: 18,
    alignItems: 'center',
  },
  claimBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
