import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const historyMock = [
  {
    id: 'h1',
    foodName: 'Vegetable Biryani',
    pickup: 'Spice Garden',
    dropoff: 'Hope Community Kitchen',
    date: 'Yesterday, 3:15 PM',
    status: 'Completed ✓',
  },
  {
    id: 'h2',
    foodName: 'Artisanal Bakery Items',
    pickup: 'Artisan Bakery Hub',
    dropoff: 'City Care Shelter',
    date: '2 days ago',
    status: 'Completed ✓',
  },
];

export const VolunteerHistoryList = ({ history = historyMock, onViewAll }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>COMPLETED TASK HISTORY</Text>
        <TouchableOpacity onPress={onViewAll} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>View history →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.list}>
        {history.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.topRow}>
              <View style={styles.iconBubble}>
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.foodTitle}>{item.foodName}</Text>
                <Text style={styles.routeSub}>
                  {item.pickup} → {item.dropoff}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
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
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
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
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoCol: {
    flex: 1,
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  routeSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
});
