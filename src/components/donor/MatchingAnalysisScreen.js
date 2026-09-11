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
import { matchingService } from '../../services/matching/matchingService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

const matchingStages = [
  { id: 1, text: 'Checking nearby organizations...' },
  { id: 2, text: 'Comparing food requirements...' },
  { id: 3, text: 'Checking receiving capacity...' },
  { id: 4, text: 'Evaluating distance & pickup radius...' },
  { id: 5, text: 'Calculating 8-factor compatibility...' },
  { id: 6, text: 'Ranking top matches...' },
];

export const MatchingAnalysisScreen = ({ donation, onCompleteMatching, onErrorFallback }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);

  const radarPulseAnim = useRef(new Animated.Value(1)).current;

  const startMatching = () => {
    setErrorMessage(null);
    setCurrentStageIdx(0);

    // Pulse animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(radarPulseAnim, {
          toValue: 1.05,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(radarPulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();

    runMatchingService();
  };

  const runMatchingService = async () => {
    let stageInterval;
    stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < matchingStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageInterval);
          return prev;
        }
      });
    }, 450);

    const result = await matchingService.findMatches(donation);

    if (result.success && result.matches.length > 0) {
      setTimeout(() => {
        if (onCompleteMatching) onCompleteMatching(result);
      }, 400);
    } else {
      setErrorMessage(result.error || "We couldn't find a strong match nearby.");
    }
  };

  useEffect(() => {
    startMatching();
  }, [donation]);

  const foodName = donation?.foodName || 'Vegetable Biryani';
  const quantity = donation?.quantity || '25 meals';
  const img = donation?.image || DEFAULT_FOOD_IMG;

  return (
    <View style={styles.container}>
      <View style={styles.titleCenter}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiBadgeText}>SMART MATCHING ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Finding the right <Text style={styles.italicSerif}>place for your food.</Text>
        </Text>
        <Text style={styles.subtitle}>
          We're looking for organizations that can make the most of your donation based on capacity, demand, and proximity.
        </Text>
      </View>

      {/* Donation Visual Frame */}
      <Animated.View style={[styles.donationCard, { transform: [{ scale: radarPulseAnim }] }]}>
        <Image source={{ uri: img }} style={styles.foodThumb} resizeMode="cover" />

        <View style={styles.donationInfo}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.foodSub}>{quantity} · Jubilee Hills 2.4 km area</Text>
        </View>
      </Animated.View>

      {/* Error Fallback */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="alert-circle-outline" size={24} color={colors.gold} />
          <Text style={styles.errorTitle}>Matching Notice</Text>
          <Text style={styles.errorSub}>{errorMessage}</Text>

          <View style={styles.errorActionRow}>
            <TouchableOpacity onPress={startMatching} style={styles.retryBtn} activeOpacity={0.8}>
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onErrorFallback} style={styles.keepOpenBtn} activeOpacity={0.8}>
              <Text style={styles.keepOpenText}>Keep Open →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* 6-Stage Progress Indicator */
        <View style={styles.stagesCard}>
          <View style={styles.currentStageHeader}>
            <Ionicons name="sync" size={18} color={colors.primary} />
            <Text style={styles.currentStageText}>
              {matchingStages[currentStageIdx].text}
            </Text>
          </View>

          <View style={styles.stagesList}>
            {matchingStages.map((stage, idx) => {
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
  donationCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    width: '100%',
    marginVertical: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  foodThumb: {
    width: 52,
    height: 52,
    borderRadius: 14,
    marginRight: 12,
  },
  donationInfo: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  foodSub: {
    fontSize: 12,
    color: colors.textSecondary,
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
  keepOpenBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  keepOpenText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
