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

const claimTimelineStages = [
  { id: 1, title: 'Donation Created', sub: 'Published by donor', active: true, done: true },
  { id: 2, title: 'Match Found', sub: 'Calculated 94% match score', active: true, done: true },
  { id: 3, title: 'Claimed & Reserved', sub: 'Reserved for Hope Community Kitchen', active: true, done: false },
  { id: 4, title: 'Volunteer Assigned', sub: 'Pending community volunteer dispatch', active: false, done: false },
  { id: 5, title: 'Pickup', sub: 'Pending donor pickup', active: false, done: false },
  { id: 6, title: 'Delivered', sub: 'Completed food redistribution', active: false, done: false },
];

export const NgoClaimSuccessScreen = ({
  donation,
  onViewClaim,
  onBackToDashboard,
}) => {
  const item = donation || {
    id: 'DON-8842',
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    pickupWindow: '6:00 PM – 8:00 PM',
    distanceKm: 2.4,
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
          <Text style={styles.subTag}>RESERVATION CONFIRMED</Text>
          <Text style={styles.mainTitle}>
            Donation <Text style={styles.italicSerif}>Claimed.</Text>
          </Text>
          <Text style={styles.subtitle}>
            {item.quantity} are now reserved for your organization.
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>STATUS: CLAIMED ✓</Text>
          </View>
        </View>

        {/* Claim Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeaderRow}>
            <Ionicons name="restaurant-outline" size={18} color={colors.primary} />
            <Text style={styles.summaryHeaderTitle}>RESERVATION DETAILS</Text>
          </View>

          <Text style={styles.foodTitle}>{item.foodName}</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>DONOR</Text>
              <Text style={styles.metaVal}>{item.donorName}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>PICKUP WINDOW</Text>
              <Text style={styles.metaVal}>{item.pickupWindow}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>DISTANCE</Text>
              <Text style={styles.metaVal}>{item.distanceKm} km</Text>
            </View>
          </View>
        </View>

        {/* 6-Stage Timeline Tracker */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeaderTitle}>DISPATCH & LIFECYCLE TIMELINE</Text>

          <View style={styles.timelineList}>
            {claimTimelineStages.map((stage, idx) => (
              <View key={stage.id} style={styles.timelineRow}>
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.stageDot,
                      stage.done && styles.stageDotDone,
                      stage.active && !stage.done && styles.stageDotActive,
                    ]}
                  >
                    {stage.done && (
                      <Ionicons name="checkmark" size={10} color={colors.white} />
                    )}
                  </View>
                  {idx < claimTimelineStages.length - 1 && (
                    <View
                      style={[
                        styles.connectorLine,
                        stage.done && styles.connectorLineDone,
                      ]}
                    />
                  )}
                </View>

                <View style={styles.rightCol}>
                  <Text
                    style={[
                      styles.stageTitle,
                      stage.active && styles.stageTitleActive,
                    ]}
                  >
                    {stage.title}
                  </Text>
                  <Text style={styles.stageSub}>{stage.sub}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Action Bar */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title="View Active Claim →"
          onPress={onViewClaim}
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
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
    marginTop: 10,
  },
  statusBadgeText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  summaryCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
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
  timelineCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 14,
  },
  timelineList: {
    gap: 0,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  stageDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stageDotActive: {
    backgroundColor: colors.gold,
    borderWidth: 3,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  stageDotDone: {
    backgroundColor: colors.primary,
  },
  connectorLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 2,
    minHeight: 18,
  },
  connectorLineDone: {
    backgroundColor: colors.primary,
  },
  rightCol: {
    flex: 1,
  },
  stageTitle: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
  stageTitleActive: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  stageSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
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
