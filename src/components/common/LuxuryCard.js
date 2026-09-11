import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

export const LuxuryCard = ({
  children,
  onPress,
  selected = false,
  style,
  elevation = 'subtle', // 'none' | 'subtle' | 'medium'
}) => {
  const CardContainer = onPress ? TouchableOpacity : View;

  return (
    <CardContainer
      activeOpacity={onPress ? 0.85 : 1}
      onPress={onPress}
      style={[
        styles.card,
        elevation === 'medium' && styles.shadowMedium,
        elevation === 'subtle' && styles.shadowSubtle,
        selected && styles.selectedCard,
        style,
      ]}
    >
      {children}
    </CardContainer>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 30, // 28-32px rounded corners as requested
    borderWidth: 1.5,
    borderColor: colors.border,
    padding: 20,
    marginVertical: 8,
    width: '100%',
  },
  shadowSubtle: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 2,
  },
  shadowMedium: {
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 4,
  },
  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#FAF4EB',
  },
});
