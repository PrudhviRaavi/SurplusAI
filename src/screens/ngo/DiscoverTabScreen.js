import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { UrgentFoodList } from '../../components/ngo/UrgentFoodList';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ngoApiService } from '../../services/api/ngoApiService';
import { socketClient } from '../../services/api/socketClient';

const filterPills = ['All Food', 'Cooked meals', 'Bakery', 'Fruits & Veg', 'Under 3 km'];

export const DiscoverTabScreen = ({ onSelectDonationToClaim }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All Food']);
  const [donations, setDonations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchLiveDonations = useCallback(async () => {
    try {
      const activeFilter = selectedFilter[0] || 'All Food';
      const params = {};

      if (activeFilter === 'Cooked meals') params.foodCategory = 'COOKED_MEALS';
      if (activeFilter === 'Bakery') params.foodCategory = 'BAKERY';
      if (activeFilter === 'Fruits & Veg') params.foodCategory = 'FRUITS_VEGETABLES';
      if (activeFilter === 'Under 3 km') params.radius = 3;

      const res = await ngoApiService.discoverDonations(params);
      const items = res?.donations || res?.data?.donations || (Array.isArray(res) ? res : []);
      setDonations(items);
    } catch (err) {
      console.warn('[DiscoverTabScreen] Fetch error:', err.message);
    } finally {
      setIsLoading(false);
    }
  }, [selectedFilter]);

  useEffect(() => {
    setIsLoading(true);
    fetchLiveDonations();

    // 10-second polling fallback
    const intervalId = setInterval(fetchLiveDonations, 10000);

    // Real-time socket updates
    const unsub = typeof socketClient?.onDonationChange === 'function'
      ? socketClient.onDonationChange(() => {
          fetchLiveDonations();
        })
      : null;

    return () => {
      clearInterval(intervalId);
      if (typeof unsub === 'function') unsub();
    };
  }, [fetchLiveDonations]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>REAL-TIME DISCOVERY</Text>
          <Text style={styles.mainTitle}>
            Discover Surplus <Text style={styles.italicSerif}>Food.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Explore live food rescue postings nearby and claim meals before expiration.
          </Text>
        </View>

        <MultiSelectPills
          options={filterPills}
          selectedValues={selectedFilter}
          onToggle={(val) => setSelectedFilter([val])}
        />

        {isLoading && donations.length === 0 ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator size="small" color={colors.primary} />
            <Text style={{ marginTop: 8, fontSize: 12, color: colors.textSecondary }}>
              Searching live surplus postings...
            </Text>
          </View>
        ) : (
          <UrgentFoodList
            donations={donations.length > 0 ? donations : undefined}
            onViewDonation={onSelectDonationToClaim}
          />
        )}

        <View style={styles.mapContainer}>
          <Text style={styles.sectionHeader}>SURPLUS MAP DISCOVERY</Text>
          <LocationPickerMap initialAddress="Jubilee Hills, Hyderabad" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 14,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 2,
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
  mapContainer: {
    marginTop: 8,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
});
