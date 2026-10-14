import React, { useState } from 'react';
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
import { LuxuryInput } from '../components/common/LuxuryInput';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { colors } from '../theme/colors';
import { authApiService } from '../services/api/authApiService';
import { useAppStore } from '../store/useAppStore';
import { typography } from '../theme';

export const AdminLoginScreen = ({ onAdminLogin, onBackToLogin }) => {
  const [adminEmail, setAdminEmail] = useState('admin@example.com');
  const [adminPassword, setAdminPassword] = useState('Password123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setActiveRole } = useAppStore();

  const handleSecureLogin = async () => {
    if (!adminEmail || !adminPassword) {
      setError('Please enter your admin credentials.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      await authApiService.adminLogin({
        email: adminEmail,
        password: adminPassword,
      });

      setActiveRole('Admin');
      setLoading(false);
      if (onAdminLogin) onAdminLogin();
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Admin authentication failed.');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header Navigation */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={onBackToLogin} style={styles.backButton}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backButtonText}>Back to Login</Text>
          </TouchableOpacity>

          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark-sharp" size={14} color={colors.gold} />
            <Text style={styles.adminBadgeText}>RESTRICTED PORTAL</Text>
          </View>
        </View>

        {/* Headline */}
        <View style={styles.headlineContainer}>
          <Text style={styles.subTag}>ORGANIZATION GOVERNANCE</Text>
          <Text style={styles.title}>
            Admin <Text style={styles.italicSerif}>Access.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Secure portal for FoodShareAI platform administrators, verification officers, and system dispatch oversight.
          </Text>
        </View>

        {/* Card Form */}
        <View style={styles.adminCard}>
          <View style={styles.cardHeader}>
            <View style={styles.shieldIconWrapper}>
              <Ionicons name="shield-half" size={28} color={colors.primary} />
            </View>
            <View style={styles.cardHeaderText}>
              <Text style={styles.cardTitle}>Platform Administration</Text>
              <Text style={styles.cardSub}>Level 4 Access Clearance</Text>
            </View>
          </View>

          <LuxuryInput
            label="Admin email address"
            placeholder="admin@foodshareai.org"
            value={adminEmail}
            onChangeText={(text) => setAdminEmail(text)}
            keyboardType="email-address"
            iconName="mail-outline"
          />

          <LuxuryInput
            label="Security Passcode / Password"
            placeholder="Enter security key"
            value={adminPassword}
            onChangeText={(text) => setAdminPassword(text)}
            secureTextEntry
            iconName="key-outline"
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <LuxuryButton
            title="Secure login →"
            onPress={handleSecureLogin}
            variant="primary"
            size="large"
            style={styles.loginBtn}
          />
        </View>

        {/* Security Notice */}
        <View style={styles.noticeBox}>
          <Ionicons name="information-circle-outline" size={18} color={colors.textMuted} />
          <Text style={styles.noticeText}>
            All admin authentication attempts are logged for system audit and compliance.
          </Text>
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
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
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
  adminBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  adminBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    marginLeft: 4,
    letterSpacing: 0.6,
  },
  headlineContainer: {
    marginBottom: 20,
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
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 21,
  },
  adminCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
    marginVertical: 8,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  shieldIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  cardHeaderText: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  cardSub: {
    fontSize: 12,
    fontWeight: '500',
    color: colors.textMuted,
  },
  errorText: {
    fontSize: 13,
    color: '#EF4444',
    marginBottom: 12,
  },
  loginBtn: {
    marginTop: 8,
  },
  noticeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(107, 114, 128, 0.06)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 18,
    marginTop: 20,
  },
  noticeText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginLeft: 8,
    flex: 1,
    lineHeight: 17,
  },
});
