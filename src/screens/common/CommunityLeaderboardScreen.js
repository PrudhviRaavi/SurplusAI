import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { impactService } from '../../services/impact/impactService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const CommunityLeaderboardScreen = ({ onBack }) => {
  const [activeCategory, setActiveCategory] = useState('Overall'); // 'Overall' | 'Donors' | 'NGOs' | 'Volunteers'
  const [activeTimeframe, setActiveTimeframe] = useState('Monthly'); // 'Weekly' | 'Monthly' | 'All Time'

  const leaderboardEntries = impactService.getLeaderboard(activeCategory, activeTimeframe);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>COMMUNITY LEADERBOARD</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Header */}
        <View style={styles.titleSection}>
          <View style={styles.badgeRow}>
            <Ionicons name="trophy" size={14} color={colors.gold} />
            <Text style={styles.badgeText}>PURPOSE-DRIVEN RANKINGS</Text>
          </View>

          <Text style={styles.mainTitle}>
            Community Impact <Text style={styles.italicSerif}>Leaders.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Recognizing top donors, receiving organizations, and volunteer rescue heroes.
          </Text>
        </View>

        {/* Category Segmented Control */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {['Overall', 'Donors', 'NGOs', 'Volunteers'].map((cat) => (
            <TouchableOpacity
              key={cat}
              activeOpacity={0.8}
              onPress={() => setActiveCategory(cat)}
              style={[styles.catTab, activeCategory === cat && styles.catTabActive]}
            >
              <Text style={[styles.catText, activeCategory === cat && styles.catTextActive]}>
                {cat}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Timeframe Filter Tabs */}
        <View style={styles.timeframeRow}>
          {['Weekly', 'Monthly', 'All Time'].map((tf) => (
            <TouchableOpacity
              key={tf}
              activeOpacity={0.8}
              onPress={() => setActiveTimeframe(tf)}
              style={[styles.tfTab, activeTimeframe === tf && styles.tfTabActive]}
            >
              <Text style={[styles.tfText, activeTimeframe === tf && styles.tfTextActive]}>
                {tf}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leaderboard List */}
        <View style={styles.leaderboardList}>
          {leaderboardEntries.map((entry) => (
            <View
              key={entry.rank}
              style={[styles.rankCard, entry.isCurrentUser && styles.currentUserRankCard]}
            >
              <View style={styles.rankBadgeCol}>
                <Text style={styles.rankNum}>#{entry.rank}</Text>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.entryName}>{entry.name}</Text>
                  {entry.isCurrentUser && (
                    <View style={styles.youPill}>
                      <Text style={styles.youText}>YOU</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.entrySub}>
                  {entry.role} · {entry.primaryMetric}
                </Text>
              </View>

              <View style={styles.pointsCol}>
                <Text style={styles.pointsVal}>{entry.points}</Text>
                <Text style={styles.pointsLabel}>PTS</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Sticky Bottom Bar with Current User Position */}
      <View style={styles.bottomBar}>
        <View style={styles.userRankInfoRow}>
          <View style={styles.userRankPill}>
            <Ionicons name="sparkles" size={12} color={colors.gold} />
            <Text style={styles.userRankPillText}>YOU'RE #5 THIS MONTH</Text>
          </View>
          <Text style={styles.distanceText}>120 pts away from #4</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
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
  categoryScroll: {
    gap: 8,
    marginBottom: 12,
  },
  catTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  catTabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  catText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  catTextActive: {
    color: colors.white,
  },
  timeframeRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  tfTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  tfTabActive: {
    backgroundColor: colors.surface,
  },
  tfText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tfTextActive: {
    color: colors.primary,
    fontWeight: '800',
  },
  leaderboardList: {
    gap: 10,
  },
  rankCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  currentUserRankCard: {
    borderColor: colors.gold,
    backgroundColor: '#FAF4EB',
  },
  rankBadgeCol: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNum: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  entryName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  youPill: {
    backgroundColor: colors.gold,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  youText: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.white,
  },
  entrySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  pointsCol: {
    alignItems: 'flex-end',
  },
  pointsVal: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.primary,
  },
  pointsLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  userRankInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userRankPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  userRankPillText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  distanceText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
