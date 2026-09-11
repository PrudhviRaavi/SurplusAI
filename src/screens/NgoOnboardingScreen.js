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

const ngoTypes = [
  { id: 'ngo', label: 'Registered NGO', icon: '🤝', description: 'Non-profit organization' },
  { id: 'shelter', label: 'Shelter Home', icon: '🏠', description: 'Night shelter & orphanages' },
  { id: 'kitchen', label: 'Community Kitchen', icon: '🍲', description: 'Mass meal distribution' },
  { id: 'foodbank', label: 'Food Bank', icon: '📦', description: 'Surplus food collection' },
  { id: 'charity', label: 'Charity Trust', icon: '💖', description: 'Religious or social trust' },
  { id: 'other', label: 'Other Receiver', icon: '🏢', description: 'Community welfare group' },
];

const foodCategories = [
  'Cooked meals',
  'Fruits & vegetables',
  'Bakery items',
  'Packaged food',
  'Dairy',
  'Beverages',
];

const mealCapacityPills = [
  { id: '50-100', label: '50 - 100 meals/day', icon: '🥣' },
  { id: '100-250', label: '100 - 250 meals/day', icon: '🍲' },
  { id: '250-500', label: '250 - 500 meals/day', icon: '🍱' },
  { id: '500+', label: '500+ meals/day', icon: '🚚' },
];

const radiusOptions = [
  { id: '5 km', label: '5 km radius', icon: '📍' },
  { id: '15 km', label: '15 km radius', icon: '🗺️' },
  { id: '25 km', label: '25 km radius', icon: '🚲' },
  { id: '35+ km', label: '35+ km citywide', icon: '🚗' },
];

export const NgoOnboardingScreen = ({ onComplete, onBackToRoleSelection }) => {
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
              ? "Let's get to know your organization."
              : step === 2
              ? 'Contact Representative'
              : step === 3
              ? 'Food Requirements'
              : 'Service Area & Logistics'
          }
          stepSubtitle={
            step === 1
              ? 'Provide your organization details and registration status.'
              : step === 2
              ? 'Details of the official authorized to accept food deliveries.'
              : step === 3
              ? 'Specify food categories and daily distribution capacity.'
              : 'Define your operating hours and preferred pickup radius.'
          }
          onBack={handlePrevStep}
        />

        {/* STEP 1: Org Details */}
        {step === 1 && (
          <View style={styles.stepSection}>
            <LuxuryInput
              label="Organization name"
              placeholder="e.g. Hope Community Foundation"
              value={formData.ngoName}
              onChangeText={(text) => updateFormData({ ngoName: text })}
              iconName="home-outline"
            />

            <Text style={styles.sectionHeading}>ORGANIZATION TYPE</Text>
            <CardGridSelector
              options={ngoTypes}
              selectedId={formData.ngoType}
              onSelect={(id) => updateFormData({ ngoType: id })}
              columns={2}
            />

            <LuxuryInput
              label="Registration / Trust Number"
              placeholder="e.g. NGO-8842-HYD"
              value={formData.ngoRegNumber}
              onChangeText={(text) => updateFormData({ ngoRegNumber: text })}
              iconName="document-text-outline"
            />

            <LuxuryInput
              label="Website or Social link (Optional)"
              placeholder="e.g. https://hopefoundation.org"
              value={formData.ngoWebsite}
              onChangeText={(text) => updateFormData({ ngoWebsite: text })}
              iconName="globe-outline"
            />
          </View>
        )}

        {/* STEP 2: Contact Person */}
        {step === 2 && (
          <View style={styles.stepSection}>
            <LuxuryInput
              label="Representative name"
              placeholder="e.g. Ananya Sharma"
              value={formData.ngoContactName}
              onChangeText={(text) => updateFormData({ ngoContactName: text })}
              iconName="person-outline"
            />

            <LuxuryInput
              label="Designation / Role"
              placeholder="e.g. Program Director"
              value={formData.ngoDesignation}
              onChangeText={(text) => updateFormData({ ngoDesignation: text })}
              iconName="briefcase-outline"
            />

            <LuxuryInput
              label="Phone number"
              placeholder="e.g. +91 98765 00112"
              value={formData.ngoPhone}
              onChangeText={(text) => updateFormData({ ngoPhone: text })}
              keyboardType="phone-pad"
              iconName="call-outline"
            />

            <LuxuryInput
              label="Official Email address"
              placeholder="e.g. contact@hopefoundation.org"
              value={formData.ngoEmail}
              onChangeText={(text) => updateFormData({ ngoEmail: text })}
              keyboardType="email-address"
              iconName="mail-outline"
            />
          </View>
        )}

        {/* STEP 3: Food Requirements */}
        {step === 3 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>WHAT KIND OF SUPPORT DO YOU NEED?</Text>
            <MultiSelectPills
              options={foodCategories}
              selectedValues={formData.ngoCategories}
              onToggle={(cat) => {
                const current = formData.ngoCategories || [];
                const updated = current.includes(cat)
                  ? current.filter((c) => c !== cat)
                  : [...current, cat];
                updateFormData({ ngoCategories: updated });
              }}
            />

            <Text style={[styles.sectionHeading, { marginTop: 18 }]}>ESTIMATED MEALS REQUIRED PER DAY</Text>
            <CardGridSelector
              options={mealCapacityPills}
              selectedId={formData.ngoMealsRequired}
              onSelect={(id) => updateFormData({ ngoMealsRequired: id })}
              columns={2}
            />
          </View>
        )}

        {/* STEP 4: Service Area */}
        {step === 4 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>PRIMARY SERVICE LOCATION</Text>
            <LocationPickerMap
              initialAddress="Koti Community Center, Hyderabad"
              onLocationConfirm={(newAddr) => {
                updateFormData({ ngoAddress: newAddr, ngoLocationConfirmed: true });
              }}
            />

            <LuxuryInput
              label="Operating Hours"
              placeholder="e.g. 08:00 AM - 09:00 PM"
              value={formData.ngoOperatingHours}
              onChangeText={(text) => updateFormData({ ngoOperatingHours: text })}
              iconName="time-outline"
            />

            <Text style={styles.sectionHeading}>PREFERRED PICKUP RADIUS</Text>
            <CardGridSelector
              options={radiusOptions}
              selectedId={formData.ngoPickupRadius}
              onSelect={(id) => updateFormData({ ngoPickupRadius: id })}
              columns={2}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title={step === 4 ? 'Complete NGO Onboarding →' : 'Continue →'}
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
