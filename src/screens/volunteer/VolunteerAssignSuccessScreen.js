import React from 'react';
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
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const VolunteerAssignSuccessScreen = ({
  volunteer,
  donation,
  onViewDelivery,
  onBackToDashboard,
}) => {
  const vol = volunteer || { name: 'Arjun Kumar' };
  const item = donation || {
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    ngoName: 'Hope Community Kitchen',
    pickupWindow: '6:00 PM – 8:00 PM',
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Checkmark Circle */}
        <View style={styles.iconWrapper}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark-sharp" size={48} color={colors.white} />
          </View>
        </View>

        {/* Headline */}
        <View style={styles.textCenter}>
          <Text style={styles.subTag}>DISPATCH INVITATION SENT</Text>
          <Text style={styles.mainTitle}>
            Volunteer <Text style={styles.italicSerif}>Assigned.</Text>
          </Text>
          <Text style={styles.subtitle}>
            {vol.name} has been invited to handle this delivery.
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>STATUS: AWAITING ACCEPTANCE</Text>
          </View>
        </View>

        {/* Delivery Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <Ionicons name="bicycle-outline" size={18} color={colors.primary} />
            <Text style={styles.summaryHeaderTitle}>DELIVERY DISPATCH DETAILS</Text>
          </View>

          <Text style={styles.foodTitle}>{item.foodName} ({item.quantity})</Text>

          <View style={styles.divider} />

          <View style={styles.routeBox}>
            <View style={styles.routePoint}>
              <Ionicons name="ellipse" size={10} color="#10B981" />
              <Text style={styles.routeText}>Pickup: <Text style={styles.boldText}>{item.donorName}</Text></Text>
            </View>

            <View style={styles.routeConnector} />

            <View style={styles.routePoint}>
              <Ionicons name="location-sharp" size={12} color={colors.gold} />
              <Text style={styles.routeText}>Drop-off: <Text style={styles.boldText}>{item.ngoName || 'Hope Community Kitchen'}</Text></Text>
            </View>
          </View>

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>ASSIGNED HERO</Text>
              <Text style={styles.metaVal}>{vol.name}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>PICKUP WINDOW</Text>
              <Text style={styles.metaVal}>{item.pickupWindow}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <LuxuryButton
          title="View Delivery →"
          onPress={onViewDelivery}
          variant="primary"
          size="large"
          style={{ marginBottom: 10 }}
        />
        <LuxuryButton
          title="Back to Dashboard"
          onPress={onBackToDashboard}
          variant="outline"
          size="medium"
        />
      </View>
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
    paddingTop: 30,
    paddingBottom: 140,
    alignItems: 'center',
  },
  iconWrapper: {
    marginBottom: 16,
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  textCenter: {
    alignItems: 'center',
    marginBottom: 20,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
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
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginTop: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  summaryHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  summaryHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  routeBox: {
    marginBottom: 12,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeConnector: {
    width: 1.5,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
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
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
