import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const AvailabilityStatusCard = ({ isOnline, onToggleAvailability }) => {
  return (
    <View style={[styles.cardContainer, isOnline ? styles.cardOnline : styles.cardOffline]}>
      <View style={styles.contentRow}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={isOnline ? 'radio-outline' : 'power-outline'}
            size={24}
            color={isOnline ? '#10B981' : colors.textMuted}
          />
        </View>

        <View style={styles.textCol}>
          <Text style={styles.statusTitle}>
            {isOnline ? "You're available" : "You're offline"}
          </Text>
          <Text style={styles.statusSub}>
            {isOnline
              ? 'Looking for nearby food rescue opportunities...'
              : 'Turn on availability to discover tasks.'}
          </Text>
        </View>

        {/* Custom Toggle Switch */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={onToggleAvailability}
          style={[styles.switchTrack, isOnline ? styles.switchOnline : styles.switchOffline]}
        >
          <View
            style={[
              styles.switchThumb,
              isOnline ? styles.thumbOnline : styles.thumbOffline,
            ]}
          >
            <Text style={styles.switchLabel}>{isOnline ? 'ON' : 'OFF'}</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardOnline: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  cardOffline: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textCol: {
    flex: 1,
    paddingRight: 8,
  },
  statusTitle: {
    fontFamily: 'Poppins',
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  statusSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  switchTrack: {
    width: 64,
    height: 34,
    borderRadius: 17,
    padding: 3,
    justifyContent: 'center',
  },
  switchOnline: {
    backgroundColor: colors.primary,
  },
  switchOffline: {
    backgroundColor: colors.border,
  },
  switchThumb: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  thumbOnline: {
    alignSelf: 'flex-end',
  },
  thumbOffline: {
    alignSelf: 'flex-start',
  },
  switchLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
});
