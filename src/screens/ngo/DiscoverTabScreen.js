import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { UrgentFoodList } from '../../components/ngo/UrgentFoodList';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const filterPills = ['All Food', 'Cooked meals', 'Bakery', 'Fruits & Veg', 'Under 3 km'];

export const DiscoverTabScreen = ({ onSelectDonationToClaim }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All Food']);

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

        <UrgentFoodList onViewDonation={onSelectDonationToClaim} />

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
