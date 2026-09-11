import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SmartRouteCard = ({
  timeSavedText = 'Save approximately 6 minutes',
  distanceText = '2.1 km shortest path',
  onUseRoute,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.aiTag}>
          <Ionicons name="hardware-chip-outline" size={12} color={colors.gold} />
          <Text style={styles.aiTagText}>AI ROUTE OPTIMIZATION</Text>
        </View>

        <View style={styles.savedPill}>
          <Text style={styles.savedPillText}>OPTIMIZED</Text>
        </View>
      </View>

      <Text style={styles.titleHeader}>
        Intelligent <Text style={styles.italicSerif}>Dispatch Route.</Text>
      </Text>

      <Text style={styles.timeSavedHighlight}>{timeSavedText}</Text>
      <Text style={styles.subDetail}>Avoids peak traffic around Jubilee Hills Checkpost. ({distanceText})</Text>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onUseRoute}
        style={styles.useRouteBtn}
      >
        <Ionicons name="navigate-outline" size={16} color={colors.white} />
        <Text style={styles.useRouteText}>Use Optimized Route →</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
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
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  aiTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  savedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  savedPillText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  timeSavedHighlight: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 4,
  },
  subDetail: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
    marginBottom: 16,
  },
  useRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  useRouteText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
