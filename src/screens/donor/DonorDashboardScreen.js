import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import { DonorHeader } from '../../components/donor/DonorHeader';
import { HeroDonationCTA } from '../../components/donor/HeroDonationCTA';
import { ActiveDonationCard } from '../../components/donor/ActiveDonationCard';
import { AIScannerFeatureCard } from '../../components/donor/AIScannerFeatureCard';
import { ImpactStatsGrid } from '../../components/donor/ImpactStatsGrid';
import { RecentDonationsList } from '../../components/donor/RecentDonationsList';
import { EmotionalImpactBanner } from '../../components/donor/EmotionalImpactBanner';
import { NearbyReceiversList } from '../../components/donor/NearbyReceiversList';
import { SmartMatchCard } from '../../components/donor/SmartMatchCard';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { DonorBottomNav } from '../../components/donor/DonorBottomNav';

// Sub-Screens & Modals
import { CreateDonationModalScreen } from './CreateDonationModalScreen';
import { DonationsTabScreen } from './DonationsTabScreen';
import { DonorProfileScreen } from './DonorProfileScreen';
import { DonorNotificationsModal } from './DonorNotificationsModal';
import { DonorClaimDetailModalScreen } from './DonorClaimDetailModalScreen';
import { AIScanModalScreen } from '../AIScanModalScreen';
import { MapScreen } from '../MapScreen';

import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';

export const DonorDashboardScreen = ({ onLogout }) => {
  const { formData, donationsList } = useAppStore();
  const [activeTab, setActiveTab] = useState('Home'); // 'Home' | 'Donations' | 'Map' | 'Profile'

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [isAiScanOpen, setIsAiScanOpen] = useState(false);
  const [isClaimDetailOpen, setIsClaimDetailOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [aiScannedData, setAiScannedData] = useState(null);

  const userName = formData.fullName || formData.donorContactName || 'Prudhvi';
  const activeDonation = donationsList[0] || null;

  const handleOpenCreateDonation = () => {
    setIsCreateModalOpen(true);
  };

  const handleOpenClaimDetail = (item) => {
    setSelectedDonation(item || activeDonation);
    setIsClaimDetailOpen(true);
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
            <DonorHeader
              userName={userName}
              onNotificationPress={() => setIsNotifModalOpen(true)}
              onProfilePress={() => setActiveTab('Profile')}
            />

            {/* 2. Hero Action Banner */}
            <HeroDonationCTA onCreateDonation={handleOpenCreateDonation} />

            {/* 3. Active Donation Tracker */}
            <ActiveDonationCard
              foodName={activeDonation?.foodName || 'Vegetable Biryani'}
              quantity={activeDonation?.quantity || '25 meals'}
              currentStageIndex={activeDonation?.status === 'CLAIMED' ? 2 : 1}
              matchedNgo={activeDonation?.claimedBy || 'Hope Community Kitchen'}
              etaText={activeDonation?.status === 'CLAIMED' ? 'Reserved by NGO ✓' : 'Looking for match'}
              onPressDetails={() => handleOpenClaimDetail(activeDonation)}
            />

            {/* 4. AI Scanner Feature Card */}
            <AIScannerFeatureCard onScanFood={() => setIsAiScanOpen(true)} />

            {/* 5. Quick Impact Stats Grid */}
            <ImpactStatsGrid rescuedKg={128} mealsShared={312} totalDonations={24} impactScore={8.6} />

            {/* 6. Recent Donations List */}
            <RecentDonationsList
              donations={donationsList.length > 0 ? donationsList : undefined}
              onViewAll={() => setActiveTab('Donations')}
            />

            {/* 7. Emotional Impact Card */}
            <EmotionalImpactBanner mealsServed={312} co2AvoidedKg={284} />

            {/* 8. Nearby Receivers (NGOs) */}
            <NearbyReceiversList onViewReceiver={() => setActiveTab('Map')} />

            {/* 9. Smart Matching Preview */}
            <SmartMatchCard onViewMatch={handleOpenCreateDonation} />

            {/* 10. Map Preview */}
            <View style={styles.mapPreviewWrapper}>
              <LocationPickerMap
                initialAddress={typeof formData.donorAddress === 'string' ? formData.donorAddress : (formData.donorAddress?.address || '124 Luxury Boulevard, Jubilee Hills, Hyderabad')}
              />
            </View>
          </ScrollView>
        )}

        {activeTab === 'Donations' && (
          <DonationsTabScreen
            onCreateDonationPress={handleOpenCreateDonation}
            onViewDonationDetails={(item) => handleOpenClaimDetail(item)}
          />
        )}

        {activeTab === 'Map' && <MapScreen />}

        {activeTab === 'Profile' && <DonorProfileScreen onLogout={onLogout} />}
      </View>

      {/* Floating Bottom Navigation Bar */}
      <DonorBottomNav
        activeTab={activeTab}
        onSelectTab={(tabId) => setActiveTab(tabId)}
        onCreateDonationPress={handleOpenCreateDonation}
      />

      {/* CREATE DONATION MODAL */}
      {/* CREATE DONATION FLOW MODAL */}
      <Modal
        visible={isCreateModalOpen}
        animationType="slide"
        onRequestClose={() => {
          setIsCreateModalOpen(false);
          setAiScannedData(null);
        }}
      >
        <CreateDonationModalScreen
          initialScannedData={aiScannedData}
          onClose={() => {
            setIsCreateModalOpen(false);
            setAiScannedData(null);
          }}
          onSubmitDonation={() => {
            setIsCreateModalOpen(false);
            setAiScannedData(null);
            setActiveTab('Donations');
          }}
          onTriggerAIScan={() => setIsAiScanOpen(true)}
        />
      </Modal>

      {/* NOTIFICATIONS MODAL */}
      <Modal
        visible={isNotifModalOpen}
        animationType="slide"
        onRequestClose={() => setIsNotifModalOpen(false)}
      >
        <DonorNotificationsModal onClose={() => setIsNotifModalOpen(false)} />
      </Modal>

      {/* CLAIM DETAIL MODAL */}
      <Modal
        visible={isClaimDetailOpen}
        animationType="slide"
        onRequestClose={() => setIsClaimDetailOpen(false)}
      >
        <DonorClaimDetailModalScreen
          donation={selectedDonation}
          onClose={() => setIsClaimDetailOpen(false)}
        />
      </Modal>

      {/* AI SCANNER CAMERA MODAL */}
      <Modal
        visible={isAiScanOpen}
        animationType="slide"
        onRequestClose={() => setIsAiScanOpen(false)}
      >
        <AIScanModalScreen
          onClose={() => setIsAiScanOpen(false)}
          onContinueToDonation={(scannedData) => {
            setIsAiScanOpen(false);
            setAiScannedData(scannedData);
            setIsCreateModalOpen(true);
          }}
        />
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
