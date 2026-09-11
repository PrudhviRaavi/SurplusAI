import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { VolunteerHeader } from '../../components/volunteer/VolunteerHeader';
import { AvailabilityStatusCard } from '../../components/volunteer/AvailabilityStatusCard';
import { ActiveDeliveryCard } from '../../components/volunteer/ActiveDeliveryCard';
import { NearbyTasksList } from '../../components/volunteer/NearbyTasksList';
import { SmartRouteCard } from '../../components/volunteer/SmartRouteCard';
import { VolunteerImpactGrid } from '../../components/volunteer/VolunteerImpactGrid';
import { RecognitionBadgesCard } from '../../components/volunteer/RecognitionBadgesCard';
import { VolunteerHistoryList } from '../../components/volunteer/VolunteerHistoryList';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { VolunteerBottomNav } from '../../components/volunteer/VolunteerBottomNav';

// Sub-Screens & Modals
import { VolunteerTasksTabScreen } from './VolunteerTasksTabScreen';
import { VolunteerRouteTabScreen } from './VolunteerRouteTabScreen';
import { VolunteerImpactTabScreen } from './VolunteerImpactTabScreen';
import { VolunteerProfileScreen } from './VolunteerProfileScreen';
import { AcceptTaskModalScreen } from './AcceptTaskModalScreen';
import { VolunteerActiveDeliveryScreen } from './VolunteerActiveDeliveryScreen';
import { VolunteerNotificationsModal } from './VolunteerNotificationsModal';

import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { volunteerApiService } from '../../services/api/volunteerApiService';

export const VolunteerDashboardScreen = ({ onLogout }) => {
  const { formData, donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Tasks' | 'Route' | 'Impact' | 'Profile'
  const [isOnline, setIsOnline] = useState(true);

  // Modals state
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
  const [isActiveDeliveryOpen, setIsActiveDeliveryOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await volunteerApiService.getDashboard();
        if (res?.data && isMounted) {
          setDashboardData(res.data);
          if (res.data.isOnline !== undefined) {
            setIsOnline(res.data.isOnline);
          }
        }
      } catch (err) {
        // Fallback to store
      }
    };
    fetchDashboard();
    return () => { isMounted = false; };
  }, [activeTab]);

  const userName = formData.volFullName || formData.fullName || 'Prudhvi';
  const activeDonation = donationsList[0] || null;

  const handleOpenAcceptModal = (task) => {
    setSelectedTask(task || activeDonation);
    setIsAcceptModalOpen(true);
  };

  const handleOpenActiveDelivery = () => {
    setIsActiveDeliveryOpen(true);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Main Tab Render Canvas */}
      <View style={styles.tabCanvas}>
        {activeTab === 'Home' && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {/* 1. Header */}
            <VolunteerHeader
              userName={userName}
              isOnline={isOnline}
              onNotificationPress={() => setIsNotifModalOpen(true)}
              onProfilePress={() => setActiveTab('Profile')}
            />

            {/* 2. Availability Toggle Status Card */}
            <AvailabilityStatusCard
              isOnline={isOnline}
              onToggleAvailability={() => setIsOnline(!isOnline)}
            />

            {/* 3. Active Delivery Progress Card */}
            <ActiveDeliveryCard onViewRoute={handleOpenActiveDelivery} />

            {/* 4. Nearby Tasks Opportunities (Only visible when online) */}
            {isOnline ? (
              <NearbyTasksList
                tasks={
                  dashboardData?.recentAvailableTasks?.length
                    ? dashboardData.recentAvailableTasks.map((t) => ({
                        id: t.id || t._id,
                        pickupName: t.donor?.organizationName || 'Donor Location',
                        dropoffName: t.ngo?.organizationName || 'NGO Community Center',
                        distance: `${t.distanceToPickupKm || 2.4} km`,
                        quantity: t.quantity || '25 meals',
                        estTime: `${t.estimatedDurationMins || 18} min`,
                        foodCategory: t.foodCategory || 'Cooked meals',
                        icon: '🍱',
                        rawTask: t,
                      }))
                    : undefined
                }
                onAcceptTask={handleOpenAcceptModal}
              />
            ) : (
              <View style={styles.offlineEncouragementCard}>
                <Ionicons name="moon-outline" size={24} color={colors.textMuted} />
                <Text style={styles.offlineTitle}>Turn on availability to discover tasks.</Text>
                <Text style={styles.offlineSub}>
                  You'll get notified as soon as local food rescue dispatches become available.
                </Text>
              </View>
            )}

            {/* 5. AI Smart Route Recommendation */}
            <SmartRouteCard onUseRoute={handleOpenActiveDelivery} />

            {/* 6. OpenStreetMap Live Route Preview */}
            <View style={styles.mapPreviewWrapper}>
              <Text style={styles.sectionHeader}>LIVE ROUTE MAP</Text>
              <LocationPickerMap initialAddress="Green Leaf Restaurant → Hope Community Kitchen" />
            </View>

            {/* 7. Volunteer Impact Grid */}
            <VolunteerImpactGrid
              deliveriesCount={dashboardData?.impact?.completedDeliveries ?? 15}
              mealsDelivered={dashboardData?.impact?.mealsRescued ?? 209}
              distanceKm={dashboardData?.impact?.foodDeliveredKg ?? 46}
              hoursLogged={Math.max(1, Math.round((dashboardData?.impact?.completedDeliveries ?? 15) * 1.2))}
            />

            {/* 8. Recognition & Achievements */}
            <RecognitionBadgesCard level="Community Hero" />

            {/* 9. Completed Task History */}
            <VolunteerHistoryList onViewAll={() => setActiveTab('Impact')} />
          </ScrollView>
        )}

        {activeTab === 'Tasks' && (
          <VolunteerTasksTabScreen
            onAcceptTask={handleOpenAcceptModal}
            onViewRoute={handleOpenActiveDelivery}
          />
        )}

        {activeTab === 'Route' && <VolunteerRouteTabScreen />}

        {activeTab === 'Impact' && <VolunteerImpactTabScreen />}

        {activeTab === 'Profile' && <VolunteerProfileScreen onLogout={onLogout} />}
      </View>

      {/* Floating Luxury Bottom Navigation Bar */}
      <VolunteerBottomNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* ACCEPT TASK MODAL */}
      <Modal
        visible={isAcceptModalOpen}
        animationType="slide"
        onRequestClose={() => setIsAcceptModalOpen(false)}
      >
        <AcceptTaskModalScreen
          task={selectedTask}
          onClose={() => setIsAcceptModalOpen(false)}
          onConfirmAccept={() => {
            setIsAcceptModalOpen(false);
            setIsActiveDeliveryOpen(true);
          }}
        />
      </Modal>

      {/* ACTIVE DELIVERY FULL-SCREEN MODAL */}
      <Modal
        visible={isActiveDeliveryOpen}
        animationType="slide"
        onRequestClose={() => setIsActiveDeliveryOpen(false)}
      >
        <VolunteerActiveDeliveryScreen
          donation={activeDonation}
          onBack={() => setIsActiveDeliveryOpen(false)}
          onCompleteAll={() => {
            setIsActiveDeliveryOpen(false);
            setActiveTab('Impact');
          }}
        />
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={isNotifModalOpen}
        animationType="slide"
        onRequestClose={() => setIsNotifModalOpen(false)}
      >
        <VolunteerNotificationsModal onClose={() => setIsNotifModalOpen(false)} />
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
  },
  offlineEncouragementCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
  },
  offlineTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 8,
  },
  offlineSub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 18,
  },
  mapPreviewWrapper: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
});
