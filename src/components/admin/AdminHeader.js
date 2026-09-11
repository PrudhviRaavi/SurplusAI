import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminHeader = ({
  adminName = 'System Admin',
  onProfilePress,
  onNotificationPress,
  hasUnreadNotifications = true,
}) => {
  return (
    <View style={styles.headerContainer}>
      <View style={styles.leftGreeting}>
        <View style={styles.badgeRow}>
          <Text style={styles.subGreetingTag}>PLATFORM GOVERNANCE</Text>
          <View style={styles.clearanceBadge}>
            <Ionicons name="shield-checkmark-sharp" size={10} color={colors.gold} />
            <Text style={styles.clearanceText}>LEVEL 4 CLEARANCE</Text>
          </View>
        </View>

        <Text style={styles.mainGreeting}>
          Good morning, <Text style={styles.italicSerif}>Admin.</Text>
        </Text>
        <Text style={styles.subtext}>Here's what's happening across FoodShareAI.</Text>
      </View>

      <View style={styles.rightActions}>
        {/* Notification Bell */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onNotificationPress}
          style={styles.actionBtn}
        >
          <Ionicons name="notifications-outline" size={22} color={colors.primary} />
          {hasUnreadNotifications && <View style={styles.unreadDot} />}
        </TouchableOpacity>

        {/* Profile Avatar */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onProfilePress}
          style={styles.avatarBtn}
        >
          <View style={styles.avatarInner}>
            <Ionicons name="shield-half" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  leftGreeting: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  subGreetingTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
  },
  clearanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
  },
  clearanceText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.6,
  },
  mainGreeting: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtext: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    marginTop: 4,
  },
  rightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  unreadDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.accent,
    borderWidth: 1.5,
    borderColor: colors.surface,
  },
  avatarBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    padding: 2,
    backgroundColor: colors.primary,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 20,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
