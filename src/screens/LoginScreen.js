import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryInput } from '../components/common/LuxuryInput';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { colors } from '../theme/colors';
import { authApiService } from '../services/api/authApiService';
import { useAppStore } from '../store/useAppStore';

export const LoginScreen = ({
  onSignIn,
  onNavigateToSignUp,
  onNavigateToForgotPassword,
  onNavigateToAdminLogin,
  onBack,
}) => {
  const [emailOrPhone, setEmailOrPhone] = useState('donor@example.com');
  const [password, setPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setActiveRole } = useAppStore();

  const handleLogin = async () => {
    if (!emailOrPhone || !password) {
      setError('Please enter your email and password.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const result = await authApiService.login({
        email: emailOrPhone,
        password,
      });

      const userRole = result?.user?.role;
      if (userRole === 'DONOR') {
        setActiveRole('Donor');
      } else if (userRole === 'NGO') {
        setActiveRole('NGO');
      } else if (userRole === 'VOLUNTEER') {
        setActiveRole('Volunteer');
      }

      setLoading(false);
      if (onSignIn) onSignIn(userRole);
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Invalid email or password.');
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
          {/* Header Navigation */}
          <View style={styles.topHeader}>
            {onBack ? (
              <TouchableOpacity onPress={onBack} style={styles.backButton}>
                <Ionicons name="arrow-back" size={20} color={colors.primary} />
                <Text style={styles.backButtonText}>Back</Text>
              </TouchableOpacity>
            ) : (
              <View />
            )}
          </View>

          {/* Headline */}
          <View style={styles.headlineContainer}>
            <Text style={styles.subTag}>WELCOME BACK</Text>
            <Text style={styles.title}>
              Good to see <Text style={styles.italicSerif}>you again.</Text>
            </Text>
            <Text style={styles.subtitle}>
              Sign in to manage your food rescue operations and community matches.
            </Text>
          </View>

          {/* Form */}
          <View style={styles.formContainer}>
            <LuxuryInput
              label="Email or Mobile number"
              placeholder="Enter email or mobile number"
              value={emailOrPhone}
              onChangeText={(text) => setEmailOrPhone(text)}
              iconName="person-outline"
            />

            <LuxuryInput
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry
              iconName="lock-closed-outline"
            />

            <TouchableOpacity
              onPress={onNavigateToForgotPassword}
              style={styles.forgotBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotText}>Forgot password?</Text>
            </TouchableOpacity>

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <LuxuryButton
              title="Log In →"
              onPress={handleLogin}
              variant="primary"
              size="large"
              style={styles.loginBtn}
            />

            {/* Divider */}
            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>or continue with</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Social Login Button */}
            <TouchableOpacity style={styles.googleBtn} activeOpacity={0.8}>
              <Ionicons name="logo-google" size={18} color="#EA4335" style={{ marginRight: 8 }} />
              <Text style={styles.googleBtnText}>Continue with Google</Text>
            </TouchableOpacity>
          </View>

          {/* Create Account Link */}
          <View style={styles.createRow}>
            <Text style={styles.createText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onNavigateToSignUp}>
              <Text style={styles.createLink}>Create one</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Subtle Bottom Admin Portal Link */}
        <View style={styles.adminFooter}>
          <TouchableOpacity
            onPress={onNavigateToAdminLogin}
            style={styles.adminLinkBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="shield-checkmark" size={14} color={colors.textMuted} />
            <Text style={styles.adminLinkText}>Admin / Organization access</Text>
          </TouchableOpacity>
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
    paddingBottom: 70,
  },
  topHeader: {
    marginBottom: 12,
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
  headlineContainer: {
    marginBottom: 24,
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
    fontSize: 32,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    lineHeight: 40,
    marginBottom: 8,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 15,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 22,
  },
  formContainer: {
    marginTop: 4,
  },
  forgotBtn: {
    alignSelf: 'flex-end',
    marginBottom: 20,
    marginTop: -4,
  },
  forgotText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginBottom: 12,
  },
  loginBtn: {
    marginBottom: 16,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
    marginHorizontal: 12,
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    height: 52,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  googleBtnText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  createRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  createText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  createLink: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  adminFooter: {
    alignItems: 'center',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  adminLinkBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  adminLinkText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
    marginLeft: 6,
    letterSpacing: 0.2,
  },
});
