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
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

const volunteerPreferencesList = [
  { value: 'Food pickup', label: 'Food pickup', icon: '🚲' },
  { value: 'Food delivery', label: 'Food delivery', icon: '🚚' },
  { value: 'Distribution', label: 'Community distribution', icon: '🤲' },
  { value: 'Event support', label: 'Event rescue support', icon: '🎪' },
  { value: 'Community outreach', label: 'Community outreach', icon: '📣' },
];

const availabilityList = [
  { value: 'Morning', label: 'Morning (07 AM - 12 PM)', icon: '🌅' },
  { value: 'Afternoon', label: 'Afternoon (12 PM - 05 PM)', icon: '☀️' },
  { value: 'Evening', label: 'Evening (05 PM - 10 PM)', icon: '🌙' },
  { value: 'Weekends', label: 'Weekends only', icon: '🗓️' },
];

const travelRadiusList = [
  { id: '5 km', label: '5 km radius', icon: '🚶' },
  { id: '10 km', label: '10 km radius', icon: '🚲' },
  { id: '20 km', label: '20 km radius', icon: '🛵' },
  { id: '30+ km', label: '30+ km citywide', icon: '🚗' },
];

const transportOptions = [
  { id: 'Bicycle', label: 'Bicycle', icon: '🚲', description: 'Zero emissions rescue' },
  { id: 'Two-wheeler', label: 'Two-wheeler', icon: '🛵', description: 'Quick urban dispatch' },
  { id: 'Car', label: 'Car / SUV', icon: '🚗', description: 'Bulk food movement' },
  { id: 'Public transport', label: 'Metro / Bus', icon: '🚌', description: 'Transit transport' },
  { id: 'Walking', label: 'Walking', icon: '🚶', description: 'Local neighborhood' },
];

export const VolunteerOnboardingScreen = ({ onComplete, onBackToRoleSelection }) => {
  const { formData, updateFormData } = useAppStore();
  const [step, setStep] = useState(1);

  const handleNext = () => {
    if (step < 3) {
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
          totalSteps={3}
          stepTitle={
            step === 1
              ? 'Help move food. Create impact.'
              : step === 2
              ? 'Volunteer Preferences'
              : 'Availability & Transportation'
          }
          stepSubtitle={
            step === 1
              ? 'Tell us who you are so we can coordinate your rescue tasks.'
              : step === 2
              ? 'Select how you would like to contribute your time.'
              : 'Help us optimize route dispatch by setting your schedule and vehicle.'
          }
          onBack={handlePrevStep}
        />

        {/* STEP 1: Personal Details */}
        {step === 1 && (
          <View style={styles.stepSection}>
            <LuxuryInput
              label="Full name"
              placeholder="e.g. Prudhvi Raavi"
              value={formData.volFullName}
              onChangeText={(text) => updateFormData({ volFullName: text })}
              iconName="person-outline"
            />

            <LuxuryInput
              label="Phone number"
              placeholder="e.g. +91 98765 43210"
              value={formData.volPhone}
              onChangeText={(text) => updateFormData({ volPhone: text })}
              keyboardType="phone-pad"
              iconName="call-outline"
            />

            <LuxuryInput
              label="Email address"
              placeholder="e.g. prudhvi@foodshareai.org"
              value={formData.volEmail}
              onChangeText={(text) => updateFormData({ volEmail: text })}
              keyboardType="email-address"
              iconName="mail-outline"
            />
          </View>
        )}

        {/* STEP 2: Preferences */}
        {step === 2 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>HOW WOULD YOU LIKE TO HELP?</Text>
            <MultiSelectPills
              options={volunteerPreferencesList}
              selectedValues={formData.volPreferences}
              onToggle={(val) => {
                const current = formData.volPreferences || [];
                const updated = current.includes(val)
                  ? current.filter((v) => v !== val)
                  : [...current, val];
                updateFormData({ volPreferences: updated });
              }}
            />
          </View>
        )}

        {/* STEP 3: Availability & Transportation */}
        {step === 3 && (
          <View style={styles.stepSection}>
            <Text style={styles.sectionHeading}>WHEN ARE YOU USUALLY AVAILABLE?</Text>
            <MultiSelectPills
              options={availabilityList}
              selectedValues={formData.volAvailability}
              onToggle={(val) => {
                const current = formData.volAvailability || [];
                const updated = current.includes(val)
                  ? current.filter((v) => v !== val)
                  : [...current, val];
                updateFormData({ volAvailability: updated });
              }}
            />

            <Text style={[styles.sectionHeading, { marginTop: 18 }]}>PREFERRED TRAVEL RADIUS</Text>
            <CardGridSelector
              options={travelRadiusList}
              selectedId={formData.volTravelRadius}
              onSelect={(id) => updateFormData({ volTravelRadius: id })}
              columns={2}
            />

            <Text style={[styles.sectionHeading, { marginTop: 18 }]}>MODE OF TRANSPORTATION</Text>
            <CardGridSelector
              options={transportOptions}
              selectedId={formData.volTransport}
              onSelect={(id) => updateFormData({ volTransport: id })}
              columns={2}
            />
          </View>
        )}
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title={step === 3 ? 'Complete Volunteer Onboarding →' : 'Continue →'}
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
