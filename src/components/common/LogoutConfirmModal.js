import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from './LuxuryButton';
import { colors } from '../../theme/colors';

export const LogoutConfirmModal = ({ visible, onClose, onConfirmLogout }) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.card}>
          <View style={styles.iconCircle}>
            <Ionicons name="log-out-outline" size={24} color={colors.accent} />
          </View>

          <Text style={styles.title}>Log Out of FoodShareAI?</Text>
          <Text style={styles.description}>
            You will need to sign in again to access your surplus food rescue dashboard.
          </Text>

          <View style={styles.actionRow}>
            <LuxuryButton
              title="Log Out"
              onPress={onConfirmLogout}
              variant="outline"
              size="large"
              style={{ marginBottom: 8, borderColor: colors.accent }}
            />
            <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 28,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: 'rgba(217, 143, 92, 0.12)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  description: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 6,
    marginBottom: 18,
  },
  actionRow: {
    width: '100%',
    alignItems: 'center',
  },
  cancelBtn: {
    paddingVertical: 8,
  },
  cancelText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
});
