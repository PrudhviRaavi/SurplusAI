import React from 'react';
import { ScrollView, View, Text, StyleSheet, SafeAreaView, StatusBar, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { AuroraBackground } from '../components/AuroraBackground';
import { CommandCenterHeader } from '../components/CommandCenterHeader';
import { AICommandCard } from '../components/AICommandCard';
import { FloatingWidgets } from '../components/FloatingWidgets';
import { InteractiveMapPreview } from '../components/InteractiveMapPreview';
import { AnalyticsBentoGrid } from '../components/AnalyticsBentoGrid';
import { AIFeaturesGlassGrid } from '../components/AIFeaturesGlassGrid';
import { AIWorkflowPipeline } from '../components/AIWorkflowPipeline';
import { CTASection } from '../components/CTASection';
import { Footer } from '../components/Footer';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useNavigationStore } from '../store/useNavigationStore';

export const HomeScreen = () => {
  const { openScannerModal, setActiveTab } = useNavigationStore();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={colors.background} />

      {/* Aurora Ambient Mesh Background */}
      <AuroraBackground />

      {/* Header */}
      <CommandCenterHeader
        onNotificationPress={() => setActiveTab('Notifications')}
        onProfilePress={() => setActiveTab('Profile')}
      />

      {/* Scrollable Command Center View */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* 1. Hero Title & Aurora Tag */}
        <View style={styles.heroSection}>
          <View style={styles.auroraTagPill}>
            <Ionicons name="hardware-chip-sharp" size={13} color={colors.cyanAccent} />
            <Text style={styles.auroraTagText}>NEURAL FOOD REDISTRIBUTION V2.4</Text>
          </View>

          <Text style={styles.mainHeading}>Intelligent Food Rescue</Text>

          <Text style={styles.subHeading}>
            Powered by Computer Vision & Predictive AI
          </Text>

          {/* 2. Floating AI Command Card */}
          <AICommandCard onOpenScanner={openScannerModal} />
        </View>

        {/* 3. Live Telemetry Widgets */}
        <FloatingWidgets />

        {/* 4. Interactive Map Card */}
        <InteractiveMapPreview onFullMapPress={() => setActiveTab('Map')} />

        {/* 5. Command Analytics Bento Grid */}
        <AnalyticsBentoGrid />

        {/* 6. AI Features Glass Grid */}
        <AIFeaturesGlassGrid />

        {/* 7. AI Workflow Execution Pipeline */}
        <AIWorkflowPipeline />

        {/* 8. Call To Action (CTA) Banner */}
        <CTASection
          onDonorRegister={openScannerModal}
          onNGORegister={() => setActiveTab('Map')}
        />

        {/* 9. Minimal Footer */}
        <Footer />
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
    paddingBottom: 110, // Spacing for floating bottom bar
  },
  heroSection: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 12,
    alignItems: 'center',
  },
  auroraTagPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.35)',
    marginBottom: 16,
  },
  auroraTagText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.cyanAccent,
    letterSpacing: 0.8,
  },
  mainHeading: {
    fontFamily: fontFamily.headingBold,
    fontSize: Platform.OS === 'web' ? 36 : 28,
    lineHeight: Platform.OS === 'web' ? 44 : 36,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.6,
  },
  subHeading: {
    fontFamily: fontFamily.bodyRegular,
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 480,
    marginBottom: 8,
  },
});
