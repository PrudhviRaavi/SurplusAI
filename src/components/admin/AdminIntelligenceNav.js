import React from 'react';
import { ScrollView, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { colors } from '../../theme/colors';

const adminTabs = [
  { id: 'Overview', label: 'Overview' },
  { id: 'MapIntelligence', label: 'Map Intelligence' },
  { id: 'Forecast', label: 'Demand Forecast' },
  { id: 'Insights', label: 'AI Insights' },
  { id: 'SafetyRisk', label: 'Safety & Risk' },
  { id: 'UsersNgoQueue', label: 'Users & NGO Queue' },
  { id: 'Operations', label: 'Operations & Analytics' },
];

export const AdminIntelligenceNav = ({ activeTab, onSelectTab }) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {adminTabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <TouchableOpacity
            key={tab.id}
            activeOpacity={0.8}
            onPress={() => onSelectTab(tab.id)}
            style={[styles.tab, isActive && styles.tabActive]}
          >
            <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    gap: 8,
    paddingVertical: 10,
    backgroundColor: colors.background,
  },
  tab: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  tabTextActive: {
    color: colors.white,
  },
});
