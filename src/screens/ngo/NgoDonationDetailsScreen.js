import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { ClaimConfirmationBottomSheet } from '../../components/ngo/ClaimConfirmationBottomSheet';
import { NgoClaimSuccessScreen } from './NgoClaimSuccessScreen';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { ngoApiService } from '../../services/api/ngoApiService';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

export const NgoDonationDetailsScreen = ({ donation, onBack, onCompleteClaimFlow }) => {
  const { claimDonation, confirmNgoReceipt, ngoCapacityUsed, ngoTotalCapacity, donationsList } =
    useAppStore();

  const [showConfirmSheet, setShowConfirmSheet] = useState(false);
  const [isClaimSuccess, setIsClaimSuccess] = useState(false);
  const [liveMatch, setLiveMatch] = useState(null);

  const defaultDonation = {
    id: 'DON-8842',
    donorName: 'Green Leaf Restaurant',
    donorType: 'Restaurant',
    donorVerified: true,
    foodName: 'Vegetable Biryani & Curry',
    category: 'Cooked meals',
    image: DEFAULT_FOOD_IMG,
    quantity: '25 meals',
    quantityNum: 25,
    preparationTime: 'Today, 3:30 PM',
    bestBefore: 'Today, 8:00 PM',
    storageCondition: 'Refrigerated',
    freshnessLabel: 'Good',
    freshnessScore: 94,
    aiConfidence: '94%',
    pickupAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    pickupWindow: '6:00 PM – 8:00 PM',
    distanceKm: 2.4,
    matchScore: 94,
    status: 'PUBLISHED',
    reasons: [
      'Matches your food requirements',
      '2.4 km away',
      'Within your capacity (72 meals space)',
      'Available during operating hours',
      'Compatible with your pickup radius',
    ],
  };

  const currentStoreItem = (donationsList || []).find((i) => i.id === (donation?.id || 'DON-8842')) || donation;

  const item = {
    ...defaultDonation,
    ...(currentStoreItem || {}),
  };

  useEffect(() => {
    const donationId = item?.id || item?._id;
    if (donationId && /^[0-9a-fA-F]{24}$/.test(donationId)) {
      ngoApiService.getMatchDetails(donationId)
        .then((res) => {
          if (res?.data) {
            setLiveMatch(res.data);
          }
        })
        .catch(() => {});
    }
  }, [item?.id, item?._id]);

  const availableCapacity = Math.max(0, ngoTotalCapacity - ngoCapacityUsed);
  const capacityAfter = Math.max(0, availableCapacity - (item.quantityNum || 25));

  const handleExecuteClaim = async (confirmedDonation) => {
    const donationId = confirmedDonation.id || confirmedDonation._id;
    try {
      if (donationId && /^[0-9a-fA-F]{24}$/.test(donationId)) {
        await ngoApiService.claimDonation(donationId, {
          requestedQuantity: confirmedDonation.quantityNum || confirmedDonation.quantity || 25,
        });
      }
    } catch (err) {
      if (err?.message?.includes('409') || err?.statusCode === 409) {
        Alert.alert('Claim Conflict', 'This donation was just claimed by another organization.');
        setShowConfirmSheet(false);
        return;
      }
    }
    claimDonation(confirmedDonation.id, { name: 'Hope Community Kitchen' });
    setShowConfirmSheet(false);
    setIsClaimSuccess(true);
  };

  const handleConfirmReceiptAction = () => {
    confirmNgoReceipt(item.id);
    if (onBack) onBack();
  };

  if (isClaimSuccess) {
    return (
      <NgoClaimSuccessScreen
        donation={item}
        onViewClaim={() => {
          if (onCompleteClaimFlow) onCompleteClaimFlow();
          else onBack();
        }}
        onBackToDashboard={onBack}
      />
    );
  }

  const statusStr = typeof item.status === 'string' && item.status ? item.status : 'PUBLISHED';
  const pickupAddressStr = typeof item.pickupAddress === 'string'
    ? item.pickupAddress
    : (item.pickupAddress?.address || '124 Luxury Boulevard, Jubilee Hills, Hyderabad');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>DONATION DETAILS</Text>

        <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="share-outline" size={20} color={colors.primary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Food Hero */}
        <View style={styles.heroFrame}>
          <Image
            source={{ uri: item.image || DEFAULT_FOOD_IMG }}
            style={styles.heroImg}
            resizeMode="cover"
          />
          <View style={styles.heroOverlay}>
            <View style={styles.statusPill}>
              <Ionicons name="sparkles" size={12} color={colors.gold} />
              <Text style={styles.statusText}>STATUS: {statusStr.replace(/_/g, ' ')}</Text>
            </View>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.foodTitle}>{item.foodName}</Text>
          <Text style={styles.foodQty}>{item.quantity} · {item.category}</Text>

          <View style={styles.freshnessTag}>
            <Ionicons name="leaf-outline" size={14} color="#10B981" />
            <Text style={styles.freshnessText}>
              Estimated freshness: <Text style={styles.boldText}>{item.freshnessLabel}</Text> (AI estimate)
            </Text>
          </View>
        </View>

        {/* 2. Donor Information Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>DONOR INFORMATION</Text>
          <View style={styles.donorRow}>
            <View style={styles.donorAvatar}>
              <Ionicons name="business" size={22} color={colors.primary} />
            </View>
            <View style={styles.donorCol}>
              <View style={styles.donorTitleRow}>
                <Text style={styles.donorName}>{item.donorName}</Text>
                {item.donorVerified && (
                  <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                )}
              </View>
              <Text style={styles.donorSub}>{item.donorType} · {item.distanceKm} km away</Text>
            </View>
          </View>
        </View>

        {/* 3. Food Telemetry & Storage Information */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>FOOD & STORAGE TELEMETRY</Text>

          <View style={styles.telemetryGrid}>
            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>PREPARATION TIME</Text>
              <Text style={styles.gridVal}>{item.preparationTime}</Text>
            </View>

            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>BEST BEFORE</Text>
              <Text style={[styles.gridVal, { color: colors.primary }]}>{item.bestBefore}</Text>
            </View>

            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>STORAGE CONDITION</Text>
              <Text style={styles.gridVal}>{item.storageCondition}</Text>
            </View>

            <View style={styles.gridBox}>
              <Text style={styles.gridLabel}>PICKUP WINDOW</Text>
              <Text style={styles.gridVal}>{item.pickupWindow}</Text>
            </View>
          </View>
        </View>

        {/* 4. AI Insights Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.cardHeaderTag}>FOODSHAREAI INSIGHTS</Text>
            <Text style={styles.confidenceText}>{item.aiConfidence || '94%'} Confidence</Text>
          </View>

          <View style={styles.aiInsightsRow}>
            <View style={styles.aiItem}>
              <Text style={styles.aiItemLabel}>Detected Food</Text>
              <Text style={styles.aiItemVal}>{item.foodName}</Text>
            </View>
            <View style={styles.aiItem}>
              <Text style={styles.aiItemLabel}>Freshness Score</Text>
              <Text style={[styles.aiItemVal, { color: '#10B981' }]}>{item.freshnessScore} / 100</Text>
            </View>
            <View style={styles.aiItem}>
              <Text style={styles.aiItemLabel}>Safe Window</Text>
              <Text style={styles.aiItemVal}>4–6 hours</Text>
            </View>
          </View>

          <Text style={styles.aiDisclaimer}>
            ℹ️ AI-generated estimates. Please verify food condition before accepting.
          </Text>
        </View>

        {/* 5. Pickup Location & Map Preview */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>PICKUP LOCATION</Text>
          <Text style={styles.addressText}>{pickupAddressStr}</Text>
          <LocationPickerMap initialAddress={pickupAddressStr} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Claim / Confirm Receipt Bar */}
      <View style={styles.bottomBar}>
        {item.status === 'DELIVERED' || item.status === 'FOOD_COLLECTED' ? (
          <LuxuryButton
            title="Confirm Receipt & Complete ✓"
            onPress={handleConfirmReceiptAction}
            variant="primary"
            size="large"
          />
        ) : item.status === 'PUBLISHED' ? (
          <LuxuryButton
            title="Claim This Donation →"
            onPress={() => setShowConfirmSheet(true)}
            variant="primary"
            size="large"
          />
        ) : (
          <View style={styles.statusBoxActive}>
            <Ionicons name="checkmark-circle" size={18} color="#10B981" />
            <Text style={styles.statusBoxText}>RESERVED & IN RESCUE PIPELINE</Text>
          </View>
        )}
      </View>

      {/* Claim Confirmation Bottom Sheet */}
      <ClaimConfirmationBottomSheet
        visible={showConfirmSheet}
        donation={item}
        currentCapacity={availableCapacity}
        totalCapacity={ngoTotalCapacity}
        onClose={() => setShowConfirmSheet(false)}
        onConfirmClaim={handleExecuteClaim}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  heroFrame: {
    height: 220,
    borderRadius: 26,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    marginBottom: 16,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    top: 14,
    left: 14,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 247, 235, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  statusText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  titleBlock: {
    marginBottom: 16,
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  foodQty: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  freshnessTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  freshnessText: {
    fontSize: 12,
    color: '#065F46',
  },
  boldText: {
    fontWeight: '800',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  donorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  donorCol: {
    flex: 1,
  },
  donorTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  donorName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  donorSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  telemetryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  gridBox: {
    width: '47%',
    backgroundColor: '#FAF4EB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  gridLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  gridVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  confidenceText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  aiInsightsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FAF4EB',
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  aiItem: {
    flex: 1,
  },
  aiItemLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
  },
  aiItemVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  aiDisclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 16,
  },
  addressText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
  statusBoxActive: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 14,
    borderRadius: 18,
    gap: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  statusBoxText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
});
