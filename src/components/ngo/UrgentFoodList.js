import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const urgentDonationsMock = [
  {
    id: 'u1',
    foodName: 'Vegetable Rice & Curry',
    quantity: '25 meals',
    distance: '1.8 km away',
    freshness: 'Good (Freshly Prepared)',
    timeLeft: '2h 15m remaining',
    donorName: 'Royal Spice Palace',
    urgency: 'HIGH URGENCY',
    icon: '🍱',
  },
  {
    id: 'u2',
    foodName: 'Fresh Baked Artisan Bread',
    quantity: '40 loaves',
    distance: '2.4 km away',
    freshness: 'Excellent',
    timeLeft: '4h 30m remaining',
    donorName: 'Artisan Bakery Hub',
    urgency: 'MEDIUM URGENCY',
    icon: '🥐',
  },
];

export const UrgentFoodList = ({ donations = urgentDonationsMock, onViewDonation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.sectionHeaderRow}>
        <View style={styles.headerTitleGroup}>
          <Text style={styles.sectionHeader}>FOOD AVAILABLE NEAR YOU</Text>
          <View style={styles.urgencyBadge}>
            <Text style={styles.urgencyBadgeText}>QUICK DISPATCH NEEDED</Text>
          </View>
        </View>
      </View>

      <View style={styles.list}>
        {donations.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.foodIconBubble}>
                <Text style={styles.foodEmoji}>{item.icon}</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.donorSub}>
                  From <Text style={styles.donorHighlight}>{item.donorName}</Text> · {item.distance}
                </Text>
              </View>

              <View style={styles.quantityTag}>
                <Text style={styles.quantityText}>{item.quantity}</Text>
              </View>
            </View>

            <View style={styles.metaDivider} />

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#10B981" />
                <Text style={styles.metaText}>{item.freshness}</Text>
              </View>

              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={colors.accent} />
                <Text style={[styles.metaText, { color: colors.accent, fontWeight: '700' }]}>
                  {item.timeLeft}
                </Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onViewDonation && onViewDonation(item)}
              style={styles.viewBtn}
            >
              <Text style={styles.viewBtnText}>View Donation →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeaderRow: {
    marginBottom: 10,
  },
  headerTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
  },
  urgencyBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  urgencyBadgeText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#DC2626',
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodIconBubble: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  foodEmoji: {
    fontSize: 22,
  },
  infoCol: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  donorSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  donorHighlight: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  quantityTag: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.15)',
  },
  quantityText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  metaDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  viewBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    alignItems: 'center',
  },
  viewBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
