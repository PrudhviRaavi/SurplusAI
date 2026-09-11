import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ngoApiService } from '../../services/api/ngoApiService';

export const DiscoverFoodScreen = ({ onSelectDonation }) => {
  const { donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Recommended'); // 'Recommended' | 'Nearby' | 'Urgent' | 'New'
  const [apiDonations, setApiDonations] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const loadLiveDonations = async () => {
      try {
        let res;
        if (activeTab === 'Recommended') {
          res = await ngoApiService.getRecommendations({ limit: 10 });
          if (res?.data?.recommendations && isMounted) {
            const mapped = res.data.recommendations.map((item) => ({
              id: item.donation.id || item.donation._id,
              foodName: item.donation.title,
              quantity: `${item.donation.quantity} ${item.donation.quantityUnit?.toLowerCase() || ''}`,
              quantityNum: item.donation.quantity,
              donorName: item.donation.donor?.organizationName || 'Verified Donor',
              matchScore: item.matchScore,
              distanceKm: item.distanceKm,
              status: item.donation.status,
              image: item.donation.foodImage,
              rawDonation: item.donation,
            }));
            setApiDonations(mapped);
          }
        } else {
          res = await ngoApiService.discoverDonations({ limit: 10 });
          if (res?.data?.donations && isMounted) {
            const mapped = res.data.donations.map((d) => ({
              id: d.id || d._id,
              foodName: d.title,
              quantity: `${d.quantity} ${d.quantityUnit?.toLowerCase() || ''}`,
              quantityNum: d.quantity,
              donorName: d.donor?.organizationName || 'Verified Donor',
              matchScore: 92,
              distanceKm: d.distanceKm || 2.5,
              status: d.status,
              image: d.foodImage,
              rawDonation: d,
            }));
            setApiDonations(mapped);
          }
        }
      } catch (err) {
        // Fallback to store on error / offline
      }
    };
    loadLiveDonations();
    return () => { isMounted = false; };
  }, [activeTab]);

  const displayList = apiDonations.length > 0 ? apiDonations : donationsList;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>SMART NGO DISCOVERY ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Discover Surplus <Text style={styles.italicSerif}>Food.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Recommended surplus food listings matched specifically to your organization's needs.
        </Text>
      </View>

      {/* Segmented Filter Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScroll}>
        {['Recommended', 'Nearby', 'Urgent', 'New'].map((tab) => (
          <TouchableOpacity
            key={tab}
            activeOpacity={0.8}
            onPress={() => setActiveTab(tab)}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
          >
            <Text style={[styles.tabText, activeTab === tab && styles.tabTextActive]}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Donations List */}
      <View style={styles.list}>
        {displayList.map((d) => (
          <TouchableOpacity
            key={d.id}
            activeOpacity={0.8}
            onPress={() => onSelectDonation && onSelectDonation(d)}
            style={styles.card}
          >
            <View style={styles.cardTop}>
              <View style={styles.matchPill}>
                <Ionicons name="sparkles" size={12} color={colors.gold} />
                <Text style={styles.matchText}>{d.matchScore || 94}% MATCH</Text>
              </View>
              <Text style={styles.distText}>
                {d.distanceKm ? `${d.distanceKm} km away` : '2.4 km away'}
              </Text>
            </View>

            <Text style={styles.foodTitle}>{d.foodName}</Text>
            <Text style={styles.subText}>{d.quantity} · Donor: {d.donorName}</Text>
          </TouchableOpacity>
        ))}
      </View>
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
  tabsScroll: {
    gap: 8,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
    fontWeight: '800',
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
    marginBottom: 8,
  },
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 4,
  },
  matchText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  distText: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
