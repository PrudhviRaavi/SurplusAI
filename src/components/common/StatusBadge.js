import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const StatusBadge = ({ status = 'PUBLISHED' }) => {
  const getStatusConfig = (st) => {
    switch (st) {
      case 'PUBLISHED':
        return { label: 'AVAILABLE', icon: 'sparkles', bg: 'rgba(201, 169, 110, 0.15)', text: colors.gold };
      case 'CLAIMED':
        return { label: 'CLAIMED', icon: 'heart', bg: '#EFF6FF', text: '#2563EB' };
      case 'VOLUNTEER_ASSIGNED':
        return { label: 'VOLUNTEER ASSIGNED', icon: 'person', bg: '#F5F3FF', text: '#7C3AED' };
      case 'VOLUNTEER_ACCEPTED':
        return { label: 'ACCEPTED', icon: 'checkmark-circle', bg: '#F0FDF4', text: '#16A34A' };
      case 'HEADING_TO_PICKUP':
        return { label: 'EN ROUTE TO PICKUP', icon: 'navigate', bg: '#FFFBEB', text: '#D97706' };
      case 'ARRIVED_AT_PICKUP':
        return { label: 'ARRIVED AT PICKUP', icon: 'location', bg: '#FEF3C7', text: '#B45309' };
      case 'FOOD_COLLECTED':
        return { label: 'FOOD COLLECTED', icon: 'cube', bg: '#ECFDF5', text: '#059669' };
      case 'HEADING_TO_DROPOFF':
        return { label: 'EN ROUTE TO DROPOFF', icon: 'bicycle', bg: '#F0F9FF', text: '#0284C7' };
      case 'ARRIVED_AT_DROPOFF':
        return { label: 'ARRIVED AT DROPOFF', icon: 'location', bg: '#E0F2FE', text: '#0369A1' };
      case 'DELIVERED':
        return { label: 'DELIVERED', icon: 'checkmark-done', bg: '#DCFCE7', text: '#15803D' };
      case 'COMPLETED':
        return { label: 'COMPLETED', icon: 'trophy', bg: '#D1FAE5', text: '#047857' };
      case 'CANCELLED':
        return { label: 'CANCELLED', icon: 'close-circle', bg: '#FEE2E2', text: '#DC2626' };
      default:
        return { label: st.replace(/_/g, ' '), icon: 'information-circle', bg: 'rgba(201, 169, 110, 0.15)', text: colors.gold };
    }
  };

  const config = getStatusConfig(status);

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Ionicons name={config.icon} size={11} color={config.text} />
      <Text style={[styles.badgeText, { color: config.text }]}>{config.label}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
    alignSelf: 'flex-start',
  },
  badgeText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
