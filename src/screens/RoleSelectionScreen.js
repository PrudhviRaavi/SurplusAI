import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { StepProgressBar } from '../components/common/StepProgressBar';
import { LuxuryButton } from '../components/common/LuxuryButton';
import { LuxuryCard } from '../components/common/LuxuryCard';
import {
  RoleDonorIllustration,
  RoleReceiverIllustration,
  RoleVolunteerIllustration,
} from '../components/illustrations/FoodShareIllustrations';
import { colors } from '../theme/colors';

const publicRoles = [
  {
    id: 'donor',
    title: 'Donor',
    subtitle: 'I have surplus food to share',
    tags: 'Restaurants · Hotels · Canteens · Events · Individuals',
    badge: 'Food Provider',
    Illustration: RoleDonorIllustration,
  },
  {
    id: 'ngo',
    title: 'NGO / Receiver',
    subtitle: 'I help distribute food to communities',
    tags: 'NGOs · Shelters · Community kitchens · Food banks',
    badge: 'Impact Receiver',
    Illustration: RoleReceiverIllustration,
  },
  {
    id: 'volunteer',
    title: 'Volunteer',
    subtitle: 'I want to help move food where it\'s needed',
    tags: 'Delivery · Pickup · Community logistics',
    badge: 'Food Rescue Helper',
    Illustration: RoleVolunteerIllustration,
  },
];

export const RoleSelectionScreen = ({ onContinue, onBack }) => {
  const [selectedRoleId, setSelectedRoleId] = useState('donor');

  const selectedRole = publicRoles.find((r) => r.id === selectedRoleId);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Step Progress Header */}
        <StepProgressBar
          currentStep={3}
          totalSteps={3}
          stepTitle="How would you like to use FoodShareAI?"
          stepSubtitle="Choose the role that best describes your food rescue participation."
          onBack={onBack}
        />

        {/* Public Role Cards List */}
        <View style={styles.cardsContainer}>
          {publicRoles.map((item) => {
            const isSelected = item.id === selectedRoleId;
            return (
              <LuxuryCard
                key={item.id}
                onPress={() => setSelectedRoleId(item.id)}
                selected={isSelected}
                style={[
                  styles.roleCard,
                  isSelected && styles.roleCardActive,
                ]}
                elevation={isSelected ? 'medium' : 'subtle'}
              >
                <View style={styles.cardHeaderRow}>
                  <item.Illustration />
                  <View
                    style={[
                      styles.radioOuter,
                      isSelected && styles.radioOuterSelected,
                    ]}
                  >
                    {isSelected && <Ionicons name="checkmark" size={14} color={colors.white} />}
                  </View>
                </View>

                <View style={styles.cardBody}>
                  <View style={styles.badgePill}>
                    <Text style={styles.badgePillText}>{item.badge}</Text>
                  </View>

                  <Text style={styles.roleTitle}>{item.title}</Text>
                  <Text style={styles.roleSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.roleTags}>{item.tags}</Text>
                </View>
              </LuxuryCard>
            );
          })}
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={styles.footerCta}>
        <LuxuryButton
          title={`Continue as ${selectedRole ? selectedRole.title : 'Selected Role'} →`}
          onPress={() => onContinue && onContinue(selectedRoleId)}
          variant="primary"
          size="large"
        />
      </View>
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
    paddingBottom: 120,
  },
  cardsContainer: {
    marginTop: 4,
  },
  roleCard: {
    padding: 20,
    marginVertical: 8,
    borderRadius: 28,
  },
  roleCardActive: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#FAF4EB',
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
  },
  radioOuterSelected: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  cardBody: {
    alignItems: 'flex-start',
  },
  badgePill: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginBottom: 8,
  },
  badgePillText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  roleTitle: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  roleSubtitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.primary,
    marginBottom: 6,
  },
  roleTags: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 18,
  },
  footerCta: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
