import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../theme/colors';

const { width } = Dimensions.get('window');

export const AuroraBackground = () => {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {/* Dark Base Background */}
      <View style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.background }]} />

      {/* Top Left Purple Aurora Glow */}
      <View style={styles.purpleAuroraBlob}>
        <LinearGradient
          colors={['rgba(124, 58, 237, 0.35)', 'rgba(124, 58, 237, 0.05)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        />
      </View>

      {/* Top Right Blue/Cyan Aurora Glow */}
      <View style={styles.blueAuroraBlob}>
        <LinearGradient
          colors={['rgba(59, 130, 246, 0.3)', 'rgba(6, 182, 212, 0.08)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
          start={{ x: 1, y: 0 }}
          end={{ x: 0, y: 1 }}
        />
      </View>

      {/* Center Subtle Mesh Overlay */}
      <View style={styles.meshCenterGlow}>
        <LinearGradient
          colors={['rgba(124, 58, 237, 0.12)', 'rgba(59, 130, 246, 0.15)', 'transparent']}
          style={StyleSheet.absoluteFillObject}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  purpleAuroraBlob: {
    position: 'absolute',
    top: -100,
    left: -80,
    width: width * 0.9,
    height: 380,
    borderRadius: 190,
  },
  blueAuroraBlob: {
    position: 'absolute',
    top: -60,
    right: -100,
    width: width * 0.85,
    height: 360,
    borderRadius: 180,
  },
  meshCenterGlow: {
    position: 'absolute',
    top: '30%',
    left: '10%',
    width: '80%',
    height: 300,
    borderRadius: 150,
    opacity: 0.8,
  },
});
