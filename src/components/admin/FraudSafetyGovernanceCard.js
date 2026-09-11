import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const mockFlags = [
  {
    id: 'f1',
    title: 'Duplicate Listing Detected',
    reason: 'Identical image hash posted 2x within 5 mins.',
    severity: 'High Severity',
    status: 'Pending Audit',
    actionText: 'Audit Listing',
    sevColor: '#EF4444',
    bg: '#FEF2F2',
  },
  {
    id: 'f2',
    title: 'Temperature Expiry Warning',
    reason: 'Cooked meals left unclaimed for over 3.5 hours.',
    severity: 'Medium Severity',
    status: 'Safety Alert',
    actionText: 'Verify / Clear',
    sevColor: colors.gold,
    bg: 'rgba(201, 169, 110, 0.15)',
  },
  {
    id: 'f3',
    title: 'Unverified NGO Account Activity',
    reason: 'Multiple rapid claims without valid 80G tax document.',
    severity: 'Low Severity',
    status: 'Under Review',
    actionText: 'Review Profile',
    sevColor: colors.primary,
    bg: 'rgba(75, 99, 85, 0.08)',
  },
];

export const FraudSafetyGovernanceCard = ({ onActionPress }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="shield-alert-outline" size={18} color="#EF4444" />
          <Text style={styles.sectionHeader}>FRAUD & FOOD SAFETY GOVERNANCE</Text>
        </View>

        <Text style={styles.countText}>3 Pending Alerts</Text>
      </View>

      <Text style={styles.cardTitle}>Security & Quality Control</Text>

      <View style={styles.flagsList}>
        {mockFlags.map((item) => (
          <View key={item.id} style={styles.flagItem}>
            <View style={styles.topRow}>
              <View style={[styles.sevPill, { backgroundColor: item.bg }]}>
                <Text style={[styles.sevText, { color: item.sevColor }]}>
                  {item.severity}
                </Text>
              </View>

              <Text style={styles.statusText}>{item.status}</Text>
            </View>

            <Text style={styles.flagTitle}>{item.title}</Text>
            <Text style={styles.reasonText}>{item.reason}</Text>

            <View style={styles.divider} />

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onActionPress && onActionPress(item)}
              style={styles.actionBtn}
            >
              <Text style={styles.actionBtnText}>{item.actionText} →</Text>
            </TouchableOpacity>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#EF4444',
    letterSpacing: 1.0,
  },
  countText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 14,
  },
  flagsList: {
    gap: 12,
  },
  flagItem: {
    backgroundColor: '#FAF4EB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sevPill: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  sevText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
  },
  flagTitle: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  reasonText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  actionBtn: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  actionBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
