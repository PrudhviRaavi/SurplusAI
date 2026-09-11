import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const Toast = ({
  visible,
  message,
  type = 'Success', // 'Success' | 'Info' | 'Warning' | 'Error'
  onHide,
  duration = 2500,
}) => {
  const translateY = React.useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (visible) {
      Animated.spring(translateY, {
        toValue: 20,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(translateY, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          if (onHide) onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, translateY, onHide]);

  if (!visible) return null;

  const getConfig = () => {
    switch (type) {
      case 'Success':
        return { icon: 'checkmark-circle', bg: '#ECFDF5', text: '#065F46', border: '#A7F3D0' };
      case 'Warning':
        return { icon: 'warning', bg: 'rgba(217, 143, 92, 0.15)', text: colors.accent, border: 'rgba(217, 143, 92, 0.3)' };
      case 'Error':
        return { icon: 'alert-circle', bg: '#FEE2E2', text: '#DC2626', border: '#FCA5A5' };
      default:
        return { icon: 'information-circle', bg: '#EFF6FF', text: '#1E40AF', border: '#BFDBFE' };
    }
  };

  const cfg = getConfig();

  return (
    <Animated.View
      style={[
        styles.toastContainer,
        {
          transform: [{ translateY }],
          backgroundColor: cfg.bg,
          borderColor: cfg.border,
        },
      ]}
    >
      <Ionicons name={cfg.icon} size={18} color={cfg.text} />
      <Text style={[styles.toastText, { color: cfg.text }]}>{message}</Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  toastContainer: {
    position: 'absolute',
    top: 40,
    left: 20,
    right: 20,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1.5,
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  toastText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '700',
    flex: 1,
  },
});
