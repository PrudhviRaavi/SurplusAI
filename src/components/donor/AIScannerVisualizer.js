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
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

const scanSteps = [
  { id: 1, text: 'Scanning image composition...' },
  { id: 2, text: 'Identifying food category & dishes...' },
  { id: 3, text: 'Estimating freshness & thermal state...' },
  { id: 4, text: 'Estimating portion quantity & safe window...' },
];

export const AIScannerVisualizer = ({ imageUri, onStartAnalysis, onAnalysisComplete }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  const scanLineAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    let interval;
    if (isScanning) {
      // Loop scan line moving up and down
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanLineAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scanLineAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
        ])
      ).start();

      // Progress through analysis steps sequentially
      interval = setInterval(() => {
        setCurrentStepIndex((prev) => {
          if (prev < scanSteps.length - 1) {
            return prev + 1;
          } else {
            clearInterval(interval);
            setTimeout(() => {
              setIsScanning(false);
              if (onAnalysisComplete) onAnalysisComplete();
            }, 600);
            return prev;
          }
        });
      }, 1000);
    } else {
      scanLineAnim.setValue(0);
    }

    return () => clearInterval(interval);
  }, [isScanning]);

  const handleAnalyze = () => {
    setIsScanning(true);
    setCurrentStepIndex(0);
    if (onStartAnalysis) onStartAnalysis();
  };

  const translateY = scanLineAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 200],
  });

  return (
    <View style={styles.container}>
      <View style={styles.titleGroup}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiBadgeText}>AI VISION ANALYSIS</Text>
        </View>
        <Text style={styles.mainTitle}>
          Let FoodShareAI <Text style={styles.italicSerif}>take a look.</Text>
        </Text>
        <Text style={styles.subTitle}>
          Our visual intelligence engine detects meal type, estimates portions, and predicts safe consumption windows.
        </Text>
      </View>

      {/* Image Container with Scan Overlay */}
      <View style={styles.imageFrame}>
        <Image
          source={{ uri: imageUri || DEFAULT_FOOD_IMG }}
          style={styles.foodImage}
          resizeMode="cover"
        />

        {isScanning && (
          <>
            <View style={styles.scanOverlay} />
            <Animated.View
              style={[
                styles.laserLine,
                { transform: [{ translateY }] },
              ]}
            />
          </>
        )}
      </View>

      {/* Sequential Analysis Loading Steps */}
      {isScanning ? (
        <View style={styles.stepProgressContainer}>
          <View style={styles.spinnerRow}>
            <Ionicons name="sync" size={18} color={colors.primary} style={styles.spinnerIcon} />
            <Text style={styles.stepActiveText}>
              {scanSteps[currentStepIndex].text}
            </Text>
          </View>

          <View style={styles.stepDotsRow}>
            {scanSteps.map((step, idx) => (
              <View
                key={step.id}
                style={[
                  styles.stepDot,
                  idx <= currentStepIndex && styles.stepDotActive,
                ]}
              />
            ))}
          </View>
        </View>
      ) : (
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={handleAnalyze}
          style={styles.analyzeBtn}
        >
          <Ionicons name="sparkles" size={18} color={colors.white} />
          <Text style={styles.analyzeBtnText}>Analyze with AI →</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  titleGroup: {
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
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subTitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: 4,
    paddingHorizontal: 20,
  },
  imageFrame: {
    width: '100%',
    height: 220,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: colors.border,
    position: 'relative',
    marginVertical: 16,
  },
  foodImage: {
    width: '100%',
    height: '100%',
  },
  scanOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(75, 99, 85, 0.25)',
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
  stepProgressContainer: {
    width: '100%',
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 6,
  },
  spinnerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 10,
  },
  spinnerIcon: {
    marginRight: 2,
  },
  stepActiveText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  stepDotsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  stepDot: {
    width: 24,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.border,
  },
  stepDotActive: {
    backgroundColor: colors.primary,
  },
  analyzeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 20,
    width: '100%',
    gap: 8,
    marginTop: 8,
  },
  analyzeBtnText: {
    fontSize: 15,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.white,
  },
});
