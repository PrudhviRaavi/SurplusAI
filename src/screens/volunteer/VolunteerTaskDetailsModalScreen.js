import React, { useState } from 'react';
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
import { VolunteerTaskAcceptBottomSheet } from '../../components/volunteer/VolunteerTaskAcceptBottomSheet';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { volunteerApiService } from '../../services/api/volunteerApiService';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

export const VolunteerTaskDetailsModalScreen = ({
  donation,
  onClose,
  onAcceptTaskComplete,
}) => {
  const [showAcceptSheet, setShowAcceptSheet] = useState(false);
  const [isAccepted, setIsAccepted] = useState(false);

  const item = donation || {
    id: 'DON-8842',
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    donorAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    ngoName: 'Hope Community Kitchen',
    ngoAddress: 'Hope Foundation, Koti, Hyderabad',
    pickupWindow: '6:00 PM – 8:00 PM',
    distanceToPickupKm: 1.8,
    totalDistanceKm: 4.2,
    image: DEFAULT_FOOD_IMG,
    notes: 'Packaged in individual hygienic foil boxes. Handle thermal bag carefully.',
    freshnessLabel: 'Good (AI estimate)',
    status: 'VOLUNTEER_ASSIGNED',
  };

  const handleConfirmAcceptance = async (confirmedTask) => {
    const taskId = confirmedTask?.id || confirmedTask?._id || item?.id;
    if (taskId && /^[0-9a-fA-F]{24}$/.test(taskId)) {
      try {
        await volunteerApiService.acceptTask(taskId);
      } catch (err) {
        if (err?.message?.includes('409') || err?.statusCode === 409) {
          Alert.alert('Task Unavailable', 'This task was already accepted by another volunteer.');
          setShowAcceptSheet(false);
          return;
        }
      }
    }
    setShowAcceptSheet(false);
    setIsAccepted(true);
    setTimeout(() => {
      if (onAcceptTaskComplete) onAcceptTaskComplete(confirmedTask);
    }, 800);
  };

  if (isAccepted) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor={colors.background} />
        <View style={styles.acceptedContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-sharp" size={48} color={colors.white} />
          </View>
          <Text style={styles.acceptedTitle}>You're on the way! 🎉</Text>
          <Text style={styles.acceptedSub}>
            This delivery has been added to your active tasks. Status updated to <Text style={styles.boldText}>Ready for pickup</Text>.
          </Text>

          <LuxuryButton
            title="View Delivery →"
            onPress={() => {
              if (onAcceptTaskComplete) onAcceptTaskComplete(item);
              else onClose();
            }}
            variant="primary"
            size="large"
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>DELIVERY OPPORTUNITY</Text>

        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Food Hero */}
        <View style={styles.heroFrame}>
          <Image source={{ uri: item.image || DEFAULT_FOOD_IMG }} style={styles.heroImg} resizeMode="cover" />
          <View style={styles.heroOverlay}>
            <View style={styles.matchPill}>
              <Ionicons name="sparkles" size={12} color={colors.gold} />
              <Text style={styles.matchText}>94% MATCH FOR YOU</Text>
            </View>
          </View>
        </View>

        <View style={styles.titleBlock}>
          <Text style={styles.foodTitle}>{item.foodName}</Text>
          <Text style={styles.foodQty}>{item.quantity} · Fresh Cooked Meals</Text>

          <View style={styles.freshnessTag}>
            <Ionicons name="leaf-outline" size={14} color="#10B981" />
            <Text style={styles.freshnessText}>{item.freshnessLabel}</Text>
          </View>
        </View>

        {/* Pickup & Dropoff Route Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>RESCUE ROUTE TELEMETRY</Text>

          <View style={styles.routeBox}>
            <View style={styles.routeRow}>
              <View style={styles.iconCircleGreen}>
                <Ionicons name="restaurant-outline" size={16} color="#10B981" />
              </View>
              <View style={styles.routeCol}>
                <Text style={styles.routeRole}>PICKUP (DONOR)</Text>
                <Text style={styles.routeName}>{item.donorName}</Text>
                <Text style={styles.routeAddr}>{item.donorAddress}</Text>
              </View>
            </View>

            <View style={styles.connectorLine} />

            <View style={styles.routeRow}>
              <View style={styles.iconCircleGold}>
                <Ionicons name="heart-outline" size={16} color={colors.gold} />
              </View>
              <View style={styles.routeCol}>
                <Text style={styles.routeRole}>DROP-OFF (NGO RECEIVER)</Text>
                <Text style={styles.routeName}>{item.ngoName}</Text>
                <Text style={styles.routeAddr}>{item.ngoAddress}</Text>
              </View>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>DISTANCE TO PICKUP</Text>
              <Text style={styles.metaVal}>{item.distanceToPickupKm} km</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>TOTAL ROUTE</Text>
              <Text style={styles.metaVal}>{item.totalDistanceKm} km</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>PICKUP WINDOW</Text>
              <Text style={styles.metaVal}>{item.pickupWindow}</Text>
            </View>
          </View>
        </View>

        {/* Special Instructions & Food Safety Notes */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>SPECIAL INSTRUCTIONS & SAFETY</Text>
          <Text style={styles.notesText}>ℹ️ {item.notes}</Text>
          <Text style={styles.disclaimerText}>
            AI-generated estimates. Always inspect food condition and container seal during pickup.
          </Text>
        </View>

        {/* OpenStreetMap Route Preview */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>ROUTE MAP PREVIEW</Text>
          <LocationPickerMap initialAddress={item.donorAddress} />
        </View>
      </ScrollView>

      {/* Sticky Bottom Actions */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title="Accept Task →"
          onPress={() => setShowAcceptSheet(true)}
          variant="primary"
          size="large"
          style={{ marginBottom: 8 }}
        />
        <TouchableOpacity onPress={onClose} style={styles.declineBtn}>
          <Text style={styles.declineText}>Decline Opportunity</Text>
        </TouchableOpacity>
      </View>

      {/* Acceptance Bottom Sheet */}
      <VolunteerTaskAcceptBottomSheet
        visible={showAcceptSheet}
        task={item}
        onClose={() => setShowAcceptSheet(false)}
        onConfirmAccept={handleConfirmAcceptance}
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
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    height: 200,
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
  matchPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(254, 247, 235, 0.92)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  matchText: {
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
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    alignSelf: 'flex-start',
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  freshnessText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#065F46',
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
    marginBottom: 12,
  },
  routeBox: {
    gap: 10,
  },
  routeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  iconCircleGreen: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleGold: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectorLine: {
    width: 2,
    height: 16,
    backgroundColor: colors.border,
    marginLeft: 17,
  },
  routeCol: {
    flex: 1,
  },
  routeRole: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  routeName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeAddr: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 1,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 14,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaBox: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  metaVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  notesText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 18,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 16,
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
  declineBtn: {
    alignItems: 'center',
    paddingVertical: 6,
  },
  declineText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
  acceptedContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  acceptedTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  acceptedSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
  },
  boldText: {
    fontWeight: '700',
    color: colors.primary,
  },
});
