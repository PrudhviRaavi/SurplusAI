import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgeCard } from '../../components/impact/BadgeCard';
import { ImpactShareModal } from '../../components/impact/ImpactShareModal';
import { CommunityLeaderboardScreen } from '../common/CommunityLeaderboardScreen';
import { impactService } from '../../services/impact/impactService';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const ImpactTabScreen = () => {
  const { donorMealsShared, donorFoodRescuedKg } = useAppStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const impactData = impactService.getImpact('Donor');
  const badges = impactService.getBadges('Donor');
  const milestones = impactService.getMilestones('Donor');

  if (showLeaderboard) {
    return <CommunityLeaderboardScreen onBack={() => setShowLeaderboard(false)} />;
  }

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>MEASURABLE ENVIRONMENTAL IMPACT</Text>
        </View>

        <Text style={styles.mainTitle}>
          Your food found <Text style={styles.italicSerif}>another story.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Your surplus donations nourish local communities and prevent carbon emissions.
        </Text>
      </View>

      {/* 3-Week Activity Streak Banner */}
      <View style={styles.streakBanner}>
        <View style={styles.streakLeft}>
          <Text style={styles.streakEmoji}>🔥</Text>
          <View>
            <Text style={styles.streakTitle}>3-Week Impact Streak!</Text>
            <Text style={styles.streakSub}>You've shared food for 3 consecutive weeks.</Text>
          </View>
        </View>
        <View style={styles.streakBadge}>
          <Text style={styles.streakBadgeText}>ACTIVE</Text>
        </View>
      </View>

      {/* Level & Points Progress Bar */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>LEVEL 4: IMPACT MAKER</Text>
          </View>
          <Text style={styles.pointsVal}>{impactData.impactPoints} PTS</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '51%' }]} />
        </View>
        <Text style={styles.progressSubText}>1,280 / 2,500 pts to Food Rescue Champion</Text>
      </View>

      {/* Primary Impact Telemetry Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="fast-food" size={20} color={colors.primary} />
          <Text style={styles.statVal}>{donorMealsShared || 312}</Text>
          <Text style={styles.statLabel}>Meals Shared</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="scale" size={20} color="#10B981" />
          <Text style={styles.statVal}>{donorFoodRescuedKg || 128} kg</Text>
          <Text style={styles.statLabel}>Food Rescued</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="checkmark-done-circle" size={20} color={colors.gold} />
          <Text style={styles.statVal}>24</Text>
          <Text style={styles.statLabel}>Completed Donations</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="leaf" size={20} color={colors.accent} />
          <Text style={styles.statVal}>320 kg</Text>
          <Text style={styles.statLabel}>CO₂ Prevented</Text>
        </View>
      </View>

      {/* Environmental Educational Breakdown */}
      <View style={styles.enviroCard}>
        <Text style={styles.sectionHeaderTag}>YOUR ENVIRONMENTAL IMPACT</Text>
        <Text style={styles.enviroText}>
          By redirecting surplus meals to local receiving organizations, your contributions diverted food from landfills, preventing estimated methane decomposition emissions.
        </Text>
        <Text style={styles.disclaimerText}>
          ℹ️ Calculations based on global environmental conversion estimates (~0.4 kg food = 1 meal, 2.5 kg CO₂ avoided per kg food).
        </Text>
      </View>

      {/* Donor Achievement Badges */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionHeaderTag}>DONOR ACHIEVEMENT BADGES</Text>
        <View style={styles.badgeGrid}>
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
          ))}
        </View>
      </View>

      {/* Milestone Timeline */}
      <View style={styles.milestonesCard}>
        <Text style={styles.sectionHeaderTag}>MILESTONE TIMELINE</Text>
        <View style={styles.timelineList}>
          {milestones.map((m) => (
            <View key={m.id} style={styles.timelineRow}>
              <View style={[styles.timelineDot, m.done && styles.timelineDotDone]}>
                {m.done && <Ionicons name="checkmark" size={10} color={colors.white} />}
              </View>
              <View style={styles.timelineCol}>
                <Text style={[styles.timelineTitle, m.done && styles.timelineTitleDone]}>
                  {m.title}
                </Text>
                <Text style={styles.timelineSub}>{m.description}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowLeaderboard(true)}
          style={styles.actionBtn}
        >
          <Ionicons name="trophy-outline" size={16} color={colors.primary} />
          <Text style={styles.actionBtnText}>Leaderboards →</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setShowShareModal(true)}
          style={[styles.actionBtn, { backgroundColor: colors.primary }]}
        >
          <Ionicons name="share-social-outline" size={16} color={colors.white} />
          <Text style={[styles.actionBtnText, { color: colors.white }]}>Share Impact →</Text>
        </TouchableOpacity>
      </View>

      <ImpactShareModal
        visible={showShareModal}
        impactData={{
          foodRescuedKg: donorFoodRescuedKg || 128,
          mealsShared: donorMealsShared || 312,
          co2SavedKg: 320,
          userName: 'Royal Spice Palace',
        }}
        onClose={() => setShowShareModal(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
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
    color: colors.textSecondary,
    marginTop: 4,
  },
  streakBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF4EB',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  streakLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  streakEmoji: {
    fontSize: 26,
  },
  streakTitle: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  streakSub: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  streakBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  streakBadgeText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  levelCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  levelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  levelPill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  levelPillText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.white,
  },
  pointsVal: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.gold,
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.primary,
    borderRadius: 4,
  },
  progressSubText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 6,
    textAlign: 'right',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    width: '47%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  statVal: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 6,
  },
  statLabel: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  enviroCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  enviroText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 16,
  },
  badgesSection: {
    marginBottom: 16,
  },
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  milestonesCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  timelineList: {
    gap: 12,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  timelineDotDone: {
    backgroundColor: colors.primary,
  },
  timelineCol: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
  timelineTitleDone: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  timelineSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 14,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 6,
  },
  actionBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
