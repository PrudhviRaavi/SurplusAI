import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const AdminKpiCard = ({ title, value, unit, change, iconName = 'analytics' }) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.iconCircle}>
          <Ionicons name={iconName} size={18} color={colors.primary} />
        </View>

        {change && (
          <View style={styles.changeBadge}>
            <Ionicons name="trending-up" size={12} color="#10B981" />
            <Text style={styles.changeText}>{change}</Text>
          </View>
        )}
      </View>

      <Text style={styles.valText}>
        {typeof value === 'number' ? value.toLocaleString() : value} {unit || ''}
      </Text>
      <Text style={styles.titleText}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    gap: 3,
  },
  changeText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  valText: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  titleText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
