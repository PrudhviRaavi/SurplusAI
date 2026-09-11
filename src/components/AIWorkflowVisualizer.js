import React from 'react';
import { View, Text, StyleSheet, ScrollView, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const AIWorkflowVisualizer = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const steps = [
    { id: '1', title: 'Upload Photo', desc: 'Donor snaps meal image', icon: 'camera-sharp', color: colors.glowGreen },
    { id: '2', title: 'AI Detection', desc: 'Instant item identification', icon: 'scan-sharp', color: colors.accent },
    { id: '3', title: 'Freshness Analysis', desc: 'Safety decay scoring', icon: 'time-sharp', color: colors.secondary },
    { id: '4', title: 'Smart Matching', desc: 'Nearest NGO demand check', icon: 'git-network-sharp', color: '#8B5CF6' },
    { id: '5', title: 'Volunteer Assign', desc: 'Driver dispatch route', icon: 'car-sport-sharp', color: '#F59E0B' },
    { id: '6', title: 'Food Delivered', desc: 'Real-time handoff verification', icon: 'checkmark-circle-sharp', color: colors.glowGreen },
  ];

  return (
    <View style={styles.sectionContainer}>
      <View style={styles.headerArea}>
        <Text style={[styles.sectionSubtitle, { color: colors.glowGreen }]}>AUTOMATED PIPELINE</Text>
        <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>AI Rescue Workflow</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {steps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <View style={[styles.stepCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
              <View style={styles.stepHeader}>
                <View style={[styles.stepIconBox, { backgroundColor: `${step.color}18` }]}>
                  <Ionicons name={step.icon} size={18} color={step.color} />
                </View>
                <Text style={[styles.stepNumber, { color: themeColors.textMuted }]}>0{idx + 1}</Text>
              </View>

              <Text style={[styles.stepTitle, { color: themeColors.textPrimary }]}>{step.title}</Text>
              <Text style={[styles.stepDesc, { color: themeColors.textSecondary }]}>{step.desc}</Text>
            </View>

            {idx < steps.length - 1 && (
              <View style={styles.connectorContainer}>
                <View style={styles.glowingConnectorLine} />
                <Ionicons name="chevron-forward-sharp" size={14} color={colors.glowGreen} />
              </View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginVertical: 24,
  },
  headerArea: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionSubtitle: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    letterSpacing: 1.2,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stepCard: {
    width: 140,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 10,
  },
  stepIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
  },
  stepNumber: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
  },
  stepTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 13,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    lineHeight: 14,
  },
  connectorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  glowingConnectorLine: {
    width: 20,
    height: 2,
    backgroundColor: colors.glowGreen,
  },
});
