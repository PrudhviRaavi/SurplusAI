/**
 * FoodShareAI - Frontend API Configuration
 * Configurable base URL for local development, LAN devices, and production.
 */
import { Platform } from 'react-native';

// Priority: 1. EXPO_PUBLIC_API_URL env var, 2. Platform default
const getBaseUrl = () => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  // Android emulator loopback alias is 10.0.2.2
  // Real device or iOS simulator uses localhost or local IP
  if (Platform.OS === 'android') {
    // When debugging on physical Android or emulator
    return 'http://10.0.2.2:5000/api';
  }

  return 'http://127.0.0.1:5000/api';
};

export const API_BASE_URL = getBaseUrl();
