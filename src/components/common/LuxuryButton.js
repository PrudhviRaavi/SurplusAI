import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, View } from 'react-native';
import { colors } from '../../theme/colors';

export const LuxuryButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost'
  size = 'large',      // 'small' | 'medium' | 'large'
  loading = false,
  disabled = false,
  icon = null,
  style,
  textStyle,
}) => {
  const getContainerStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryContainer;
      case 'outline':
        return styles.outlineContainer;
      case 'ghost':
        return styles.ghostContainer;
      case 'primary':
      default:
        return styles.primaryContainer;
    }
  };

  const getTextStyle = () => {
    switch (variant) {
      case 'secondary':
        return styles.secondaryText;
      case 'outline':
        return styles.outlineText;
      case 'ghost':
        return styles.ghostText;
      case 'primary':
      default:
        return styles.primaryText;
    }
  };

  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return styles.smallSize;
      case 'medium':
        return styles.mediumSize;
      case 'large':
      default:
        return styles.largeSize;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.baseContainer,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabledContainer,
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === 'primary' ? colors.white : colors.primary}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && <View style={styles.iconMargin}>{icon}</View>}
          <Text style={[styles.baseText, getTextStyle(), textStyle]}>{title}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  baseContainer: {
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconMargin: {
    marginRight: 8,
  },
  // Sizes
  smallSize: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  mediumSize: {
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 20,
  },
  largeSize: {
    paddingVertical: 18,
    paddingHorizontal: 28,
    width: '100%',
    borderRadius: 26,
  },
  // Variants
  primaryContainer: {
    backgroundColor: colors.primary, // #4B6355 Olive Green
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 3,
  },
  primaryText: {
    color: colors.white,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  secondaryContainer: {
    backgroundColor: colors.secondary, // #E8DCC8 Warm Beige
  },
  secondaryText: {
    color: colors.textPrimary,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  outlineContainer: {
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  outlineText: {
    color: colors.textPrimary,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 16,
    letterSpacing: -0.2,
  },
  ghostContainer: {
    backgroundColor: colors.transparent,
  },
  ghostText: {
    color: colors.primary,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 15,
  },
  disabledContainer: {
    opacity: 0.5,
  },
  baseText: {
    textAlign: 'center',
  },
});
