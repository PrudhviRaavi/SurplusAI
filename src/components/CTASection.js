import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const { width } = Dimensions.get('window');

export const CTASection = ({ onDonorRegister, onNGORegister }) => {
  return (
    <View style={styles.sectionWrapper}>
      <LinearGradient
        colors={[colors.primaryDark, colors.primary, '#047857']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradientCard}
      >
        {/* Background Decorative Rings */}
        <View style={styles.decorativeRing1} />
        <View style={styles.decorativeRing2} />

        <View style={styles.content}>
          <View style={styles.badge}>
            <Ionicons name="people-sharp" size={14} color={colors.white} />
            <Text style={styles.badgeText}>GET STARTED TODAY</Text>
          </View>

          <Text style={styles.headline}>Join the Food Rescue Movement</Text>

          <Text style={styles.subtitle}>
            Whether you are a restaurant, hotel, event host, or non-profit organization — connect with FoodShareAI to start saving lives and reducing food waste in under 60 seconds.
          </Text>

          {/* Action Buttons */}
          <View style={styles.buttonRow}>
            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onDonorRegister}
              style={styles.whiteButton}
            >
              <Ionicons name="restaurant-sharp" size={18} color={colors.primaryDark} />
              <Text style={styles.whiteButtonText}>Become a Donor</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.85}
              onPress={onNGORegister}
              style={styles.outlineButton}
            >
              <Ionicons name="business-sharp" size={18} color={colors.white} />
              <Text style={styles.outlineButtonText}>Register as NGO</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    paddingVertical: 48,
    paddingHorizontal: 20,
    maxWidth: 960,
    width: '100%',
    alignSelf: 'center',
  },
  gradientCard: {
    borderRadius: 24,
    padding: Platform.OS === 'web' && width > 768 ? 44 : 24,
    position: 'relative',
    overflow: 'hidden',
    shadowColor: colors.primaryDark,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 8,
  },
  decorativeRing1: {
    position: 'absolute',
    top: -60,
    right: -60,
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 24,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  decorativeRing2: {
    position: 'absolute',
    bottom: -80,
    left: -40,
    width: 240,
    height: 240,
    borderRadius: 120,
    borderWidth: 32,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  content: {
    alignItems: 'center',
    zIndex: 2,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    marginBottom: 14,
  },
  badgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.white,
    letterSpacing: 1.2,
  },
  headline: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' && width > 768 ? 36 : 26,
    lineHeight: Platform.OS === 'web' && width > 768 ? 44 : 34,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: Platform.OS === 'web' && width > 768 ? 16 : 14,
    lineHeight: 22,
    color: 'rgba(255, 255, 255, 0.9)',
    textAlign: 'center',
    maxWidth: 620,
    marginBottom: 28,
  },
  buttonRow: {
    flexDirection: width > 500 ? 'row' : 'column',
    gap: 14,
    width: '100%',
    maxWidth: 440,
    justifyContent: 'center',
  },
  whiteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: colors.white,
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  whiteButtonText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
    color: colors.primaryDark,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
    paddingHorizontal: 22,
    paddingVertical: 14,
    borderRadius: 14,
  },
  outlineButtonText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
    color: colors.white,
  },
});
