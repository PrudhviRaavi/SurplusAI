import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

export const CommandCenterHeader = ({ onNotificationPress, onProfilePress }) => {
  return (
    <View style={styles.headerContainer}>
      {/* Brand & Logo */}
      <View style={styles.brandRow}>
        <View style={styles.logoBadge}>
          <LinearGradient
            colors={colors.gradientPurpleBlue}
            style={StyleSheet.absoluteFillObject}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />
          <Ionicons name="sparkles" size={16} color={colors.white} />
        </View>

        <View>
          <Text style={styles.brandTitle}>
            FoodShare<Text style={styles.aiAccentText}>AI</Text>
          </Text>
          <View style={styles.statusPill}>
            <View style={styles.pulseDot} />
            <Text style={styles.statusText}>AI Network Online</Text>
          </View>
        </View>
      </View>

      {/* Action Icons */}
      <View style={styles.actionsRow}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          style={styles.iconButton}
        >
          <Ionicons name="notifications-outline" size={18} color={colors.textPrimary} />
          <View style={styles.unreadDot} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onProfilePress}
          style={styles.avatarButton}
        >
          <LinearGradient
            colors={colors.gradientPurpleBlue}
            style={styles.avatarGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="person-sharp" size={14} color={colors.white} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: 'rgba(15, 23, 42, 0.6)',
    borderBottomWidth: 1,
    borderColor: colors.glassBorder,
    zIndex: 90,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoBadge: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justify: 'center',
    overflow: 'hidden',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 5,
  },
  brandTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 20,
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  aiAccentText: {
    color: colors.cyanAccent,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 1,
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.emeraldAccent,
  },
  statusText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.emeraldAccent,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.glass,
    borderWidth: 1,
    borderColor: colors.glassBorder,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
  },
  unreadDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cyanAccent,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    overflow: 'hidden',
  },
  avatarGradient: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
  },
});
