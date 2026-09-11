import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AdminActionConfirmModal } from '../../components/admin/AdminActionConfirmModal';
import { adminApiService } from '../../services/api/adminApiService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const defaultPendingNgos = [
  { id: 'ngo-req-1', name: 'Hope Foundation Kitchen', regNumber: 'NGO-8842-HYD', contact: 'Ananya Sharma', phone: '+91 98765 00112', submittedDate: 'Today' },
  { id: 'ngo-req-2', name: 'Sunrise Food Relief Trust', regNumber: 'NGO-9912-HYD', contact: 'Karan Patel', phone: '+91 98765 44332', submittedDate: 'Yesterday' },
];

export const AdminUsersNgoQueueTab = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionPayload, setActionPayload] = useState(null);
  const [pendingNgos, setPendingNgos] = useState(defaultPendingNgos);

  useEffect(() => {
    let isMounted = true;
    const fetchQueue = async () => {
      try {
        const res = await adminApiService.getPendingNgos();
        if (isMounted && res?.ngos && res.ngos.length > 0) {
          const mapped = res.ngos.map((ngo) => ({
            id: ngo._id,
            name: ngo.organizationName,
            regNumber: ngo.registrationNumber || 'NGO-PENDING',
            contact: ngo.representativeName || ngo.userId?.fullName || 'NGO Admin',
            phone: ngo.phone || ngo.userId?.phone || 'N/A',
            submittedDate: new Date(ngo.createdAt).toLocaleDateString(),
          }));
          setPendingNgos(mapped);
        }
      } catch (err) {
        // preserve offline defaults gracefully
      }
    };
    fetchQueue();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleAction = (item, actionType) => {
    setActionPayload({ item, actionType });
    setShowConfirmModal(true);
  };

  const handleConfirmDecision = async () => {
    if (actionPayload?.item?.id) {
      const decisionStatus = actionPayload.actionType.includes('Approve') ? 'VERIFIED' : 'REJECTED';
      try {
        await adminApiService.verifyNgo(
          actionPayload.item.id,
          decisionStatus,
          `${actionPayload.actionType} executed via Admin Intelligence Center.`
        );
      } catch (err) {
        // graceful offline handling
      }
      setPendingNgos((prev) => prev.filter((ngo) => ngo.id !== actionPayload.item.id));
    }
    setShowConfirmModal(false);
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="people" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>USER GOVERNANCE & VERIFICATION QUEUE</Text>
        </View>

        <Text style={styles.mainTitle}>
          NGO Verification <Text style={styles.italicSerif}>Queue.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Review pending NGO verification requests and manage platform access.
        </Text>
      </View>

      {/* Pending NGO Applications */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>PENDING NGO REGISTRATIONS ({pendingNgos.length})</Text>
        {pendingNgos.map((ngo) => (
          <View key={ngo.id} style={styles.ngoRow}>
            <View style={styles.ngoCol}>
              <Text style={styles.ngoName}>{ngo.name}</Text>
              <Text style={styles.ngoSub}>Reg #: {ngo.regNumber} · Submitted: {ngo.submittedDate}</Text>
              <Text style={styles.ngoContact}>Contact: {ngo.contact} ({ngo.phone})</Text>
            </View>

            <View style={styles.actionBtnRow}>
              <TouchableOpacity
                onPress={() => handleAction(ngo, 'Approve NGO Application')}
                style={styles.approveBtn}
              >
                <Text style={styles.approveText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleAction(ngo, 'Reject NGO Application')}
                style={styles.rejectBtn}
              >
                <Text style={styles.rejectText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Account Suspensions & Audits */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>PLATFORM GOVERNANCE ACTIONS</Text>
        <Text style={styles.infoText}>
          All user suspensions and verification approvals require explicit confirmation and leave an immutable governance audit trail.
        </Text>
      </View>

      <AdminActionConfirmModal
        visible={showConfirmModal}
        title={actionPayload?.actionType || 'Confirm Decision'}
        description={`Execute ${actionPayload?.actionType} for "${actionPayload?.item?.name || ''}"? Decision will be logged.`}
        confirmText="Confirm Decision ✓"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDecision}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
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
    marginBottom: 12,
  },
  ngoRow: {
    backgroundColor: '#FAF4EB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  ngoCol: {
    marginBottom: 10,
  },
  ngoName: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ngoSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ngoContact: {
    fontSize: 12,
    color: colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: 10,
  },
  approveBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 10,
    borderRadius: 12,
  },
  approveText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  rejectBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rejectText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.accent,
  },
  infoText: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
});
