import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const MyDonationsScreen = ({ onSelectDonation }) => {
  const { donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Completed' | 'Cancelled'

  const filteredDonations = donationsList.filter((d) => {
    if (activeTab === 'Active') return d.status !== 'COMPLETED' && d.status !== 'CANCELLED';
    if (activeTab === 'Completed') return d.status === 'COMPLETED';
    return d.status === 'CANCELLED';
  });

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="receipt" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>DONATION HISTORY</Text>
        </View>

        <Text style={styles.mainTitle}>
          My Food <Text style={styles.italicSerif}>Donations.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Track active surplus listings, claimed dispatches, and completed rescue history.
        </Text>
      </View>

      {/* Segmented Filter Bar */}
      <View style={styles.segmentedRow}>
        {['Active', 'Completed', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab)}
            style={[styles.segTab, activeTab === tab && styles.segTabActive]}
          >
            <Text style={[styles.segText, activeTab === tab && styles.segTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* History List */}
      <View style={styles.list}>
        {filteredDonations.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="fast-food-outline" size={32} color={colors.gold} />
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} donations.</Text>
          </View>
        ) : (
          filteredDonations.map((d) => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.8}
              onPress={() => onSelectDonation && onSelectDonation(d)}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Text style={styles.foodTitle}>{d.foodName}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{(d?.status || 'PUBLISHED').replace(/_/g, ' ')}</Text>
                </View>
              </View>

              <Text style={styles.subText}>{d.quantity} · Pickup: {d.pickupWindow}</Text>
              <Text style={styles.receiverText}>
                Receiver: <Text style={styles.boldText}>{d.claimedBy || 'Unclaimed'}</Text>
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
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  segTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
  },
  segTabActive: {
    backgroundColor: colors.primary,
  },
  segText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segTextActive: {
    color: colors.white,
    fontWeight: '800',
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
  receiverText: {
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
