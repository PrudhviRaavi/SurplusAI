import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const MyClaimsScreen = ({ onSelectClaim }) => {
  const { donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Completed' | 'Cancelled'

  const claimedDonations = donationsList.filter((d) => d.status !== 'PUBLISHED');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="heart" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>CLAIMED DISPATCHES</Text>
        </View>

        <Text style={styles.mainTitle}>
          My Claimed <Text style={styles.italicSerif}>Food.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Track reserved food shipments, active volunteer deliveries, and receipt confirmations.
        </Text>
      </View>

      {/* History List */}
      <View style={styles.list}>
        {claimedDonations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="heart-outline" size={32} color={colors.gold} />
            <Text style={styles.emptyTitle}>No claimed donations yet.</Text>
          </View>
        ) : (
          claimedDonations.map((d) => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.8}
              onPress={() => onSelectClaim && onSelectClaim(d)}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Text style={styles.foodTitle}>{d.foodName}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{d.status.replace(/_/g, ' ')}</Text>
                </View>
              </View>

              <Text style={styles.subText}>{d.quantity} · Donor: {d.donorName}</Text>
              <Text style={styles.volText}>
                Assigned Volunteer: <Text style={styles.boldText}>{d.volunteerName || 'Searching...'}</Text>
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>
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
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
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
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  volText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  emptyTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
  },
});
