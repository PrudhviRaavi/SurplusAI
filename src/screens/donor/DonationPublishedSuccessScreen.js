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

const timelineStages = [
  { id: 1, title: 'Donation Created', sub: 'Published to rescue network', active: true, done: true },
  { id: 2, title: 'Finding a Match', sub: 'Scanning 15 km NGO radius', active: true, done: false },
  { id: 3, title: 'Claimed', sub: 'Pending NGO receiver claim', active: false, done: false },
  { id: 4, title: 'Volunteer Assigned', sub: 'Pending volunteer dispatch', active: false, done: false },
  { id: 5, title: 'Pickup', sub: 'Pending collection', active: false, done: false },
  { id: 6, title: 'Delivered', sub: 'Completed redistribution', active: false, done: false },
];

export const DonationPublishedSuccessScreen = ({
  donationId = 'DON-8842',
  onViewDonation,
  onBackToDashboard,
}) => {
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

        {/* Headlines */}
        <View style={styles.textCenter}>
          <Text style={styles.subTag}>DONATION PUBLISHED</Text>
          <Text style={styles.mainTitle}>
            Your food is ready <Text style={styles.italicSerif}>to be rescued.</Text>
          </Text>
          <Text style={styles.subtitle}>
            We'll look for suitable organizations nearby and notify you as soon as an NGO claims your surplus.
          </Text>

          <View style={styles.idBadge}>
            <Text style={styles.idText}>Donation ID: <Text style={styles.idVal}>#{donationId}</Text></Text>
          </View>
        </View>

        {/* 6-Stage Timeline Tracker */}
        <View style={styles.timelineCard}>
          <Text style={styles.cardHeaderTitle}>DISPATCH & CLAIM LIFECYCLE</Text>

          <View style={styles.timelineList}>
            {timelineStages.map((stage, idx) => (
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

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title="View Active Listing →"
          onPress={onViewDonation}
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
    marginBottom: 20,
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
    marginBottom: 24,
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
    marginTop: 6,
    paddingHorizontal: 12,
  },
  idBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginTop: 12,
  },
  idText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  idVal: {
    fontWeight: '800',
    color: colors.primary,
  },
  timelineCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeaderTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 16,
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
