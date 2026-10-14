import React, { useEffect } from 'react';
import { SplashScreen } from '../screens/SplashScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { LandingScreen } from '../screens/LandingScreen';
import { View, StyleSheet, SafeAreaView } from 'react-native';
import { authApiService } from '../services/api/authApiService';
import { tokenStorage } from '../services/api/tokenStorage';
import { ScreenBarSwitcher } from '../components/navigation/ScreenBarSwitcher';
import { useNavigationStore } from '../store/useNavigationStore';
import { useAppStore } from '../store/useAppStore';
import { colors } from '../theme/colors';
import { CreateAccountScreen } from '../screens/CreateAccountScreen';
import { VerifyOtpScreen } from '../screens/VerifyOtpScreen';
import { RoleSelectionScreen } from '../screens/RoleSelectionScreen';
import { DonorOnboardingScreen } from '../screens/DonorOnboardingScreen';
import { NgoOnboardingScreen } from '../screens/NgoOnboardingScreen';
import { VolunteerOnboardingScreen } from '../screens/VolunteerOnboardingScreen';
import { AccountSuccessScreen } from '../screens/AccountSuccessScreen';

import { DonorDashboardScreen } from '../screens/donor/DonorDashboardScreen';
import { NgoDashboardScreen } from '../screens/ngo/NgoDashboardScreen';
import { VolunteerDashboardScreen } from '../screens/volunteer/VolunteerDashboardScreen';

import { LoginScreen } from '../screens/LoginScreen';
import { AdminLoginScreen } from '../screens/AdminLoginScreen';
import { AdminDashboardScreen } from '../screens/AdminDashboardScreen';
import { ForgotPasswordFlow } from '../screens/ForgotPasswordFlow';

export const AppNavigator = () => {
  const { currentScreen, setCurrentScreen, selectedRole, setSelectedRole } =
    useNavigationStore();
  const { activeRole, setActiveRole, formData } = useAppStore();

  // Session restoration on mobile boot
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const token = await tokenStorage.getToken();
        if (!token) return;

        const user = await authApiService.getCurrentUser();
        if (user && user.role) {
          const role = user.role.toUpperCase();
          if (role === 'DONOR') {
            setActiveRole('Donor');
            setSelectedRole('donor');
            setCurrentScreen('donorDashboard');
          } else if (role === 'NGO') {
            setActiveRole('NGO');
            setSelectedRole('ngo');
            setCurrentScreen('ngoDashboard');
          } else if (role === 'VOLUNTEER') {
            setActiveRole('Volunteer');
            setSelectedRole('volunteer');
            setCurrentScreen('volunteerDashboard');
          } else if (role === 'ADMIN') {
            setActiveRole('Admin');
            setCurrentScreen('adminDashboard');
          }
        }
      } catch (err) {
        // Invalid or expired token; remove it
        await tokenStorage.removeToken();
      }
    };

    restoreSession();
  }, []);

  const handleRoleContinue = async (roleId) => {
    setSelectedRole(roleId);

    // Call real public registration if credentials were provided
    try {
      if (formData.email && formData.password) {
        await authApiService.register({
          fullName: formData.fullName || 'FoodShare User',
          email: formData.email,
          phone: formData.phone || '',
          password: formData.password,
          role: roleId.toUpperCase(),
        });
      }
    } catch (err) {
      console.warn('[Registration notice]', err.message);
    }

    if (roleId === 'donor') {
      setActiveRole('Donor');
      setCurrentScreen('onboardingDonor');
    } else if (roleId === 'ngo') {
      setActiveRole('NGO');
      setCurrentScreen('onboardingNgo');
    } else if (roleId === 'volunteer') {
      setActiveRole('Volunteer');
      setCurrentScreen('onboardingVolunteer');
    } else {
      setCurrentScreen('landing');
    }
  };

  const renderActiveScreen = () => {
    switch (currentScreen) {
      case 'splash':
        console.log('[AppNavigator] Rendering SplashScreen (currentScreen:', currentScreen, ')');
        return (
          <SplashScreen
            onFinish={() => {
              console.log('[AppNavigator] SplashScreen onFinish triggered, calling setCurrentScreen("onboarding1")');
              setCurrentScreen('onboarding1');
            }}
          />
        );

      case 'onboarding1':
        return (
          <OnboardingScreen
            initialSlideIndex={0}
            onComplete={() => setCurrentScreen('landing')}
          />
        );

      case 'onboarding2':
        return (
          <OnboardingScreen
            initialSlideIndex={1}
            onComplete={() => setCurrentScreen('landing')}
          />
        );

      case 'onboarding3':
        return (
          <OnboardingScreen
            initialSlideIndex={2}
            onComplete={() => setCurrentScreen('landing')}
          />
        );

      case 'createAccount':
      case 'signup':
        return (
          <CreateAccountScreen
            onNext={() => setCurrentScreen('verifyOtp')}
            onBack={() => setCurrentScreen('landing')}
            onNavigateToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'verifyOtp':
        return (
          <VerifyOtpScreen
            onNext={() => setCurrentScreen('roles')}
            onBack={() => setCurrentScreen('createAccount')}
          />
        );

      case 'roles':
        return (
          <RoleSelectionScreen
            onContinue={handleRoleContinue}
            onBack={() => setCurrentScreen('landing')}
          />
        );

      case 'onboardingDonor':
        return (
          <DonorOnboardingScreen
            onComplete={() => setCurrentScreen('accountSuccess')}
            onBackToRoleSelection={() => setCurrentScreen('roles')}
          />
        );

      case 'onboardingNgo':
        return (
          <NgoOnboardingScreen
            onComplete={() => setCurrentScreen('accountSuccess')}
            onBackToRoleSelection={() => setCurrentScreen('roles')}
          />
        );

      case 'onboardingVolunteer':
        return (
          <VolunteerOnboardingScreen
            onComplete={() => setCurrentScreen('accountSuccess')}
            onBackToRoleSelection={() => setCurrentScreen('roles')}
          />
        );

      case 'accountSuccess':
        return (
          <AccountSuccessScreen
            onGoToDashboard={() => {
              if (activeRole === 'NGO' || selectedRole === 'ngo') {
                setCurrentScreen('ngoDashboard');
              } else if (activeRole === 'Volunteer' || selectedRole === 'volunteer') {
                setCurrentScreen('volunteerDashboard');
              } else {
                setCurrentScreen('donorDashboard');
              }
            }}
          />
        );

      case 'donorDashboard':
        return (
          <DonorDashboardScreen
            onLogout={() => setCurrentScreen('login')}
          />
        );

      case 'ngoDashboard':
        return (
          <NgoDashboardScreen
            onLogout={() => setCurrentScreen('login')}
          />
        );

      case 'volunteerDashboard':
        return (
          <VolunteerDashboardScreen
            onLogout={() => setCurrentScreen('login')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onSignIn={(userRole) => {
              // Route using the role returned by the server (passed from LoginScreen.handleLogin).
              // Do NOT read activeRole/selectedRole from closure – those are render-time stale values.
              const role = (userRole || '').toUpperCase();
              if (role === 'NGO') {
                setActiveRole('NGO');
                setSelectedRole('ngo');
                setCurrentScreen('ngoDashboard');
              } else if (role === 'VOLUNTEER') {
                setActiveRole('Volunteer');
                setSelectedRole('volunteer');
                setCurrentScreen('volunteerDashboard');
              } else if (role === 'ADMIN') {
                setActiveRole('Admin');
                setCurrentScreen('adminDashboard');
              } else {
                // DONOR or any unrecognized role
                setActiveRole('Donor');
                setSelectedRole('donor');
                setCurrentScreen('donorDashboard');
              }
            }}
            onNavigateToSignUp={() => setCurrentScreen('createAccount')}
            onNavigateToForgotPassword={() => setCurrentScreen('forgotPassword')}
            onNavigateToAdminLogin={() => setCurrentScreen('adminLogin')}
            onBack={() => setCurrentScreen('landing')}
          />
        );

      case 'adminLogin':
        return (
          <AdminLoginScreen
            onAdminLogin={() => setCurrentScreen('adminDashboard')}
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'adminDashboard':
        return (
          <AdminDashboardScreen
            onLogout={() => setCurrentScreen('login')}
          />
        );

      case 'forgotPassword':
      case 'forgotOtp':
      case 'forgotReset':
      case 'forgotSuccess':
        return (
          <ForgotPasswordFlow
            onBackToLogin={() => setCurrentScreen('login')}
          />
        );

      case 'landing':
      default:
        return (
          <LandingScreen
            onNavigateToLogin={() => setCurrentScreen('login')}
            onNavigateToSignUp={() => setCurrentScreen('createAccount')}
            onContinueGuest={() => setCurrentScreen('roles')}
          />
        );
    }
  };

  return (
    <View style={styles.mainShell}>
      {/* Top Preview Switcher Bar for Architecture Testing — DEV only, hidden on splash */}
      {typeof __DEV__ !== 'undefined' && __DEV__ && currentScreen !== 'splash' && (
        <SafeAreaView style={styles.devBarSafeArea}>
          <ScreenBarSwitcher
            activeScreen={currentScreen}
            onSelectScreen={(screenId) => setCurrentScreen(screenId)}
          />
        </SafeAreaView>
      )}

      {/* Active Screen Container */}
      <View style={styles.screenCanvas}>{renderActiveScreen()}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainShell: {
    flex: 1,
    backgroundColor: colors.background,
  },
  devBarSafeArea: {
    backgroundColor: '#2A3B31',
  },
  screenCanvas: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
