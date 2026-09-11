import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from './LuxuryButton';
import { colors } from '../../theme/colors';

export const ErrorState = ({
  title = 'Something went wrong.',
  description = "We couldn't load this information right now. Please try again.",
  onRetry,
  onGoBack,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name="alert-circle-outline" size={32} color={colors.accent} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {onRetry && (
        <LuxuryButton
          title="Try Again ↺"
          onPress={onRetry}
          variant="primary"
          size="medium"
          style={{ marginTop: 14, width: '100%' }}
        />
      )}

      {onGoBack && (
        <TouchableOpacity onPress={onGoBack} style={styles.backBtn}>
          <Text style={styles.backText}>Go Back</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginVertical: 12,
  },
  iconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(217, 143, 92, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  backBtn: {
    marginTop: 10,
    paddingVertical: 6,
  },
  backText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
});
