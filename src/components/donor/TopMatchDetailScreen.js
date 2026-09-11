import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const TopMatchDetailScreen = ({
  topMatch,
  onSeeAllMatches,
  onKeepDonationOpen,
  onViewOrgDetails,
}) => {
  const match = topMatch || {
    name: 'Hope Community Kitchen',
    category: 'Shelter & Kitchen',
    matchScore: 96,
    matchLabel: 'Excellent match',
    isVerified: true,
    distanceKm: 2.4,
    availableCapacity: 72,
    donationQuantity: '25 meals',
    demandLevel: 'High',
    reasons: [
      'Accepts cooked meals',
      '2.4 km away (within 15 km radius)',
      'Has enough capacity (72 meals space)',
      'High demand for cooked meals today',
      'Can receive within your 6:00 PM pickup window',
    ],
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>#1 RECOMMENDATION MATCH</Text>
        </View>

        <Text style={styles.mainTitle}>
          We found a <Text style={styles.italicSerif}>strong match.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Based on location proximity, capacity, and immediate food requirements.
        </Text>
      </View>

      {/* Top Match Spotlight Card */}
      <View style={styles.spotlightCard}>
        <View style={styles.topScoreRow}>
          <View style={styles.scorePill}>
            <Text style={styles.scoreVal}>{match.matchScore}%</Text>
            <Text style={styles.scoreLabel}>{match.matchLabel.toUpperCase()}</Text>
          </View>

          {match.isVerified && (
            <View style={styles.verifiedPill}>
              <Ionicons name="checkmark-circle" size={14} color="#10B981" />
              <Text style={styles.verifiedText}>VERIFIED RECEIVER ✓</Text>
            </View>
          )}
        </View>

        <Text style={styles.orgName}>{match.name}</Text>
        <Text style={styles.orgCategory}>{match.category} · {match.distanceKm} km away</Text>

        <View style={styles.divider} />

        {/* Telemetry Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>AVAILABLE SPACE</Text>
            <Text style={styles.statVal}>{match.availableCapacity} meals</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>YOUR DONATION</Text>
            <Text style={styles.statVal}>{match.donationQuantity}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>DEMAND LEVEL</Text>
            <Text style={[styles.statVal, { color: colors.gold }]}>{match.demandLevel}</Text>
          </View>
        </View>
      </View>

      {/* Transparent Reasons: WHY WE RECOMMEND THEM */}
      <View style={styles.reasonsCard}>
        <Text style={styles.reasonsHeaderTitle}>WHY WE RECOMMEND THEM</Text>
        <Text style={styles.reasonsSub}>5 algorithmic match criteria satisfied:</Text>

        <View style={styles.reasonsList}>
          {match.reasons.map((reason, idx) => (
            <View key={idx} style={styles.reasonItem}>
              <View style={styles.checkBubble}>
                <Ionicons name="checkmark" size={12} color="#10B981" />
              </View>
              <Text style={styles.reasonText}>{reason}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Decision Actions */}
      <View style={styles.actionsBox}>
        <LuxuryButton
          title="View Organization Details →"
          onPress={() => onViewOrgDetails && onViewOrgDetails(match)}
          variant="primary"
          size="large"
          style={{ marginBottom: 10 }}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onSeeAllMatches}
          style={styles.seeAllBtn}
        >
          <Ionicons name="list-outline" size={16} color={colors.primary} />
          <Text style={styles.seeAllText}>See All Ranked Matches →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onKeepDonationOpen}
          style={styles.keepOpenLink}
        >
          <Text style={styles.keepOpenLinkText}>Keep Donation Open & Back to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  spotlightCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  scorePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  scoreVal: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
  },
  scoreLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.9)',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  orgName: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orgCategory: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  statVal: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  reasonsCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  reasonsHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  reasonsSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    marginBottom: 10,
  },
  reasonsList: {
    gap: 8,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  checkBubble: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  reasonText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  actionsBox: {
    alignItems: 'center',
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    width: '100%',
    gap: 8,
    marginBottom: 10,
  },
  seeAllText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  keepOpenLink: {
    paddingVertical: 8,
  },
  keepOpenLinkText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
});
