/**
 * FoodShareAI - Authentication API Service
 * Connects frontend auth screens to the real Express/JWT backend endpoints.
 */
import { apiClient } from './apiClient';
import { tokenStorage } from './tokenStorage';

export const authApiService = {
  /**
   * Register a new public user (Donor, NGO, Volunteer)
   */
  register: async ({ fullName, email, phone, password, role }) => {
    const res = await apiClient.post('/auth/register', {
      fullName,
      email,
      phone,
      password,
      role: role.toUpperCase(),
    });

    if (res.data?.token) {
      await tokenStorage.saveToken(res.data.token);
    }
    return res.data;
  },

  /**
   * Standard user login (Donor, NGO, Volunteer)
   */
  login: async ({ email, password }) => {
    const res = await apiClient.post('/auth/login', {
      email,
      password,
    });

    if (res.data?.token) {
      await tokenStorage.saveToken(res.data.token);
    }
    return res.data;
  },

  /**
   * Dedicated Admin login portal
   */
  adminLogin: async ({ email, password }) => {
    const res = await apiClient.post('/auth/admin/login', {
      email,
      password,
    });

    if (res.data?.token) {
      await tokenStorage.saveToken(res.data.token);
    }
    return res.data;
  },

  /**
   * Get current authenticated user session
   */
  getCurrentUser: async () => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },

  /**
   * Request password reset instructions
   */
  forgotPassword: async (email) => {
    const res = await apiClient.post('/auth/forgot-password', { email });
    return res;
  },

  /**
   * Reset password with reset token
   */
  resetPassword: async ({ token, newPassword }) => {
    const res = await apiClient.post('/auth/reset-password', {
      token,
      newPassword,
    });
    return res;
  },

  /**
   * Logout user and purge token from device storage
   */
  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (_) {
      // Ignore network errors during logout
    } finally {
      await tokenStorage.removeToken();
    }
  },
};
