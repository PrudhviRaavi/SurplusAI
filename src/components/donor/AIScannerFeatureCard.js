import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AIScannerFeatureCard = ({ onScanFood }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftContent}>
        <View style={styles.chipPill}>
          <Ionicons name="hardware-chip" size={13} color={colors.primary} />
          <Text style={styles.chipText}>COMPUTER VISION AI</Text>
        </View>

        <Text style={styles.title}>
          Let AI help you <Text style={styles.italicSerif}>describe it.</Text>
        </Text>

        <Text style={styles.subtitle}>
          Upload a photo and FoodShareAI can identify the food category, estimate portions, and predict freshness.
        </Text>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onScanFood}
          style={styles.scanBtn}
        >
          <Ionicons name="camera-outline" size={18} color={colors.white} />
          <Text style={styles.scanBtnText}>Scan Food</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.rightGraphic}>
        <View style={styles.aiOrbCircle}>
          <Ionicons name="scan-circle" size={44} color={colors.primary} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  leftContent: {
    flex: 1,
    paddingRight: 10,
  },
  chipPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  chipText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
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
    lineHeight: 18,
    marginBottom: 14,
  },
  scanBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 16,
    alignSelf: 'flex-start',
  },
  scanBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  rightGraphic: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  aiOrbCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(75, 99, 85, 0.2)',
  },
});
