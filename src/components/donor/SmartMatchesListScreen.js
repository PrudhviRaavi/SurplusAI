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

export const SmartMatchesListScreen = ({
  matchesResult,
  onSelectMatch,
  onKeepDonationOpen,
  onExpandSearch,
}) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'

  const matches = matchesResult?.matches || [];

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>RECOMMENDED RECEIVERS</Text>
        </View>

        <Text style={styles.mainTitle}>
          Ranked NGO <Text style={styles.italicSerif}>Matches.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Organizations ranked by matching score based on capacity, distance, and current needs.
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
            List View ({matches.length})
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
          <LocationPickerMap initialAddress="Hope Community Kitchen, Hyderabad" />
          <View style={styles.mapHintBox}>
            <Ionicons name="location-sharp" size={16} color={colors.primary} />
            <Text style={styles.mapHintText}>
              Top match pin highlighted. Tapping markers displays receiver details.
            </Text>
          </View>
        </View>
      ) : matches.length === 0 ? (
        /* EMPTY STATE */
        <View style={styles.emptyCard}>
          <Ionicons name="search-outline" size={32} color={colors.gold} />
          <Text style={styles.emptyTitle}>We couldn't find a strong match nearby.</Text>
          <Text style={styles.emptySub}>
            Your donation will remain active while our matching engine looks for a suitable receiver.
          </Text>

          <View style={styles.emptyActions}>
            <TouchableOpacity onPress={onExpandSearch} style={styles.expandBtn} activeOpacity={0.8}>
              <Text style={styles.expandBtnText}>Expand Search Area →</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onKeepDonationOpen} style={styles.keepBtn} activeOpacity={0.8}>
              <Text style={styles.keepBtnText}>Keep Donation Open</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* LIST VIEW RANKED MATCHES */
        <View style={styles.list}>
          {matches.map((item, idx) => (
            <View key={item.organizationId} style={styles.matchCard}>
              <View style={styles.cardTop}>
                <View style={styles.rankBadge}>
                  <Text style={styles.rankNum}>#{idx + 1}</Text>
                </View>

                <View style={styles.infoCol}>
                  <View style={styles.nameRow}>
                    <Text style={styles.orgName}>{item.name}</Text>
                    {item.isVerified && (
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                    )}
                  </View>

                  <Text style={styles.orgSub}>
                    {item.category} · {item.distanceKm} km away
                  </Text>
                </View>

                <View style={styles.scorePill}>
                  <Text style={styles.scoreText}>{item.matchScore}%</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <View style={styles.metaRow}>
                <Text style={styles.metaItem}>Space: <Text style={styles.metaVal}>{item.availableCapacity} meals</Text></Text>
                <Text style={styles.metaItem}>Demand: <Text style={[styles.metaVal, { color: colors.gold }]}>{item.demandLevel}</Text></Text>
              </View>

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onSelectMatch && onSelectMatch(item)}
                style={styles.viewDetailsBtn}
              >
                <Text style={styles.viewDetailsText}>View Recommendation →</Text>
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
  emptyActions: {
    gap: 10,
    width: '100%',
  },
  expandBtn: {
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
  },
  expandBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  keepBtn: {
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  keepBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  list: {
    gap: 12,
  },
  matchCard: {
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
  orgName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  orgSub: {
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
  viewDetailsBtn: {
    backgroundColor: '#FAF4EB',
    paddingVertical: 10,
    borderRadius: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  viewDetailsText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
