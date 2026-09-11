import React, { useState, useEffect } from 'react';
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
import { volunteerApiService } from '../../services/api/volunteerApiService';

export const VolunteerImpactTabScreen = () => {
  const { volunteerDeliveries, volunteerMealsDelivered } = useAppStore();
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [liveImpact, setLiveImpact] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchImpact = async () => {
      try {
        const res = await volunteerApiService.getImpact();
        if (res?.data && isMounted) {
          setLiveImpact(res.data);
        }
      } catch (err) {
        // Fallback to local
      }
    };
    fetchImpact();
    return () => { isMounted = false; };
  }, []);

  const impactData = impactService.getImpact('Volunteer');
  const badges = impactService.getBadges('Volunteer');

  const effectiveDeliveries = liveImpact?.completedDeliveries ?? volunteerDeliveries ?? 15;
  const effectiveMeals = liveImpact?.mealsRescued ?? volunteerMealsDelivered ?? 209;
  const effectivePoints = liveImpact?.points ?? impactData.impactPoints;

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
          <Ionicons name="bicycle" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>VOLUNTEER DISPATCH TELEMETRY</Text>
        </View>

        <Text style={styles.mainTitle}>
          Every delivery <Text style={styles.italicSerif}>matters.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Tracking your food rescue missions, distance covered, and community impact.
        </Text>
      </View>

      {/* Impact Story Banner */}
      <View style={styles.storyCard}>
        <Ionicons name="heart" size={24} color={colors.gold} />
        <Text style={styles.storyText}>
          "You helped move {effectiveMeals} meals to people who needed them."
        </Text>
        <Text style={styles.storySub}>Community Rescue Hero · Hyderabad Network</Text>
      </View>

      {/* Level & Points Progress Bar */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>LEVEL 3: COMMUNITY BUILDER</Text>
          </View>
          <Text style={styles.pointsVal}>{effectivePoints} PTS</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '81%' }]} />
        </View>
        <Text style={styles.progressSubText}>1,620 / 2,000 pts to Impact Maker</Text>
      </View>

      {/* Core Telemetry Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="bicycle-outline" size={20} color={colors.primary} />
          <Text style={styles.statVal}>{effectiveDeliveries}</Text>
          <Text style={styles.statLabel}>Deliveries Completed</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="fast-food-outline" size={20} color="#10B981" />
          <Text style={styles.statVal}>{effectiveMeals}</Text>
          <Text style={styles.statLabel}>Meals Delivered</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="navigate-outline" size={20} color={colors.gold} />
          <Text style={styles.statVal}>46.2 km</Text>
          <Text style={styles.statLabel}>Distance Covered</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="time-outline" size={20} color={colors.accent} />
          <Text style={styles.statVal}>19 hrs</Text>
          <Text style={styles.statLabel}>Volunteer Hours</Text>
        </View>
      </View>

      {/* Volunteer Achievement Badges */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionHeaderTag}>VOLUNTEER RESCUE BADGES</Text>
        <View style={styles.badgeGrid}>
          {badges.map((b) => (
            <BadgeCard key={b.id} badge={b} />
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
          foodRescuedKg: 84,
          mealsShared: volunteerMealsDelivered || 209,
          co2SavedKg: 210,
          userName: 'Arjun Kumar',
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
  storyCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    marginBottom: 16,
    alignItems: 'center',
  },
  storyText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.white,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  storySub: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  levelCard: {
    backgroundColor: '#FAF4EB',
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
  badgesSection: {
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
  badgeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
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
