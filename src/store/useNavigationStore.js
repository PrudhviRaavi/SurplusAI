import { create } from 'zustand';

export const useNavigationStore = create((set) => ({
  currentScreen: 'splash', 
  // Available screens:
  // 'splash' | 'onboarding1' | 'onboarding2' | 'onboarding3' | 'landing'
  // 'createAccount' | 'verifyOtp' | 'roleSelection'
  // 'onboardingDonor' | 'onboardingNgo' | 'onboardingVolunteer'
  // 'accountSuccess' | 'login' | 'adminLogin' | 'adminDashboard'
  // 'forgotPassword' | 'forgotOtp' | 'forgotReset' | 'forgotSuccess'

  setCurrentScreen: (screen) => set({ currentScreen: screen }),
  selectedRole: 'donor', // 'donor' | 'ngo' | 'volunteer'
  setSelectedRole: (role) => set({ selectedRole: role }),
  user: null,
  setUser: (user) => set({ user }),
}));
