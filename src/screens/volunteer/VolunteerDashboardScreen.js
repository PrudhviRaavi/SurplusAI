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
import { Ionicons } from '@expo/vector-icons';
import { VolunteerHeader } from '../../components/volunteer/VolunteerHeader';
import { AvailabilityStatusCard } from '../../components/volunteer/AvailabilityStatusCard';
import { ActiveDeliveryCard } from '../../components/volunteer/ActiveDeliveryCard';
import { NearbyTasksList, defaultTasks } from '../../components/volunteer/NearbyTasksList';
import { SmartRouteCard } from '../../components/volunteer/SmartRouteCard';
import { VolunteerImpactGrid } from '../../components/volunteer/VolunteerImpactGrid';
import { RecognitionBadgesCard } from '../../components/volunteer/RecognitionBadgesCard';
import { VolunteerHistoryList } from '../../components/volunteer/VolunteerHistoryList';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { OpenStreetMapViewer } from '../../components/common/OpenStreetMapViewer';
import { VolunteerBottomNav } from '../../components/volunteer/VolunteerBottomNav';
import { volunteerRouteService } from '../../services/routes/volunteerRouteService';

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
import { socketClient } from '../../services/api/socketClient';

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
  const [routeData, setRouteData] = useState(() => volunteerRouteService.buildDemoRoute(defaultTasks));

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await volunteerApiService.getDashboard();
        const payload = (res && res.impact) ? res : (res?.data || res);
        if (payload && isMounted) {
          setDashboardData(payload);
          if (payload.isOnline !== undefined) {
            setIsOnline(payload.isOnline);
          }
        }
      } catch (err) {
        // Fallback to store
      }
    };

    fetchDashboard();

    // 10s automatic polling fallback
    const intervalId = setInterval(fetchDashboard, 10000);

    // Real-time updates via Socket.IO
    const unsubTask = typeof socketClient?.onTaskChange === 'function'
      ? socketClient.onTaskChange(() => {
          fetchDashboard();
        })
      : null;
    const unsubDonation = typeof socketClient?.onDonationChange === 'function'
      ? socketClient.onDonationChange(() => {
          fetchDashboard();
        })
      : null;

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (typeof unsubTask === 'function') unsubTask();
      if (typeof unsubDonation === 'function') unsubDonation();
    };
  }, [activeTab]);

  const displayedTasks = React.useMemo(() => {
    if (dashboardData?.recentAvailableTasks && dashboardData.recentAvailableTasks.length > 0) {
      return dashboardData.recentAvailableTasks.map((t) => ({
        id: t.id || t._id,
        pickupName: t.donor?.organizationName || t.pickupLocation?.address || t.foodName || 'Donor Location',
        dropoffName: t.ngo?.organizationName || t.deliveryLocation?.address || 'NGO Community Center',
        distance: `${t.distanceToPickupKm || t.distanceKm || 2.4} km`,
        quantity: t.quantity || '25 meals',
        estTime: `${t.estimatedDurationMins || 18} min`,
        foodCategory: t.foodCategory || 'Cooked meals',
        icon: t.icon || '🍱',
        rawTask: t,
        pickupLocation: t.pickupLocation,
        deliveryLocation: t.deliveryLocation,
      }));
    }
    return defaultTasks;
  }, [dashboardData?.recentAvailableTasks]);

  useEffect(() => {
    let isMounted = true;
    const computeRoute = async () => {
      try {
        const route = await volunteerRouteService.getOptimizedRouteForTasks(displayedTasks);
        if (isMounted && route) {
          setRouteData(route);
        }
      } catch (err) {
        if (isMounted) {
          setRouteData(volunteerRouteService.buildDemoRoute(displayedTasks));
        }
      }
    };
    computeRoute();
    return () => {
      isMounted = false;
    };
  }, [displayedTasks]);

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
                tasks={displayedTasks}
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

            {/* 5. AI Smart Route Recommendation & Stops */}
            <SmartRouteCard
              routeData={routeData}
              onUseRoute={handleOpenActiveDelivery}
            />

            {/* 6. OpenStreetMap Live Route Preview with Stops & Line */}
            <View style={styles.mapPreviewWrapper}>
              <Text style={styles.sectionHeader}>
                {routeData?.isDemo ? 'ROUTE MAP PREVIEW (DEMO)' : 'LIVE OPTIMIZED ROUTE MAP'}
              </Text>
              <OpenStreetMapViewer
                routeCoordinates={routeData?.route?.coordinates}
                stops={routeData?.stops}
                isDemo={routeData?.isDemo}
                demoLabel={routeData?.demoLabel}
                height={230}
              />
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

        {activeTab === 'Route' && (
          <VolunteerRouteTabScreen
            routeData={routeData}
            tasks={displayedTasks}
          />
        )}

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
