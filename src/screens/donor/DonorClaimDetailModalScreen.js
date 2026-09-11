import React from 'react';
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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

const timelineStages = [
  { id: 1, title: 'Donation Created', sub: 'Published by donor', done: true },
  { id: 2, title: 'Matched', sub: 'Calculated 94% match score', done: true },
  { id: 3, title: 'Claimed', sub: 'Reserved by Hope Community Kitchen', active: true, done: false },
  { id: 4, title: 'Volunteer Assigned', sub: 'Pending community volunteer dispatch', done: false },
  { id: 5, title: 'Pickup', sub: 'Pending collection', done: false },
  { id: 6, title: 'Delivered', sub: 'Completed redistribution', done: false },
];

export const DonorClaimDetailModalScreen = ({ donation, onClose }) => {
  const item = donation || {
    id: 'DON-8842',
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    image: DEFAULT_FOOD_IMG,
    claimedBy: 'Hope Community Kitchen',
    claimedAt: 'Just now',
    pickupWindow: '6:00 PM – 8:00 PM',
    status: 'CLAIMED',
    matchScore: 94,
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>CLAIMED DONATION DETAILS</Text>

        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Claimed Badge */}
        <View style={styles.claimedBadgeRow}>
          <View style={styles.claimedPill}>
            <Ionicons name="checkmark-circle" size={14} color="#065F46" />
            <Text style={styles.claimedPillText}>STATUS: CLAIMED ✓</Text>
          </View>
          <Text style={styles.claimedSub}>Reserved by {item.claimedBy || 'Hope Community Kitchen'}</Text>
        </View>

        {/* Food Hero Frame */}
        <View style={styles.foodCard}>
          <Image source={{ uri: item.image || DEFAULT_FOOD_IMG }} style={styles.foodImg} resizeMode="cover" />
          <View style={styles.foodMeta}>
            <Text style={styles.foodName}>{item.foodName}</Text>
            <Text style={styles.foodQty}>{item.quantity} · Cooked meals</Text>
          </View>
        </View>

        {/* Receiver NGO Card */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>RECEIVING ORGANIZATION</Text>
          <View style={styles.ngoRow}>
            <View style={styles.ngoAvatar}>
              <Ionicons name="heart-sharp" size={22} color={colors.primary} />
            </View>
            <View style={styles.ngoCol}>
              <View style={styles.ngoTitleRow}>
                <Text style={styles.ngoName}>{item.claimedBy || 'Hope Community Kitchen'}</Text>
                <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
              </View>
              <Text style={styles.ngoSub}>Verified Shelter & Kitchen · 2.4 km away</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.metaGrid}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>PICKUP WINDOW</Text>
              <Text style={styles.metaVal}>{item.pickupWindow}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>MATCH SCORE</Text>
              <Text style={[styles.metaVal, { color: colors.gold }]}>{item.matchScore}% Match</Text>
            </View>
          </View>
        </View>

        {/* 6-Stage Timeline */}
        <View style={styles.card}>
          <Text style={styles.cardHeaderTag}>RESCUE LIFECYCLE TIMELINE</Text>
          <View style={styles.timelineList}>
            {timelineStages.map((stage, idx) => (
              <View key={stage.id} style={styles.timelineRow}>
                <View style={styles.leftCol}>
                  <View
                    style={[
                      styles.stageDot,
                      stage.done && styles.stageDotDone,
                      stage.active && styles.stageDotActive,
                    ]}
                  >
                    {stage.done && <Ionicons name="checkmark" size={10} color={colors.white} />}
                  </View>
                  {idx < timelineStages.length - 1 && (
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

      <View style={styles.bottomBar}>
        <LuxuryButton
          title="Back to Dashboard"
          onPress={onClose}
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
    paddingBottom: 100,
  },
  claimedBadgeRow: {
    alignItems: 'center',
    marginBottom: 16,
  },
  claimedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  claimedPillText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  claimedSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  foodCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  foodImg: {
    width: '100%',
    height: 180,
  },
  foodMeta: {
    padding: 16,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  foodQty: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
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
  ngoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  ngoCol: {
    flex: 1,
  },
  ngoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ngoSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaGrid: {
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
    paddingVertical: 14,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
