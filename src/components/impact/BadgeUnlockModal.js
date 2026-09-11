import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const BadgeUnlockModal = ({ visible, badge, onClose }) => {
  const item = badge || {
    title: '100 Meals Rescued',
    description: 'You have helped redirect 100+ meals to community members in need.',
    icon: '🍱',
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
          <View style={styles.handleBar} />

          <View style={styles.iconCircle}>
            <Text style={styles.emoji}>{item.icon || '🏆'}</Text>
          </View>

          <Text style={styles.subTag}>NEW ACHIEVEMENT UNLOCKED</Text>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description}>{item.description}</Text>

          <LuxuryButton
            title="View Achievements →"
            onPress={onClose}
            variant="primary"
            size="large"
            style={{ marginTop: 20 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: 30,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    marginBottom: 16,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    borderWidth: 1.5,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emoji: {
    fontSize: 34,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    paddingHorizontal: 12,
  },
});
