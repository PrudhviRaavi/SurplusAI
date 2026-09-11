/**
 * User Profile & Settings Service for FoodShareAI
 */

let mockUserProfile = {
  fullName: 'Prudhvi Raavi',
  role: 'Donor',
  email: 'prudhvi@foodshareai.org',
  phone: '+91 98765 43210',
  location: 'Jubilee Hills, Hyderabad',
  isVerified: true,
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop',
};

let mockUserSettings = {
  theme: 'System', // 'Light' | 'Dark' | 'System'
  notificationsEnabled: true,
  donationUpdatesNotif: true,
  claimUpdatesNotif: true,
  deliveryUpdatesNotif: true,
  impactAchievementsNotif: true,
  locationAccessEnabled: true,
  language: 'English',
};

export const profileService = {
  getProfile: () => mockUserProfile,

  updateProfile: (updatedFields) => {
    mockUserProfile = { ...mockUserProfile, ...updatedFields };
    return mockUserProfile;
  },

  getSettings: () => mockUserSettings,

  updateSettings: (updatedSettings) => {
    mockUserSettings = { ...mockUserSettings, ...updatedSettings };
    return mockUserSettings;
  },
};
