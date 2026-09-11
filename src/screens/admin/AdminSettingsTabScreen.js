import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const AdminSettingsTabScreen = ({ onLogout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarLarge}>
            <Ionicons name="shield-half" size={32} color={colors.primary} />
          </View>

          <View style={styles.heroBadge}>
            <Ionicons name="shield-checkmark-sharp" size={14} color={colors.gold} />
            <Text style={styles.heroBadgeText}>LEVEL 4 SUPER ADMIN</Text>
          </View>

          <Text style={styles.nameText}>System Governance Portal</Text>
          <Text style={styles.contactText}>admin@foodshareai.org · Session Encrypted</Text>
        </View>

        {/* System Settings */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>SYSTEM GOVERNANCE & SECURITY</Text>

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="hardware-chip-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>AI Match Engine Sensitivity</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="shield-alert-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Fraud Threshold & Auto-Flagging</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="document-text-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Audit Logs & System Telemetry</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="key-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>API Keys & Webhook Integrations</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onLogout}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out of Admin Governance</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  nameText: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  contactText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#DC2626',
  },
});
