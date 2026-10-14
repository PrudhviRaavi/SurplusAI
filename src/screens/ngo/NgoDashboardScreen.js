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
import { NgoHeader } from '../../components/ngo/NgoHeader';
import { CapacityTrackerCard } from '../../components/ngo/CapacityTrackerCard';
import { UrgentFoodList } from '../../components/ngo/UrgentFoodList';
import { NgoAIRecommendationCard } from '../../components/ngo/NgoAIRecommendationCard';
import { ActiveClaimsCard } from '../../components/ngo/ActiveClaimsCard';
import { FoodRequirementsCard } from '../../components/ngo/FoodRequirementsCard';
import { NearbyDonorsList } from '../../components/ngo/NearbyDonorsList';
import { NgoImpactGrid } from '../../components/ngo/NgoImpactGrid';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { NgoBottomNav } from '../../components/ngo/NgoBottomNav';

// Sub-Screens & Modals
import { DiscoverTabScreen } from './DiscoverTabScreen';
import { ClaimsTabScreen } from './ClaimsTabScreen';
import { NgoProfileScreen } from './NgoProfileScreen';
import { ClaimDonationModalScreen } from './ClaimDonationModalScreen';
import { UpdateRequirementsModalScreen } from './UpdateRequirementsModalScreen';
import { NgoNotificationsModal } from './NgoNotificationsModal';
import { MapScreen } from '../MapScreen';

import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { ngoApiService } from '../../services/api/ngoApiService';
import { socketClient } from '../../services/api/socketClient';

export const NgoDashboardScreen = ({ onLogout }) => {
  const { formData } = useAppStore();
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Discover' | 'Claims' | 'Map' | 'Profile'

  // Modals state
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);
  const [isReqModalOpen, setIsReqModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboard = async () => {
      try {
        const res = await ngoApiService.getDashboard();
        const payload = (res && res.capacity) ? res : (res?.data || res);
        if (payload && isMounted) {
          setDashboardData(payload);
        }
      } catch (err) {
        // Fallback to store on error
      }
    };

    fetchDashboard();

    // 10s automatic polling fallback for resilient sync
    const intervalId = setInterval(fetchDashboard, 10000);

    // Real-time updates via Socket.IO
    const unsub = typeof socketClient?.onDonationChange === 'function'
      ? socketClient.onDonationChange(() => {
          fetchDashboard();
        })
      : null;

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (typeof unsub === 'function') unsub();
    };
  }, [activeTab]);

  const ngoName = formData.ngoName || 'Hope Community Kitchen';

  const handleOpenClaimModal = (item) => {
    setSelectedDonation(item);
    setIsClaimModalOpen(true);
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
            {/* 1. NGO Header */}
            <NgoHeader
              ngoName={ngoName}
              onNotificationPress={() => setIsNotifModalOpen(true)}
              onProfilePress={() => setActiveTab('Profile')}
            />

            {/* 2. Capacity Status Tracker */}
            <CapacityTrackerCard
              usedMeals={dashboardData?.capacity?.usedMeals ?? 72}
              totalCapacity={dashboardData?.capacity?.totalCapacity ?? 100}
              availableMeals={dashboardData?.capacity?.availableMeals ?? 28}
            />

            {/* 3. URGENT FOOD SECTION (Most Important) */}
            <UrgentFoodList
              donations={dashboardData?.recentUrgentDonations?.length ? dashboardData.recentUrgentDonations : undefined}
              onViewDonation={handleOpenClaimModal}
            />

            {/* 4. AI Recommendation Match Card (96% Match) */}
            <NgoAIRecommendationCard onClaimDonation={() => handleOpenClaimModal(null)} />

            {/* 5. Active Claims Pipeline */}
            <ActiveClaimsCard onPressDetails={() => setActiveTab('Claims')} />

            {/* 6. Food Requirements / Needs */}
            <FoodRequirementsCard onUpdateRequirements={() => setIsReqModalOpen(true)} />

            {/* 7. Nearby Verified Donors */}
            <NearbyDonorsList onViewAll={() => setActiveTab('Discover')} />

            {/* 8. Map Preview Widget */}
            <View style={styles.mapPreviewWrapper}>
              <LocationPickerMap
                initialAddress={typeof formData.ngoAddress === 'string' ? formData.ngoAddress : (formData.ngoAddress?.address || 'Koti Community Center, Hyderabad')}
              />
            </View>

            {/* 9. NGO Impact Analytics Grid */}
            <NgoImpactGrid
              mealsReceived={dashboardData?.impact?.mealsReceived ?? 380}
              peopleServed={dashboardData?.impact?.peopleServed ?? 520}
              foodRescuedKg={dashboardData?.impact?.foodRescuedKg ?? 145}
              co2AvoidedKg={dashboardData?.impact?.co2AvoidedKg ?? 310}
            />
          </ScrollView>
        )}

        {activeTab === 'Discover' && (
          <DiscoverTabScreen onSelectDonationToClaim={handleOpenClaimModal} />
        )}

        {activeTab === 'Claims' && (
          <ClaimsTabScreen onViewClaimDetails={() => {}} />
        )}

        {activeTab === 'Map' && <MapScreen />}

        {activeTab === 'Profile' && (
          <NgoProfileScreen
            onLogout={onLogout}
            onOpenUpdateRequirements={() => setIsReqModalOpen(true)}
          />
        )}
      </View>

      {/* Floating Luxury Bottom Navigation Bar */}
      <NgoBottomNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
      />

      {/* CLAIM DONATION MODAL */}
      <Modal
        visible={isClaimModalOpen}
        animationType="slide"
        onRequestClose={() => setIsClaimModalOpen(false)}
      >
        <ClaimDonationModalScreen
          donation={selectedDonation}
          onClose={() => setIsClaimModalOpen(false)}
          onConfirmClaim={() => {
            setIsClaimModalOpen(false);
            setActiveTab('Claims');
          }}
        />
      </Modal>

      {/* UPDATE REQUIREMENTS MODAL */}
      <Modal
        visible={isReqModalOpen}
        animationType="slide"
        onRequestClose={() => setIsReqModalOpen(false)}
      >
        <UpdateRequirementsModalScreen
          onClose={() => setIsReqModalOpen(false)}
          onSaveRequirements={() => setIsReqModalOpen(false)}
        />
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={isNotifModalOpen}
        animationType="slide"
        onRequestClose={() => setIsNotifModalOpen(false)}
      >
        <NgoNotificationsModal onClose={() => setIsNotifModalOpen(false)} />
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
