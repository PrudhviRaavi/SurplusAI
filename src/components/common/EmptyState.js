import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from './LuxuryButton';
import { colors } from '../../theme/colors';

export const EmptyState = ({
  icon = 'cube-outline',
  title = 'Nothing here yet.',
  description = 'Check back later or try taking action.',
  buttonTitle,
  onButtonPress,
  secondaryButtonTitle,
  onSecondaryButtonPress,
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.iconCircle}>
        <Ionicons name={icon} size={32} color={colors.gold} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {buttonTitle && onButtonPress && (
        <LuxuryButton
          title={buttonTitle}
          onPress={onButtonPress}
          variant="primary"
          size="medium"
          style={{ marginTop: 14, width: '100%' }}
        />
      )}

      {secondaryButtonTitle && onSecondaryButtonPress && (
        <TouchableOpacity onPress={onSecondaryButtonPress} style={styles.secondaryBtn}>
          <Text style={styles.secondaryText}>{secondaryButtonTitle}</Text>
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
    backgroundColor: 'rgba(201, 169, 110, 0.12)',
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
  secondaryBtn: {
    marginTop: 10,
    paddingVertical: 6,
  },
  secondaryText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
});
