import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { UserManagementCard } from '../../components/admin/UserManagementCard';
import { FraudSafetyGovernanceCard } from '../../components/admin/FraudSafetyGovernanceCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const filterPills = ['All Users', 'Verified Donors', 'Verified NGOs', 'Active Volunteers', 'Pending Review'];

export const AdminUsersTabScreen = ({ onManageUser }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All Users']);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>USER GOVERNANCE</Text>
          <Text style={styles.mainTitle}>
            Ecosystem <Text style={styles.italicSerif}>Users.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Audit, verify, and manage permissions across Donors, NGOs, and Community Volunteers.
          </Text>
        </View>

        <MultiSelectPills
          options={filterPills}
          selectedValues={selectedFilter}
          onToggle={(val) => setSelectedFilter([val])}
        />

        <FraudSafetyGovernanceCard onActionPress={onManageUser} />

        <UserManagementCard onManageUser={onManageUser} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
  },
  titleSection: {
    marginBottom: 14,
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
});
