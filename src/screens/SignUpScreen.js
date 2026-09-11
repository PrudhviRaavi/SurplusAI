import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { LuxuryCard } from '../components/common/LuxuryCard';
import { colors } from '../theme/colors';

export const SignUpScreen = ({ onCreateAccount, onNavigateToLogin, onBack }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (onCreateAccount) {
      onCreateAccount({ fullName, email, phone, password, confirmPassword });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Navigation Top Header */}
        <View style={styles.topHeader}>
          {onBack && (
            <TouchableOpacity onPress={onBack} style={styles.backButton}>
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Header Title */}
        <View style={styles.headerTextContainer}>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join FoodShareAI and start transforming surplus food into community impact.</Text>
        </View>

        {/* Form Card */}
        <LuxuryCard style={styles.formCard} elevation="subtle">
          <LuxuryInput
            label="Full Name"
            placeholder="Jane Doe"
            value={fullName}
            onChangeText={setFullName}
            iconName="person-outline"
            autoCapitalize="words"
          />

          <LuxuryInput
            label="Email Address"
            placeholder="jane@organization.org"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            iconName="mail-outline"
          />

          <LuxuryInput
            label="Phone Number"
            placeholder="+1 (555) 000-0000"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            iconName="call-outline"
          />

          <LuxuryInput
            label="Password"
            placeholder="Minimum 8 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            iconName="lock-closed-outline"
          />

          <LuxuryInput
            label="Confirm Password"
            placeholder="Re-enter password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            iconName="checkmark-circle-outline"
          />

          <LuxuryButton
            title="Create Account"
            onPress={handleSubmit}
            variant="primary"
            size="large"
            style={styles.submitButton}
          />
        </LuxuryCard>

        {/* Sign In Link */}
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={onNavigateToLogin}>
            <Text style={styles.signInLink}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background, // #FEF7EB
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
    paddingVertical: 6,
  },
  backButtonText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  headerTextContainer: {
    marginBottom: 20,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  formCard: {
    padding: 24,
    marginBottom: 24,
    borderRadius: 30,
  },
  submitButton: {
    marginTop: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  signInLink: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
