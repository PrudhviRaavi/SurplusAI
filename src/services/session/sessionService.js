/**
 * Session Service for FoodShareAI
 * Manages mock user authentication session, active role, and session persistence.
 */

let mockSession = {
  isAuthenticated: true,
  role: 'Donor', // 'Donor' | 'NGO' | 'Volunteer' | 'Admin'
  user: {
    id: 'user-101',
    fullName: 'Prudhvi Raavi',
    email: 'prudhvi@foodshareai.org',
    role: 'Donor',
    isVerified: true,
  },
};

export const sessionService = {
  getCurrentUser: () => mockSession.user,

  getRole: () => mockSession.role,

  isAuthenticated: () => mockSession.isAuthenticated,

  setSession: (role, userDetails = {}) => {
    mockSession = {
      isAuthenticated: true,
      role: role,
      user: {
        ...mockSession.user,
        role: role,
        ...userDetails,
      },
    };
    return mockSession;
  },

  logout: () => {
    mockSession = {
      isAuthenticated: false,
      role: null,
      user: null,
    };
    return mockSession;
  },
};
