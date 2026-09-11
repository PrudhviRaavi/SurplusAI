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
import { DeliveryProofCard } from '../../components/common/DeliveryProofCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const VolunteerCompletionScreen = ({
  donation,
  pickupPhoto,
  deliveryPhoto,
  onViewImpact,
  onBackToDashboard,
}) => {
  const item = donation || {
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    ngoName: 'Hope Community Kitchen',
    volunteerName: 'Arjun Kumar',
    pickupTime: '6:18 PM',
    deliveryTime: '6:42 PM',
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
          <Text style={styles.subTag}>RESCUE DISPATCH COMPLETED</Text>
          <Text style={styles.mainTitle}>
            Food <Text style={styles.italicSerif}>Delivered.</Text>
          </Text>
          <Text style={styles.subtitle}>
            {item.quantity} have safely reached {item.ngoName || 'Hope Community Kitchen'}.
          </Text>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>STATUS: COMPLETED ✓</Text>
          </View>
        </View>

        {/* Proof of Delivery Card */}
        <DeliveryProofCard
          pickupPhoto={pickupPhoto}
          deliveryPhoto={deliveryPhoto}
          pickupTime={item.pickupTime || '6:18 PM'}
          deliveryTime={item.deliveryTime || '6:42 PM'}
          donorName={item.donorName}
          ngoName={item.ngoName}
          volunteerName={item.volunteerName}
          foodName={item.foodName}
          quantity={item.quantity}
        />

        {/* Impact Impact Preview Grid */}
        <View style={styles.impactCard}>
          <Text style={styles.impactTitle}>IMPACT GENERATED</Text>
          <View style={styles.impactGrid}>
            <View style={styles.impactBox}>
              <Text style={styles.impactVal}>+25</Text>
              <Text style={styles.impactLabel}>Meals Delivered</Text>
            </View>
            <View style={styles.impactBox}>
              <Text style={styles.impactVal}>+10 kg</Text>
              <Text style={styles.impactLabel}>Food Rescued</Text>
            </View>
            <View style={styles.impactBox}>
              <Text style={styles.impactVal}>+25 kg</Text>
              <Text style={styles.impactLabel}>CO₂ Prevented</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title="View Impact →"
          onPress={onViewImpact}
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
    marginBottom: 16,
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
  impactCard: {
    width: '100%',
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 6,
  },
  impactTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  impactGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  impactBox: {
    flex: 1,
    alignItems: 'center',
  },
  impactVal: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.primary,
  },
  impactLabel: {
    fontSize: 10,
    color: colors.textSecondary,
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
