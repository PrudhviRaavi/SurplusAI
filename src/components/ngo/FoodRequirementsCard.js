import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const defaultNeeds = [
  { category: 'Cooked meals', priority: 'High Priority', color: '#DC2626', bg: '#FEF2F2', icon: '🍲' },
  { category: 'Bakery items', priority: 'Medium Priority', color: colors.gold, bg: 'rgba(201, 169, 110, 0.15)', icon: '🥐' },
  { category: 'Fruits & Vegetables', priority: 'Low Priority', color: colors.textSecondary, bg: 'rgba(107, 114, 128, 0.1)', icon: '🥦' },
];

export const FoodRequirementsCard = ({ needs = defaultNeeds, onUpdateRequirements }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="list-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionHeader}>YOUR CURRENT NEEDS</Text>
        </View>

        <TouchableOpacity onPress={onUpdateRequirements} activeOpacity={0.7}>
          <Text style={styles.updateLink}>Update requirements →</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.needsList}>
        {needs.map((item, idx) => (
          <View key={idx} style={styles.needRow}>
            <Text style={styles.needIcon}>{item.icon}</Text>
            <Text style={styles.categoryName}>{item.category}</Text>

            <View style={[styles.priorityPill, { backgroundColor: item.bg }]}>
              <Text style={[styles.priorityText, { color: item.color }]}>
                {item.priority}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  updateLink: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  needsList: {
    gap: 10,
  },
  needRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  needIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  categoryName: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  priorityPill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  priorityText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
});
