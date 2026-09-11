import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const HeroDonationCTA = ({ onCreateDonation }) => {
  return (
    <View style={styles.heroCard}>
      {/* Decorative Gold Accent Badge */}
      <View style={styles.topBadge}>
        <Ionicons name="sparkles-outline" size={12} color={colors.gold} />
        <Text style={styles.topBadgeText}>INSTANT SURPLUS DISPATCH</Text>
      </View>

      <Text style={styles.heroTitle}>
        Have surplus <Text style={styles.italicSerif}>food?</Text>
      </Text>

      <Text style={styles.heroSubtitle}>
        Let's find it a new destination. Connect directly with nearby shelters and community kitchens.
      </Text>

      <View style={styles.ctaRow}>
        <LuxuryButton
          title="Create Donation +"
          onPress={onCreateDonation}
          variant="primary"
          size="medium"
          style={styles.actionBtn}
        />

        <View style={styles.foodIllustrationBubble}>
          <Text style={styles.foodEmoji}>🍲</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  heroCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 30,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
  },
  topBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.25)',
  },
  topBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    marginLeft: 4,
    letterSpacing: 0.8,
  },
  heroTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  heroSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 21,
    marginBottom: 18,
    maxWidth: '85%',
  },
  ctaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  actionBtn: {
    flex: 1,
    marginRight: 12,
  },
  foodIllustrationBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  foodEmoji: {
    fontSize: 24,
  },
});
