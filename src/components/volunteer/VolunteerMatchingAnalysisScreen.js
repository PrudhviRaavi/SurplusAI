import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { volunteerMatchingService } from '../../services/volunteerMatching/volunteerMatchingService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

const volunteerMatchingStages = [
  { id: 1, text: 'Checking nearby volunteers...' },
  { id: 2, text: 'Checking availability...' },
  { id: 3, text: 'Comparing transportation...' },
  { id: 4, text: 'Checking pickup timing...' },
  { id: 5, text: 'Checking travel compatibility...' },
  { id: 6, text: 'Ranking top volunteers...' },
];

export const VolunteerMatchingAnalysisScreen = ({
  donation,
  ngo,
  onCompleteMatching,
  onErrorFallback,
}) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startMatching = () => {
    setErrorMessage(null);
    setCurrentStageIdx(0);

    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    executeServiceCall();
  };

  const executeServiceCall = async () => {
    let stageInterval;
    stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < volunteerMatchingStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageInterval);
          return prev;
        }
      });
    }, 450);

    const result = await volunteerMatchingService.findVolunteers(donation, ngo);

    if (result.success && result.volunteers.length > 0) {
      setTimeout(() => {
        if (onCompleteMatching) onCompleteMatching(result);
      }, 400);
    } else {
      setErrorMessage(result.error || 'No suitable volunteers available nearby.');
    }
  };

  useEffect(() => {
    startMatching();
  }, [donation]);

  const foodName = donation?.foodName || 'Vegetable Biryani';
  const quantity = donation?.quantity || '25 meals';

  return (
    <View style={styles.container}>
      <View style={styles.titleCenter}>
        <View style={styles.aiBadge}>
          <Ionicons name="bicycle-outline" size={14} color={colors.gold} />
          <Text style={styles.aiBadgeText}>VOLUNTEER DISPATCH ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Finding someone <Text style={styles.italicSerif}>to move it.</Text>
        </Text>
        <Text style={styles.subtitle}>
          We're looking for an available volunteer who can pick up and deliver your donation.
        </Text>
      </View>

      {/* Donation Telemetry Summary Card */}
      <Animated.View style={[styles.summaryCard, { transform: [{ scale: pulseAnim }] }]}>
        <Image
          source={{ uri: donation?.image || DEFAULT_FOOD_IMG }}
          style={styles.foodThumb}
          resizeMode="cover"
        />
        <View style={styles.summaryCol}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.summarySub}>{quantity} · Pickup: 6:00 PM – 8:00 PM</Text>
          <Text style={styles.routeText}>
            Green Leaf Restaurant → Hope Community Kitchen
          </Text>
        </View>
      </Animated.View>

      {/* Error Fallback */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.gold} />
          <Text style={styles.errorTitle}>No Suitable Volunteers Nearby</Text>
          <Text style={styles.errorSub}>{errorMessage}</Text>

          <View style={styles.errorActionRow}>
            <TouchableOpacity onPress={startMatching} style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onErrorFallback} style={styles.keepWaitingBtn} activeOpacity={0.8}>
              <Text style={styles.keepWaitingText}>Keep Waiting →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* 6-Stage Progress Indicator */
        <View style={styles.stagesCard}>
          <View style={styles.currentStageHeader}>
            <Ionicons name="sync" size={18} color={colors.primary} />
            <Text style={styles.currentStageText}>
              {volunteerMatchingStages[currentStageIdx].text}
            </Text>
          </View>

          <View style={styles.stagesList}>
            {volunteerMatchingStages.map((stage, idx) => {
              const isPassed = idx <= currentStageIdx;
              return (
                <View key={stage.id} style={styles.stageRow}>
                  <View style={[styles.dot, isPassed && styles.dotPassed]}>
                    {isPassed && <Ionicons name="checkmark" size={10} color={colors.white} />}
                  </View>
                  <Text style={[styles.stageLabel, isPassed && styles.stageLabelPassed]}>
                    {stage.text}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
    width: '100%',
  },
  titleCenter: {
    alignItems: 'center',
    marginBottom: 16,
  },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  aiBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 26,
    fontWeight: '800',
    color: colors.textPrimary,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 16,
  },
  summaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    width: '100%',
    marginVertical: 14,
  },
  foodThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginRight: 12,
  },
  summaryCol: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  summarySub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  routeText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginTop: 2,
  },
  stagesCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 6,
  },
  currentStageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  currentStageText: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.primary,
  },
  stagesList: {
    gap: 8,
  },
  stageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  dot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotPassed: {
    backgroundColor: colors.primary,
  },
  stageLabel: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '500',
    color: colors.textMuted,
  },
  stageLabelPassed: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  errorBox: {
    width: '100%',
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 8,
  },
  errorTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 6,
  },
  errorSub: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 16,
  },
  errorActionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
  },
  retryBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
  },
  retryBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  keepWaitingBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keepWaitingText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
