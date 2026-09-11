import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';

export const ClaimConfirmationBottomSheet = ({
  visible,
  donation,
  currentCapacity = 72,
  totalCapacity = 100,
  onClose,
  onConfirmClaim,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorState, setErrorState] = useState(null); // 'claimed' | 'capacity' | null

  const item = donation || {
    id: 'DON-8842',
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    quantityNum: 25,
    donorName: 'Green Leaf Restaurant',
    pickupWindow: '6:00 PM – 8:00 PM',
    status: 'PUBLISHED',
  };

  const remainingCapacityAfter = Math.max(0, currentCapacity - (item.quantityNum || 25));

  const handleConfirm = () => {
    // Conflict validations
    if (item.status === 'CLAIMED') {
      setErrorState('claimed');
      return;
    }

    if (currentCapacity < (item.quantityNum || 25)) {
      setErrorState('capacity');
      return;
    }

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onConfirmClaim) onConfirmClaim(item);
    }, 1200);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        activeOpacity={1}
        onPress={onClose}
        style={styles.backdrop}
      >
        <TouchableOpacity
          activeOpacity={1}
          style={styles.bottomSheet}
        >
          {/* Handle indicator */}
          <View style={styles.handleBar} />

          {/* Conflict Error Banners */}
          {errorState === 'claimed' && (
            <View style={styles.errorCard}>
              <Ionicons name="close-circle-outline" size={24} color="#DC2626" />
              <Text style={styles.errorTitle}>This donation is no longer available.</Text>
              <Text style={styles.errorSub}>
                Another organization has already claimed this donation.
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.errorBtn}>
                <Text style={styles.errorBtnText}>Explore Other Donations</Text>
              </TouchableOpacity>
            </View>
          )}

          {errorState === 'capacity' && (
            <View style={styles.errorCard}>
              <Ionicons name="alert-circle-outline" size={24} color={colors.gold} />
              <Text style={styles.errorTitle}>Insufficient Capacity</Text>
              <Text style={styles.errorSub}>
                Your current available space ({currentCapacity} meals) isn't sufficient for this donation ({item.quantityNum} meals).
              </Text>
              <TouchableOpacity onPress={onClose} style={styles.errorBtn}>
                <Text style={styles.errorBtnText}>Update Organization Capacity</Text>
              </TouchableOpacity>
            </View>
          )}

          {!errorState && (
            <>
              {/* Header */}
              <View style={styles.sheetHeader}>
                <Text style={styles.sheetTitle}>Claim This Donation?</Text>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Ionicons name="close" size={20} color={colors.primary} />
                </TouchableOpacity>
              </View>

              {/* Donation Summary Box */}
              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.foodEmoji}>🍱</Text>
                  <View style={styles.summaryCol}>
                    <Text style={styles.foodName}>{item.foodName}</Text>
                    <Text style={styles.foodSub}>
                      From <Text style={styles.donorName}>{item.donorName}</Text> · {item.quantity}
                    </Text>
                  </View>
                </View>

                <View style={styles.divider} />

                <View style={styles.metaRow}>
                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>PICKUP WINDOW</Text>
                    <Text style={styles.metaVal}>{item.pickupWindow}</Text>
                  </View>

                  <View style={styles.metaBox}>
                    <Text style={styles.metaLabel}>CAPACITY AFTER CLAIM</Text>
                    <Text style={[styles.metaVal, { color: colors.primary }]}>
                      {remainingCapacityAfter} / {totalCapacity} meals
                    </Text>
                  </View>
                </View>
              </View>

              <Text style={styles.confirmQuestion}>
                Are you sure your organization can receive this donation during the specified pickup window?
              </Text>

              {/* Action Buttons */}
              <View style={styles.actionRow}>
                <LuxuryButton
                  title={isProcessing ? 'Confirming Claim...' : 'Confirm Claim ✓'}
                  onPress={handleConfirm}
                  variant="primary"
                  size="large"
                  disabled={isProcessing}
                  style={{ marginBottom: 10 }}
                />

                <TouchableOpacity onPress={onClose} style={styles.goBackBtn}>
                  <Text style={styles.goBackText}>Go Back</Text>
                </TouchableOpacity>
              </View>
            </>
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
    paddingBottom: 30,
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
    fontSize: 22,
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
  summaryCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 14,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  foodEmoji: {
    fontSize: 24,
    marginRight: 12,
  },
  summaryCol: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  foodSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  donorName: {
    fontWeight: '700',
    color: colors.primary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  confirmQuestion: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  actionRow: {
    alignItems: 'center',
  },
  goBackBtn: {
    paddingVertical: 8,
  },
  goBackText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
  errorCard: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  errorTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 8,
  },
  errorSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  errorBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
  },
  errorBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
