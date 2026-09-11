import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChangePasswordModal } from '../../components/profile/ChangePasswordModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SecurityScreen = ({ onBack }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Top Header */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>ACCOUNT SECURITY</Text>

        <View style={{ width: 36 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Security & <Text style={styles.italicSerif}>Authentication.</Text>
          </Text>
          <Text style={styles.subtitle}>Manage account password, active sessions, and two-factor authentication.</Text>
        </View>

        {/* Change Password Card */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>PASSWORD SECURITY</Text>

          <TouchableOpacity onPress={() => setShowPasswordModal(true)} style={styles.actionRow}>
            <View style={styles.actionLeft}>
              <Ionicons name="key-outline" size={18} color={colors.primary} />
              <Text style={styles.actionTitle}>Change Password</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Active Sessions */}
        <View style={styles.card}>
          <Text style={styles.sectionHeaderTag}>ACTIVE SESSIONS</Text>

          <View style={styles.sessionRow}>
            <Ionicons name="phone-portrait-outline" size={20} color={colors.primary} />
            <View style={styles.sessionCol}>
              <Text style={styles.sessionTitle}>Mobile App (This Device)</Text>
              <Text style={styles.sessionSub}>Hyderabad, India · Active Now</Text>
            </View>
          </View>
        </View>

        {/* Change Password Modal */}
        <ChangePasswordModal visible={showPasswordModal} onClose={() => setShowPasswordModal(false)} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
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
  sectionHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  sessionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
  },
  sessionCol: {
    flex: 1,
  },
  sessionTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  sessionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
