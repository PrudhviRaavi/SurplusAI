import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  Modal,
} from 'react-native';
import { AdminHeader } from '../../components/admin/AdminHeader';
import { AdminIntelligenceNav } from '../../components/admin/AdminIntelligenceNav';
import { AdminBottomNav } from '../../components/admin/AdminBottomNav';

// Operational Intelligence Tabs
import { AdminOverviewTab } from './AdminOverviewTab';
import { AdminMapIntelligenceTab } from './AdminMapIntelligenceTab';
import { AdminForecastTab } from './AdminForecastTab';
import { AdminInsightsTab } from './AdminInsightsTab';
import { AdminSafetyRiskTab } from './AdminSafetyRiskTab';
import { AdminUsersNgoQueueTab } from './AdminUsersNgoQueueTab';
import { AdminDonationOperationsTab } from './AdminDonationOperationsTab';

// Sub-Screens & Modals
import { AdminSettingsTabScreen } from './AdminSettingsTabScreen';
import { UserDetailModalScreen } from './UserDetailModalScreen';
import { AdminNotificationsModal } from './AdminNotificationsModal';

import { colors } from '../../theme/colors';

export const AdminDashboardScreen = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState('Overview'); // Main bottom nav
  const [activeIntelTab, setActiveIntelTab] = useState('Overview'); // Operational sub-nav

  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenUserModal = (user) => {
    setSelectedUser(user);
    setIsUserModalOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Admin Top Header */}
      <AdminHeader
        onNotificationPress={() => setIsNotifModalOpen(true)}
        onProfilePress={() => setActiveTab('Settings')}
      />

      {/* Admin Intelligence Sub-Navigation Bar (Active on Overview & Intelligence tabs) */}
      {activeTab !== 'Settings' && (
        <AdminIntelligenceNav
          activeTab={activeIntelTab}
          onSelectTab={(tabId) => setActiveIntelTab(tabId)}
        />
      )}

      {/* Operational Intelligence Render Canvas */}
      <View style={styles.tabCanvas}>
        {activeTab === 'Settings' ? (
          <AdminSettingsTabScreen onLogout={onLogout} />
        ) : activeIntelTab === 'Overview' ? (
          <AdminOverviewTab />
        ) : activeIntelTab === 'MapIntelligence' ? (
          <AdminMapIntelligenceTab />
        ) : activeIntelTab === 'Forecast' ? (
          <AdminForecastTab />
        ) : activeIntelTab === 'Insights' ? (
          <AdminInsightsTab />
        ) : activeIntelTab === 'SafetyRisk' ? (
          <AdminSafetyRiskTab />
        ) : activeIntelTab === 'UsersNgoQueue' ? (
          <AdminUsersNgoQueueTab />
        ) : (
          <AdminDonationOperationsTab />
        )}
      </View>

      {/* Floating Luxury Bottom Navigation Bar */}
      <AdminBottomNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* USER AUDIT MODAL */}
      <Modal
        visible={isUserModalOpen}
        animationType="slide"
        onRequestClose={() => setIsUserModalOpen(false)}
      >
        <UserDetailModalScreen
          user={selectedUser}
          onClose={() => setIsUserModalOpen(false)}
          onUpdateStatus={() => {
            setIsUserModalOpen(false);
          }}
        />
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={isNotifModalOpen}
        animationType="slide"
        onRequestClose={() => setIsNotifModalOpen(false)}
      >
        <AdminNotificationsModal onClose={() => setIsNotifModalOpen(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  tabCanvas: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
