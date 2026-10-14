import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const defaultTasks = [
  {
    id: 'vt1',
    pickupName: 'Green Leaf Restaurant',
    dropoffName: 'Hope Community Kitchen',
    distance: '2.4 km',
    quantity: '25 meals',
    estTime: '18 min',
    foodCategory: 'Cooked meals',
    icon: '🍱',
  },
  {
    id: 'vt2',
    pickupName: 'Artisan Bakery Hub',
    dropoffName: 'City Care Shelter Home',
    distance: '3.1 km',
    quantity: '40 loaves',
    estTime: '22 min',
    foodCategory: 'Bakery items',
    icon: '🥐',
  },
];

export const NearbyTasksList = ({ tasks = defaultTasks, onAcceptTask }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>OPPORTUNITIES NEAR YOU</Text>

      <View style={styles.list}>
        {tasks.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.badgePill}>
                <Ionicons name="location-outline" size={12} color={colors.primary} />
                <Text style={styles.badgeText}>PICKUP & DELIVERY</Text>
              </View>

              <Text style={styles.estTimeText}>{item.estTime} est.</Text>
            </View>

            {/* Pickup -> Drop-off Route visual */}
            <View style={styles.routeContainer}>
              <View style={styles.routeLineBox}>
                <View style={styles.startDot} />
                <View style={styles.dashedConnector} />
                <Ionicons name="location-sharp" size={14} color={colors.accent} />
              </View>

              <View style={styles.addressCol}>
                <View style={styles.addressRow}>
                  <Text style={styles.addressLabel}>PICKUP: </Text>
                  <Text style={styles.addressName}>{item.pickupName}</Text>
                </View>

                <View style={[styles.addressRow, { marginTop: 10 }]}>
                  <Text style={styles.addressLabel}>DROP-OFF: </Text>
                  <Text style={styles.addressName}>{item.dropoffName}</Text>
                </View>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.bottomMetaRow}>
              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>DISTANCE</Text>
                <Text style={styles.metaValue}>{item.distance}</Text>
              </View>

              <View style={styles.metaBox}>
                <Text style={styles.metaLabel}>FOOD QUANTITY</Text>
                <Text style={styles.metaValue}>{item.quantity}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onAcceptTask && onAcceptTask(item)}
                style={styles.acceptBtn}
              >
                <Text style={styles.acceptBtnText}>Accept task →</Text>
              </TouchableOpacity>
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
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.6,
  },
  estTimeText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.gold,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  routeLineBox: {
    alignItems: 'center',
    marginRight: 12,
    height: 48,
    justifyContent: 'space-between',
  },
  startDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
  },
  dashedConnector: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  addressCol: {
    flex: 1,
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  addressName: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginBottom: 12,
  },
  bottomMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaBox: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  metaValue: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
  },
  acceptBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  acceptBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
