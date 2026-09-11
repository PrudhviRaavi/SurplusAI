import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';

export const ChangePasswordModal = ({ visible, onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMsg, setSuccessMsg] = useState(false);

  const handleUpdatePassword = () => {
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
      onClose();
    }, 1200);
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
          <View style={styles.handleBar} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Change Password</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {successMsg ? (
            <View style={styles.successBox}>
              <Ionicons name="checkmark-circle" size={32} color="#10B981" />
              <Text style={styles.successText}>Password Updated Successfully! ✓</Text>
            </View>
          ) : (
            <View>
              <View style={styles.fieldBox}>
                <Text style={styles.label}>CURRENT PASSWORD</Text>
                <TextInput style={styles.input} secureTextEntry value={currentPassword} onChangeText={setCurrentPassword} placeholder="••••••••" />
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.label}>NEW PASSWORD</Text>
                <TextInput style={styles.input} secureTextEntry value={newPassword} onChangeText={setNewPassword} placeholder="••••••••" />
              </View>

              <View style={styles.fieldBox}>
                <Text style={styles.label}>CONFIRM NEW PASSWORD</Text>
                <TextInput style={styles.input} secureTextEntry value={confirmPassword} onChangeText={setConfirmPassword} placeholder="••••••••" />
              </View>

              <LuxuryButton
                title="Update Password →"
                onPress={handleUpdatePassword}
                variant="primary"
                size="large"
                style={{ marginTop: 10, marginBottom: 14 }}
              />
            </View>
          )}
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
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border,
    alignSelf: 'center',
    marginBottom: 16,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sheetTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fieldBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 4,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins',
  },
  successBox: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  successText: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: '#065F46',
    marginTop: 8,
  },
});
