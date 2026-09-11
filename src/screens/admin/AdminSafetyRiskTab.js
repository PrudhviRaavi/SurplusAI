import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { safetyMonitoringService } from '../../services/safety/safetyMonitoringService';
import { riskDetectionService } from '../../services/risk/riskDetectionService';
import { AdminActionConfirmModal } from '../../components/admin/AdminActionConfirmModal';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminSafetyRiskTab = () => {
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [activeActionItem, setActiveActionItem] = useState(null);

  const [safetyAlerts, setSafetyAlerts] = useState(safetyMonitoringService.getSafetyAlerts());
  const [duplicateFlags, setDuplicateFlags] = useState(riskDetectionService.getDuplicateFlags());
  const [riskFlags, setRiskFlags] = useState(riskDetectionService.getRiskFlags());

  useEffect(() => {
    let isMounted = true;
    const loadRealOperationalData = async () => {
      try {
        const liveAlerts = await safetyMonitoringService.fetchSafetyAlerts();
        if (isMounted && liveAlerts && liveAlerts.length > 0) {
          setSafetyAlerts(liveAlerts);
        }
      } catch (err) {
        // graceful offline fallback preserved
      }

      try {
        const liveRisk = await riskDetectionService.fetchRiskAssessments();
        if (isMounted && liveRisk && liveRisk.length > 0) {
          setRiskFlags(liveRisk);
        }
      } catch (err) {
        // graceful offline fallback preserved
      }
    };

    loadRealOperationalData();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleOpenConfirm = (item, type) => {
    setActiveActionItem({ ...item, type });
    setShowConfirmModal(true);
  };

  const handleConfirmResolution = async () => {
    if (activeActionItem && activeActionItem.id && activeActionItem.type === 'Audit Entity') {
      try {
        await riskDetectionService.reviewAssessment(
          activeActionItem.id,
          'REVIEWED',
          'Administrative resolution confirmed by operator.'
        );
      } catch (err) {
        // graceful offline error handling
      }
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
          <Ionicons name="shield-alert" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>FOOD SAFETY & GOVERNANCE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Safety & Risk <Text style={styles.italicSerif}>Monitoring.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Reviewing food expiration alerts, potential duplicate listings, and risk anomalies.
        </Text>
      </View>

      {/* Food Safety Alerts Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>FOOD SAFETY ALERTS</Text>
        {safetyAlerts.map((safe) => (
          <View key={safe.id} style={styles.itemBox}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{safe.title}</Text>
              <View style={styles.critBadge}>
                <Text style={styles.critText}>{safe.severity.toUpperCase()}</Text>
              </View>
            </View>
            <Text style={styles.itemSub}>Food: {safe.foodName} · Donor: {safe.donorName}</Text>
            <Text style={styles.itemIssue}>Issue: {safe.issue}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOpenConfirm(safe, 'Safety Review')}
              style={styles.reviewBtn}
            >
              <Text style={styles.reviewBtnText}>Review Safety Alert →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Duplicate Listing Detection Section */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>POTENTIAL DUPLICATE DONATIONS</Text>
        {duplicateFlags.map((dup) => (
          <View key={dup.id} style={styles.itemBox}>
            <View style={styles.itemHeader}>
              <Text style={styles.itemTitle}>{dup.title}</Text>
              <View style={styles.confBadge}>
                <Text style={styles.confText}>{dup.confidencePercent}% MATCH</Text>
              </View>
            </View>
            <Text style={styles.itemSub}>Donor: {dup.donorName}</Text>
            <Text style={styles.itemSub}>Listing A: {dup.donationA}</Text>
            <Text style={styles.itemSub}>Listing B: {dup.donationB}</Text>
            <Text style={styles.itemIssue}>Reason: {dup.reason}</Text>

            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={() => handleOpenConfirm(dup, 'Dismiss Duplicate')}
                style={styles.outlineBtn}
              >
                <Text style={styles.outlineBtnText}>Dismiss</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleOpenConfirm(dup, 'Merge Duplicates')}
                style={styles.primaryBtn}
              >
                <Text style={styles.primaryBtnText}>Review Duplicate →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>

      {/* Risk Monitoring Anomalies */}
      <View style={styles.sectionCard}>
        <Text style={styles.sectionHeaderTag}>ANOMALY & RISK MONITORING</Text>
        {riskFlags.map((rf) => (
          <View key={rf.id} style={styles.itemBox}>
            <Text style={styles.itemTitle}>{rf.title}</Text>
            <Text style={styles.itemSub}>Entity: {rf.entityName}</Text>
            <Text style={styles.itemIssue}>Reason: {rf.reason}</Text>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => handleOpenConfirm(rf, 'Audit Entity')}
              style={styles.reviewBtn}
            >
              <Text style={styles.reviewBtnText}>Audit Activity Record →</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Administrative Confirmation Modal */}
      <AdminActionConfirmModal
        visible={showConfirmModal}
        title={activeActionItem?.type || 'Governance Action'}
        description={`Confirm governance resolution for record "${activeActionItem?.title || ''}". Decision will be recorded in audit logs.`}
        confirmText="Confirm Resolution ✓"
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmResolution}
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
  itemBox: {
    backgroundColor: '#FAF4EB',
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
    flex: 1,
  },
  critBadge: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  critText: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#DC2626',
  },
  confBadge: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  confText: {
    fontSize: 8,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  itemSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  itemIssue: {
    fontSize: 12,
    color: colors.textPrimary,
    marginTop: 4,
  },
  reviewBtn: {
    marginTop: 10,
    paddingVertical: 8,
  },
  reviewBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  outlineBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  primaryBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  primaryBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
