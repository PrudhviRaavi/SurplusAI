import React, { useState } from 'react';
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
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const UserDetailModalScreen = ({ user, onClose, onUpdateStatus }) => {
  const [status, setStatus] = useState(user?.status || 'Verified');
  const [actionDone, setActionDone] = useState(false);

  const target = user || {
    name: 'Hope Community Kitchen',
    type: 'NGO Partner',
    status: 'Pending Review',
    total: '380 meals',
  };

  const handleVerify = () => {
    setStatus('Verified');
    setActionDone(true);
    setTimeout(() => {
      if (onUpdateStatus) onUpdateStatus(target, 'Verified');
      onClose();
    }, 1200);
  };

  const handleSuspend = () => {
    setStatus('Suspended');
    setActionDone(true);
    setTimeout(() => {
      if (onUpdateStatus) onUpdateStatus(target, 'Suspended');
      onClose();
    }, 1200);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>USER GOVERNANCE AUDIT</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>SYSTEM AUDIT</Text>
          <Text style={styles.mainTitle}>
            Inspect User <Text style={styles.italicSerif}>Profile.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Review registration documents, compliance history, and verify or suspend account access.
          </Text>
        </View>

        {/* User Card */}
        <View style={styles.userCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{target.name.charAt(0)}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>{status.toUpperCase()}</Text>
          </View>

          <Text style={styles.userName}>{target.name}</Text>
          <Text style={styles.userSub}>{target.type} · ID: #USR-9942</Text>

          <View style={styles.divider} />

          <View style={styles.metaRow}>
            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>TOTAL ACTIVITY</Text>
              <Text style={styles.metaVal}>{target.total}</Text>
            </View>

            <View style={styles.metaBox}>
              <Text style={styles.metaLabel}>TAX 80G STATUS</Text>
              <Text style={[styles.metaVal, { color: '#10B981' }]}>Verified ✓</Text>
            </View>
          </View>
        </View>

        {/* Success Banner */}
        {actionDone && (
          <View style={styles.successBanner}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.successText}>Governance Action Recorded! ✓</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomBar}>
        <LuxuryButton
          title="Approve & Verify Account ✓"
          onPress={handleVerify}
          variant="primary"
          size="medium"
          style={{ marginBottom: 8 }}
        />
        <LuxuryButton
          title="Suspend Access"
          onPress={handleSuspend}
          variant="outline"
          size="medium"
        />
      </View>
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
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    paddingBottom: 140,
  },
  titleSection: {
    marginBottom: 16,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 2,
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
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  userCard: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  avatarLarge: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  statusBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  statusBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  userName: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  userSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    width: '100%',
    marginVertical: 16,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  metaBox: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  metaVal: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: '#A7F3D0',
    marginTop: 10,
    gap: 8,
  },
  successText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
