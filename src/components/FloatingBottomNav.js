import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';
import { useNavigationStore } from '../store/useNavigationStore';

export const FloatingBottomNav = () => {
  const { isDarkMode } = useThemeStore();
  const { activeTab, setActiveTab, openScannerModal } = useNavigationStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const tabs = [
    { id: 'Home', label: 'Home', icon: 'home-sharp' },
    { id: 'Map', label: 'Map', icon: 'map-sharp' },
    { id: 'AIScan', label: 'AI Scan', icon: 'scan-circle-sharp', isCenter: true },
    { id: 'Notifications', label: 'Alerts', icon: 'notifications-sharp' },
    { id: 'Profile', label: 'Profile', icon: 'person-sharp' },
  ];

  return (
    <View style={styles.floatingNavWrapper}>
      <View style={[styles.glassNavContainer, { backgroundColor: themeColors.glassBackground, borderColor: themeColors.glassBorder }]}>
        {tabs.map((tab) => {
          if (tab.isCenter) {
            return (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.85}
                onPress={openScannerModal}
                style={styles.centerFabButton}
              >
                <View style={styles.fabPulseRing} />
                <View style={styles.fabInnerCircle}>
                  <Ionicons name="scan-sharp" size={24} color={colors.white} />
                </View>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === tab.id;

          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.id)}
              style={styles.tabItem}
            >
              <Ionicons
                name={tab.icon}
                size={20}
                color={isActive ? colors.glowGreen : themeColors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isActive ? colors.glowGreen : themeColors.textMuted },
                ]}
              >
                {tab.label}
              </Text>

              {isActive && <View style={styles.activeDot} />}
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
  glassNavContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-around',
    width: '100%',
    maxWidth: 420,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    paddingHorizontal: 12,
    ...Platform.select({
      ios: {
        shadowColor: colors.glowGreen,
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
      },
      android: {
        elevation: 8,
      },
      web: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0px 10px 30px rgba(0, 0, 0, 0.4)',
      },
    }),
  },
  tabItem: {
    alignItems: 'center',
    justify: 'center',
    paddingVertical: 6,
    paddingHorizontal: 8,
    position: 'relative',
  },
  tabLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    marginTop: 2,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.glowGreen,
    position: 'absolute',
    bottom: 2,
  },
  centerFabButton: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginTop: -24,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
  },
  fabPulseRing: {
    position: 'absolute',
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(34, 197, 94, 0.3)',
  },
  fabInnerCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justify: 'center',
    shadowColor: colors.glowGreen,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 6,
  },
});
