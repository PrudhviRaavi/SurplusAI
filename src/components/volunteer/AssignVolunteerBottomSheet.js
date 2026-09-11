import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';

export const AssignVolunteerBottomSheet = ({
  visible,
  volunteer,
  donation,
  onClose,
  onConfirmAssignment,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const vol = volunteer || {
    name: 'Arjun Kumar',
    transportation: 'Two-wheeler',
    transportIcon: '🛵',
  };

  const item = donation || {
    foodName: 'Vegetable Biryani & Curry',
    quantity: '25 meals',
    donorName: 'Green Leaf Restaurant',
    ngoName: 'Hope Community Kitchen',
    pickupWindow: '6:00 PM – 8:00 PM',
  };

  const handleConfirm = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      if (onConfirmAssignment) onConfirmAssignment(vol);
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
        <TouchableOpacity activeOpacity={1} style={styles.bottomSheet}>
          <View style={styles.handleBar} />

          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Assign This Delivery?</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Telemetry Summary Card */}
          <View style={styles.summaryCard}>
            <View style={styles.volRow}>
              <View style={styles.volAvatar}>
                <Ionicons name="person" size={20} color={colors.primary} />
              </View>
              <View style={styles.volCol}>
                <Text style={styles.volName}>{vol.name}</Text>
                <Text style={styles.volSub}>{vol.transportIcon || '🛵'} {vol.transportation}</Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.routeBox}>
              <View style={styles.routePoint}>
                <Ionicons name="ellipse" size={10} color="#10B981" />
                <Text style={styles.routeText}>Pickup: <Text style={styles.boldText}>{item.donorName}</Text></Text>
              </View>

              <View style={styles.routeConnector} />

              <View style={styles.routePoint}>
                <Ionicons name="location-sharp" size={12} color={colors.gold} />
                <Text style={styles.routeText}>Drop-off: <Text style={styles.boldText}>{item.ngoName || 'Hope Community Kitchen'}</Text></Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <Text style={styles.metaLabel}>FOOD: <Text style={styles.metaVal}>{item.foodName} ({item.quantity})</Text></Text>
              <Text style={styles.metaLabel}>WINDOW: <Text style={styles.metaVal}>{item.pickupWindow}</Text></Text>
            </View>
          </View>

          <Text style={styles.confirmQuestion}>
            Assign this rescue task to {vol.name}? They will be notified to review and accept the delivery.
          </Text>

          <View style={styles.actionRow}>
            <LuxuryButton
              title={isProcessing ? 'Assigning Delivery...' : 'Confirm Assignment ✓'}
              onPress={handleConfirm}
              variant="primary"
              size="large"
              disabled={isProcessing}
              style={{ marginBottom: 10 }}
            />

            <TouchableOpacity onPress={onClose} style={styles.chooseOtherBtn}>
              <Text style={styles.chooseOtherText}>Choose Another Volunteer</Text>
            </TouchableOpacity>
          </View>
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
  volRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  volAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  volCol: {
    flex: 1,
  },
  volName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  volSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  routeBox: {
    marginBottom: 10,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  routeConnector: {
    width: 1.5,
    height: 12,
    backgroundColor: colors.border,
    marginLeft: 4,
    marginVertical: 2,
  },
  routeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  metaRow: {
    marginTop: 6,
    paddingTop: 8,
    borderTopWidth: 1,
    borderColor: colors.border,
    gap: 4,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
  },
  metaVal: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
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
  chooseOtherBtn: {
    paddingVertical: 8,
  },
  chooseOtherText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textMuted,
  },
});
