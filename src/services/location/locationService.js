/**
 * FoodShareAI - Device Location & OpenStreetMap Nominatim Service
 *
 * Provides:
 * 1. Device GPS location using Expo Location with foreground permissions
 * 2. Reverse geocoding via OpenStreetMap Nominatim with local memory caching
 * 3. Forward geocoding / address lookup via OpenStreetMap Nominatim
 * 4. Haversine distance calculation between coordinates
 *
 * Compliance:
 * - Uses custom User-Agent identifying FoodShareAI
 * - Memory caching prevents redundant Nominatim requests
 * - Zero Google Maps API keys or paid map dependencies
 */
import * as Location from 'expo-location';

const NOMINATIM_BASE_URL = 'https://nominatim.openstreetmap.org';
const USER_AGENT = 'FoodShareAI-Mobile/1.0 (https://foodshareai.org; contact@foodshareai.org)';

// Local in-memory geocoding cache (lat_lng -> address) and (query -> coordinates)
const geocodeCache = new Map();
const searchCache = new Map();

/**
 * Calculates Haversine distance in kilometers between two [lng, lat] or {latitude, longitude} points
 */
export const calculateDistanceKm = (pointA, pointB) => {
  if (!pointA || !pointB) return null;

  let lat1, lon1, lat2, lon2;
  if (Array.isArray(pointA)) {
    [lon1, lat1] = pointA;
  } else {
    lat1 = pointA.latitude ?? pointA.lat;
    lon1 = pointA.longitude ?? pointA.lng ?? pointA.lon;
  }

  if (Array.isArray(pointB)) {
    [lon2, lat2] = pointB;
  } else {
    lat2 = pointB.latitude ?? pointB.lat;
    lon2 = pointB.longitude ?? pointB.lng ?? pointB.lon;
  }

  if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) return null;

  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
};

export const locationService = {
  /**
   * Requests foreground location permission from device
   */
  requestPermission: async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      return {
        granted: status === 'granted',
        status,
      };
    } catch (err) {
      console.warn('[locationService] Permission request error:', err.message);
      return {
        granted: false,
        status: 'error',
        error: err.message,
      };
    }
  },

  /**
   * Retrieves device's actual GPS position
   */
  getCurrentPosition: async () => {
    try {
      const permission = await locationService.requestPermission();
      if (!permission.granted) {
        return {
          success: false,
          error: 'LOCATION_PERMISSION_DENIED',
          message: 'Location permission was denied. Please allow location access or select an address manually.',
        };
      }

      // Check if location services are enabled on device
      const isEnabled = await Location.hasServicesEnabledAsync();
      if (!isEnabled) {
        return {
          success: false,
          error: 'LOCATION_SERVICES_DISABLED',
          message: 'Location services are disabled on your device. Please turn on GPS.',
        };
      }

      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude, accuracy } = position.coords;

      // Reverse geocode to human readable street address
      const addressResult = await locationService.reverseGeocode(latitude, longitude);

      return {
        success: true,
        coords: {
          latitude,
          longitude,
          accuracy,
        },
        address: addressResult.formattedAddress,
        addressDetails: addressResult.details,
      };
    } catch (err) {
      console.warn('[locationService] getCurrentPosition error:', err.message);
      return {
        success: false,
        error: 'LOCATION_FETCH_FAILED',
        message: err.message || 'Could not acquire current GPS location. Please enter manually.',
      };
    }
  },

  /**
   * Reverse geocodes coordinates to street address via OpenStreetMap Nominatim
   */
  reverseGeocode: async (latitude, longitude) => {
    const cacheKey = `${latitude.toFixed(4)}_${longitude.toFixed(4)}`;
    if (geocodeCache.has(cacheKey)) {
      return geocodeCache.get(cacheKey);
    }

    try {
      const url = `${NOMINATIM_BASE_URL}/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Nominatim error HTTP ${response.status}`);
      }

      const data = await response.json();
      const addr = data.address || {};

      // Build clean short address
      const parts = [
        addr.road || addr.suburb || addr.neighbourhood,
        addr.city || addr.town || addr.county,
        addr.state,
      ].filter(Boolean);

      const formatted = parts.length > 0 ? parts.join(', ') : data.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;

      const result = {
        formattedAddress: formatted,
        fullAddress: data.display_name,
        details: addr,
      };

      geocodeCache.set(cacheKey, result);
      return result;
    } catch (err) {
      console.warn('[locationService] Reverse geocode error:', err.message);
      const fallback = {
        formattedAddress: `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`,
        fullAddress: '',
        details: {},
      };
      return fallback;
    }
  },

  /**
   * Forward geocodes an address string to coordinates via OpenStreetMap Nominatim
   */
  searchAddress: async (query) => {
    const trimmed = (query || '').trim();
    if (!trimmed || trimmed.length < 3) return [];

    if (searchCache.has(trimmed.toLowerCase())) {
      return searchCache.get(trimmed.toLowerCase());
    }

    try {
      const url = `${NOMINATIM_BASE_URL}/search?format=json&q=${encodeURIComponent(trimmed)}&limit=5&addressdetails=1`;
      const response = await fetch(url, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/json',
        },
      });

      if (!response.ok) return [];

      const list = await response.json();
      const mapped = list.map((item) => ({
        display_name: item.display_name,
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      }));

      searchCache.set(trimmed.toLowerCase(), mapped);
      return mapped;
    } catch (err) {
      console.warn('[locationService] Search address error:', err.message);
      return [];
    }
  },

  calculateDistanceKm,
};
