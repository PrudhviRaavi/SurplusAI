import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const ActiveDeliveryCard = ({
  pickupName = 'Green Leaf Restaurant',
  dropoffName = 'Hope Community Kitchen',
  quantity = '25 meals',
  etaText = 'ETA 12 min',
  statusText = 'Heading to pickup',
  onViewRoute,
}) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.activeTag}>
          <View style={styles.pulseDot} />
          <Text style={styles.activeTagText}>CURRENT DELIVERY</Text>
        </View>

        <Text style={styles.etaText}>{etaText}</Text>
      </View>

      <View style={styles.statusRow}>
        <Ionicons name="navigate-circle-sharp" size={20} color={colors.primary} />
        <Text style={styles.statusTitle}>{statusText}</Text>
      </View>

      {/* Pickup -> Drop-off summary */}
      <View style={styles.routeBox}>
        <View style={styles.routeItem}>
          <Text style={styles.label}>PICKUP</Text>
          <Text style={styles.value}>{pickupName}</Text>
        </View>

        <Ionicons name="arrow-forward" size={16} color={colors.textMuted} style={styles.arrowIcon} />

        <View style={styles.routeItem}>
          <Text style={styles.label}>DROP-OFF</Text>
          <Text style={styles.value}>{dropoffName}</Text>
        </View>
      </View>

      <View style={styles.bottomRow}>
        <View style={styles.foodPill}>
          <Text style={styles.foodEmoji}>🍱</Text>
          <Text style={styles.foodText}>{quantity}</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onViewRoute}
          style={styles.viewRouteBtn}
        >
          <Ionicons name="map-outline" size={16} color={colors.white} />
          <Text style={styles.viewRouteText}>View route</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FAF4EB',
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  activeTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  etaText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 14,
  },
  statusTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.surface,
    padding: 14,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  routeItem: {
    flex: 1,
  },
  arrowIcon: {
    marginHorizontal: 8,
  },
  label: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 6,
  },
  foodEmoji: {
    fontSize: 16,
  },
  foodText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  viewRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    gap: 6,
  },
  viewRouteText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
