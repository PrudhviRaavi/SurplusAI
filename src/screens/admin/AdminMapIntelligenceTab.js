import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { mapAnalyticsService } from '../../services/map/mapAnalyticsService';
import { adminApiService } from '../../services/api/adminApiService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminMapIntelligenceTab = () => {
  const [activeLayers, setActiveLayers] = useState({
    Donors: true,
    NGOs: true,
    Volunteers: false,
    SurplusHotspots: true,
    DemandHotspots: false,
  });

  const [surplusHotspots, setSurplusHotspots] = useState(mapAnalyticsService.getSurplusHotspots());
  const [demandHotspots, setDemandHotspots] = useState(mapAnalyticsService.getDemandHotspots());

  useEffect(() => {
    let isMounted = true;
    const fetchMapIntelligence = async () => {
      try {
        const liveMap = await adminApiService.getMapIntelligence();
        if (isMounted) {
          if (liveMap?.surplusHotspots && liveMap.surplusHotspots.length > 0) {
            setSurplusHotspots(liveMap.surplusHotspots);
          }
          if (liveMap?.demandHotspots && liveMap.demandHotspots.length > 0) {
            setDemandHotspots(liveMap.demandHotspots);
          }
        }
      } catch (err) {
        // graceful offline fallback
      }
    };
    fetchMapIntelligence();
    return () => {
      isMounted = false;
    };
  }, []);

  const toggleLayer = (layerKey) => {
    setActiveLayers((prev) => ({ ...prev, [layerKey]: !prev[layerKey] }));
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="map" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>GEOGRAPHIC MAP INTELLIGENCE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Surplus & Demand <Text style={styles.italicSerif}>Hotspots.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Visualize donor density, NGO demand clusters, and active rescue dispatches.
        </Text>
      </View>

      {/* Layer Filter Toggles */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.layerScroll}
      >
        {Object.keys(activeLayers).map((key) => {
          const isEnabled = activeLayers[key];
          return (
            <TouchableOpacity
              key={key}
              activeOpacity={0.8}
              onPress={() => toggleLayer(key)}
              style={[styles.layerChip, isEnabled && styles.layerChipActive]}
            >
              <Ionicons
                name={isEnabled ? 'checkbox' : 'square-outline'}
                size={14}
                color={isEnabled ? colors.white : colors.textSecondary}
              />
              <Text style={[styles.layerText, isEnabled && styles.layerTextActive]}>
                {key.replace(/([A-Z])/g, ' $1').trim()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Interactive OpenStreetMap Canvas */}
      <View style={styles.mapContainer}>
        <LocationPickerMap initialAddress="Jubilee Hills, Hyderabad" />
        <View style={styles.mapLegendBox}>
          <Text style={styles.legendTitle}>ACTIVE MAP LAYERS</Text>
          <View style={styles.legendGrid}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: '#10B981' }]} />
              <Text style={styles.legendLabel}>Surplus Hotspots</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.gold }]} />
              <Text style={styles.legendLabel}>Demand Hotspots</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
              <Text style={styles.legendLabel}>Donors & NGOs</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Hotspots Summary Lists */}
      <View style={styles.hotspotsCard}>
        <Text style={styles.sectionHeaderTag}>SURPLUS FOOD HOTSPOTS</Text>
        {surplusHotspots.map((hs) => (
          <View key={hs.id} style={styles.spotRow}>
            <View style={styles.spotCol}>
              <Text style={styles.spotName}>{hs.name}</Text>
              <Text style={styles.spotSub}>{hs.count} active surplus listings</Text>
            </View>
            <View style={styles.intensityPill}>
              <Text style={styles.intensityText}>{hs.intensity.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.hotspotsCard}>
        <Text style={styles.sectionHeaderTag}>FOOD DEMAND HOTSPOTS</Text>
        {demandHotspots.map((dh) => (
          <View key={dh.id} style={styles.spotRow}>
            <View style={styles.spotCol}>
              <Text style={styles.spotName}>{dh.name}</Text>
              <Text style={styles.spotSub}>{dh.requiredMeals} meals required</Text>
            </View>
            <View style={[styles.intensityPill, { backgroundColor: 'rgba(217, 143, 92, 0.15)' }]}>
              <Text style={[styles.intensityText, { color: colors.accent }]}>{dh.demandLevel.toUpperCase()}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  layerScroll: {
    gap: 8,
    marginBottom: 14,
  },
  layerChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  layerChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  layerText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  layerTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  mapContainer: {
    marginBottom: 16,
  },
  mapLegendBox: {
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
  },
  legendTitle: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  legendGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendLabel: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  hotspotsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 14,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  spotRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  spotCol: {
    flex: 1,
  },
  spotName: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  spotSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  intensityPill: {
    backgroundColor: 'rgba(16, 185, 129, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  intensityText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
});
