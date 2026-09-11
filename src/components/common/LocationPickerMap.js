import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const LocationPickerMap = ({
  initialAddress = '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
  onLocationConfirm,
}) => {
  const [address, setAddress] = useState(initialAddress);
  const [isConfirmed, setIsConfirmed] = useState(true);

  const handleUseCurrentLocation = () => {
    setAddress('Jubilee Hills Checkpost, Hyderabad (Current GPS Location)');
    setIsConfirmed(true);
    if (onLocationConfirm) onLocationConfirm(address);
  };

  return (
    <View style={styles.container}>
      {/* Search / Manual Address Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="location-outline" size={20} color={colors.primary} style={styles.pinIcon} />
        <TextInput
          value={address}
          onChangeText={(text) => {
            setAddress(text);
            setIsConfirmed(false);
          }}
          placeholder="Enter address manually..."
          placeholderTextColor={colors.textMuted}
          style={styles.addressInput}
        />
        {address.length > 0 && (
          <TouchableOpacity onPress={() => setIsConfirmed(true)} style={styles.confirmCheck}>
            <Ionicons name="checkmark-circle" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}
      </View>

      {/* GPS Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleUseCurrentLocation}
        style={styles.gpsBtn}
      >
        <Ionicons name="navigate-circle" size={20} color={colors.primary} />
        <Text style={styles.gpsBtnText}>Use my current location</Text>
      </TouchableOpacity>

      {/* Map Graphic Box */}
      <View style={styles.mapGraphicCard}>
        <View style={styles.mapBackground}>
          <View style={styles.roadLineHorizontal} />
          <View style={styles.roadLineVertical} />
          <View style={styles.greenZone} />

          {/* Animated Center Pin */}
          <View style={styles.markerContainer}>
            <View style={styles.markerBubble}>
              <Text style={styles.markerEmoji}>📍</Text>
            </View>
            <View style={styles.markerShadow} />
          </View>
        </View>

        {/* Confirmed Banner */}
        {isConfirmed && (
          <View style={styles.confirmedBanner}>
            <Ionicons name="checkmark-circle-sharp" size={18} color="#10B981" />
            <Text style={styles.confirmedText}>Location confirmed</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 10,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 1,
  },
  pinIcon: {
    marginRight: 10,
  },
  addressInput: {
    flex: 1,
    fontSize: 14,
    color: colors.textPrimary,
    fontFamily: 'Poppins',
    fontWeight: '500',
  },
  confirmCheck: {
    padding: 4,
  },
  gpsBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingVertical: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.15)',
    marginBottom: 14,
  },
  gpsBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 8,
  },
  mapGraphicCard: {
    height: 150,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#EBE5D9',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#EAE3D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  roadLineHorizontal: {
    position: 'absolute',
    top: '50%',
    left: 0,
    right: 0,
    height: 24,
    backgroundColor: '#FFFFFF',
    transform: [{ translateY: -12 }],
  },
  roadLineVertical: {
    position: 'absolute',
    left: '50%',
    top: 0,
    bottom: 0,
    width: 24,
    backgroundColor: '#FFFFFF',
    transform: [{ translateX: -12 }],
  },
  greenZone: {
    position: 'absolute',
    top: 10,
    left: 10,
    width: 80,
    height: 60,
    borderRadius: 16,
    backgroundColor: '#D1E0D7',
  },
  markerContainer: {
    alignItems: 'center',
    zIndex: 10,
  },
  markerBubble: {
    backgroundColor: colors.surface,
    padding: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  markerEmoji: {
    fontSize: 22,
  },
  markerShadow: {
    width: 14,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 4,
  },
  confirmedBanner: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  confirmedText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#065F46',
    marginLeft: 6,
  },
});
