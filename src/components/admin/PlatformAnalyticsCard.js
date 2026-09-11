import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const chartBars = [
  { day: 'Mon', kg: 140, pct: 45 },
  { day: 'Tue', kg: 180, pct: 60 },
  { day: 'Wed', kg: 240, pct: 80 },
  { day: 'Thu', kg: 210, pct: 70 },
  { day: 'Fri', kg: 290, pct: 95 },
  { day: 'Sat', kg: 310, pct: 100 },
  { day: 'Sun', kg: 260, pct: 85 },
];

export const PlatformAnalyticsCard = () => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>PLATFORM ANALYTICS TELEMETRY</Text>
        <Text style={styles.periodText}>This Week</Text>
      </View>

      <Text style={styles.cardTitle}>Food Rescued Over Time (kg)</Text>

      {/* Visual Bar Chart */}
      <View style={styles.chartWrapper}>
        {chartBars.map((bar, idx) => (
          <View key={idx} style={styles.barCol}>
            <Text style={styles.barVal}>{bar.kg}</Text>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  { height: `${bar.pct}%` },
                  bar.pct === 100 && styles.barPeak,
                ]}
              />
            </View>
            <Text style={styles.barLabel}>{bar.day}</Text>
          </View>
        ))}
      </View>

      <View style={styles.summaryBar}>
        <View style={styles.sumBox}>
          <Text style={styles.sumLabel}>WEEKLY TOTAL</Text>
          <Text style={styles.sumVal}>1,630 kg</Text>
        </View>

        <View style={styles.sumBox}>
          <Text style={styles.sumLabel}>GROWTH RATE</Text>
          <Text style={[styles.sumVal, { color: '#10B981' }]}>+18.4% YoY</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 26,
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  periodText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  chartWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingBottom: 4,
    marginBottom: 16,
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    height: '100%',
    justifyContent: 'flex-end',
  },
  barVal: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 16,
    height: 100,
    backgroundColor: '#FAF4EB',
    borderRadius: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 8,
  },
  barPeak: {
    backgroundColor: colors.gold,
  },
  barLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textSecondary,
    marginTop: 6,
  },
  summaryBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF4EB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  sumBox: {
    flex: 1,
  },
  sumLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  sumVal: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
});
