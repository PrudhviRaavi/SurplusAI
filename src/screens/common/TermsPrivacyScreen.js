import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const TermsPrivacyScreen = ({ onBack }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>LEGAL & SAFETY POLICIES</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Terms & <Text style={styles.italicSerif}>Privacy Policy.</Text>
          </Text>
          <Text style={styles.subtitle}>Platform guidelines, food safety disclaimers, and data protection policies.</Text>
        </View>

        {/* Food Safety Disclaimer */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>FOOD SAFETY DISCLAIMER</Text>
          <Text style={styles.bodyText}>
            FoodShareAI facilitates the discovery and transportation of surplus food. Donors must certify that all contributed food was prepared in compliance with local food safety regulations and stored within safe temperature boundaries.
          </Text>
          <Text style={styles.disclaimerText}>
            ℹ️ AI freshness predictions and safe consumption windows are algorithmic estimates and do not replace physical verification.
          </Text>
        </View>

        {/* Privacy Policy */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>PRIVACY & DATA PROTECTION</Text>
          <Text style={styles.bodyText}>
            We respect your privacy. Personal contact information (phone numbers, full addresses) is never publicly displayed or sold. Geographic location data is strictly used for nearby surplus food discovery and delivery dispatching.
          </Text>
        </View>

        {/* Terms of Service */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>TERMS OF SERVICE</Text>
          <Text style={styles.bodyText}>
            By participating in the FoodShareAI network as a Donor, NGO Receiver, or Volunteer, you agree to uphold community standards, treat rescue partners respectfully, and maintain accurate operational records.
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
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 13,
    color: colors.textPrimary,
    lineHeight: 19,
  },
  disclaimerText: {
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 8,
    lineHeight: 16,
  },
});
