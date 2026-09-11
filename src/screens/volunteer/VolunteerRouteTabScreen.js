import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { SmartRouteCard } from '../../components/volunteer/SmartRouteCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const VolunteerRouteTabScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>LIVE NAVIGATION</Text>
          <Text style={styles.mainTitle}>
            Delivery <Text style={styles.italicSerif}>Route.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Optimized turn-by-turn guidance connecting donor pickup to NGO community drop-off.
          </Text>
        </View>

        {/* AI Smart Route Card */}
        <SmartRouteCard />

        {/* OpenStreetMap Map Component */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionHeader}>LIVE OPENSTREETMAP DISPATCH ROUTE</Text>
          <LocationPickerMap initialAddress="Green Leaf Restaurant → Hope Community Kitchen" />
        </View>

        {/* Route Steps */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>TURN-BY-TURN GUIDANCE</Text>

          <View style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Head north on Jubilee Hills Road #36</Text>
              <Text style={styles.stepSub}>0.8 km · 3 min</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={styles.stepNum}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Arrive at Green Leaf Restaurant (Pickup)</Text>
              <Text style={styles.stepSub}>Collect 25 packaged meals</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: colors.accent }]}>
              <Text style={styles.stepNumText}>3</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Proceed via Outer Ring Road to Koti Shelter</Text>
              <Text style={styles.stepSub}>1.6 km · 9 min</Text>
            </View>
          </View>
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
  mapContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    gap: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.white,
  },
  stepInfo: {
    flex: 1,
  },
  stepText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stepSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
