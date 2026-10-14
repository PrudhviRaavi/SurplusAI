import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const MyTasksScreen = ({ onSelectTask }) => {
  const { donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Active'); // 'Active' | 'Upcoming' | 'Completed' | 'Cancelled'

  const volunteerTasks = donationsList.filter((d) => d.status !== 'PUBLISHED');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="bicycle" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>RESCUE DISPATCH HISTORY</Text>
        </View>

        <Text style={styles.mainTitle}>
          My Delivery <Text style={styles.italicSerif}>Tasks.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Track active rescue assignments, upcoming pickups, and completed deliveries.
        </Text>
      </View>

      {/* Segmented Filter Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
        {['Active', 'Upcoming', 'Completed', 'Cancelled'].map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Tasks List */}
      <View style={styles.list}>
        {volunteerTasks.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="bicycle-outline" size={32} color={colors.gold} />
            <Text style={styles.emptyTitle}>No {activeTab.toLowerCase()} tasks.</Text>
          </View>
        ) : (
          volunteerTasks.map((t) => (
            <TouchableOpacity
              key={t.id}
              activeOpacity={0.8}
              onPress={() => onSelectTask && onSelectTask(t)}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Text style={styles.foodTitle}>{t.foodName}</Text>
                <View style={styles.statusPill}>
                  <Text style={styles.statusText}>{(t?.status || 'ASSIGNED').replace(/_/g, ' ')}</Text>
                </View>
              </View>

              <Text style={styles.subText}>{t.quantity} · Pickup: {t.donorName}</Text>
              <Text style={styles.subText}>Drop-off: {t.claimedBy || 'Hope Community Kitchen'}</Text>
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
  tabsScroll: {
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
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
    marginTop: 2,
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
