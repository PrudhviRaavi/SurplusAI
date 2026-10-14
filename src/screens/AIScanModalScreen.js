import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Platform,
  Alert,
  TextInput,
  Image,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useNavigationStore } from '../store/useNavigationStore';
import {
  aiService,
  VALID_APP_CATEGORIES,
  APP_CATEGORY_LABELS,
} from '../services/ai/aiService';

export const AIScanModalScreen = ({
  visible,
  onClose,
  onConfirmScan,
  onContinueToDonation,
  matchedNgo,
}) => {
  const navigationStore = useNavigationStore();
  const isStoreModalOpen = navigationStore?.isScannerModalOpen;
  const isVisible =
    visible !== undefined
      ? visible
      : isStoreModalOpen !== undefined
      ? isStoreModalOpen
      : true;

  // Active food image being analyzed - defaults to null (no mock or hardcoded placeholder)
  const [imageUri, setImageUri] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);

  // Real AI scanning state machine: 'IDLE' | 'SCANNING' | 'SUCCESS' | 'NO_DETECTIONS' | 'ERROR'
  const [scanStatus, setScanStatus] = useState('IDLE');
  const [errorMessage, setErrorMessage] = useState(null);

  // Real candidate model detections
  const [analysisResult, setAnalysisResult] = useState(null);
  const [detections, setDetections] = useState([]);
  const [selectedDetectionIdx, setSelectedDetectionIdx] = useState(0);

  // Donor-editable verification fields
  const [foodName, setFoodName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('COOKED_MEALS');
  const [weightValue, setWeightValue] = useState('15 kg');

  const handleClose = () => {
    if (onClose) onClose();
    if (navigationStore?.closeScannerModal) navigationStore.closeScannerModal();
  };

  /**
   * Captures a real photo using the device camera
   */
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        const msg = 'Camera permission is required to capture food photos for AI scanning.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Camera Permission Required', msg);
        }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
        base64: true,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return; // Donor canceled capture gracefully
      }

      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      setImageBase64(selectedAsset.base64 || null);
      setScanStatus('IDLE');
      setErrorMessage(null);
      setDetections([]);
      setAnalysisResult(null);
      if (!foodName) {
        setFoodName('Captured Food Item');
      }
    } catch (err) {
      console.warn('[AIScanModalScreen] Error capturing photo:', err);
      const msg = 'Could not access camera. Please check camera permissions.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Camera Error', msg);
      }
    }
  };

  /**
   * Selects an existing photo from the device photo gallery.
   * Handles modern Android Photo Picker without requiring legacy storage permissions,
   * with automatic fallback if system cropping is unavailable.
   */
  const handleChooseFromGallery = async () => {
    try {
      // Check media library permissions when supported.
      // Note: On Android 13+ (API 33+), the system photo picker does not require runtime permissions.
      try {
        const currentPerm = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!currentPerm.granted && currentPerm.canAskAgain) {
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
      } catch (permErr) {
        console.info('[AIScanModalScreen] Media permission check notice:', permErr.message);
      }

      let result;
      try {
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
          base64: true,
        });
      } catch (cropErr) {
        // Fallback without allowsEditing in case device lacks a system crop activity
        console.warn('[AIScanModalScreen] launchImageLibraryAsync with crop failed, retrying direct picker:', cropErr.message);
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.8,
          base64: true,
        });
      }

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return; // Donor canceled selection gracefully
      }

      const selectedAsset = result.assets[0];
      setImageUri(selectedAsset.uri);
      setImageBase64(selectedAsset.base64 || null);
      setScanStatus('IDLE');
      setErrorMessage(null);
      setDetections([]);
      setAnalysisResult(null);
      if (!foodName) {
        setFoodName('Selected Food Item');
      }
    } catch (err) {
      console.warn('[AIScanModalScreen] Error choosing image from gallery:', err);
      const msg = 'Could not open photo gallery. Please ensure photo gallery access is granted.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Gallery Error', msg);
      }
    }
  };

  /**
   * Triggers real YOLOv8 multi-model inference via candidate ML microservice
   */
  const handleExecuteScan = async () => {
    if (!imageUri) {
      const msg = 'Please take a photo or choose an image from the gallery first.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('No Image Selected', msg);
      }
      return;
    }

    setScanStatus('SCANNING');
    setErrorMessage(null);

    const result = await aiService.analyzeFoodImage(imageUri, {
      foodCategory: selectedCategory,
      base64: imageBase64,
    });

    if (!result.success) {
      setScanStatus('ERROR');
      setErrorMessage(result.error || 'Unable to complete AI analysis.');
      return;
    }

    setAnalysisResult(result);

    if (!result.hasDetections || result.detections.length === 0) {
      setScanStatus('NO_DETECTIONS');
      setDetections([]);
      setFoodName(foodName || 'Unclassified Surplus Food');
      setSelectedCategory('OTHER');
      return;
    }

    setScanStatus('SUCCESS');
    setDetections(result.detections);
    setSelectedDetectionIdx(0);

    const primary = result.detections[0];
    setFoodName(primary.itemName);
    setSelectedCategory(primary.category);
    setWeightValue(result.estimatedQuantityNum ? `${result.estimatedQuantityNum} kg` : '15 kg');
  };

  // When donor selects another detected item pill
  const handleSelectDetection = (index) => {
    setSelectedDetectionIdx(index);
    const item = detections[index];
    if (item) {
      setFoodName(item.itemName);
      setSelectedCategory(item.category);
    }
  };

  const currentDetection = detections[selectedDetectionIdx] || null;

  const handleContinueToDonation = () => {
    const categoryTitle = APP_CATEGORY_LABELS[selectedCategory] || selectedCategory;
    const scannedData = {
      foodName,
      category: selectedCategory,
      displayCategory: categoryTitle,
      quantityVal: weightValue.replace(/[^0-9.]/g, '') || '15',
      quantityUnit: weightValue.toLowerCase().includes('meal') ? 'meals' : 'kg',
      imageUri,
      analysisResult,
    };

    if (onContinueToDonation) {
      onContinueToDonation(scannedData);
    } else if (onConfirmScan) {
      onConfirmScan(scannedData);
    } else {
      handleConfirmDispatch();
    }
  };

  const handleConfirmDispatch = () => {
    const categoryTitle = APP_CATEGORY_LABELS[selectedCategory] || selectedCategory;
    const msg = `Food Item: ${foodName}\nCategory: ${categoryTitle}\nVerified Quantity: ${weightValue}\nFreshness: Physical inspection required upon pickup.\n\nMatched with Hope Shelter NGO. Driver dispatched.`;

    if (onConfirmScan) {
      onConfirmScan({
        foodName,
        category: selectedCategory,
        quantity: weightValue,
        analysisResult,
      });
    }

    if (Platform.OS === 'web') {
      window.alert(`🚀 Food Rescue Active!\n\n${msg}`);
    } else {
      Alert.alert('Food Rescue Active', msg);
    }
    handleClose();
  };

  const renderContent = () => (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEF7EB" translucent={false} />

      {/* Screen Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={handleClose}
          style={styles.headerIconButton}
          activeOpacity={0.7}
          accessibilityLabel="Close scanner"
          accessibilityRole="button"
        >
          <Ionicons name="close-outline" size={24} color="#1F2937" />
        </TouchableOpacity>

        <View style={styles.headerTitleBox}>
          <Text style={styles.headerTitle}>AI Vision Scanner</Text>
          <View style={styles.candidateBadge}>
            <Ionicons name="sparkles" size={11} color="#4B6355" />
            <Text style={styles.candidateBadgeText}>YOLOv8 Candidate • Experimental</Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleExecuteScan}
          disabled={!imageUri || scanStatus === 'SCANNING'}
          style={[
            styles.headerIconButton,
            (!imageUri || scanStatus === 'SCANNING') && styles.disabledHeaderButton,
          ]}
          activeOpacity={0.7}
          accessibilityLabel="Scan food image"
          accessibilityRole="button"
        >
          {scanStatus === 'SCANNING' ? (
            <ActivityIndicator size="small" color="#4B6355" />
          ) : (
            <Ionicons
              name="scan-outline"
              size={20}
              color={!imageUri ? '#9CA3AF' : '#4B6355'}
            />
          )}
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Responsive Food Image Preview */}
          <View style={styles.previewViewport}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.previewImage}
                resizeMode="contain"
              />
            ) : (
              <View style={styles.emptyViewport}>
                <Ionicons name="camera-outline" size={46} color="#64748B" />
                <Text style={styles.emptyViewportTitle}>No Food Image Selected</Text>
                <Text style={styles.emptyViewportSubtitle}>
                  Take a photo or choose from gallery to begin scanning
                </Text>
              </View>
            )}

            {/* Corner reticle framing */}
            <View style={[styles.reticleCorner, styles.tl]} />
            <View style={[styles.reticleCorner, styles.tr]} />
            <View style={[styles.reticleCorner, styles.bl]} />
            <View style={[styles.reticleCorner, styles.br]} />

            {/* Floating Image Status Pill */}
            <View style={styles.floatingStatusPill}>
              {scanStatus === 'SCANNING' ? (
                <>
                  <ActivityIndicator size="small" color="#A8B5A2" style={{ marginRight: 6 }} />
                  <Text style={styles.floatingStatusText}>Analyzing tensors with YOLOv8...</Text>
                </>
              ) : scanStatus === 'SUCCESS' ? (
                <>
                  <Ionicons
                    name={currentDetection?.isLowConfidence ? 'alert-circle' : 'checkmark-circle'}
                    size={14}
                    color={currentDetection?.isLowConfidence ? '#F59E0B' : '#10B981'}
                    style={{ marginRight: 5 }}
                  />
                  <Text style={styles.floatingStatusText}>
                    {currentDetection?.itemName || foodName} ({currentDetection?.confidencePercent || '0%'})
                  </Text>
                </>
              ) : scanStatus === 'NO_DETECTIONS' ? (
                <Text style={styles.floatingStatusText}>No recognizable food detected</Text>
              ) : imageUri ? (
                <Text style={styles.floatingStatusText}>Image ready • Tap scan below</Text>
              ) : (
                <Text style={styles.floatingStatusText}>Awaiting food selection</Text>
              )}
            </View>
          </View>

          {/* Action Row: Take Photo & Choose Gallery */}
          <View style={styles.imageActionsRow}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleTakePhoto}
              style={styles.imageActionBtn}
              accessibilityLabel="Take a photo with camera"
              accessibilityRole="button"
            >
              <Ionicons name="camera-outline" size={20} color="#4B6355" />
              <Text style={styles.imageActionBtnText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.8}
              onPress={handleChooseFromGallery}
              style={styles.imageActionBtn}
              accessibilityLabel="Choose photo from gallery"
              accessibilityRole="button"
            >
              <Ionicons name="images-outline" size={20} color="#4B6355" />
              <Text style={styles.imageActionBtnText}>Choose Gallery</Text>
            </TouchableOpacity>
          </View>

          {/* Instruction Box when no image */}
          {!imageUri && (
            <View style={styles.instructionBanner}>
              <Ionicons name="information-circle-outline" size={18} color="#4B6355" />
              <Text style={styles.instructionBannerText}>
                Select a food item photo above to run real YOLOv8 candidate detection.
              </Text>
            </View>
          )}

          {/* Prominent Scan Action Button */}
          <TouchableOpacity
            activeOpacity={0.88}
            onPress={handleExecuteScan}
            disabled={!imageUri || scanStatus === 'SCANNING'}
            style={[
              styles.scanActionBtn,
              (!imageUri || scanStatus === 'SCANNING') && styles.disabledScanActionBtn,
            ]}
            accessibilityLabel="Scan with Real AI"
            accessibilityRole="button"
          >
            <LinearGradient
              colors={
                imageUri && scanStatus !== 'SCANNING'
                  ? ['#3B5B47', '#4B6355']
                  : ['#94A3B8', '#64748B']
              }
              style={styles.scanActionGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {scanStatus === 'SCANNING' ? (
                <>
                  <ActivityIndicator size="small" color="#FFFFFF" />
                  <Text style={styles.scanActionText}>Running Real YOLOv8 Inference...</Text>
                </>
              ) : (
                <>
                  <Ionicons
                    name="sparkles"
                    size={18}
                    color="#FFFFFF"
                  />
                  <Text style={styles.scanActionText}>
                    {imageUri ? 'Scan with Real AI (YOLOv8)' : 'Select Image to Scan'}
                  </Text>
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>

          {/* Low-Confidence Warning Banner */}
          {currentDetection?.isLowConfidence && (
            <View style={styles.warningBanner}>
              <Ionicons name="warning-outline" size={18} color="#D97706" />
              <Text style={styles.warningBannerText}>
                Food not confidently identified ({currentDetection.confidencePercent}) — please verify or edit the food description manually below.
              </Text>
            </View>
          )}

          {/* Detected Objects Switcher (If multiple objects detected) */}
          {detections.length > 0 && (
            <View style={styles.foodSelectorCard}>
              <Text style={styles.foodSelectorTitle}>
                Detected Food Candidates ({detections.length}):
              </Text>
              <View style={styles.foodSelectorRow}>
                {detections.map((det, idx) => (
                  <TouchableOpacity
                    key={`${det.className}-${idx}`}
                    onPress={() => handleSelectDetection(idx)}
                    activeOpacity={0.8}
                    style={[
                      styles.foodPill,
                      selectedDetectionIdx === idx && styles.activeFoodPill,
                      det.isLowConfidence && styles.lowConfPill,
                    ]}
                  >
                    <Text
                      style={[
                        styles.foodPillText,
                        selectedDetectionIdx === idx && styles.activeFoodPillText,
                      ]}
                    >
                      {det.itemName} ({det.confidencePercent})
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Error Message & Retry Card */}
          {scanStatus === 'ERROR' && (
            <View style={styles.errorCard}>
              <Ionicons name="cloud-offline-outline" size={24} color="#DC2626" />
              <Text style={styles.errorTitle}>ML Inference Service Unavailable</Text>
              <Text style={styles.errorSubtitle}>
                {errorMessage || 'Could not connect to the candidate YOLOv8 service.'}
              </Text>
              <TouchableOpacity
                onPress={handleExecuteScan}
                style={styles.retryButton}
                activeOpacity={0.8}
              >
                <Ionicons name="refresh" size={16} color="#FFFFFF" />
                <Text style={styles.retryButtonText}>Retry Inference</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Donor Review & Manual Verification Card */}
          <View style={styles.reviewCard}>
            <Text style={styles.cardHeading}>Review & Verify Food Donation</Text>

            {/* Editable Food Description */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>FOOD DESCRIPTION (EDITABLE)</Text>
              <View style={styles.textInputBox}>
                <Ionicons name="restaurant-outline" size={17} color="#4B6355" />
                <TextInput
                  style={styles.textInput}
                  value={foodName}
                  onChangeText={setFoodName}
                  placeholder="e.g. Authentic Street Tacos"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* 7 Standardized Donation Categories */}
            <View style={styles.formGroup}>
              <Text style={styles.formLabel}>DONATION CATEGORY (7 STANDARDIZED CLASSES)</Text>
              <View style={styles.categoryPillsWrap}>
                {VALID_APP_CATEGORIES.map((catKey) => {
                  const isSelected = selectedCategory === catKey;
                  return (
                    <TouchableOpacity
                      key={catKey}
                      onPress={() => setSelectedCategory(catKey)}
                      activeOpacity={0.75}
                      style={[
                        styles.categoryPill,
                        isSelected && styles.categoryPillActive,
                      ]}
                    >
                      {isSelected && (
                        <Ionicons
                          name="checkmark-circle"
                          size={13}
                          color="#FFFFFF"
                          style={{ marginRight: 4 }}
                        />
                      )}
                      <Text
                        style={[
                          styles.categoryPillText,
                          isSelected && styles.categoryPillTextActive,
                        ]}
                      >
                        {APP_CATEGORY_LABELS[catKey]}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

            {/* Weight & Freshness Row */}
            <View style={styles.infoRow}>
              {/* Calculated / Stated Weight */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name="scale-outline" size={16} color="#4B6355" />
                  <Text style={styles.infoItemLabel}>Estimated Weight</Text>
                </View>
                <TextInput
                  style={styles.inlineWeightInput}
                  value={weightValue}
                  onChangeText={setWeightValue}
                  placeholder="e.g. 15 kg"
                  placeholderTextColor="#94A3B8"
                />
              </View>

              {/* Freshness Status */}
              <View style={styles.infoItem}>
                <View style={styles.infoItemHeader}>
                  <Ionicons name="shield-checkmark-outline" size={16} color="#64748B" />
                  <Text style={styles.infoItemLabel}>Freshness Model</Text>
                </View>
                <Text style={styles.freshnessStatusValue}>
                  {analysisResult?.isFreshnessLoaded
                    ? analysisResult.freshnessLabel
                    : 'Offline (Inspection Req.)'}
                </Text>
              </View>
            </View>

            {/* NGO Match Section: Displays verified match or honest pending state */}
            <View style={styles.ngoMatchCard}>
              <View style={styles.ngoIconCircle}>
                <Ionicons
                  name={matchedNgo ? 'business' : 'location-outline'}
                  size={20}
                  color={matchedNgo ? '#16A34A' : '#4B6355'}
                />
              </View>
              <View style={styles.ngoDetails}>
                <Text style={styles.ngoTitle}>
                  {matchedNgo
                    ? `Matched NGO: ${matchedNgo.name || matchedNgo.fullName || 'Hope Shelter'}`
                    : 'NGO Matching Pending'}
                </Text>
                <Text style={styles.ngoSubtitle}>
                  {matchedNgo
                    ? `Distance: ${matchedNgo.distance || '1.2 km'} • Driver Dispatch Ready`
                    : 'Nearby verified NGOs within 5 km will be matched automatically upon completing donation details.'}
                </Text>
              </View>
            </View>

            {/* Primary Action: Continue to Donation Creation */}
            <TouchableOpacity
              activeOpacity={0.88}
              onPress={handleContinueToDonation}
              style={styles.primaryActionButton}
              accessibilityLabel="Continue to Donation Creation"
              accessibilityRole="button"
            >
              <LinearGradient
                colors={['#4B6355', '#3A4E42']}
                style={styles.primaryActionGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryActionText}>Continue to Donation Creation</Text>
                <Ionicons name="arrow-forward-sharp" size={19} color="#FFFFFF" />
              </LinearGradient>
            </TouchableOpacity>

            {/* Secondary Action: Quick Rescue Dispatch */}
            <TouchableOpacity
              activeOpacity={0.78}
              onPress={handleConfirmDispatch}
              style={styles.secondaryActionButton}
              accessibilityLabel="Quick Rescue Dispatch"
              accessibilityRole="button"
            >
              <Text style={styles.secondaryActionText}>Quick Rescue Dispatch</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );

  if (visible !== undefined) {
    return (
      <Modal
        visible={visible}
        animationType="slide"
        transparent={false}
        onRequestClose={handleClose}
      >
        {renderContent()}
      </Modal>
    );
  }

  return renderContent();
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEF7EB',
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight || 20) : 0,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FEF7EB',
    borderBottomWidth: 1,
    borderColor: '#ECE0CF',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  disabledHeaderButton: {
    opacity: 0.5,
  },
  headerTitleBox: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 16,
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  candidateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(75, 99, 85, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
    marginTop: 2,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.25)',
  },
  candidateBadgeText: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#3B5B47',
    letterSpacing: 0.3,
  },
  scrollContent: {
    paddingBottom: 60,
  },
  previewViewport: {
    height: 225,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#0F172A',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  emptyViewport: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  emptyViewportTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 14,
    color: '#F8FAFC',
    marginTop: 8,
  },
  emptyViewportSubtitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 4,
    lineHeight: 16,
  },
  reticleCorner: {
    position: 'absolute',
    width: 14,
    height: 14,
    borderColor: '#A8B5A2',
  },
  tl: { top: 8, left: 8, borderTopWidth: 2.5, borderLeftWidth: 2.5, borderTopLeftRadius: 4 },
  tr: { top: 8, right: 8, borderTopWidth: 2.5, borderRightWidth: 2.5, borderTopRightRadius: 4 },
  bl: { bottom: 8, left: 8, borderBottomWidth: 2.5, borderLeftWidth: 2.5, borderBottomLeftRadius: 4 },
  br: { bottom: 8, right: 8, borderBottomWidth: 2.5, borderRightWidth: 2.5, borderBottomRightRadius: 4 },
  floatingStatusPill: {
    position: 'absolute',
    bottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.88)',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  floatingStatusText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 11,
    color: '#FFFFFF',
  },
  imageActionsRow: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 16,
    marginTop: 12,
  },
  imageActionBtn: {
    flex: 1,
    height: 48,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  imageActionBtnText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 13,
    color: '#0F172A',
  },
  instructionBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 10,
    borderRadius: 12,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.2)',
  },
  instructionBannerText: {
    flex: 1,
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#3B5B47',
    lineHeight: 16,
  },
  scanActionBtn: {
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#3B5B47',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 3,
  },
  disabledScanActionBtn: {
    opacity: 0.7,
  },
  scanActionGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  scanActionText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 10,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FDE68A',
  },
  warningBannerText: {
    flex: 1,
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#92400E',
    lineHeight: 16,
  },
  foodSelectorCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  foodSelectorTitle: {
    fontFamily: fontFamily.caption,
    fontSize: 11,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  foodSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  foodPill: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  activeFoodPill: {
    backgroundColor: '#4B6355',
    borderColor: '#3B5B47',
  },
  lowConfPill: {
    borderColor: '#F59E0B',
  },
  foodPillText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    color: '#334155',
  },
  activeFoodPillText: {
    color: '#FFFFFF',
  },
  errorCard: {
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 14,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    alignItems: 'center',
    gap: 6,
  },
  errorTitle: {
    fontFamily: fontFamily.headingBold,
    fontSize: 13,
    color: '#DC2626',
  },
  errorSubtitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#B91C1C',
    textAlign: 'center',
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4B6355',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 6,
  },
  retryButtonText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    color: '#FFFFFF',
  },
  reviewCard: {
    marginHorizontal: 16,
    marginTop: 14,
    padding: 18,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#ECE0CF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeading: {
    fontFamily: fontFamily.headingBold,
    fontSize: 16,
    color: '#0F172A',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 14,
  },
  formLabel: {
    fontFamily: fontFamily.caption,
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 6,
    letterSpacing: 0.6,
  },
  textInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 46,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
  },
  textInput: {
    flex: 1,
    color: '#0F172A',
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 14,
    padding: 0,
  },
  categoryPillsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryPill: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 38,
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  categoryPillActive: {
    backgroundColor: '#4B6355',
    borderColor: '#3B5B47',
  },
  categoryPillText: {
    fontFamily: fontFamily.bodyMedium,
    fontSize: 12,
    color: '#334155',
  },
  categoryPillTextActive: {
    color: '#FFFFFF',
    fontFamily: fontFamily.bodySemiBold,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  infoItem: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  infoItemLabel: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#64748B',
  },
  inlineWeightInput: {
    color: '#0F172A',
    fontFamily: fontFamily.headingBold,
    fontSize: 14,
    padding: 0,
    marginTop: 2,
  },
  freshnessStatusValue: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 12,
    color: '#475569',
    marginTop: 2,
  },
  ngoMatchCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    backgroundColor: '#F8FAFC',
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 18,
  },
  ngoIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  ngoDetails: {
    flex: 1,
  },
  ngoTitle: {
    fontFamily: fontFamily.headingSemiBold,
    fontSize: 13,
    color: '#0F172A',
    marginBottom: 2,
  },
  ngoSubtitle: {
    fontFamily: fontFamily.bodySmall,
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
  },
  primaryActionButton: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#4B6355',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 3,
  },
  primaryActionGradient: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingHorizontal: 20,
  },
  primaryActionText: {
    fontFamily: fontFamily.button,
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: 0.2,
  },
  secondaryActionButton: {
    marginTop: 10,
    height: 44,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#4B6355',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(75, 99, 85, 0.05)',
  },
  secondaryActionText: {
    fontFamily: fontFamily.bodySemiBold,
    fontSize: 13,
    color: '#4B6355',
  },
});
