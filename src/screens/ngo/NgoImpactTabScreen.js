import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BadgeCard } from '../../components/impact/BadgeCard';
import { ImpactShareModal } from '../../components/impact/ImpactShareModal';
import { CommunityLeaderboardScreen } from '../common/CommunityLeaderboardScreen';
import { impactService } from '../../services/impact/impactService';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const NgoImpactTabScreen = () => {
  const { ngoMealsReceived, ngoPeopleServed } = useAppStore();
  const [periodFilter, setPeriodFilter] = useState('This month'); // 'This week' | 'This month' | 'All time'
  const [showShareModal, setShowShareModal] = useState(false);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  const impactData = impactService.getImpact('NGO');
  const badges = impactService.getBadges('NGO');

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
          <Ionicons name="heart" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>COMMUNITY FEEDING TELEMETRY</Text>
        </View>

        <Text style={styles.mainTitle}>
          Feeding <Text style={styles.italicSerif}>Communities.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Tracking meals received, families nourished, and food diverted from waste.
        </Text>
      </View>

      {/* Period Filter Segmented Control */}
      <View style={styles.periodRow}>
        {['This week', 'This month', 'All time'].map((period) => (
          <TouchableOpacity
            key={period}
            activeOpacity={0.8}
            onPress={() => setPeriodFilter(period)}
            style={[styles.periodTab, periodFilter === period && styles.periodTabActive]}
          >
            <Text style={[styles.periodText, periodFilter === period && styles.periodTextActive]}>
              {period}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Core Impact Telemetry Grid */}
      <View style={styles.statsGrid}>
        <View style={styles.statCard}>
          <Ionicons name="fast-food" size={20} color={colors.primary} />
          <Text style={styles.statVal}>{ngoMealsReceived || 1240}</Text>
          <Text style={styles.statLabel}>Meals Received</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="people" size={20} color={colors.gold} />
          <Text style={styles.statVal}>{ngoPeopleServed || 864}</Text>
          <Text style={styles.statLabel}>People Served</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="scale" size={20} color="#10B981" />
          <Text style={styles.statVal}>420 kg</Text>
          <Text style={styles.statLabel}>Food Rescued</Text>
        </View>

        <View style={styles.statCard}>
          <Ionicons name="business" size={20} color={colors.accent} />
          <Text style={styles.statVal}>32</Text>
          <Text style={styles.statLabel}>Donors Connected</Text>
        </View>
      </View>

      {/* Gamification Level & Points Banner */}
      <View style={styles.levelCard}>
        <View style={styles.levelHeader}>
          <View style={styles.levelPill}>
            <Text style={styles.levelPillText}>LEVEL 4: IMPACT MAKER</Text>
          </View>
          <Text style={styles.pointsVal}>{impactData.impactPoints} PTS</Text>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[styles.progressBarFill, { width: '82%' }]} />
        </View>
        <Text style={styles.progressSubText}>2,450 / 2,500 pts to Food Rescue Champion</Text>
      </View>

      {/* Category Breakdown */}
      <View style={styles.categoryCard}>
        <Text style={styles.sectionHeaderTag}>RESCUED FOOD CATEGORY BREAKDOWN</Text>

        <View style={styles.catRow}>
          <Text style={styles.catLabel}>Cooked Meals</Text>
          <Text style={styles.catVal}>65% (806 meals)</Text>
        </View>
        <View style={styles.catRow}>
          <Text style={styles.catLabel}>Bakery Items</Text>
          <Text style={styles.catVal}>20% (248 meals)</Text>
        </View>
        <View style={styles.catRow}>
          <Text style={styles.catLabel}>Fruits & Produce</Text>
          <Text style={styles.catVal}>15% (186 meals)</Text>
        </View>
      </View>

      {/* NGO Achievement Badges */}
      <View style={styles.badgesSection}>
        <Text style={styles.sectionHeaderTag}>NGO PARTNER BADGES</Text>
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
          foodRescuedKg: 420,
          mealsShared: ngoMealsReceived || 1240,
          co2SavedKg: 425,
          userName: 'Hope Community Kitchen',
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
  periodRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  periodTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  periodTabActive: {
    backgroundColor: colors.primary,
  },
  periodText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  periodTextActive: {
    color: colors.white,
    fontWeight: '800',
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
  categoryCard: {
    backgroundColor: colors.surface,
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
    marginBottom: 12,
  },
  catRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  catLabel: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  catVal: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  badgesSection: {
    marginBottom: 16,
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
