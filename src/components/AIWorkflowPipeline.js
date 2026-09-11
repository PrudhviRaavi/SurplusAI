import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

export const AIWorkflowPipeline = () => {
  const pipelineSteps = [
    { id: '1', title: 'Upload Image', desc: 'Donor snaps meal image', icon: 'camera-sharp', gradient: colors.gradientPurpleBlue },
    { id: '2', title: 'Vision AI Detection', desc: 'Item classification in < 1s', icon: 'scan-sharp', gradient: colors.gradientCyanBlue },
    { id: '3', title: 'Freshness Prediction', desc: 'Neural decay scoring', icon: 'time-sharp', gradient: colors.gradientPurpleBlue },
    { id: '4', title: 'Demand Matching', desc: 'Smart NGO graph routing', icon: 'git-network-sharp', gradient: colors.gradientCyanBlue },
    { id: '5', title: 'Volunteer Assignment', desc: 'Driver route dispatch', icon: 'car-sport-sharp', gradient: colors.gradientSuccess },
    { id: '6', title: 'Delivery Confirmation', desc: 'Verification & ESG logging', icon: 'checkmark-circle-sharp', gradient: colors.gradientPurpleBlue },
  ];

  return (
    <View style={styles.sectionWrapper}>
      <View style={styles.headerArea}>
        <View style={styles.badgePill}>
          <Ionicons name="git-commit-sharp" size={12} color={colors.cyanAccent} />
          <Text style={styles.badgeText}>AUTOMATED RESCUE PIPELINE</Text>
        </View>
        <Text style={styles.sectionTitle}>Execution Workflow</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {pipelineSteps.map((step, idx) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepCard}>
              <View style={styles.stepHeader}>
                <View style={styles.iconBox}>
                  <LinearGradient colors={step.gradient} style={StyleSheet.absoluteFillObject} />
                  <Ionicons name={step.icon} size={18} color={colors.white} />
                </View>
                <Text style={styles.stepNum}>0{idx + 1}</Text>
              </View>

              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDesc}>{step.desc}</Text>
            </View>

            {idx < pipelineSteps.length - 1 && (
              <View style={styles.connector}>
                <LinearGradient
                  colors={[colors.primaryPurple, colors.cyanAccent]}
                  style={styles.lineGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                />
                <Ionicons name="chevron-forward-sharp" size={14} color={colors.cyanAccent} />
              </View>
            )}
          </React.Fragment>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionWrapper: {
    marginVertical: 24,
  },
  headerArea: {
    paddingHorizontal: 20,
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(6, 182, 212, 0.12)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  badgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.cyanAccent,
  },
  sectionTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 22,
    color: colors.textPrimary,
  },
  scrollContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  stepCard: {
    width: 145,
    borderRadius: 16,
    padding: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.glassBorder,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    marginBottom: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justify: 'center',
    overflow: 'hidden',
  },
  stepNum: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    color: colors.textMuted,
  },
  stepTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 13,
    color: colors.textPrimary,
    marginBottom: 4,
  },
  stepDesc: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 14,
  },
  connector: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
  },
  lineGradient: {
    width: 22,
    height: 2,
    borderRadius: 1,
  },
});
