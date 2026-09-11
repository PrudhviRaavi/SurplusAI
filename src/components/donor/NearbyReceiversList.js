import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const nearbyNgos = [
  {
    id: 'ngo1',
    name: 'Hope Community Kitchen',
    distance: '1.8 km away',
    accepted: 'Cooked meals · Bakery',
    capacity: '72 meals capacity',
    verified: true,
  },
  {
    id: 'ngo2',
    name: 'City Care Shelter Home',
    distance: '2.4 km away',
    accepted: 'Cooked meals · Packaged food',
    capacity: '120 meals capacity',
    verified: true,
  },
  {
    id: 'ngo3',
    name: 'St. Mary\'s Food Bank',
    distance: '3.1 km away',
    accepted: 'Fruits & veg · Bakery',
    capacity: '200+ meals capacity',
    verified: true,
  },
];

export const NearbyReceiversList = ({ receivers = nearbyNgos, onViewReceiver }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>ORGANIZATIONS NEAR YOU</Text>

      <View style={styles.list}>
        {receivers.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.headerRow}>
              <View style={styles.ngoInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.ngoName}>{item.name}</Text>
                  {item.verified && (
                    <Ionicons
                      name="checkmark-circle"
                      size={14}
                      color={colors.primary}
                      style={{ marginLeft: 4 }}
                    />
                  )}
                </View>
                <Text style={styles.distanceText}>{item.distance}</Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onViewReceiver && onViewReceiver(item)}
                style={styles.viewBtn}
              >
                <Text style={styles.viewBtnText}>View</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.divider} />

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>ACCEPTING</Text>
                <Text style={styles.detailValue}>{item.accepted}</Text>
              </View>

              <View style={styles.detailItem}>
                <Text style={styles.detailLabel}>DAILY CAPACITY</Text>
                <Text style={styles.detailValue}>{item.capacity}</Text>
              </View>
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
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ngoInfo: {
    flex: 1,
    paddingRight: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  distanceText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textSecondary,
    marginTop: 2,
  },
  viewBtn: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.15)',
  },
  viewBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
