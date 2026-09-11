import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export const CreateAccountScreen = ({ onNext, onBack, onNavigateToLogin }) => {
  const { formData, updateFormData } = useAppStore();
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@'))
      newErrors.email = 'Enter a valid email address';
    if (!formData.phone.trim()) newErrors.phone = 'Mobile number is required';
    if (!formData.password || formData.password.length < 6)
      newErrors.password = 'Password must be at least 6 characters';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (validate()) {
      if (onNext) onNext();
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Step Progress Bar Header */}
          <StepProgressBar
            currentStep={1}
            totalSteps={3}
            stepTitle="Let's get started."
            stepSubtitle="Create your FoodShareAI account in a few simple steps."
            onBack={onBack}
          />

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <LuxuryInput
              label="Full name"
              placeholder="e.g. Prudhvi Raavi"
              value={formData.fullName}
              onChangeText={(text) => updateFormData({ fullName: text })}
              iconName="person-outline"
              error={errors.fullName}
            />

            <LuxuryInput
              label="Email address"
              placeholder="e.g. prudhvi@foodshareai.org"
              value={formData.email}
              onChangeText={(text) => updateFormData({ email: text })}
              keyboardType="email-address"
              iconName="mail-outline"
              error={errors.email}
            />

            <LuxuryInput
              label="Mobile number"
              placeholder="e.g. +91 98765 43210"
              value={formData.phone}
              onChangeText={(text) => updateFormData({ phone: text })}
              keyboardType="phone-pad"
              iconName="call-outline"
              error={errors.phone}
            />

            <LuxuryInput
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChangeText={(text) => updateFormData({ password: text })}
              secureTextEntry
              iconName="lock-closed-outline"
              error={errors.password}
            />

            <LuxuryInput
              label="Confirm password"
              placeholder="Repeat your password"
              value={formData.confirmPassword}
              onChangeText={(text) => updateFormData({ confirmPassword: text })}
              secureTextEntry
              iconName="shield-checkmark-outline"
              error={errors.confirmPassword}
            />
          </View>
        </ScrollView>

        {/* Fixed Bottom Action Bar */}
        <View style={styles.bottomBar}>
          <LuxuryButton
            title="Continue →"
            onPress={handleContinue}
            variant="primary"
            size="large"
          />

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>Already have an account? </Text>
            <Text onPress={onNavigateToLogin} style={styles.loginLink}>
              Log in
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 120,
  },
  formContainer: {
    marginTop: 8,
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
  loginRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  loginText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
