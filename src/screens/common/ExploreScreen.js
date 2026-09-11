import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const mockExploreDonations = [
  { id: '1', name: 'Vegetable Biryani', qty: '25 meals', donor: 'Green Leaf Restaurant', dist: '2.4 km', urgency: 'High' },
  { id: '2', name: 'Paneer Butter Masala', qty: '40 meals', donor: 'Spice Route Hotel', dist: '3.1 km', urgency: 'Normal' },
  { id: '3', name: 'Fresh Artisan Loaves', qty: '30 loaves', donor: 'Bakers Delight', dist: '1.8 km', urgency: 'High' },
];

export const ExploreScreen = ({ onSelectDonation }) => {
  const [viewMode, setViewMode] = useState('list'); // 'list' | 'map'
  const [filterChip, setFilterChip] = useState('Food'); // 'Food' | 'NGOs' | 'Nearby' | 'Urgent'

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="compass" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>FOOD & ORGANIZATIONS DISCOVERY</Text>
        </View>

        <Text style={styles.mainTitle}>
          Explore Surplus <Text style={styles.italicSerif}>Food.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Discover surplus food listings and nearby receiving organizations.
        </Text>
      </View>

      {/* Segmented View Mode Toggle: List vs Map */}
      <View style={styles.segmentedRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewMode('list')}
          style={[styles.segTab, viewMode === 'list' && styles.segTabActive]}
        >
          <Ionicons name="list-outline" size={16} color={viewMode === 'list' ? colors.white : colors.textSecondary} />
          <Text style={[styles.segText, viewMode === 'list' && styles.segTextActive]}>List View</Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setViewMode('map')}
          style={[styles.segTab, viewMode === 'map' && styles.segTabActive]}
        >
          <Ionicons name="map-outline" size={16} color={viewMode === 'map' ? colors.white : colors.textSecondary} />
          <Text style={[styles.segText, viewMode === 'map' && styles.segTextActive]}>Map View</Text>
        </TouchableOpacity>
      </View>

      {/* Filter Chips Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
        {['Food', 'NGOs', 'Nearby', 'Urgent'].map((chip) => (
          <TouchableOpacity
            key={chip}
            onPress={() => setFilterChip(chip)}
            style={[styles.chip, filterChip === chip && styles.chipActive]}
          >
            <Text style={[styles.chipText, filterChip === chip && styles.chipTextActive]}>{chip}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* RENDER MAP VS LIST */}
      {viewMode === 'map' ? (
        <View style={styles.mapFrame}>
          <LocationPickerMap initialAddress="Jubilee Hills, Hyderabad" />
        </View>
      ) : (
        <View style={styles.list}>
          {mockExploreDonations.map((d) => (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.8}
              onPress={() => onSelectDonation && onSelectDonation(d)}
              style={styles.card}
            >
              <View style={styles.cardTop}>
                <Text style={styles.foodTitle}>{d.name}</Text>
                <View style={styles.urgencyTag}>
                  <Text style={styles.urgencyText}>{d.urgency.toUpperCase()}</Text>
                </View>
              </View>

              <Text style={styles.subText}>{d.qty} · {d.donor} ({d.dist} away)</Text>
            </TouchableOpacity>
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
    paddingBottom: 110,
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
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
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
  chipsScroll: {
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  chipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  chipTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  mapFrame: {
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  urgencyTag: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  urgencyText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
});
