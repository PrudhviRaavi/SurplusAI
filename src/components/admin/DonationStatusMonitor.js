import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const stages = [
  { label: 'Posted', count: 18, pct: 18, color: '#3B82F6' },
  { label: 'Matched', count: 32, pct: 32, color: colors.gold },
  { label: 'Claimed', count: 24, pct: 24, color: colors.primary },
  { label: 'Pickup', count: 16, pct: 16, color: colors.accent },
  { label: 'Delivered', count: 10, pct: 10, color: '#10B981' },
];

export const DonationStatusMonitor = () => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.sectionHeader}>DONATION LIFECYCLE DISTRIBUTION</Text>
      <Text style={styles.cardTitle}>Real-time Pipeline Telemetry</Text>

      {/* Multi-segmented Progress Bar */}
      <View style={styles.progressBarWrapper}>
        {stages.map((stage, idx) => (
          <View
            key={idx}
            style={[
              styles.progressSegment,
              { width: `${stage.pct}%`, backgroundColor: stage.color },
              idx === 0 && styles.firstSegment,
              idx === stages.length - 1 && styles.lastSegment,
            ]}
          />
        ))}
      </View>

      {/* Breakdown Legend */}
      <View style={styles.legendGrid}>
        {stages.map((stage, idx) => (
          <View key={idx} style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: stage.color }]} />
            <View style={styles.legendTextCol}>
              <Text style={styles.legendLabel}>{stage.label}</Text>
              <Text style={styles.legendValue}>{stage.count} ({stage.pct}%)</Text>
            </View>
          </View>
        ))}
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
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 2,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 16,
  },
  progressBarWrapper: {
    height: 14,
    borderRadius: 7,
    backgroundColor: 'rgba(107, 114, 128, 0.1)',
    flexDirection: 'row',
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressSegment: {
    height: '100%',
  },
  firstSegment: {
    borderTopLeftRadius: 7,
    borderBottomLeftRadius: 7,
  },
  lastSegment: {
    borderTopRightRadius: 7,
    borderBottomRightRadius: 7,
  },
  legendGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 8,
  },
  legendItem: {
    width: '30%',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  legendTextCol: {
    flex: 1,
  },
  legendLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
  },
  legendValue: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
});
