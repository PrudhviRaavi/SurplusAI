import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Animated,
  Easing,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const AccountSuccessScreen = ({ onGoToDashboard }) => {
  const { formData, selectedRole } = useAppStore();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const userName = formData.fullName || formData.donorContactName || 'Prudhvi';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.container}>
        {/* Animated Checkmark Circle */}
        <Animated.View
          style={[
            styles.iconCircle,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={88} color={colors.primary} />
        </Animated.View>

        {/* Content */}
        <Animated.View style={[styles.contentBlock, { opacity: fadeAnim }]}>
          <View style={styles.badgePill}>
            <Text style={styles.badgeText}>ACCOUNT CREATED ✓</Text>
          </View>

          <Text style={styles.headline}>
            You're all <Text style={styles.italicSerif}>set.</Text>
          </Text>

          <Text style={styles.welcomeName}>Welcome to FoodShareAI, {userName}.</Text>

          <Text style={styles.subtitle}>
            Your intelligent food rescue profile has been verified and registered. Let's turn surplus into something meaningful.
          </Text>

          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>ASSIGNED ROLE</Text>
              <Text style={styles.summaryValue}>
                {selectedRole ? selectedRole.toUpperCase() : 'DONOR'}
              </Text>
            </View>

            <View style={styles.summaryDivider} />

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>DISPATCH STATUS</Text>
              <Text style={[styles.summaryValue, { color: '#10B981' }]}>READY & ACTIVE</Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom CTA */}
      <View style={styles.bottomBar}>
        <LuxuryButton
          title="Go to my dashboard →"
          onPress={onGoToDashboard}
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
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 80,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: 'rgba(75, 99, 85, 0.15)',
  },
  contentBlock: {
    alignItems: 'center',
    width: '100%',
  },
  badgePill: {
    backgroundColor: 'rgba(75, 99, 85, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.0,
  },
  headline: {
    fontFamily: 'Poppins',
    fontSize: 34,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.8,
    marginBottom: 4,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  welcomeName: {
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    width: '100%',
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  summaryValue: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summaryDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
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
