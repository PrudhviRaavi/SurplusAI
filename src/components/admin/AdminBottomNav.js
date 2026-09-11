import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const AdminBottomNav = ({ activeTab = 'Overview', onSelectTab }) => {
  const tabs = [
    { id: 'Overview', label: 'Overview', icon: 'grid-outline', activeIcon: 'grid' },
    { id: 'Users', label: 'Users', icon: 'people-outline', activeIcon: 'people' },
    { id: 'Donations', label: 'Donations', icon: 'restaurant-outline', activeIcon: 'restaurant' },
    { id: 'Map', label: 'Map', icon: 'map-outline', activeIcon: 'map' },
    { id: 'Analytics', label: 'Analytics', icon: 'analytics-outline', activeIcon: 'analytics' },
    { id: 'Settings', label: 'Settings', icon: 'settings-outline', activeIcon: 'settings' },
  ];

  return (
    <View style={styles.navShell}>
      <View style={styles.navContainer}>
        {tabs.map((tab) => {
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
                size={20}
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
    paddingHorizontal: 12,
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
    maxWidth: 440,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 8,
    paddingHorizontal: 4,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
  },
  tabLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: colors.textMuted,
    marginTop: 2,
  },
  tabLabelActive: {
    fontWeight: '800',
    color: colors.primary,
  },
});
