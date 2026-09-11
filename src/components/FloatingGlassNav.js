import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useNavigationStore } from '../store/useNavigationStore';

export const FloatingGlassNav = () => {
  const { activeTab, setActiveTab, openScannerModal } = useNavigationStore();

  const navItems = [
    { id: 'Home', label: 'Home', icon: 'home-sharp' },
    { id: 'Map', label: 'Map', icon: 'map-sharp' },
    { id: 'AIScan', label: 'AI Scan', icon: 'scan-sharp', isCenter: true },
    { id: 'Notifications', label: 'Alerts', icon: 'notifications-sharp' },
    { id: 'Profile', label: 'Profile', icon: 'person-sharp' },
  ];

  return (
    <View style={styles.floatingNavWrapper}>
      <View style={styles.glassBar}>
        {navItems.map((item) => {
          if (item.isCenter) {
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                onPress={openScannerModal}
                style={styles.centerFabContainer}
              >
                <View style={styles.glowRing} />
                <LinearGradient
                  colors={colors.gradientPurpleBlue}
                  style={styles.fabCircle}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <Ionicons name="scan-sharp" size={26} color={colors.white} />
                </LinearGradient>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === item.id;

          return (
            <TouchableOpacity
              key={item.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(item.id)}
              style={styles.tabButton}
            >
              <Ionicons
                name={item.icon}
                size={20}
                color={isActive ? colors.cyanAccent : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabText,
                  { color: isActive ? colors.cyanAccent : colors.textMuted },
                ]}
              >
                {item.label}
              </Text>

              {isActive && <View style={styles.activeIndicator} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  floatingNavWrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  glassBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-around',
    width: '100%',
    maxWidth: 420,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.primaryPurple,
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 18,
      },
      android: {
        elevation: 10,
      },
      web: {
        backdropFilter: 'blur(20px)',
        boxShadow: '0px 10px 30px rgba(124, 58, 237, 0.25)',
      },
    }),
  },
  tabButton: {
    alignItems: 'center',
    justify: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    position: 'relative',
  },
  tabText: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    marginTop: 2,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.cyanAccent,
  },
  centerFabContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -26,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
  },
  glowRing: {
    position: 'absolute',
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
  },
  fabCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justify: 'center',
    shadowColor: colors.primaryPurple,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.7,
    shadowRadius: 12,
    elevation: 8,
  },
});
