/**
 * FoodShareAI - Secure Token Storage
 * Uses Expo SecureStore for encrypted on-device token storage.
 */
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const TOKEN_KEY = 'foodshareai_jwt_token';
let memoryToken = null;

export const tokenStorage = {
  /**
   * Save JWT access token securely
   * @param {string} token
   */
  saveToken: async (token) => {
    try {
      memoryToken = token;
      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync(TOKEN_KEY, token);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.setItem(TOKEN_KEY, token);
      }
    } catch (err) {
      console.warn('[tokenStorage] Error saving token securely:', err.message);
    }
  },

  /**
   * Retrieve stored JWT access token
   * @returns {Promise<string|null>}
   */
  getToken: async () => {
    try {
      if (memoryToken) return memoryToken;

      if (Platform.OS !== 'web') {
        const stored = await SecureStore.getItemAsync(TOKEN_KEY);
        memoryToken = stored;
        return stored;
      } else if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(TOKEN_KEY);
        memoryToken = stored;
        return stored;
      }
      return null;
    } catch (err) {
      console.warn('[tokenStorage] Error retrieving token:', err.message);
      return memoryToken;
    }
  },

  /**
   * Remove stored JWT access token (Logout)
   */
  removeToken: async () => {
    try {
      memoryToken = null;
      if (Platform.OS !== 'web') {
        await SecureStore.deleteItemAsync(TOKEN_KEY);
      } else if (typeof localStorage !== 'undefined') {
        localStorage.removeItem(TOKEN_KEY);
      }
    } catch (err) {
      console.warn('[tokenStorage] Error removing token:', err.message);
    }
  },
};
