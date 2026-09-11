import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { DonationStatusMonitor } from '../../components/admin/DonationStatusMonitor';
import { AIInsightsCard } from '../../components/admin/AIInsightsCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminDonationsTabScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>DONATION MONITORING</Text>
          <Text style={styles.mainTitle}>
            Ecosystem <Text style={styles.italicSerif}>Donations.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Monitor active surplus postings, dispatch stage pipeline, and expiry risks across Hyderabad.
          </Text>
        </View>

        <DonationStatusMonitor />

        <AIInsightsCard />
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
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 16,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 2,
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
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
});
