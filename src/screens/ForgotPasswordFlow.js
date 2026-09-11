import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { OtpInputField } from '../components/common/OtpInputField';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const ForgotPasswordFlow = ({ onBackToLogin }) => {
  const { formData, updateFormData } = useAppStore();
  const [subStep, setSubStep] = useState(1); // 1: Email, 2: OTP, 3: New Pass, 4: Success
  const [emailOrPhone, setEmailOrPhone] = useState(formData.email || 'prudhvi@foodshareai.org');
  const [otpCode, setOtpCode] = useState('884210');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [error, setError] = useState('');

  const handleNextStep1 = () => {
    if (!emailOrPhone.trim()) {
      setError('Please enter your email or phone number.');
      return;
    }
    setError('');
    updateFormData({ resetEmailOrPhone: emailOrPhone });
    setSubStep(2);
  };

  const handleNextStep2 = () => {
    if (otpCode.length < 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }
    setError('');
    updateFormData({ resetOtpCode: otpCode });
    setSubStep(3);
  };

  const handleNextStep3 = () => {
    if (!newPass || newPass.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    if (newPass !== confirmPass) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    updateFormData({ newPassword: newPass });
    setSubStep(4);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onBackToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>
        </View>

        {/* STEP 1: Enter Email / Phone */}
        {subStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subTag}>PASSWORD RECOVERY</Text>
            <Text style={styles.title}>
              Forgot <Text style={styles.italicSerif}>Password?</Text>
            </Text>
            <Text style={styles.subtitle}>
              Enter your registered email address or phone number to receive a 6-digit reset code.
            </Text>

            <View style={styles.cardForm}>
              <LuxuryInput
                label="Email or Mobile number"
                placeholder="e.g. prudhvi@foodshareai.org"
                value={emailOrPhone}
                onChangeText={(text) => setEmailOrPhone(text)}
                iconName="mail-outline"
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <LuxuryButton
                title="Send Recovery Code →"
                onPress={handleNextStep1}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        )}

        {/* STEP 2: Enter Verification Code */}
        {subStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subTag}>VERIFY RECOVERY CODE</Text>
            <Text style={styles.title}>
              Enter Code <Text style={styles.italicSerif}>Sent.</Text>
            </Text>
            <Text style={styles.subtitle}>
              We've sent a 6-digit reset passcode to {emailOrPhone}.
            </Text>

            <View style={styles.cardForm}>
              <OtpInputField
                value={otpCode}
                onChangeCode={(val) => setOtpCode(val)}
                onResend={() => setError('A new reset code has been sent!')}
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <LuxuryButton
                title="Verify Reset Code →"
                onPress={handleNextStep2}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        )}

        {/* STEP 3: Create New Password */}
        {subStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.subTag}>CREATE NEW PASSWORD</Text>
            <Text style={styles.title}>
              Reset Your <Text style={styles.italicSerif}>Passcode.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Choose a strong password with at least 6 characters.
            </Text>

            <View style={styles.cardForm}>
              <LuxuryInput
                label="New password"
                placeholder="Enter new password"
                value={newPass}
                onChangeText={(text) => setNewPass(text)}
                secureTextEntry
                iconName="lock-closed-outline"
              />

              <LuxuryInput
                label="Confirm new password"
                placeholder="Repeat new password"
                value={confirmPass}
                onChangeText={(text) => setConfirmPass(text)}
                secureTextEntry
                iconName="shield-checkmark-outline"
              />

              {error ? <Text style={styles.errorText}>{error}</Text> : null}

              <LuxuryButton
                title="Update Password →"
                onPress={handleNextStep3}
                variant="primary"
                size="large"
              />
            </View>
          </View>
        )}

        {/* STEP 4: Success Screen */}
        {subStep === 4 && (
          <View style={styles.successContainer}>
            <View style={styles.iconCircle}>
              <Ionicons name="checkmark-circle" size={80} color={colors.primary} />
            </View>

            <View style={styles.verifiedBanner}>
              <Text style={styles.verifiedText}>Password Updated ✓</Text>
            </View>

            <Text style={styles.title}>You're ready to sign in.</Text>
            <Text style={styles.subtitle}>
              Your account passcode has been updated successfully. Proceed to login with your new credentials.
            </Text>

            <LuxuryButton
              title="Return to Login →"
              onPress={onBackToLogin}
              variant="primary"
              size="large"
              style={{ marginTop: 24, width: '100%' }}
            />
          </View>
        )}
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
    paddingBottom: 40,
  },
  topHeader: {
    marginBottom: 16,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  stepContainer: {
    marginTop: 8,
  },
  subTag: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 38,
    marginBottom: 8,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 20,
  },
  cardForm: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginBottom: 12,
  },
  successContainer: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  verifiedBanner: {
    backgroundColor: '#ECFDF5',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
});
