/**
 * FoodShareAI - Frontend API & ML URL Configuration
 *
 * Configurable base URLs for:
 * 1. Physical Android devices (via laptop LAN IP in EXPO_PUBLIC_API_URL or EXPO_PUBLIC_DEV_HOST)
 * 2. Android emulator (via 10.0.2.2 host loopback when EXPO_PUBLIC_USE_EMULATOR=true)
 * 3. iOS simulator / desktop web (127.0.0.1)
 *
 * Guarantees:
 * - Express base URL contains '/api' exactly once.
 * - ML base URL targets intended service and port without trailing slashes.
 * - Never silently falls back to 127.0.0.1 or 10.0.2.2 on a physical Android device without configuration.
 */
import { Platform } from 'react-native';

/**
 * Normalizes an API URL to ensure the '/api' suffix is present exactly once,
 * stripping trailing slashes and preventing double-nested '/api/api'.
 */
export const normalizeApiUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  const trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api') || trimmed.includes('/api/')) {
    return trimmed;
  }
  return `${trimmed}/api`;
};

/**
 * Normalizes an ML microservice base URL, stripping trailing slashes
 * and removing any accidental '/api' suffix since ML routes define their own prefixes.
 */
export const normalizeMlUrl = (url) => {
  if (!url || typeof url !== 'string') return '';
  let trimmed = url.trim().replace(/\/+$/, '');
  if (trimmed.endsWith('/api')) {
    trimmed = trimmed.slice(0, -4);
  }
  return trimmed;
};

const getBaseUrl = () => {
  // 1. Explicit full API URL from environment variable (highest priority)
  if (process.env.EXPO_PUBLIC_API_URL) {
    return normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);
  }

  // 2. Dev host configured via LAN IP or hostname
  if (process.env.EXPO_PUBLIC_DEV_HOST) {
    const port = process.env.EXPO_PUBLIC_API_PORT || '5000';
    return normalizeApiUrl(`http://${process.env.EXPO_PUBLIC_DEV_HOST}:${port}`);
  }

  // 3. Android platform handling
  if (Platform.OS === 'android') {
    // If explicitly running on an emulator:
    if (process.env.EXPO_PUBLIC_USE_EMULATOR === 'true') {
      return 'http://10.0.2.2:5000/api';
    }

    // On physical Android device without LAN configuration, log actionable guidance
    console.error(
      '[apiConfig] Configuration Error: Android device detected without LAN host configuration. ' +
      'Physical Android devices cannot connect to 127.0.0.1 or 10.0.2.2. ' +
      'Please set EXPO_PUBLIC_API_URL (e.g. http://<YOUR_LAN_IP>:5000/api) or EXPO_PUBLIC_DEV_HOST in your .env, ' +
      'or set EXPO_PUBLIC_USE_EMULATOR=true if running on an Android emulator.'
    );
    return '__UNCONFIGURED_ANDROID_LAN_HOST__/api';
  }

  // 4. iOS simulator or Web local development
  return 'http://127.0.0.1:5000/api';
};

export const API_BASE_URL = getBaseUrl();

const getMlBaseUrl = () => {
  // 1. Explicit full ML URL from environment variable (highest priority)
  if (process.env.EXPO_PUBLIC_ML_URL) {
    return normalizeMlUrl(process.env.EXPO_PUBLIC_ML_URL);
  }

  const mlPort = process.env.EXPO_PUBLIC_ML_PORT || '8002';

  // 2. Dev host configured via LAN IP or hostname
  if (process.env.EXPO_PUBLIC_DEV_HOST) {
    return normalizeMlUrl(`http://${process.env.EXPO_PUBLIC_DEV_HOST}:${mlPort}`);
  }

  // 3. Android platform handling
  if (Platform.OS === 'android') {
    // If explicitly running on an emulator:
    if (process.env.EXPO_PUBLIC_USE_EMULATOR === 'true') {
      return `http://10.0.2.2:${mlPort}`;
    }

    // On physical Android device without LAN configuration
    console.error(
      '[apiConfig] Configuration Error: Android device detected without ML LAN host configuration. ' +
      'Please set EXPO_PUBLIC_ML_URL (e.g. http://<YOUR_LAN_IP>:8002) or EXPO_PUBLIC_DEV_HOST in your .env.'
    );
    return `__UNCONFIGURED_ANDROID_LAN_HOST__:${mlPort}`;
  }

  // 4. iOS simulator or Web local development
  return `http://127.0.0.1:${mlPort}`;
};

export const ML_BASE_URL = getMlBaseUrl();
