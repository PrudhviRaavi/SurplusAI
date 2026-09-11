import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const InteractiveMapPreview = ({ onFullMapPress }) => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;
  const [activeFilter, setActiveFilter] = useState('All');

  const pins = [
    { id: '1', title: 'Grand Royal Hotel', type: 'Donor', meals: '180 Meals', top: '30%', left: '25%', color: colors.glowGreen },
    { id: '2', title: 'Hope Shelter NGO', type: 'NGO', distance: '1.2 km', top: '55%', left: '60%', color: colors.accent },
    { id: '3', title: 'City Supermarket', type: 'Donor', meals: '90 Meals', top: '70%', left: '35%', color: colors.secondary },
    { id: '4', title: 'St. Mary Kitchen', type: 'NGO', distance: '2.8 km', top: '25%', left: '75%', color: '#8B5CF6' },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.headerRow}>
        <View>
          <Text style={[styles.sectionSubtitle, { color: colors.glowGreen }]}>GEOSPATIAL REDISTRIBUTION</Text>
          <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Live AI Dispatch Map</Text>
        </View>

        <TouchableOpacity onPress={onFullMapPress} style={styles.expandButton}>
          <Text style={styles.expandText}>Expand Map</Text>
          <Ionicons name="expand-sharp" size={14} color={colors.glowGreen} />
        </TouchableOpacity>
      </View>

      {/* Map Filter Pills */}
      <View style={styles.filtersRow}>
        {['All', 'Donors', 'NGOs', 'Heatmap'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => setActiveFilter(filter)}
            style={[
              styles.filterPill,
              activeFilter === filter
                ? { backgroundColor: colors.primary, borderColor: colors.glowGreen }
                : { backgroundColor: themeColors.surfaceSubtle, borderColor: themeColors.border },
            ]}
          >
            <Text
              style={[
                styles.filterText,
                { color: activeFilter === filter ? colors.white : themeColors.textSecondary },
              ]}
            >
              {filter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Interactive Map Visual Box */}
      <View style={[styles.mapContainer, { borderColor: themeColors.border }]}>
        <LinearGradient
          colors={['#030712', '#0B1220', '#050816']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Grid Line Overlay Simulation */}
        <View style={styles.mapGridOverlay}>
          <View style={styles.gridHorizontalLine} />
          <View style={[styles.gridHorizontalLine, { top: '50%' }]} />
          <View style={styles.gridVerticalLine} />
          <View style={[styles.gridVerticalLine, { left: '50%' }]} />
        </View>

        {/* Simulated Connecting Route Arc Line */}
        <View style={styles.routeConnectorLine} />

        {/* Map Pins */}
        {pins.map((pin) => (
          <View key={pin.id} style={[styles.pinWrapper, { top: pin.top, left: pin.left }]}>
            <View style={[styles.pulseRing, { backgroundColor: `${pin.color}35` }]} />
            <View style={[styles.pinHead, { backgroundColor: pin.color }]}>
              <Ionicons
                name={pin.type === 'Donor' ? 'restaurant-sharp' : 'business-sharp'}
                size={12}
                color={colors.white}
              />
            </View>
            <View style={styles.pinTooltip}>
              <Text style={styles.pinTitle}>{pin.title}</Text>
              <Text style={styles.pinSub}>{pin.type === 'Donor' ? pin.meals : pin.distance}</Text>
            </View>
          </View>
        ))}

        {/* Live Dispatch Floating Badge */}
        <View style={styles.liveDispatchCard}>
          <Ionicons name="sparkles" size={14} color={colors.glowGreen} />
          <Text style={styles.liveDispatchText}>Optimal Route Active: ETA 6.4 mins</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingHorizontal: 20,
    marginVertical: 24,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
  },
  expandButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 10,
  },
  expandText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    color: colors.glowGreen,
  },
  filtersRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },
  filterPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  filterText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
  },
  mapContainer: {
    height: 240,
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    position: 'relative',
  },
  mapGridOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  gridHorizontalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '25%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  gridVerticalLine: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '25%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  routeConnectorLine: {
    position: 'absolute',
    top: '40%',
    left: '28%',
    width: '35%',
    height: 2,
    backgroundColor: colors.glowGreen,
    transform: [{ rotate: '25deg' }],
    opacity: 0.8,
  },
  pinWrapper: {
    position: 'absolute',
    alignItems: 'center',
  },
  pulseRing: {
    position: 'absolute',
    width: 24,
    height: 24,
    borderRadius: 12,
    top: -4,
  },
  pinHead: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justify: 'center',
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  pinTooltip: {
    backgroundColor: 'rgba(5, 8, 22, 0.9)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginTop: 2,
    alignItems: 'center',
  },
  pinTitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 9,
    color: colors.white,
  },
  pinSub: {
    fontFamily: fontFamily.caption,
    fontSize: 8,
    color: colors.glowGreen,
  },
  liveDispatchCard: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 6,
    backgroundColor: 'rgba(5, 8, 22, 0.85)',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
  },
  liveDispatchText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    color: colors.white,
  },
});
