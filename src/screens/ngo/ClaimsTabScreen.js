import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { ActiveClaimsCard } from '../../components/ngo/ActiveClaimsCard';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ngoApiService } from '../../services/api/ngoApiService';

const defaultCompletedClaims = [
  {
    id: 'c1',
    foodName: 'Vegetable Biryani',
    quantity: '20 meals',
    donorName: 'Spice Garden',
    date: 'Yesterday, 6:00 PM',
    status: 'Distributed ✓',
  },
  {
    id: 'c2',
    foodName: 'Fresh Sandwich Platters',
    quantity: '15 meals',
    donorName: 'Metro Bistro Cafe',
    date: '2 days ago',
    status: 'Distributed ✓',
  },
];

export const ClaimsTabScreen = ({ onViewClaimDetails }) => {
  const { donationsList } = useAppStore();
  const [liveClaims, setLiveClaims] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchClaims = async () => {
      try {
        const res = await ngoApiService.getClaims();
        if (res?.data?.claims && isMounted) {
          setLiveClaims(res.data.claims);
        }
      } catch (err) {
        // Fallback to store on error
      }
    };
    fetchClaims();
    return () => { isMounted = false; };
  }, []);

  const activeClaimedItems = liveClaims.length > 0
    ? liveClaims
        .filter((c) => c.status === 'CONFIRMED' || c.status === 'REQUESTED')
        .map((c) => ({
          id: c.id || c._id,
          foodName: c.donation?.title || 'Claimed Food',
          quantity: `${c.requestedQuantity || c.donation?.quantity || 20} meals`,
          donorName: c.donation?.donorId?.fullName || 'Verified Food Donor',
          pickupStartTime: c.donation?.pickupStartTime ? new Date(c.donation.pickupStartTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '6:00 PM',
          status: 'CLAIMED',
        }))
    : donationsList.filter((item) => item.status === 'CLAIMED');

  const completedList = liveClaims.length > 0
    ? liveClaims
        .filter((c) => c.status === 'COMPLETED')
        .map((c) => ({
          id: c.id || c._id,
          foodName: c.donation?.title || 'Distributed Food',
          quantity: `${c.requestedQuantity || 20} meals`,
          donorName: c.donation?.donorId?.fullName || 'Verified Donor',
          date: new Date(c.createdAt || Date.now()).toLocaleDateString(),
          status: 'Distributed ✓',
        }))
    : [];

  const displayCompleted = completedList.length > 0 ? completedList : defaultCompletedClaims;

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>CLAIM TRACKING</Text>
          <Text style={styles.mainTitle}>
            Your Active <Text style={styles.italicSerif}>Claims.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Monitor incoming volunteer dispatches, received meals, and distribution history.
          </Text>
        </View>

        {/* Dynamic Active Claimed Cards */}
        {activeClaimedItems.map((item) => (
          <ActiveClaimsCard
            key={item.id}
            foodName={item.foodName}
            quantity={item.quantity}
            donorName={item.donorName || item.donorOrgName || 'Green Leaf Restaurant'}
            pickupTime={item.pickupStartTime || '6:00 PM'}
            status="CLAIMED"
            onPressDetails={onViewClaimDetails}
          />
        ))}

        {activeClaimedItems.length === 0 && (
          <ActiveClaimsCard onPressDetails={onViewClaimDetails} />
        )}

        {/* Completed History */}
        <Text style={styles.sectionHeader}>PAST RECEIVED DONATIONS</Text>
        <View style={styles.historyList}>
          {displayCompleted.map((item) => (
            <View key={item.id} style={styles.historyCard}>
              <View style={styles.iconBubble}>
                <Text style={styles.emoji}>🍱</Text>
              </View>

              <View style={styles.infoCol}>
                <Text style={styles.foodName}>{item.foodName}</Text>
                <Text style={styles.subText}>
                  From {item.donorName} · {item.quantity}
                </Text>
              </View>

              <View style={styles.statusBadge}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>
          ))}
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
    marginBottom: 16,
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
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
    marginTop: 8,
  },
  historyList: {
    gap: 10,
  },
  historyCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBubble: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  emoji: {
    fontSize: 20,
  },
  infoCol: {
    flex: 1,
  },
  foodName: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  subText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
});
