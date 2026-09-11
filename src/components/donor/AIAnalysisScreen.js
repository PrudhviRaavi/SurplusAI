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
import { aiService } from '../../services/ai/aiService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

const analysisStages = [
  { id: 1, text: 'Looking at your food...' },
  { id: 2, text: 'Identifying food items...' },
  { id: 3, text: 'Estimating freshness...' },
  { id: 4, text: 'Estimating quantity...' },
  { id: 5, text: 'Preparing your donation...' },
];

export const AIAnalysisScreen = ({ imageUri, onCompleteAnalysis, onSkipManual }) => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [isDone, setIsDone] = useState(false);

  const scanLineAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const startAnimation = () => {
    setErrorMessage(null);
    setIsDone(false);
    setCurrentStageIdx(0);

    // Laser scanning animation
    Animated.loop(
      Animated.sequence([
        Animated.timing(scanLineAnim, {
          toValue: 1,
          duration: 1400,
          useNativeDriver: true,
        }),
        Animated.timing(scanLineAnim, {
          toValue: 0,
          duration: 1400,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Pulse effect
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.03,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Execute AI Service analysis call & advance stages
    executeAnalysis();
  };

  const executeAnalysis = async () => {
    let stageInterval;
    stageInterval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < analysisStages.length - 1) {
          return prev + 1;
        } else {
          clearInterval(stageInterval);
          return prev;
        }
      });
    }, 700);

    const result = await aiService.analyzeFoodImage(imageUri || DEFAULT_FOOD_IMG);

    if (result.success) {
      setTimeout(() => {
        setIsDone(true);
        if (onCompleteAnalysis) onCompleteAnalysis(result);
      }, 500);
    } else {
      setErrorMessage(result.error || "We couldn't analyze this image.");
    }
  };

  useEffect(() => {
    startAnimation();
  }, [imageUri]);

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 240],
  });

  return (
    <View style={styles.container}>
      {/* Title Header */}
      <View style={styles.titleCenter}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiBadgeText}>AI VISION ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Understanding your <Text style={styles.italicSerif}>food...</Text>
        </Text>
        <Text style={styles.subtitle}>
          FoodShareAI is analyzing the image to help prepare your donation.
        </Text>
      </View>

      {/* Prominent Image Frame with Scanning Laser */}
      <Animated.View style={[styles.imageFrame, { transform: [{ scale: pulseAnim }] }]}>
        <Image
          source={{ uri: imageUri || DEFAULT_FOOD_IMG }}
          style={styles.foodImg}
          resizeMode="cover"
        />

        {!errorMessage && !isDone && (
          <>
            <View style={styles.scanOverlay} />
            <Animated.View style={[styles.laserLine, { transform: [{ translateY }] }]} />
          </>
        )}
      </Animated.View>

      {/* Error Handling State */}
      {errorMessage ? (
        <View style={styles.errorBox}>
          <Ionicons name="warning-outline" size={24} color="#DC2626" />
          <Text style={styles.errorTitle}>Analysis Unavailable</Text>
          <Text style={styles.errorSub}>{errorMessage}</Text>

          <View style={styles.errorActionRow}>
            <TouchableOpacity onPress={startAnimation} style={styles.retryBtn} activeOpacity={0.8}>
              <Ionicons name="reload" size={16} color={colors.white} />
              <Text style={styles.retryBtnText}>Try Again</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSkipManual} style={styles.manualBtn} activeOpacity={0.8}>
              <Text style={styles.manualBtnText}>Enter Manually →</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        /* Multi-Stage Animated Progress Sequence */
        <View style={styles.stagesCard}>
          <View style={styles.currentStageHeader}>
            <Ionicons name="sync" size={18} color={colors.primary} />
            <Text style={styles.currentStageText}>
              {analysisStages[currentStageIdx].text}
            </Text>
          </View>

          <View style={styles.stagesList}>
            {analysisStages.map((stage, idx) => {
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
  imageFrame: {
    width: '100%',
    height: 250,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    marginVertical: 14,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  foodImg: {
    width: '100%',
    height: '100%',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75, 99, 85, 0.2)',
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    height: 3,
    backgroundColor: colors.gold,
    shadowColor: colors.gold,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 10,
    elevation: 8,
  },
  stagesCard: {
    width: '100%',
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 8,
  },
  currentStageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
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
    backgroundColor: '#FEF2F2',
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    alignItems: 'center',
    marginTop: 8,
  },
  errorTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: '#DC2626',
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 14,
    gap: 6,
  },
  retryBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  manualBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  manualBtnText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
