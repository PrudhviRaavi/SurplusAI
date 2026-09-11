import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../common/LuxuryButton';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const ImpactShareModal = ({ visible, impactData, onClose }) => {
  const data = impactData || {
    foodRescuedKg: 128,
    mealsShared: 312,
    co2SavedKg: 320,
    userName: 'Prudhvi Raavi',
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <TouchableOpacity activeOpacity={1} onPress={onClose} style={styles.backdrop}>
        <TouchableOpacity activeOpacity={1} style={styles.cardContainer}>
          {/* Header Close */}
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={20} color={colors.primary} />
          </TouchableOpacity>

          {/* Social Share Card Canvas */}
          <View style={styles.shareCardCanvas}>
            <View style={styles.brandRow}>
              <Ionicons name="leaf" size={18} color={colors.gold} />
              <Text style={styles.brandText}>FOODSHAREAI IMPACT</Text>
            </View>

            <Text style={styles.userName}>{data.userName}</Text>
            <Text style={styles.cardQuote}>
              "Redirecting surplus food into community nourishment."
            </Text>

            <View style={styles.divider} />

            <View style={styles.statsRow}>
              <View style={styles.statBox}>
                <Text style={styles.statVal}>{data.foodRescuedKg} kg</Text>
                <Text style={styles.statLabel}>Food Rescued</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statVal}>{data.mealsShared}</Text>
                <Text style={styles.statLabel}>Meals Shared</Text>
              </View>

              <View style={styles.statBox}>
                <Text style={styles.statVal}>{data.co2SavedKg} kg</Text>
                <Text style={styles.statLabel}>CO₂ Prevented</Text>
              </View>
            </View>

            <View style={styles.footerRow}>
              <Text style={styles.footerTag}>#ZeroFoodWaste · foodshareai.org</Text>
            </View>
          </View>

          <LuxuryButton
            title="Share Story (Instagram / WhatsApp) →"
            onPress={onClose}
            variant="primary"
            size="large"
            style={{ marginTop: 16 }}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  cardContainer: {
    width: '100%',
    backgroundColor: colors.background,
    borderRadius: 32,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  closeBtn: {
    alignSelf: 'flex-end',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  shareCardCanvas: {
    width: '100%',
    backgroundColor: colors.primary,
    borderRadius: 26,
    padding: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 12,
  },
  brandText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
  },
  userName: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '800',
    color: colors.white,
  },
  cardQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    marginVertical: 18,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statBox: {
    flex: 1,
  },
  statVal: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.gold,
  },
  statLabel: {
    fontSize: 10,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  footerRow: {
    marginTop: 20,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
  },
  footerTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.6)',
  },
});
