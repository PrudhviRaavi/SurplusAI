import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const VolunteerBottomNav = ({ activeTab = 'Home', onSelectTab }) => {
  const tabs = [
    { id: 'Home', label: 'Home', icon: 'home-outline', activeIcon: 'home' },
    { id: 'Tasks', label: 'Tasks', icon: 'bicycle-outline', activeIcon: 'bicycle' },
    { id: 'Route', label: 'Route', icon: 'navigate-outline', activeIcon: 'navigate' },
    { id: 'Impact', label: 'Impact', icon: 'ribbon-outline', activeIcon: 'ribbon' },
    { id: 'Profile', label: 'Profile', icon: 'person-outline', activeIcon: 'person' },
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
});
