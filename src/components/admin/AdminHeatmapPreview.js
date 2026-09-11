import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LocationPickerMap } from '../common/LocationPickerMap';
import { colors } from '../../theme/colors';

export const AdminHeatmapPreview = ({ onExploreHeatmap }) => {
  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionHeader}>GEOGRAPHIC ACTIVITY HEATMAP</Text>
        <TouchableOpacity onPress={onExploreHeatmap} activeOpacity={0.7}>
          <Text style={styles.exploreText}>Explore full map →</Text>
        </TouchableOpacity>
      </View>

      <LocationPickerMap initialAddress="Hyderabad Ecosystem Hub" />

      {/* Heatmap Legend */}
      <View style={styles.legendBar}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
          <Text style={styles.label}>Donation Hotspots</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.gold }]} />
          <Text style={styles.label}>Demand Zones</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: colors.primary }]} />
          <Text style={styles.label}>Volunteer Density</Text>
        </View>
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
  exploreText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  legendBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
});
