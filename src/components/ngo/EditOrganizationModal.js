import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';

export const EditOrganizationModal = ({ visible, orgData, onClose, onSave }) => {
  const [orgName, setOrgName] = useState(orgData?.ngoName || 'Hope Community Foundation');
  const [mealsRequired, setMealsRequired] = useState(String(orgData?.ngoMealsRequired || 250));
  const [dailyCapacity, setDailyCapacity] = useState(String(orgData?.ngoDailyCapacity || 500));
  const [operatingHours, setOperatingHours] = useState(orgData?.ngoOperatingHours || '08:00 AM - 09:00 PM');

  const handleSave = () => {
    if (onSave) {
      onSave({
        ngoName: orgName,
        ngoMealsRequired: Number(mealsRequired),
        ngoDailyCapacity: Number(dailyCapacity),
        ngoOperatingHours: operatingHours,
      });
    }
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
          <View style={styles.handleBar} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Edit Organization Details</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.fieldBox}>
              <Text style={styles.label}>ORGANIZATION NAME</Text>
              <TextInput style={styles.input} value={orgName} onChangeText={setOrgName} />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>MEALS REQUIRED DAILY</Text>
              <TextInput style={styles.input} value={mealsRequired} onChangeText={setMealsRequired} keyboardType="numeric" />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>TOTAL DAILY CAPACITY</Text>
              <TextInput style={styles.input} value={dailyCapacity} onChangeText={setDailyCapacity} keyboardType="numeric" />
            </View>

            <View style={styles.fieldBox}>
              <Text style={styles.label}>OPERATING HOURS</Text>
              <TextInput style={styles.input} value={operatingHours} onChangeText={setOperatingHours} />
            </View>

            <LuxuryButton
              title="Save Organization Profile ✓"
              onPress={handleSave}
              variant="primary"
              size="large"
              style={{ marginTop: 14, marginBottom: 20 }}
            />
          </ScrollView>
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
    maxHeight: '80%',
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
    marginBottom: 14,
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
});
