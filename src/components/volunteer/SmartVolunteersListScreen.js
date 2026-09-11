import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerMap } from '../common/LocationPickerMap';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SmartVolunteersListScreen = ({
  matchingResult,
  onSelectVolunteer,
  onKeepWaiting,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const volunteers = matchingResult?.volunteers || [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>MATCHED VOLUNTEERS</Text>
        </View>

        <Text style={styles.mainTitle}>
          Ranked Candidate <Text style={styles.italicSerif}>Volunteers.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Volunteers ranked by travel proximity, transportation suitability, and availability.
        </Text>
      </View>

      {/* Segmented View Mode Toggle: List vs Map */}
      <View style={styles.segmentedRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewMode('list')}
          style={[styles.segTab, viewMode === 'list' && styles.segTabActive]}
        >
          <Ionicons
            name="list-outline"
            size={16}
            color={viewMode === 'list' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.segText,
              viewMode === 'list' && styles.segTextActive,
            ]}
          >
            List View ({volunteers.length})
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewMode('map')}
          style={[styles.segTab, viewMode === 'map' && styles.segTabActive]}
        >
          <Ionicons
            name="map-outline"
            size={16}
            color={viewMode === 'map' ? colors.white : colors.textSecondary}
          />
          <Text
            style={[
              styles.segText,
              viewMode === 'map' && styles.segTextActive,
            ]}
          >
            Map View
          </Text>
        </TouchableOpacity>
      </View>

      {/* MAP VIEW RENDER */}
      {viewMode === 'map' ? (
        <View style={styles.mapContainer}>
          <LocationPickerMap initialAddress="Jubilee Hills, Hyderabad" />
          <View style={styles.mapHintBox}>
            <Ionicons name="location-sharp" size={16} color={colors.primary} />
            <Text style={styles.mapHintText}>
              Top volunteer markers relative to donor pickup and NGO drop-off.
            </Text>
          </View>
        </View>
      ) : volunteers.length === 0 ? (
        /* EMPTY STATE */
        <View style={styles.emptyCard}>
          <Ionicons name="bicycle-outline" size={32} color={colors.gold} />
          <Text style={styles.emptyTitle}>No suitable volunteers nearby.</Text>
          <Text style={styles.emptySub}>
            We'll keep looking for an available volunteer to pick up this donation.
          </Text>

          <TouchableOpacity onPress={onKeepWaiting} style={styles.keepBtn} activeOpacity={0.8}>
            <Text style={styles.keepBtnText}>Keep Waiting & Back to Dashboard</Text>
          </TouchableOpacity>
        </View>
      ) : (
        /* LIST VIEW RANKED VOLUNTEERS */
        <View style={styles.list}>
          {volunteers.map((vol, idx) => (
            <View key={vol.volunteerId} style={styles.volCard}>
              <View style={styles.cardTop}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNum}>#{idx + 1}</Text>
                </View>

                <View style={styles.infoCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.volName}>{vol.name}</Text>
                    {vol.isVerified && (
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                    )}
                  </View>

                  <Text style={styles.volSub}>
                    {vol.transportIcon || '🛵'} {vol.transportation} · {vol.distanceToPickupKm} km to pickup
                  </Text>
                </View>

                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>{vol.matchScore}%</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>Availability: <Text style={styles.metaVal}>{vol.availabilityWindow}</Text></Text>
                <Text style={styles.metaItem}>Reliability: <Text style={[styles.metaVal, { color: '#10B981' }]}>{vol.completionRate}</Text></Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectVolunteer && onSelectVolunteer(vol)}
                style={styles.assignBtn}
              >
                <Text style={styles.assignBtnText}>Assign {vol.name} →</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
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
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 16,
  },
  segTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    gap: 6,
  },
  segTabActive: {
    backgroundColor: colors.primary,
  },
  segText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  mapContainer: {
    marginBottom: 20,
  },
  mapHintBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginTop: 8,
    gap: 6,
  },
  mapHintText: {
    fontSize: 12,
    color: colors.textSecondary,
    flex: 1,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    marginBottom: 16,
  },
  keepBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 14,
    alignItems: 'center',
  },
  keepBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  list: {
    gap: 12,
  },
  volCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rankNum: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  volSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  scorePill: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  scoreText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.white,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  metaItem: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  metaVal: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  assignBtn: {
    backgroundColor: '#FAF4EB',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  assignBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
