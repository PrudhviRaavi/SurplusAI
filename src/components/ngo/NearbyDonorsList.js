import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const mockDonors = [
  {
    id: 'nd1',
    name: 'Green Leaf Restaurant',
    distance: '1.2 km away',
    typicalFood: 'Cooked meals & curries',
    verified: true,
    donationsCount: '48 donations',
  },
  {
    id: 'nd2',
    name: 'City Cafe & Bakery',
    distance: '2.4 km away',
    typicalFood: 'Bakery items & beverages',
    verified: true,
    donationsCount: '32 donations',
  },
];

export const NearbyDonorsList = ({ donors = mockDonors, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>NEARBY VERIFIED DONORS</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View all →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {donors.map((item) => (
          <View key={item.id} style={styles.donorCard}>
            <View style={styles.topRow}>
              <View style={styles.iconBubble}>
                <Ionicons name="restaurant-outline" size={20} color={colors.primary} />
              </View>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.donorName}>{item.name}</Text>
                  {item.verified && (
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                  )}
                </View>

                <Text style={styles.distanceText}>
                  {item.distance} · <Text style={styles.countText}>{item.donationsCount}</Text>
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.foodTypeRow}>
              <Text style={styles.typeLabel}>USUALLY DONATES:</Text>
              <Text style={styles.typeValue}>{item.typicalFood}</Text>
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
  donorCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  distanceText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  countText: {
    fontWeight: '600',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  foodTypeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  typeLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  typeValue: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
