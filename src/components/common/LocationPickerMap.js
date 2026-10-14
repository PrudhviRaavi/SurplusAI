import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { locationService } from '../../services/location/locationService';
import { OpenStreetMapViewer } from './OpenStreetMapViewer';

const resolveAddressStr = (addr) => {
  if (typeof addr === 'string') return addr;
  if (addr && typeof addr === 'object' && addr.address) return String(addr.address);
  return '124 Luxury Boulevard, Jubilee Hills, Hyderabad';
};

export const LocationPickerMap = ({
  initialAddress = '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
  initialCoords = null,
  onLocationConfirm,
  title = 'PICKUP LOCATION',
  routeCoordinates = null,
  stops = null,
  isDemo = false,
  demoLabel = 'Demo Route — Sample Route',
}) => {
  const [address, setAddress] = useState(resolveAddressStr(initialAddress));
  const [latitude, setLatitude] = useState(
    initialCoords?.latitude || (initialAddress && typeof initialAddress === 'object' && initialAddress.latitude) || 17.43
  );
  const [longitude, setLongitude] = useState(
    initialCoords?.longitude || (initialAddress && typeof initialAddress === 'object' && initialAddress.longitude) || 78.40
  );
  const [isLocating, setIsLocating] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  useEffect(() => {
    if (initialCoords?.latitude && initialCoords?.longitude) {
      setLatitude(initialCoords.latitude);
      setLongitude(initialCoords.longitude);
    }
  }, [initialCoords?.latitude, initialCoords?.longitude]);

  useEffect(() => {
    if (initialAddress) {
      setAddress(resolveAddressStr(initialAddress));
    }
  }, [initialAddress]);

  const notifyConfirm = (addr, lat, lng) => {
    setIsConfirmed(true);
    if (onLocationConfirm) {
      onLocationConfirm({
        address: addr,
        latitude: lat,
        longitude: lng,
        coordinates: [lng, lat],
      });
    }
  };

  /**
   * Acquire device GPS position via Expo Location
   */
  const handleUseCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const res = await locationService.getCurrentPosition();
      setIsLocating(false);

      if (!res.success) {
        const errorMsg = res.message || 'Could not acquire device location.';
        if (Platform.OS === 'web') {
          window.alert(errorMsg);
        } else {
          Alert.alert('Location Notice', errorMsg);
        }
        return;
      }

      const { latitude: lat, longitude: lng } = res.coords;
      const formattedAddress = res.address || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;

      setLatitude(lat);
      setLongitude(lng);
      setAddress(formattedAddress);
      setSearchResults([]);
      notifyConfirm(formattedAddress, lat, lng);
    } catch (err) {
      setIsLocating(false);
      console.warn('[LocationPickerMap] GPS Error:', err.message);
      Alert.alert('Location Error', 'An unexpected error occurred while accessing GPS.');
    }
  };

  /**
   * Search address via Nominatim forward geocoding
   */
  const handleSearchAddress = async (text) => {
    setAddress(text);
    setIsConfirmed(false);
    if (text.length > 3) {
      setSearchLoading(true);
      const results = await locationService.searchAddress(text);
      setSearchLoading(false);
      setSearchResults(results.slice(0, 3));
    } else {
      setSearchResults([]);
    }
  };

  const handleSelectSearchResult = (item) => {
    const lat = item.latitude;
    const lng = item.longitude;
    const shortAddr = item.display_name.split(',').slice(0, 3).join(', ');

    setLatitude(lat);
    setLongitude(lng);
    setAddress(shortAddr);
    setSearchResults([]);
    notifyConfirm(shortAddr, lat, lng);
  };

  return (
    <View style={styles.container}>
      {/* Search / Manual Address Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.pinIcon} />
        <TextInput
          value={address}
          onChangeText={handleSearchAddress}
          placeholder="Enter street or landmark..."
          placeholderTextColor={colors.textMuted}
          style={styles.addressInput}
        />
        {searchLoading && <ActivityIndicator size="small" color={colors.primary} />}
        {address.length > 0 && !searchLoading && (
          <TouchableOpacity
            onPress={() => notifyConfirm(address, latitude, longitude)}
            style={styles.confirmCheck}
          >
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* Auto-suggest dropdown from OpenStreetMap Nominatim */}
      {searchResults.length > 0 && (
        <View style={styles.searchDropdown}>
          {searchResults.map((item, idx) => (
            <TouchableOpacity
              key={`${item.latitude}_${idx}`}
              onPress={() => handleSelectSearchResult(item)}
              style={styles.searchResultItem}
            >
              <Ionicons name="pin-outline" size={14} color={colors.primary} />
              <Text numberOfLines={2} style={styles.searchResultText}>
                {item.display_name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* GPS Current Location Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleUseCurrentLocation}
        disabled={isLocating}
        style={styles.gpsBtn}
      >
        {isLocating ? (
          <ActivityIndicator size="small" color={colors.primary} />
        ) : (
          <Ionicons name="navigate-circle" size={20} color={colors.primary} />
        )}
        <Text style={styles.gpsBtnText}>
          {isLocating ? 'Acquiring GPS position...' : 'Use device current location'}
        </Text>
      </TouchableOpacity>

      {/* OpenStreetMap Real Cartographic Tile Map */}
      <View style={styles.mapGraphicCard}>
        <OpenStreetMapViewer
          latitude={latitude}
          longitude={longitude}
          zoom={stops || routeCoordinates ? 13 : 15}
          height={stops || routeCoordinates ? 220 : 180}
          routeCoordinates={routeCoordinates}
          stops={stops}
          isDemo={isDemo}
          demoLabel={demoLabel}
        />

        {/* Confirmed Banner */}
        {isConfirmed && (
          <View style={styles.confirmedBanner}>
            <Ionicons name="checkmark-circle-sharp" size={16} color="#10B981" />
            <Text style={styles.confirmedText}>OpenStreetMap Coordinates Confirmed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 8,
  },
  pinIcon: {
    marginRight: 10,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textDark,
    fontFamily: 'Poppins',
  },
  confirmCheck: {
    padding: 4,
  },
  searchDropdown: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    gap: 8,
  },
  searchResultText: {
    flex: 1,
    fontSize: 12,
    color: colors.textDark,
    fontFamily: 'Poppins',
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 14,
    gap: 8,
    marginBottom: 12,
  },
  gpsBtnText: {
    fontSize: 13,
    color: colors.primary,
    fontFamily: 'Poppins',
    fontWeight: '700',
  },
  mapGraphicCard: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
  },
  confirmedBanner: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    zIndex: 10,
  },
  confirmedText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#065F46',
  },
});
