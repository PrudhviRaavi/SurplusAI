import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminKpiCard } from '../../components/admin/AdminKpiCard';
import { analyticsService } from '../../services/analytics/analyticsService';
import { adminApiService } from '../../services/api/adminApiService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminOverviewTab = () => {
  const [timeframe, setTimeframe] = useState('30 Days'); // 'Today' | '7 Days' | '30 Days' | 'All Time'
  const [kpis, setKpis] = useState(analyticsService.getKPIs('30 Days'));
  const [liveActivity, setLiveActivity] = useState(analyticsService.getLiveActivity());

  useEffect(() => {
    let isMounted = true;
    const fetchTelemetry = async () => {
      try {
        const liveKpis = await adminApiService.getOperationalKpis(timeframe);
        if (isMounted && liveKpis?.kpis) {
          setKpis((prev) => ({ ...prev, ...liveKpis.kpis }));
        }
      } catch (err) {
        // Gracefully preserve offline defaults
      }
    };

    fetchTelemetry();
    return () => {
      isMounted = false;
    };
  }, [timeframe]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <Text style={styles.greeting}>Good morning, Admin.</Text>
        <Text style={styles.subtitle}>Here's what's happening across FoodShareAI.</Text>
      </View>

      {/* Date Filter Segmented Bar */}
      <View style={styles.dateFilterRow}>
        {['Today', '7 Days', '30 Days', 'All Time'].map((tf) => (
          <TouchableOpacity
            key={tf}
            activeOpacity={0.8}
            onPress={() => setTimeframe(tf)}
            style={[styles.dateTab, timeframe === tf && styles.dateTabActive]}
          >
            <Text style={[styles.dateText, timeframe === tf && styles.dateTextActive]}>
              {tf}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Platform Status Cards */}
      <View style={styles.statusRow}>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>DONATIONS</Text>
          <Text style={[styles.statusVal, { color: '#10B981' }]}>Healthy</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>MATCHING</Text>
          <Text style={[styles.statusVal, { color: '#10B981' }]}>Operational</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>VOLUNTEERS</Text>
          <Text style={[styles.statusVal, { color: colors.gold }]}>Good</Text>
        </View>
        <View style={styles.statusCard}>
          <Text style={styles.statusLabel}>COMPLETION</Text>
          <Text style={[styles.statusVal, { color: colors.primary }]}>92%</Text>
        </View>
      </View>

      {/* KPI Grid */}
      <View style={styles.kpiGrid}>
        <AdminKpiCard
          title="Active Donations"
          value={kpis.activeDonations.value}
          change={kpis.activeDonations.change}
          iconName="fast-food-outline"
        />
        <AdminKpiCard
          title="Completed Donations"
          value={kpis.completedDonations.value}
          change={kpis.completedDonations.change}
          iconName="checkmark-done-circle-outline"
        />
        <AdminKpiCard
          title="Food Rescued"
          value={kpis.foodRescuedKg.value}
          unit={kpis.foodRescuedKg.unit}
          change={kpis.foodRescuedKg.change}
          iconName="scale-outline"
        />
        <AdminKpiCard
          title="Meals Redistributed"
          value={kpis.mealsRedistributed.value}
          unit={kpis.mealsRedistributed.unit}
          change={kpis.mealsRedistributed.change}
          iconName="heart-outline"
        />
        <AdminKpiCard
          title="Active NGOs"
          value={kpis.activeNgos.value}
          change={kpis.activeNgos.change}
          iconName="business-outline"
        />
        <AdminKpiCard
          title="Active Volunteers"
          value={kpis.activeVolunteers.value}
          change={kpis.activeVolunteers.change}
          iconName="bicycle-outline"
        />
      </View>

      {/* Live Platform Activity Feed */}
      <View style={styles.activityCard}>
        <View style={styles.activityHeader}>
          <Ionicons name="pulse" size={16} color={colors.primary} />
          <Text style={styles.activityHeaderTitle}>LIVE PLATFORM ACTIVITY FEED</Text>
        </View>

        <View style={styles.activityList}>
          {liveActivity.map((act) => (
            <View key={act.id} style={styles.activityRow}>
              <Text style={styles.activityTime}>{act.time}</Text>
              <View style={styles.activityDot} />
              <View style={styles.activityCol}>
                <Text style={styles.activityTitle}>{act.title}</Text>
                <Text style={styles.activitySub}>{act.description}</Text>
              </View>
            </View>
          ))}
        </View>
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
    marginBottom: 14,
  },
  greeting: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  dateFilterRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  dateTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
  },
  dateTabActive: {
    backgroundColor: colors.primary,
  },
  dateText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  dateTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  statusCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statusLabel: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  statusVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    marginTop: 2,
  },
  kpiGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  activityCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 6,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  activityHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  activityList: {
    gap: 12,
  },
  activityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  activityTime: {
    width: 65,
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
  },
  activityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
    marginTop: 4,
    marginRight: 10,
  },
  activityCol: {
    flex: 1,
  },
  activityTitle: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  activitySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
});
