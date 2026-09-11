import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { OtpInputField } from '../components/common/OtpInputField';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';

export const VerifyOtpScreen = ({ onNext, onBack }) => {
  const { formData, updateFormData } = useAppStore();
  const [code, setCode] = useState(formData.otpCode || '884210');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const handleVerify = () => {
    if (code.length < 6) {
      setError('Please enter the complete 6-digit verification code.');
      return;
    }

    setError('');
    setIsVerified(true);
    updateFormData({ otpCode: code });

    setTimeout(() => {
      if (onNext) onNext();
    }, 1200);
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
          currentStep={2}
          totalSteps={3}
          stepTitle="Let's make sure it's you."
          stepSubtitle={`We've sent a 6-digit verification code to ${formData.email || 'your email / phone'}.`}
          onBack={onBack}
        />

        {/* Verification Container */}
        <View style={styles.verifyCard}>
          <Text style={styles.otpLabel}>ENTER VERIFICATION CODE</Text>

          <OtpInputField
            value={code}
            onChangeCode={(val) => {
              setCode(val);
              if (error) setError('');
            }}
            onResend={() => setError('A new verification code has been sent!')}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          {/* Verified Badge Feedback */}
          {isVerified && (
            <View style={styles.verifiedBanner}>
              <Ionicons name="checkmark-circle-sharp" size={24} color="#10B981" />
              <Text style={styles.verifiedText}>Verified ✓</Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title={isVerified ? 'Verified! Proceeding...' : 'Verify Code'}
          onPress={handleVerify}
          variant="primary"
          size="large"
          disabled={isVerified}
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
  verifyCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 12,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  otpLabel: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    textAlign: 'center',
    marginTop: 4,
  },
  verifiedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginTop: 16,
  },
  verifiedText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    marginLeft: 8,
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
