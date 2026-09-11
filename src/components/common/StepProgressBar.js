import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const StepProgressBar = ({
  currentStep = 1,
  totalSteps = 4,
  stepTitle,
  stepSubtitle,
  onBack,
}) => {
  return (
    <View style={styles.container}>
      {/* Header Row: Back button & Step fraction badge */}
      <View style={styles.headerRow}>
        {onBack ? (
          <TouchableOpacity onPress={onBack} style={styles.backBtn} activeOpacity={0.7}>
            <Ionicons name="arrow-back" size={20} color={colors.primary} />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        ) : (
          <View />
        )}

        <View style={styles.badgePill}>
          <Text style={styles.badgeText}>
            0{currentStep} / 0{totalSteps}
          </Text>
        </View>
      </View>

      {/* Segmented Progress Track */}
      <View style={styles.dotsTrack}>
        {Array.from({ length: totalSteps }).map((_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.dot,
                  isCompleted && styles.dotCompleted,
                  isCurrent && styles.dotCurrent,
                ]}
              >
                {isCompleted && <Ionicons name="checkmark" size={12} color={colors.white} />}
              </View>
              {index < totalSteps - 1 && (
                <View
                  style={[
                    styles.connectorLine,
                    stepNumber < currentStep && styles.connectorCompleted,
                  ]}
                />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* Step Title & Subtitle */}
      {stepTitle && (
        <View style={styles.titlesWrapper}>
          <Text style={styles.stepTag}>STEP 0{currentStep}</Text>
          <Text style={styles.stepTitle}>{stepTitle}</Text>
          {stepSubtitle && <Text style={styles.stepSubtitle}>{stepSubtitle}</Text>}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingRight: 12,
  },
  backText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  badgePill: {
    backgroundColor: 'rgba(75, 99, 85, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 0.8,
  },
  dotsTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 8,
    paddingHorizontal: 12,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  dotCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  connectorLine: {
    flex: 1,
    height: 3,
    backgroundColor: colors.border,
    marginHorizontal: 6,
    borderRadius: 1.5,
  },
  connectorCompleted: {
    backgroundColor: colors.primary,
  },
  titlesWrapper: {
    marginTop: 16,
  },
  stepTag: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  stepTitle: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.5,
    lineHeight: 32,
    marginBottom: 6,
  },
  stepSubtitle: {
    fontSize: 14,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 21,
  },
});
