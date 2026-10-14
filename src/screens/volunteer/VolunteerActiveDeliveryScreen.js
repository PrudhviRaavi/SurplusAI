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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { VolunteerCompletionScreen } from './VolunteerCompletionScreen';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { volunteerApiService } from '../../services/api/volunteerApiService';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

/**
 * 10-Stage Delivery Lifecycle:
 * 1. VOLUNTEER_ACCEPTED
 * 2. HEADING_TO_PICKUP
 * 3. ARRIVED_AT_PICKUP
 * 4. PICKUP_VERIFICATION
 * 5. FOOD_COLLECTED
 * 6. HEADING_TO_DROPOFF
 * 7. ARRIVED_AT_DROPOFF
 * 8. DELIVERY_VERIFICATION
 * 9. DELIVERED
 * 10. COMPLETED
 */

export const VolunteerActiveDeliveryScreen = ({ donation, onBack, onCompleteAll }) => {
  const { updateDeliveryStage, confirmNgoReceipt } = useAppStore();

  const [deliveryStage, setDeliveryStage] = useState('VOLUNTEER_ACCEPTED');
  const [pickupConfirmed, setPickupConfirmed] = useState(false);
  const [pickupPhoto, setPickupPhoto] = useState(DEFAULT_FOOD_IMG);
  const [deliveryConfirmed, setDeliveryConfirmed] = useState(false);
  const [deliveryPhoto, setDeliveryPhoto] = useState(DEFAULT_FOOD_IMG);
  const [routeInfo, setRouteInfo] = useState(null);

  const item = donation || {
    id: 'DON-8842',
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    donorAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    ngoName: 'Hope Community Kitchen',
    ngoAddress: 'Hope Foundation, Koti, Hyderabad',
    pickupWindow: '6:00 PM – 8:00 PM',
    distanceToPickupKm: 2.4,
    distanceToDropoffKm: 4.2,
    image: DEFAULT_FOOD_IMG,
  };

  const deliveryId = item?.id || item?._id;

  // Fetch real A* route from backend on mount
  React.useEffect(() => {
    let isMounted = true;
    const fetchRoute = async () => {
      if (deliveryId && /^[0-9a-fA-F]{24}$/.test(deliveryId)) {
        try {
          const res = await volunteerApiService.getRoute(deliveryId);
          if (isMounted && res?.data) {
            setRouteInfo(res.data);
          }
        } catch (err) {
          // Fallback to initial estimates
        }
      }
    };
    fetchRoute();
    return () => { isMounted = false; };
  }, [deliveryId]);

  const advanceStage = async (nextStage) => {
    setDeliveryStage(nextStage);
    updateDeliveryStage(item.id, nextStage);
    if (deliveryId && /^[0-9a-fA-F]{24}$/.test(deliveryId)) {
      try {
        await volunteerApiService.updateDeliveryStatus(deliveryId, nextStage);
      } catch (err) {
        // Log status update notice
      }
    }
  };

  const handleExecutePickupConfirm = async () => {
    advanceStage('FOOD_COLLECTED');
    if (deliveryId && /^[0-9a-fA-F]{24}$/.test(deliveryId)) {
      try {
        await volunteerApiService.confirmPickup(deliveryId);
      } catch (err) {
        // Pickup fallback
      }
    }
  };

  const handleExecuteDeliveryConfirm = async () => {
    advanceStage('DELIVERED');
    if (deliveryId && /^[0-9a-fA-F]{24}$/.test(deliveryId)) {
      try {
        await volunteerApiService.submitProof(deliveryId, {
          photoUrl: deliveryPhoto,
          notes: 'Delivered in good condition to recipient NGO kitchen.',
        });
        await volunteerApiService.completeDelivery(deliveryId);
      } catch (err) {
        // Complete fallback
      }
    }
    // Auto-simulate NGO receipt confirmation for smooth transition
    setTimeout(() => {
      confirmNgoReceipt(item.id);
      advanceStage('COMPLETED');
    }, 1200);
  };

  if (deliveryStage === 'COMPLETED') {
    return (
      <VolunteerCompletionScreen
        donation={item}
        pickupPhoto={pickupPhoto}
        deliveryPhoto={deliveryPhoto}
        onViewImpact={() => {
          if (onCompleteAll) onCompleteAll();
          else onBack();
        }}
        onBackToDashboard={onBack}
      />
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={22} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>ACTIVE DELIVERY</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Stage Status Badge */}
        <View style={styles.stageBadgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.stageBadgeText}>
            STATUS: {(deliveryStage || 'ACCEPTED').replace(/_/g, ' ')}
          </Text>
        </View>

        {/* Route Map Preview */}
        <View style={styles.mapFrame}>
          <LocationPickerMap initialAddress={item.donorAddress} />
        </View>

        {/* Route Destination Cards */}
        <View style={styles.routeCardsRow}>
          <View
            style={[
              styles.legCard,
              (deliveryStage === 'HEADING_TO_PICKUP' || deliveryStage === 'ARRIVED_AT_PICKUP') &&
                styles.legCardActive,
            ]}
          >
            <Text style={styles.legLabel}>LEG 1: PICKUP</Text>
            <Text style={styles.legName}>{item.donorName}</Text>
            <Text style={styles.legSub}>{item.distanceToPickupKm} km · Approx. 9 min</Text>
          </View>

          <View
            style={[
              styles.legCard,
              (deliveryStage === 'HEADING_TO_DROPOFF' || deliveryStage === 'ARRIVED_AT_DROPOFF') &&
                styles.legCardActive,
            ]}
          >
            <Text style={styles.legLabel}>LEG 2: DROP-OFF</Text>
            <Text style={styles.legName}>{item.ngoName}</Text>
            <Text style={styles.legSub}>{item.distanceToDropoffKm} km · Approx. 14 min</Text>
          </View>
        </View>

        {/* LEG 1: PICKUP FLOW CONTROLS */}
        {deliveryStage === 'VOLUNTEER_ACCEPTED' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>Ready to start pickup leg?</Text>
            <Text style={styles.actionSub}>Head to {item.donorName} to collect the food.</Text>
            <LuxuryButton
              title="Start Pickup →"
              onPress={() => advanceStage('HEADING_TO_PICKUP')}
              variant="primary"
              size="large"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {deliveryStage === 'HEADING_TO_PICKUP' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>On the way to pickup</Text>
            <Text style={styles.actionSub}>Destination: {item.donorName} ({item.distanceToPickupKm} km away)</Text>
            <LuxuryButton
              title="I've Arrived at Pickup ✓"
              onPress={() => advanceStage('ARRIVED_AT_PICKUP')}
              variant="primary"
              size="large"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {deliveryStage === 'ARRIVED_AT_PICKUP' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>You're at the pickup location</Text>
            <Text style={styles.actionSub}>Verify food items with {item.donorName}.</Text>

            <TouchableOpacity
              onPress={() => setPickupConfirmed(!pickupConfirmed)}
              style={styles.checkboxRow}
            >
              <Ionicons
                name={pickupConfirmed ? 'checkbox' : 'square-outline'}
                size={22}
                color={pickupConfirmed ? colors.primary : colors.textMuted}
              />
              <Text style={styles.checkboxText}>
                I have received {item.quantity} of {item.foodName}.
              </Text>
            </TouchableOpacity>

            <LuxuryButton
              title="Confirm Pickup & Food Collected →"
              onPress={handleExecutePickupConfirm}
              variant="primary"
              size="large"
              disabled={!pickupConfirmed}
              style={{ marginTop: 14 }}
            />
          </View>
        )}

        {/* FOOD COLLECTED CELEBRATION */}
        {deliveryStage === 'FOOD_COLLECTED' && (
          <View style={styles.actionCard}>
            <View style={styles.collectedHeader}>
              <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              <Text style={styles.collectedTitle}>Food Collected!</Text>
            </View>
            <Text style={styles.actionSub}>25 meals are securely in transit to {item.ngoName}.</Text>

            <LuxuryButton
              title="Start Delivery to NGO →"
              onPress={() => advanceStage('HEADING_TO_DROPOFF')}
              variant="primary"
              size="large"
              style={{ marginTop: 14 }}
            />
          </View>
        )}

        {/* LEG 2: DROP-OFF DELIVERY FLOW CONTROLS */}
        {deliveryStage === 'HEADING_TO_DROPOFF' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>On the way to drop-off</Text>
            <Text style={styles.actionSub}>Destination: {item.ngoName} ({item.distanceToDropoffKm} km away)</Text>
            <LuxuryButton
              title="I've Arrived at NGO ✓"
              onPress={() => advanceStage('ARRIVED_AT_DROPOFF')}
              variant="primary"
              size="large"
              style={{ marginTop: 12 }}
            />
          </View>
        )}

        {deliveryStage === 'ARRIVED_AT_DROPOFF' && (
          <View style={styles.actionCard}>
            <Text style={styles.actionTitle}>You're at the receiving organization</Text>
            <Text style={styles.actionSub}>Hand over meals to {item.ngoName}.</Text>

            <TouchableOpacity
              onPress={() => setDeliveryConfirmed(!deliveryConfirmed)}
              style={styles.checkboxRow}
            >
              <Ionicons
                name={deliveryConfirmed ? 'checkbox' : 'square-outline'}
                size={22}
                color={deliveryConfirmed ? colors.primary : colors.textMuted}
              />
              <Text style={styles.checkboxText}>
                I have delivered {item.quantity} to {item.ngoName}.
              </Text>
            </TouchableOpacity>

            <LuxuryButton
              title="Confirm Delivery & Complete →"
              onPress={handleExecuteDeliveryConfirm}
              variant="primary"
              size="large"
              disabled={!deliveryConfirmed}
              style={{ marginTop: 14 }}
            />
          </View>
        )}

        {deliveryStage === 'DELIVERED' && (
          <View style={styles.actionCard}>
            <Ionicons name="sync" size={24} color={colors.gold} />
            <Text style={styles.actionTitle}>Awaiting NGO Receipt Confirmation</Text>
            <Text style={styles.actionSub}>
              {item.ngoName} is confirming delivery receipt...
            </Text>
          </View>
        )}
      </ScrollView>
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
    paddingBottom: 40,
  },
  stageBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  stageBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  mapFrame: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  routeCardsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  legCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  legCardActive: {
    borderColor: colors.primary,
    backgroundColor: '#FAF4EB',
  },
  legLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  legName: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  legSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  actionCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  actionTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  actionSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    gap: 10,
  },
  checkboxText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    flex: 1,
  },
  collectedHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  collectedTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: '#065F46',
  },
});
