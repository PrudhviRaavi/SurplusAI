import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { RecentDonationsList } from '../../components/donor/RecentDonationsList';
import { ActiveDonationCard } from '../../components/donor/ActiveDonationCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { useAppStore } from '../../store/useAppStore';

const filterPills = ['All', 'Active', 'Matched', 'Delivered', 'Past'];

export const DonationsTabScreen = ({ onCreateDonationPress, onViewDonationDetails }) => {
  const { donationsList } = useAppStore();
  const [selectedFilter, setSelectedFilter] = useState(['All']);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title */}
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>DONATION ACTIVITY</Text>
          <Text style={styles.mainTitle}>
            Your Food <Text style={styles.italicSerif}>Donations.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Track real-time status of current pickups and historical redistribution impact.
          </Text>
        </View>

        {/* Filter Pills */}
        <MultiSelectPills
          options={filterPills}
          selectedValues={selectedFilter}
          onToggle={(val) => setSelectedFilter([val])}
        />

        {/* Active Donation Section */}
        <View style={styles.sectionMargin}>
          <Text style={styles.sectionHeader}>CURRENTLY IN DISPATCH</Text>
          <ActiveDonationCard onPressDetails={onViewDonationDetails} />
        </View>

        {/* Recent & Historical List */}
        <RecentDonationsList
          donations={donationsList.length > 0 ? donationsList : undefined}
          onViewAll={onViewDonationDetails}
        />
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
  sectionMargin: {
    marginTop: 16,
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
