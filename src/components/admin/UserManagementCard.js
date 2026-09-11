import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const userMock = {
  Donors: [
    { id: 'u1', name: 'Royal Spice Palace', type: 'Restaurant Donor', status: 'Verified', total: '48 donations' },
    { id: 'u2', name: 'City Cafe & Bakery', type: 'Cafe Donor', status: 'Verified', total: '32 donations' },
  ],
  NGOs: [
    { id: 'u3', name: 'Hope Community Kitchen', type: 'Shelter Home', status: 'Verified', total: '380 meals' },
    { id: 'u4', name: 'City Care Foundation', type: 'Child Welfare', status: 'Pending Review', total: '140 meals' },
  ],
  Volunteers: [
    { id: 'u5', name: 'Rajesh Kumar', type: 'Two-wheeler', status: 'Verified', total: '14 deliveries' },
    { id: 'u6', name: 'Ananya Sharma', type: 'Four-wheeler', status: 'Verified', total: '28 deliveries' },
  ],
};

export const UserManagementCard = ({ onManageUser }) => {
  const [activeRoleTab, setActiveRoleTab] = useState('Donors');

  const currentList = userMock[activeRoleTab] || [];

  return (
    <View style={styles.cardContainer}>
      <View style={styles.headerRow}>
        <View style={styles.titleGroup}>
          <Ionicons name="people-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionHeader}>USER & GOVERNANCE DIRECTORY</Text>
        </View>

        <TouchableOpacity onPress={() => onManageUser && onManageUser(null)} activeOpacity={0.7}>
          <Text style={styles.viewAllText}>Manage all →</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardTitle}>Ecosystem Directory</Text>

      {/* Role Segmented Tabs */}
      <View style={styles.segmentedRow}>
        {['Donors', 'NGOs', 'Volunteers'].map((role) => {
          const isActive = activeRoleTab === role;
          return (
            <TouchableOpacity
              key={role}
              activeOpacity={0.8}
              onPress={() => setActiveRoleTab(role)}
              style={[styles.segTab, isActive && styles.segTabActive]}
            >
              <Text style={[styles.segTabText, isActive && styles.segTabTextActive]}>
                {role}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Directory List */}
      <View style={styles.list}>
        {currentList.map((user) => (
          <View key={user.id} style={styles.userCard}>
            <View style={styles.userMain}>
              <View style={styles.avatarBubble}>
                <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
              </View>

              <View style={styles.infoCol}>
                <View style={styles.nameRow}>
                  <Text style={styles.userName}>{user.name}</Text>
                  {user.status === 'Verified' ? (
                    <Ionicons name="checkmark-circle" size={14} color="#10B981" style={{ marginLeft: 4 }} />
                  ) : (
                    <View style={styles.pendingBadge}>
                      <Text style={styles.pendingText}>Review</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.userSub}>{user.type} · {user.total}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onManageUser && onManageUser(user)}
              style={styles.inspectBtn}
            >
              <Text style={styles.inspectBtnText}>Audit</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  viewAllText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  cardTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 12,
  },
  segmentedRow: {
    flexDirection: 'row',
    backgroundColor: '#FAF4EB',
    padding: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 14,
  },
  segTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 12,
  },
  segTabActive: {
    backgroundColor: colors.primary,
  },
  segTabText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textSecondary,
  },
  segTabTextActive: {
    color: colors.white,
    fontWeight: '800',
  },
  list: {
    gap: 10,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FAF4EB',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  userMain: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatarBubble: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    fontSize: 16,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  infoCol: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userName: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  pendingBadge: {
    backgroundColor: '#FEF2F2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 6,
  },
  pendingText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#DC2626',
  },
  userSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  inspectBtn: {
    backgroundColor: colors.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inspectBtnText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
