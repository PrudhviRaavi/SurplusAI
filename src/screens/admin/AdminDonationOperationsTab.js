import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { analyticsService } from '../../services/analytics/analyticsService';
import { adminApiService } from '../../services/api/adminApiService';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminDonationOperationsTab = () => {
  const { donationsList } = useAppStore();
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('All');
  const [logistics, setLogistics] = useState(analyticsService.getLogisticsMetrics());
  const [liveDonations, setLiveDonations] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchOperationsData = async () => {
      try {
        const [kpiRes, donRes] = await Promise.all([
          adminApiService.getOperationalKpis('30 Days'),
          adminApiService.getDonations({ limit: 50 }),
        ]);

        if (isMounted) {
          if (kpiRes?.logisticsMetrics) {
            setLogistics(kpiRes.logisticsMetrics);
          }
          if (donRes?.donations && donRes.donations.length > 0) {
            const mapped = donRes.donations.map((d) => ({
              id: d._id,
              foodName: d.title,
              quantity: `${d.quantity} ${d.quantityUnit}`,
              donorName: d.donorId?.fullName || 'Anonymous Donor',
              claimedBy: d.status === 'PUBLISHED' ? 'Unclaimed' : 'Claimed',
              status: d.status,
            }));
            setLiveDonations(mapped);
          }
        }
      } catch (err) {
        // graceful offline fallback
      }
    };

    fetchOperationsData();
    return () => {
      isMounted = false;
    };
  }, []);

  const activeDonationsSource = liveDonations || donationsList;
  const filteredDonations = activeDonationsSource.filter((item) => {
    if (selectedStatusFilter === 'All') return true;
    return item.status === selectedStatusFilter;
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="cog" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>LOGISTICS & OPERATIONS TELEMETRY</Text>
        </View>

        <Text style={styles.mainTitle}>
          Donation <Text style={styles.italicSerif}>Operations.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Monitoring matching latency, pickup speed, and pipeline completion rates.
        </Text>
      </View>

      {/* Logistics Speed Telemetry Cards */}
      <View style={styles.speedGrid}>
        <View style={styles.speedCard}>
          <Text style={styles.speedLabel}>AVG MATCH TIME</Text>
          <Text style={styles.speedVal}>{logistics.avgMatchTimeMinutes} min</Text>
        </View>

        <View style={styles.speedCard}>
          <Text style={styles.speedLabel}>AVG PICKUP TIME</Text>
          <Text style={styles.speedVal}>{logistics.avgPickupTimeMinutes} min</Text>
        </View>

        <View style={styles.speedCard}>
          <Text style={styles.speedLabel}>COMPLETION RATE</Text>
          <Text style={[styles.speedVal, { color: '#10B981' }]}>{logistics.completionRatePercent}%</Text>
        </View>
      </View>

      {/* Status Filter Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.filterScroll}
      >
        {['All', 'PUBLISHED', 'CLAIMED', 'VOLUNTEER_ASSIGNED', 'FOOD_COLLECTED', 'COMPLETED'].map((status) => (
          <TouchableOpacity
            key={status}
            activeOpacity={0.8}
            onPress={() => setSelectedStatusFilter(status)}
            style={[styles.filterChip, selectedStatusFilter === status && styles.filterChipActive]}
          >
            <Text style={[styles.filterText, selectedStatusFilter === status && styles.filterTextActive]}>
              {status.replace(/_/g, ' ')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Donations Pipeline List */}
      <View style={styles.tableCard}>
        <Text style={styles.sectionHeaderTag}>LIVE RESCUE PIPELINE ({filteredDonations.length})</Text>

        {filteredDonations.map((item) => (
          <View key={item.id} style={styles.donRow}>
            <View style={styles.donCol}>
              <Text style={styles.donFood}>{item.foodName} ({item.quantity})</Text>
              <Text style={styles.donSub}>
                Donor: {item.donorName} → Receiver: {item.claimedBy || 'Unclaimed'}
              </Text>
            </View>
            <View style={styles.statusPill}>
              <Text style={styles.statusText}>{(item.status || 'AVAILABLE').replace(/_/g, ' ')}</Text>
            </View>
          </View>
        ))}
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
  speedGrid: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  speedCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  speedLabel: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  speedVal: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  filterScroll: {
    gap: 8,
    marginBottom: 14,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  filterChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  filterText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  filterTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  donRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  donCol: {
    flex: 1,
  },
  donFood: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  donSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusPill: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
});
