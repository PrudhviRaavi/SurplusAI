import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { CardGridSelector } from '../components/common/CardGridSelector';
import { MultiSelectPills } from '../components/common/MultiSelectPills';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { LocationPickerMap } from '../components/common/LocationPickerMap';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

const donorTypes = [
  { id: 'restaurant', label: 'Restaurant', icon: '🍽️', description: 'Dining places & fine dining' },
  { id: 'hotel', label: 'Hotel', icon: '🏨', description: 'Luxury hotels & banquets' },
  { id: 'cafe', label: 'Cafe', icon: '☕', description: 'Coffee shops & bistros' },
  { id: 'canteen', label: 'Canteen', icon: '🏫', description: 'Corporate & college canteens' },
  { id: 'event', label: 'Event Organizer', icon: '🎉', description: 'Weddings & catering' },
  { id: 'grocery', label: 'Food Store', icon: '🛒', description: 'Supermarkets & bakeries' },
  { id: 'individual', label: 'Individual', icon: '👤', description: 'Home cook / Residential' },
  { id: 'other', label: 'Other', icon: '🏢', description: 'Other food provider' },
];

const foodCategories = [
  'Cooked meals',
  'Fruits & vegetables',
  'Bakery items',
  'Packaged food',
  'Dairy',
  'Beverages',
  'Other',
];

const quantityOptions = [
  { id: '10-50', label: '10 - 50 meals', icon: '🍲' },
  { id: '50-100', label: '50 - 100 meals', icon: '🍱' },
  { id: '100-250', label: '100 - 250 meals', icon: '📦' },
  { id: '250+', label: '250+ meals', icon: '🚚' },
];

const frequencyOptions = [
  { id: 'Daily', label: 'Daily', icon: '📅' },
  { id: 'Several times a week', label: 'Several times / week', icon: '🗓️' },
  { id: 'Weekly', label: 'Weekly', icon: '📆' },
  { id: 'Occasionally', label: 'Occasionally', icon: '✨' },
];

export const DonorOnboardingScreen = ({ onComplete, onBackToRoleSelection }) => {
  const { formData, updateFormData } = useAppStore();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      if (onComplete) onComplete();
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      if (onBackToRoleSelection) onBackToRoleSelection();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step Progress Header */}
        <StepProgressBar
          currentStep={step}
          totalSteps={4}
          stepTitle={
            step === 1
              ? 'Tell us about your food source.'
              : step === 2
              ? 'Organization Details'
              : step === 3
              ? 'Donation Preferences'
              : 'Where will donations come from?'
          }
          stepSubtitle={
            step === 1
              ? 'What best describes your business or individual setup?'
              : step === 2
              ? 'Enter your official contact and venue details.'
              : step === 3
              ? 'Tell us what kind of surplus food you usually share.'
              : 'Confirm your primary pickup location on the map.'
          }
          onBack={handlePrevStep}
        />

        {/* STEP 1: Donor Type */}
        {step === 1 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>SELECT DONOR TYPE</Text>
            <CardGridSelector
              options={donorTypes}
              selectedId={formData.donorType}
              onSelect={(id) => updateFormData({ donorType: id })}
              columns={2}
            />
          </View>
        )}

        {/* STEP 2: Org Details */}
        {step === 2 && (
          <View style={styles.stepSection}>
            <LuxuryInput
              label="Business / Organization name"
              placeholder="e.g. Royal Spice Palace"
              value={formData.donorOrgName}
              onChangeText={(text) => updateFormData({ donorOrgName: text })}
              iconName="business-outline"
            />
            <LuxuryInput
              label="Contact person"
              placeholder="e.g. Prudhvi Raavi"
              value={formData.donorContactName}
              onChangeText={(text) => updateFormData({ donorContactName: text })}
              iconName="person-outline"
            />
            <LuxuryInput
              label="Phone number"
              placeholder="e.g. +91 98765 43210"
              value={formData.donorPhone}
              onChangeText={(text) => updateFormData({ donorPhone: text })}
              keyboardType="phone-pad"
              iconName="call-outline"
            />
            <LuxuryInput
              label="Email address"
              placeholder="e.g. prudhvi@foodshareai.org"
              value={formData.donorEmail}
              onChangeText={(text) => updateFormData({ donorEmail: text })}
              keyboardType="email-address"
              iconName="mail-outline"
            />
            <LuxuryInput
              label="Street address"
              placeholder="e.g. 124 Luxury Boulevard, Jubilee Hills"
              value={formData.donorAddress}
              onChangeText={(text) => updateFormData({ donorAddress: text })}
              iconName="location-outline"
            />
          </View>
        )}

        {/* STEP 3: Donation Preferences */}
        {step === 3 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>WHAT DO YOU USUALLY DONATE?</Text>
            <MultiSelectPills
              options={foodCategories}
              selectedValues={formData.donorCategories}
              onToggle={(cat) => {
                const current = formData.donorCategories || [];
                const updated = current.includes(cat)
                  ? current.filter((c) => c !== cat)
                  : [...current, cat];
                updateFormData({ donorCategories: updated });
              }}
            />

            <Text style={[styles.sectionHeading, { marginTop: 18 }]}>TYPICAL QUANTITY PER DONATION</Text>
            <CardGridSelector
              options={quantityOptions}
              selectedId={formData.donorQuantity}
              onSelect={(id) => updateFormData({ donorQuantity: id })}
              columns={2}
            />

            <Text style={[styles.sectionHeading, { marginTop: 18 }]}>DONATION FREQUENCY</Text>
            <CardGridSelector
              options={frequencyOptions}
              selectedId={formData.donorFrequency}
              onSelect={(id) => updateFormData({ donorFrequency: id })}
              columns={2}
            />
          </View>
        )}

        {/* STEP 4: Location */}
        {step === 4 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>PICKUP LOCATION</Text>
            <LocationPickerMap
              initialAddress={formData.donorAddress}
              onLocationConfirm={(newAddr) => {
                updateFormData({ donorAddress: newAddr, donorLocationConfirmed: true });
              }}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title={step === 4 ? 'Complete Registration →' : 'Continue →'}
          onPress={handleNext}
          variant="primary"
          size="large"
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
    paddingTop: 16,
    paddingBottom: 120,
  },
  stepSection: {
    marginTop: 4,
  },
  sectionHeading: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
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
