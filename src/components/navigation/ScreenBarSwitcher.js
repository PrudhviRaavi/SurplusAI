import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

const SCREEN_LIST = [
  { id: 'splash', label: '1. Splash' },
  { id: 'onboarding1', label: '2. Slide 1' },
  { id: 'onboarding2', label: '3. Slide 2' },
  { id: 'onboarding3', label: '4. Slide 3' },
  { id: 'landing', label: '5. Landing' },
  { id: 'createAccount', label: '6. Create Acc' },
  { id: 'verifyOtp', label: '7. Verify OTP' },
  { id: 'roles', label: '8. Roles' },
  { id: 'onboardingDonor', label: '9. Donor Setup' },
  { id: 'onboardingNgo', label: '10. NGO Setup' },
  { id: 'onboardingVolunteer', label: '11. Vol Setup' },
  { id: 'accountSuccess', label: '12. Success' },
  { id: 'donorDashboard', label: '★ DONOR DASHBOARD' },
  { id: 'ngoDashboard', label: '★ NGO DASHBOARD' },
  { id: 'volunteerDashboard', label: '★ VOLUNTEER DASHBOARD' },
  { id: 'login', label: '13. Login' },
  { id: 'adminLogin', label: '14. Admin Login' },
  { id: 'adminDashboard', label: '15. Admin Dash' },
  { id: 'forgotPassword', label: '16. Forgot Pass' },
];

export const ScreenBarSwitcher = ({ activeScreen, onSelectScreen }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.headerLabel}>FOODSHARE AI – ARCHITECTURE PREVIEW SWITCHER</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {SCREEN_LIST.map((item) => {
          const isActive = activeScreen === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.8}
              onPress={() => onSelectScreen(item.id)}
              style={[
                styles.pill,
                isActive && styles.activePill,
              ]}
            >
              <Text
                style={[
                  styles.pillText,
                  isActive && styles.activePillText,
                ]}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2A3B31',
    paddingTop: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#A8B5A2',
    letterSpacing: 1.2,
    paddingHorizontal: 16,
    marginBottom: 4,
  },
  scrollContainer: {
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    marginHorizontal: 4,
  },
  activePill: {
    backgroundColor: colors.primary,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#E8DCC8',
  },
  activePillText: {
    color: '#FFFFFF',
  },
});
