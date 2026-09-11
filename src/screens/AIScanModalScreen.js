import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, SafeAreaView, StatusBar, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useNavigationStore } from '../store/useNavigationStore';
import { useThemeStore } from '../store/useThemeStore';

export const AIScanModalScreen = () => {
  const { isScannerModalOpen, closeScannerModal } = useNavigationStore();
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const [selectedFood, setSelectedFood] = useState('Biryani & Curry');
  const [isScanning, setIsScanning] = useState(false);

  const foodOptions = [
    { name: 'Biryani & Curry', weight: '45 kg', meals: '150 Meals', freshness: '96.4%', confidence: '98.7%' },
    { name: 'Fresh Vegetables', weight: '28 kg', meals: '90 Meals', freshness: '98.1%', confidence: '99.2%' },
    { name: 'Bakery Surplus', weight: '15 kg', meals: '60 Meals', freshness: '92.0%', confidence: '95.4%' },
  ];

  const currentOption = foodOptions.find((f) => f.name === selectedFood) || foodOptions[0];

  const handleSimulateScan = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
    }, 1200);
  };

  const handleConfirmDispatch = () => {
    if (Platform.OS === 'web') {
      window.alert('🚀 Food Rescue Active!\n\nMatched with Hope Shelter NGO. Driver dispatched.');
    } else {
      Alert.alert('Food Rescue Active', 'Matched with Hope Shelter NGO. Driver dispatched to your location.');
    }
    closeScannerModal();
  };

  return (
    <Modal
      visible={isScannerModalOpen}
      animationType="slide"
      transparent={false}
      onRequestClose={closeScannerModal}
    >
      <SafeAreaView style={[styles.container, { backgroundColor: colors.dark.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={colors.dark.background} />

        {/* Modal Top Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={closeScannerModal} style={styles.closeButton}>
            <Ionicons name="close-sharp" size={22} color={colors.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleBox}>
            <Ionicons name="sparkles-sharp" size={16} color={colors.glowGreen} />
            <Text style={styles.headerTitle}>AI Vision Scanner v2.4</Text>
          </View>
          <TouchableOpacity onPress={handleSimulateScan} style={styles.scanRefreshButton}>
            <Ionicons name="refresh-sharp" size={20} color={colors.glowGreen} />
          </TouchableOpacity>
        </View>

        {/* Camera HUD Viewport */}
        <View style={styles.cameraViewport}>
          <LinearGradient
            colors={['#064E3B', '#0B1220', '#030712']}
            style={styles.cameraBg}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {/* Viewfinder Target Reticle */}
            <View style={[styles.targetReticle, isScanning && styles.reticleScanning]}>
              <View style={[styles.reticleCorner, styles.tl]} />
              <View style={[styles.reticleCorner, styles.tr]} />
              <View style={[styles.reticleCorner, styles.bl]} />
              <View style={[styles.reticleCorner, styles.br]} />

              <MaterialCommunityIcons name="food-apple" size={54} color={colors.glowGreen} />

              <View style={styles.reticleTag}>
                <Ionicons name="checkmark-circle" size={12} color={colors.glowGreen} />
                <Text style={styles.reticleTagText}>{currentOption.name}</Text>
              </View>
            </View>

            {/* Live Camera Grid Lines */}
            <View style={styles.hudGridLineH} />
            <View style={styles.hudGridLineV} />

            {/* AI HUD Confidence Badge */}
            <View style={styles.confidenceHudBadge}>
              <Text style={styles.hudLabel}>AI CONFIDENCE</Text>
              <Text style={styles.hudScore}>{currentOption.confidence}</Text>
            </View>

            {/* AI Freshness Badge */}
            <View style={styles.freshnessHudBadge}>
              <Text style={styles.hudLabel}>FRESHNESS SCORE</Text>
              <Text style={[styles.hudScore, { color: colors.glowGreen }]}>{currentOption.freshness}</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Sample Food Switcher Pills */}
        <View style={styles.foodSelectorContainer}>
          <Text style={styles.selectorTitle}>Select Detected Food Batch:</Text>
          <View style={styles.selectorRow}>
            {foodOptions.map((opt) => (
              <TouchableOpacity
                key={opt.name}
                onPress={() => setSelectedFood(opt.name)}
                style={[
                  styles.foodPill,
                  selectedFood === opt.name && styles.activeFoodPill,
                ]}
              >
                <Text
                  style={[
                    styles.foodPillText,
                    selectedFood === opt.name && styles.activeFoodPillText,
                  ]}
                >
                  {opt.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* AI Telemetry Result Card */}
        <View style={styles.resultCard}>
          <View style={styles.resultRow}>
            <View style={styles.resultItem}>
              <Ionicons name="scale-outline" size={18} color={colors.accentLight} />
              <View>
                <Text style={styles.itemLabel}>Calculated Weight</Text>
                <Text style={styles.itemValue}>{currentOption.weight}</Text>
              </View>
            </View>

            <View style={styles.resultItem}>
              <Ionicons name="restaurant-outline" size={18} color={colors.glowGreen} />
              <View>
                <Text style={styles.itemLabel}>Estimated Meals</Text>
                <Text style={styles.itemValue}>{currentOption.meals}</Text>
              </View>
            </View>
          </View>

          <View style={styles.ngoMatchBox}>
            <Ionicons name="navigate-circle-sharp" size={24} color={colors.glowGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.ngoTitle}>Matched NGO: Hope Shelter</Text>
              <Text style={styles.ngoSub}>Distance: 1.2 km • Driver Dispatch Ready</Text>
            </View>
          </View>

          {/* Action Buttons */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleConfirmDispatch}
            style={styles.confirmButton}
          >
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.confirmGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.confirmText}>Dispatch Food Rescue Request</Text>
              <Ionicons name="arrow-forward-sharp" size={18} color={colors.white} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justify: 'center',
  },
  headerTitleBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  headerTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 16,
    color: colors.white,
  },
  scanRefreshButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
    alignItems: 'center',
    justify: 'center',
  },
  cameraViewport: {
    height: 280,
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 22,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.4)',
  },
  cameraBg: {
    flex: 1,
    alignItems: 'center',
    justify: 'center',
    position: 'relative',
  },
  targetReticle: {
    width: 170,
    height: 140,
    borderWidth: 1.5,
    borderColor: colors.glowGreen,
    borderRadius: 18,
    alignItems: 'center',
    justify: 'center',
    backgroundColor: 'rgba(5, 8, 22, 0.5)',
    position: 'relative',
  },
  reticleScanning: {
    borderColor: colors.accentLight,
  },
  reticleCorner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: colors.glowGreen,
  },
  tl: { top: -2, left: -2, borderTopWidth: 3, borderLeftWidth: 3, borderTopLeftRadius: 4 },
  tr: { top: -2, right: -2, borderTopWidth: 3, borderRightWidth: 3, borderTopRightRadius: 4 },
  bl: { bottom: -2, left: -2, borderBottomWidth: 3, borderLeftWidth: 3, borderBottomLeftRadius: 4 },
  br: { bottom: -2, right: -2, borderBottomWidth: 3, borderRightWidth: 3, borderBottomRightRadius: 4 },
  reticleTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(5, 8, 22, 0.9)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    position: 'absolute',
    bottom: -12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.5)',
  },
  reticleTagText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    color: colors.white,
  },
  hudGridLineH: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '50%',
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  hudGridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '50%',
    width: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  confidenceHudBadge: {
    position: 'absolute',
    top: 14,
    left: 14,
    backgroundColor: 'rgba(5, 8, 22, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  freshnessHudBadge: {
    position: 'absolute',
    top: 14,
    right: 14,
    backgroundColor: 'rgba(5, 8, 22, 0.8)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  hudLabel: {
    fontFamily: fontFamily.caption,
    fontSize: 8,
    color: colors.textSecondary,
  },
  hudScore: {
    fontFamily: fontFamily.headingBold,
    fontSize: 13,
    color: colors.white,
  },
  foodSelectorContainer: {
    paddingHorizontal: 20,
    marginTop: 16,
  },
  selectorTitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  selectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  foodPill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeFoodPill: {
    backgroundColor: colors.primary,
    borderColor: colors.glowGreen,
  },
  foodPillText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    color: colors.textSecondary,
  },
  activeFoodPillText: {
    color: colors.white,
    fontFamily: fontFamily.bodySemiBold,
  },
  resultCard: {
    marginHorizontal: 20,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    backgroundColor: '#0B1220',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  resultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  itemLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 10,
    color: colors.textSecondary,
  },
  itemValue: {
    fontFamily: fontFamily.headingBold,
    fontSize: 14,
    color: colors.white,
  },
  ngoMatchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    padding: 12,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.3)',
    marginBottom: 16,
  },
  ngoTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 14,
    color: colors.white,
  },
  ngoSub: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: colors.glowGreen,
  },
  confirmButton: {
    borderRadius: 14,
    overflow: 'hidden',
  },
  confirmGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justify: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  confirmText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
    color: colors.white,
  },
});
