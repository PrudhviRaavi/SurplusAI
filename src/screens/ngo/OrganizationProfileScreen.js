import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { EditOrganizationModal } from '../../components/ngo/EditOrganizationModal';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const OrganizationProfileScreen = () => {
  const { formData, updateFormData, ngoMealsReceived } = useAppStore();
  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatarCircle}>
          <Ionicons name="business" size={32} color={colors.primary} />
        </View>

        <Text style={styles.orgName}>{formData.ngoName || 'Hope Community Foundation'}</Text>

        <View style={styles.verifiedPill}>
          <Ionicons name="checkmark-circle" size={14} color="#10B981" />
          <Text style={styles.verifiedText}>VERIFIED RECEIVER ORGANISATION ✓</Text>
        </View>

        <Text style={styles.regSub}>Reg #: {formData.ngoRegNumber || 'NGO-8842-HYD'}</Text>
      </View>

      {/* Capacity & Operating Hours Card */}
      <View style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.sectionHeaderTag}>CAPACITY & OPERATING HOURS</Text>
          <TouchableOpacity onPress={() => setShowEditModal(true)} style={styles.editBtn}>
            <Ionicons name="create-outline" size={14} color={colors.primary} />
            <Text style={styles.editText}>Edit</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Daily Required Meals:</Text>
          <Text style={styles.infoVal}>{formData.ngoMealsRequired || 250} meals</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Total Storage Capacity:</Text>
          <Text style={styles.infoVal}>{formData.ngoDailyCapacity || 500} meals</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Operating Hours:</Text>
          <Text style={styles.infoVal}>{formData.ngoOperatingHours || '08:00 AM - 09:00 PM'}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Pickup Radius:</Text>
          <Text style={styles.infoVal}>{formData.ngoPickupRadius || '15 km'}</Text>
        </View>
      </View>

      {/* Public Impact Card */}
      <View style={styles.card}>
        <Text style={styles.sectionHeaderTag}>PUBLIC IMPACT RECORD</Text>
        <Text style={styles.impactVal}>{ngoMealsReceived || 1240} meals received</Text>
        <Text style={styles.impactSub}>Redistributed to vulnerable families across Hyderabad.</Text>
      </View>

      {/* Edit Organization Modal */}
      <EditOrganizationModal
        visible={showEditModal}
        orgData={formData}
        onClose={() => setShowEditModal(false)}
        onSave={(updated) => updateFormData(updated)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  headerCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  orgName: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
  },
  verifiedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    marginTop: 6,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  verifiedText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  regSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  editBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  editText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  infoLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  impactVal: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.primary,
    marginTop: 4,
  },
  impactSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
