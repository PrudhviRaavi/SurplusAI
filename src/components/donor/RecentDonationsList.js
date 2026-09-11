import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const defaultRecent = [
  {
    id: 'd1',
    foodName: 'Vegetable Biryani',
    quantity: '20 meals',
    time: 'Today, 2:30 PM',
    status: 'Delivered',
    icon: '🍲',
    statusColor: '#10B981',
  },
  {
    id: 'd2',
    foodName: 'Paneer Rice & Curry',
    quantity: '15 meals',
    time: 'Yesterday',
    status: 'Claimed',
    icon: '🍱',
    statusColor: colors.primary,
  },
  {
    id: 'd3',
    foodName: 'Artisanal Bakery Items',
    quantity: '30 items',
    time: '2 days ago',
    status: 'Completed',
    icon: '🥐',
    statusColor: '#10B981',
  },
];

export const RecentDonationsList = ({ donations = defaultRecent, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>YOUR RECENT DONATIONS</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View All →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {donations.map((item) => (
          <View key={item.id} style={styles.itemCard}>
            <View style={styles.iconBubble}>
              <Text style={styles.emoji}>{item.icon}</Text>
            </View>

            <View style={styles.infoCol}>
              <Text style={styles.foodName}>{item.foodName}</Text>
              <Text style={styles.timeSub}>
                {item.quantity} · {item.time}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                { backgroundColor: `${item.statusColor}12` },
              ]}
            >
              <Ionicons name="checkmark-circle" size={12} color={item.statusColor} />
              <Text style={[styles.statusText, { color: item.statusColor }]}>
                {item.status}
              </Text>
            </View>
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
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    gap: 10,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
});
