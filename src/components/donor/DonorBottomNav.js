import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const DonorBottomNav = ({
  activeTab = 'Home',
  onSelectTab,
  onCreateDonationPress,
}) => {
  const tabs = [
    { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'Donations', label: 'Donations', icon: 'fast-food-outline', activeIcon: 'fast-food' },
    { id: 'Create', label: 'Create', isCenterBtn: true },
    { id: 'Map', label: 'Map', icon: 'map-outline', activeIcon: 'map' },
    { id: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
  ];

  return (
    <View style={styles.navShell}>
      <View style={styles.navContainer}>
        {tabs.map((tab) => {
          if (tab.isCenterBtn) {
            return (
              <TouchableOpacity
                key="create-center-btn"
                activeOpacity={0.85}
                onPress={onCreateDonationPress}
                style={styles.centerBtnWrapper}
              >
                <View style={styles.centerBtn}>
                  <Ionicons name="add" size={28} color={colors.white} />
                </View>
              </TouchableOpacity>
            );
          }

          const isActive = activeTab === tab.id;
          return (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => onSelectTab(tab.id)}
              style={styles.tabItem}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={22}
                color={isActive ? colors.primary : colors.textMuted}
              />
              <Text
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  navShell: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingBottom: Platform.OS === 'ios' ? 24 : 12,
    backgroundColor: 'transparent',
    alignItems: 'center',
    zIndex: 100,
  },
  navContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    height: 64,
    borderRadius: 32,
    width: '100%',
    maxWidth: 420,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.primary,
  },
  centerBtnWrapper: {
    top: -14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: colors.background,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
});
