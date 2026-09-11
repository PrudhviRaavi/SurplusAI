import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LogoutConfirmModal } from '../../components/common/LogoutConfirmModal';
import { profileService } from '../../services/profile/profileService';
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const ProfileScreen = ({ onNavigate, onLogout }) => {
  const { activeRole, formData } = useAppStore();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const profile = profileService.getProfile();
  const userName = formData.fullName || formData.donorOrgName || formData.ngoName || profile.fullName;

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Profile Header */}
      <View style={styles.headerCard}>
        <Image source={{ uri: profile.avatarUrl }} style={styles.avatar} />

        <Text style={styles.nameText}>{userName}</Text>
        <View style={styles.rolePill}>
          <Text style={styles.roleText}>{activeRole.toUpperCase()} ACCOUNT</Text>
        </View>

        <Text style={styles.emailText}>{profile.email}</Text>
      </View>

      {/* Navigation Sections */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>ACCOUNT & PREFERENCES</Text>

        <TouchableOpacity onPress={() => onNavigate && onNavigate('Settings')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Ionicons name="settings-outline" size={18} color={colors.primary} />
            <Text style={styles.menuText}>App Settings & Preferences</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavigate && onNavigate('Security')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Ionicons name="shield-checkmark-outline" size={18} color={colors.primary} />
            <Text style={styles.menuText}>Security & Password</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>SUPPORT & LEGAL</Text>

        <TouchableOpacity onPress={() => onNavigate && onNavigate('HelpSupport')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Ionicons name="help-circle-outline" size={18} color={colors.primary} />
            <Text style={styles.menuText}>Help & Support / FAQs</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>

        <TouchableOpacity onPress={() => onNavigate && onNavigate('TermsPrivacy')} style={styles.menuRow}>
          <View style={styles.menuLeft}>
            <Ionicons name="document-text-outline" size={18} color={colors.primary} />
            <Text style={styles.menuText}>Terms of Service & Privacy</Text>
          </View>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </TouchableOpacity>
      </View>

      {/* Logout Trigger Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => setShowLogoutModal(true)}
        style={styles.logoutBtn}
      >
        <Ionicons name="log-out-outline" size={18} color={colors.accent} />
        <Text style={styles.logoutText}>Log Out of FoodShareAI</Text>
      </TouchableOpacity>

      <LogoutConfirmModal
        visible={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirmLogout={() => {
          setShowLogoutModal(false);
          if (onLogout) onLogout();
        }}
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
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginBottom: 10,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  nameText: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  rolePill: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 4,
  },
  roleText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  emailText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  menuText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF4EB',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    gap: 8,
    marginTop: 4,
  },
  logoutText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.accent,
  },
});
