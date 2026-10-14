import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { StepProgressBar } from '../../components/common/StepProgressBar';
import { LuxuryInput } from '../../components/common/LuxuryInput';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { CardGridSelector } from '../../components/common/CardGridSelector';
import { LocationPickerMap } from '../../components/common/LocationPickerMap';
import { MinimalBowlSparkLogo } from '../../components/illustrations/FoodShareIllustrations';

// AI Service & Workflow Components
import { aiService } from '../../services/ai/aiService';
import { AIAnalysisScreen } from '../../components/donor/AIAnalysisScreen';
import { AIAnalysisResultScreen } from '../../components/donor/AIAnalysisResultScreen';
import { DonationReviewCard } from '../../components/donor/DonationReviewCard';
import { DonationPublishedSuccessScreen } from './DonationPublishedSuccessScreen';

import { useAppStore } from '../../store/useAppStore';
import { donorApiService } from '../../services/api/donorApiService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const categories = [
  'Cooked meals',
  'Fruits & vegetables',
  'Bakery items',
  'Packaged food',
  'Dairy',
  'Beverages',
  'Other',
];

const quantityUnits = ['meals', 'pieces', 'kg', 'litres', 'servings'];

const storageConditions = [
  { id: 'refrigerated', label: 'Refrigerated', icon: '❄️', description: 'Stored at < 5°C' },
  { id: 'room', label: 'Room Temp', icon: '🧺', description: 'Packaged / Dry goods' },
  { id: 'hot', label: 'Hot Thermal', icon: '🍲', description: 'Kept in thermal container' },
  { id: 'frozen', label: 'Frozen', icon: '🧊', description: 'Deep frozen food' },
];

export const CreateDonationFlow = ({ onClose, onCompleteFlow, initialScannedData }) => {
  const { addDonation, formData } = useAppStore();
  const [currentStep, setCurrentStep] = useState(initialScannedData ? 4 : 1); // Jump to review if prefilled

  // Workflow Form State (Preserved across steps) - defaults to null (no preset/default image)
  const [imageUri, setImageUri] = useState(initialScannedData?.imageUri || null);
  const [imageBase64, setImageBase64] = useState(initialScannedData?.imageBase64 || null);
  const [foodName, setFoodName] = useState(initialScannedData?.foodName || '');
  const [selectedCategory, setSelectedCategory] = useState(
    initialScannedData?.displayCategory ? [initialScannedData.displayCategory] : ['Cooked meals']
  );
  const [quantityVal, setQuantityVal] = useState(String(initialScannedData?.quantityVal || ''));
  const [quantityUnit, setQuantityUnit] = useState(initialScannedData?.quantityUnit || 'meals');
  const [prepTime, setPrepTime] = useState('Today, 1:00 PM');
  const [bestBefore, setBestBefore] = useState('Today, 6:00 PM');
  const [storageCondition, setStorageCondition] = useState('refrigerated');
  const [isFoodSafe, setIsFoodSafe] = useState(true);
  const [pickupAddress, setPickupAddress] = useState(
    formData.donorAddress || '124 Luxury Boulevard, Jubilee Hills, Hyderabad'
  );
  const [pickupCoords, setPickupCoords] = useState({ latitude: 17.43, longitude: 78.40 });
  const [pickupStart, setPickupStart] = useState('6:00 PM');
  const [pickupEnd, setPickupEnd] = useState('8:00 PM');
  const [notes, setNotes] = useState(
    initialScannedData?.foodName
      ? `AI Verified (${initialScannedData.foodName}). Packaged securely.`
      : ''
  );
  const [createdDonationId, setCreatedDonationId] = useState('DON-8842');

  // AI Service Result State
  const [aiAnalysisResult, setAiAnalysisResult] = useState(initialScannedData?.analysisResult || null);

  /**
   * Captures a real photo using device camera
   */
  const handleTakePhoto = async () => {
    try {
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      if (!permissionResult.granted) {
        const msg = 'Camera permission is required to capture food photos for your donation.';
        if (Platform.OS === 'web') {
          window.alert(msg);
        } else {
          Alert.alert('Camera Permission Required', msg);
        }
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 || null);
    } catch (err) {
      console.warn('[CreateDonationFlow] Error capturing photo:', err);
      const msg = 'Could not access camera. Please check camera permissions and try again.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Camera Error', msg);
      }
    }
  };

  /**
   * Selects an existing food photo from the device photo gallery
   */
  const handleChooseFromGallery = async () => {
    try {
      try {
        const permResult = await ImagePicker.getMediaLibraryPermissionsAsync();
        if (!permResult.granted && permResult.canAskAgain) {
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
      } catch (permErr) {
        console.info('[CreateDonationFlow] Media library check notice:', permErr.message);
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        base64: true,
        allowsEditing: false,
      });

      if (result.canceled || !result.assets || result.assets.length === 0) {
        return;
      }

      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageBase64(asset.base64 || null);
    } catch (err) {
      console.warn('[CreateDonationFlow] Error choosing from gallery:', err);
      const msg = 'Could not open photo gallery. Please check permissions and try again.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Gallery Error', msg);
      }
    }
  };

  const handleRetakePhoto = () => {
    setImageUri(null);
    setImageBase64(null);
  };

  const handleNextStep = () => {
    if (currentStep < 8) setCurrentStep(currentStep + 1);
  };

  const handlePrevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
    else onClose();
  };

  const handleAIAnalysisComplete = (result) => {
    if (result && result.success) {
      setAiAnalysisResult(result);
      setFoodName(result.detectedFood || foodName);
      const categoryMap = {
        COOKED_MEALS: 'Cooked meals',
        FRUITS_VEGETABLES: 'Fruits & vegetables',
        BAKERY: 'Bakery items',
        PACKAGED_FOOD: 'Packaged food',
        DAIRY: 'Dairy',
        BEVERAGES: 'Beverages',
        OTHER: 'Other',
      };
      const displayCat = categoryMap[result.category] || result.category || 'Cooked meals';
      setSelectedCategory([displayCat]);
      setQuantityVal(String(result.estimatedQuantityNum || quantityVal));
      setQuantityUnit(result.quantityUnit || quantityUnit);
    }
    setCurrentStep(4); // Advance to AI Analysis Result screen
  };

  const handleConfirmAIResults = (confirmedData) => {
    if (confirmedData) {
      setFoodName(confirmedData.foodName);
      setSelectedCategory([confirmedData.displayCategory || confirmedData.category || 'Cooked meals']);
    }
    setCurrentStep(5); // Continue to Donation Details & Safety
  };

  const handlePublish = async () => {
    const newId = `DON-${Math.floor(1000 + Math.random() * 9000)}`;

    const coordsArray = [
      Number(pickupCoords.longitude) || 78.40,
      Number(pickupCoords.latitude) || 17.43,
    ];

    let createdRecord = null;

    // Call real backend API to create and publish donation
    try {
      createdRecord = await donorApiService.createDonation({
        foodName,
        category: selectedCategory[0] || 'Cooked meals',
        quantity: Number(quantityVal) || 25,
        quantityUnit,
        image: imageUri,
        preparationTime: new Date().toISOString(),
        bestBefore: new Date(Date.now() + 6 * 3600000).toISOString(),
        pickupStartTime: new Date().toISOString(),
        pickupEndTime: new Date(Date.now() + 4 * 3600000).toISOString(),
        notes,
        location: {
          type: 'Point',
          coordinates: coordsArray,
        },
      });

      const actualId = createdRecord?._id || createdRecord?.id || newId;
      setCreatedDonationId(actualId);

      if (createdRecord?._id || createdRecord?.id) {
        await donorApiService.publishDonation(createdRecord._id || createdRecord.id);
      }
    } catch (err) {
      console.warn('[DonorApiService publish notice]', err.message);
      const msg = err.message || 'Failed to publish donation to server.';
      if (Platform.OS === 'web') {
        window.alert(msg);
      } else {
        Alert.alert('Publish Error', msg);
      }
      return;
    }

    const donationObject = {
      id: createdRecord?._id || createdRecord?.id || newId,
      _id: createdRecord?._id || createdRecord?.id || newId,
      donorId: 'DNR-001',
      foodName,
      category: selectedCategory[0] || 'Cooked meals',
      image: imageUri,
      quantity: `${quantityVal} ${quantityUnit}`,
      quantityUnit,
      preparationTime: prepTime,
      bestBefore,
      storageCondition,
      freshnessScore: aiAnalysisResult?.freshnessScore || 94,
      freshnessLabel: aiAnalysisResult?.freshnessLabel || 'Good',
      aiConfidence: aiAnalysisResult?.confidence || '94%',
      pickupLocation: {
        latitude: pickupCoords.latitude,
        longitude: pickupCoords.longitude,
      },
      pickupAddress,
      pickupStartTime: pickupStart,
      pickupEndTime: pickupEnd,
      notes,
      isFoodSafe,
      status: 'Published',
      createdAt: createdRecord?.createdAt || new Date().toISOString(),
      claimedBy: null,
      volunteerId: null,
    };

    addDonation(donationObject);
    setCurrentStep(8); // Step 8: Success
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        {/* Top Header Bar */}
        <View style={styles.topHeader}>
          <TouchableOpacity onPress={handlePrevStep} style={styles.closeBtn} activeOpacity={0.7}>
            <Ionicons
              name={currentStep === 1 ? 'close' : 'chevron-back'}
              size={20}
              color={colors.primary}
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            CREATE DONATION ({currentStep < 8 ? `0${currentStep} / 07` : 'SUCCESS'})
          </Text>

          <View style={{ width: 34 }} />
        </View>

        {/* Progress Bar Header */}
        {currentStep < 8 && (
          <View style={styles.progressWrapper}>
            <StepProgressBar currentStep={currentStep} totalSteps={7} />
          </View>
        )}

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* STEP 1: INTRO SCREEN */}
          {currentStep === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.heroBannerFrame}>
                <MinimalBowlSparkLogo size={84} glowOpacity={0.6} />
                <Text style={styles.heroBannerTag}>FOOD RESCUE NETWORK</Text>
              </View>

              <View style={styles.titleCenter}>
                <Text style={styles.subTag}>DONOR DISPATCH</Text>
                <Text style={styles.mainTitle}>
                  Give your surplus <Text style={styles.italicSerif}>another destination.</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Tell us a little about the food you're sharing. We'll connect you with nearby verified NGOs and handle volunteer pickup.
                </Text>
              </View>

              <LuxuryButton
                title="Start Donation →"
                onPress={handleNextStep}
                variant="primary"
                size="large"
                style={{ marginTop: 20 }}
              />
            </View>
          )}

          {/* STEP 2: FOOD PHOTO SELECTION (STEP 01 OF 06: What are you sharing?) */}
          {currentStep === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.subTag}>STEP 01 OF 06</Text>
                <Text style={styles.mainTitle}>
                  What are you <Text style={styles.italicSerif}>sharing?</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Capture or choose a photo of the surplus meals to help receivers verify food quality.
                </Text>
              </View>

              {imageUri ? (
                <View style={styles.previewBox}>
                  <Image source={{ uri: imageUri }} style={styles.previewImg} resizeMode="contain" />
                  <View style={styles.previewActions}>
                    <TouchableOpacity
                      onPress={handleRetakePhoto}
                      style={styles.retakeBtn}
                      activeOpacity={0.8}
                    >
                      <Ionicons name="refresh" size={16} color="#DC2626" />
                      <Text style={styles.retakeText}>Change Photo</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <View style={styles.photoActionsBox}>
                  <TouchableOpacity
                    onPress={handleTakePhoto}
                    style={styles.photoActionCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.photoIconCircle}>
                      <Ionicons name="camera-outline" size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.photoActionTitle}>Take Photo</Text>
                    <Text style={styles.photoActionSub}>Use camera to capture food</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={handleChooseFromGallery}
                    style={styles.photoActionCard}
                    activeOpacity={0.8}
                  >
                    <View style={styles.photoIconCircle}>
                      <Ionicons name="images-outline" size={28} color={colors.primary} />
                    </View>
                    <Text style={styles.photoActionTitle}>Choose from Gallery</Text>
                    <Text style={styles.photoActionSub}>Select photo from device</Text>
                  </TouchableOpacity>
                </View>
              )}

              <LuxuryButton
                title="Analyze with AI →"
                onPress={handleNextStep}
                variant="primary"
                size="large"
                disabled={!imageUri}
                style={{ marginTop: 24 }}
              />

              <TouchableOpacity
                onPress={() => setCurrentStep(5)}
                style={styles.skipToManualBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.skipToManualText}>Skip AI and Enter Manually →</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* STEP 3: FULL-SCREEN AI SCANNER VISUALIZER */}
          {currentStep === 3 && (
            <AIAnalysisScreen
              imageUri={imageUri}
              imageBase64={imageBase64}
              onCompleteAnalysis={handleAIAnalysisComplete}
              onSkipManual={() => setCurrentStep(5)}
            />
          )}

          {/* STEP 4: AI RESULT VERIFICATION & DONOR OVERRIDE */}
          {currentStep === 4 && (
            <AIAnalysisResultScreen
              analysisResult={aiAnalysisResult}
              onConfirmDetails={handleConfirmAIResults}
              onEditManually={() => setCurrentStep(5)}
            />
          )}

          {/* STEP 5: DONATION DETAILS & FOOD SAFETY */}
          {currentStep === 5 && (
            <View style={styles.stepContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.subTag}>STEP 03 OF 06</Text>
                <Text style={styles.mainTitle}>
                  Donation <Text style={styles.italicSerif}>Details & Safety.</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Confirm food description, quantity, storage temperature, and food safety compliance.
                </Text>
              </View>

              <LuxuryInput
                label="Food Name"
                placeholder="e.g. Fresh Vegetable Biryani"
                value={foodName}
                onChangeText={setFoodName}
                iconName="restaurant-outline"
              />

              <Text style={styles.fieldLabel}>FOOD CATEGORY</Text>
              <MultiSelectPills
                options={categories}
                selectedValues={selectedCategory}
                onToggle={(cat) => setSelectedCategory([cat])}
              />

              <Text style={styles.fieldLabel}>APPROXIMATE QUANTITY</Text>
              <View style={styles.quantityRow}>
                <View style={{ flex: 1 }}>
                  <LuxuryInput
                    label="Quantity Number"
                    placeholder="25"
                    value={quantityVal}
                    onChangeText={setQuantityVal}
                    keyboardType="numeric"
                  />
                </View>

                <View style={{ width: 140, marginLeft: 10 }}>
                  <Text style={styles.unitLabel}>UNIT</Text>
                  <View style={styles.unitsPillsRow}>
                    {quantityUnits.slice(0, 3).map((unit) => (
                      <TouchableOpacity
                        key={unit}
                        onPress={() => setQuantityUnit(unit)}
                        style={[
                          styles.unitPill,
                          quantityUnit === unit && styles.unitPillActive,
                        ]}
                      >
                        <Text
                          style={[
                            styles.unitPillText,
                            quantityUnit === unit && styles.unitPillTextActive,
                          ]}
                        >
                          {unit}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.rowTwoCols}>
                <View style={styles.col}>
                  <LuxuryInput
                    label="Preparation Time"
                    placeholder="e.g. Today, 1:00 PM"
                    value={prepTime}
                    onChangeText={setPrepTime}
                    iconName="time-outline"
                  />
                </View>

                <View style={styles.col}>
                  <LuxuryInput
                    label="Best Before / Expiry"
                    placeholder="e.g. Today, 6:00 PM"
                    value={bestBefore}
                    onChangeText={setBestBefore}
                    iconName="hourglass-outline"
                  />
                </View>
              </View>

              <Text style={styles.fieldLabel}>STORAGE CONDITION</Text>
              <CardGridSelector
                options={storageConditions}
                selectedId={storageCondition}
                onSelect={setStorageCondition}
                columns={2}
              />

              {/* Dedicated Food Safety Section */}
              <View style={styles.safetyCard}>
                <View style={styles.safetyHeader}>
                  <Ionicons name="shield-checkmark-outline" size={20} color="#10B981" />
                  <Text style={styles.safetyTitle}>FOOD SAFETY VERIFICATION</Text>
                </View>

                <Text style={styles.safetyQuestion}>Was this food prepared and stored safely?</Text>

                <View style={styles.safetyToggleRow}>
                  <TouchableOpacity
                    onPress={() => setIsFoodSafe(true)}
                    style={[
                      styles.safetyOptionBtn,
                      isFoodSafe && styles.safetyOptionBtnActive,
                    ]}
                  >
                    <Text style={[styles.safetyOptionText, isFoodSafe && styles.safetyOptionTextActive]}>
                      Yes, Safe ✓
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={() => setIsFoodSafe(false)}
                    style={[
                      styles.safetyOptionBtn,
                      !isFoodSafe && styles.safetyOptionBtnDanger,
                    ]}
                  >
                    <Text style={[styles.safetyOptionText, !isFoodSafe && styles.safetyOptionTextDanger]}>
                      No / Unsure
                    </Text>
                  </TouchableOpacity>
                </View>

                <Text style={styles.safetyNotice}>
                  ℹ️ Only list food that is safe and suitable for redistribution according to municipal food hygiene guidelines.
                </Text>
              </View>

              <LuxuryButton
                title="Continue to Location →"
                onPress={handleNextStep}
                variant="primary"
                size="large"
                style={{ marginTop: 24 }}
              />
            </View>
          )}

          {/* STEP 6: PICKUP LOCATION & WINDOW */}
          {currentStep === 6 && (
            <View style={styles.stepContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.subTag}>STEP 04 OF 06</Text>
                <Text style={styles.mainTitle}>
                  Where can it <Text style={styles.italicSerif}>be collected?</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Specify pickup location and available collection time window for receivers and volunteers.
                </Text>
              </View>

              <Text style={styles.fieldLabel}>PICKUP LOCATION</Text>
              <LocationPickerMap
                initialAddress={pickupAddress}
                initialCoords={pickupCoords}
                onLocationConfirm={(loc) => {
                  if (typeof loc === 'string') {
                    setPickupAddress(loc);
                  } else if (loc && typeof loc === 'object') {
                    if (loc.address) setPickupAddress(loc.address);
                    if (loc.latitude && loc.longitude) {
                      setPickupCoords({ latitude: loc.latitude, longitude: loc.longitude });
                    }
                  }
                }}
              />

              <Text style={styles.fieldLabel}>PICKUP TIME WINDOW</Text>
              <View style={styles.rowTwoCols}>
                <View style={styles.col}>
                  <LuxuryInput
                    label="Available From"
                    placeholder="e.g. 6:00 PM"
                    value={pickupStart}
                    onChangeText={setPickupStart}
                    iconName="time-outline"
                  />
                </View>

                <View style={styles.col}>
                  <LuxuryInput
                    label="Available Until"
                    placeholder="e.g. 8:00 PM"
                    value={pickupEnd}
                    onChangeText={setPickupEnd}
                    iconName="hourglass-outline"
                  />
                </View>
              </View>

              <LuxuryInput
                label="Donation Notes / Special Instructions"
                placeholder="e.g. Packed in individual foil containers. Keep refrigerated."
                value={notes}
                onChangeText={setNotes}
                iconName="create-outline"
              />

              <LuxuryButton
                title="Review Donation →"
                onPress={handleNextStep}
                variant="primary"
                size="large"
                style={{ marginTop: 24 }}
              />
            </View>
          )}

          {/* STEP 7: REVIEW DONATION SUMMARY */}
          {currentStep === 7 && (
            <View style={styles.stepContainer}>
              <View style={styles.titleSection}>
                <Text style={styles.subTag}>FINAL REVIEW</Text>
                <Text style={styles.mainTitle}>
                  Review your <Text style={styles.italicSerif}>Donation.</Text>
                </Text>
                <Text style={styles.subtitle}>
                  Verify all details before publishing your surplus food listing to the live rescue network.
                </Text>
              </View>

              <DonationReviewCard
                donationData={{
                  foodName,
                  category: selectedCategory[0],
                  quantity: `${quantityVal} ${quantityUnit}`,
                  prepTime,
                  bestBefore,
                  storageCondition,
                  pickupAddress,
                  pickupWindow: `Today, ${pickupStart} - ${pickupEnd}`,
                  notes,
                  isFoodSafe,
                  image: imageUri,
                }}
                onEditField={() => setCurrentStep(5)}
              />

              <LuxuryButton
                title="Publish Surplus Donation →"
                onPress={handlePublish}
                variant="primary"
                size="large"
                style={{ marginTop: 10 }}
              />
            </View>
          )}

          {/* STEP 8: PUBLISH SUCCESS STATE */}
          {currentStep === 8 && (
            <DonationPublishedSuccessScreen
              donationId={createdDonationId}
              onViewDonation={() => {
                if (onCompleteFlow) onCompleteFlow();
                else onClose();
              }}
              onBackToDashboard={onClose}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardView: {
    flex: 1,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.background,
  },
  closeBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: 1.0,
  },
  progressWrapper: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  stepContainer: {
    width: '100%',
  },
  heroBannerFrame: {
    height: 180,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroBannerTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
    letterSpacing: 1.2,
    marginTop: 10,
  },
  heroImageFrame: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  heroImg: {
    width: '100%',
    height: '100%',
  },
  titleCenter: {
    alignItems: 'center',
  },
  titleSection: {
    marginBottom: 16,
  },
  subTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 2,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  subtitle: {
    fontSize: 13,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 19,
    marginTop: 4,
  },
  photoActionsBox: {
    gap: 12,
    marginVertical: 16,
  },
  photoActionCard: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  photoIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  photoActionTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  photoActionSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  previewBox: {
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: '#0F172A',
    marginBottom: 16,
  },
  previewImg: {
    width: '100%',
    height: 220,
  },
  previewActions: {
    backgroundColor: colors.surface,
    padding: 12,
    alignItems: 'center',
  },
  retakeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  retakeText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#DC2626',
  },
  skipToManualBtn: {
    alignSelf: 'center',
    marginTop: 14,
    paddingVertical: 8,
  },
  skipToManualText: {
    fontFamily: 'Poppins',
    fontSize: 13,
    fontWeight: '600',
    color: colors.primary,
  },
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 8,
    marginTop: 10,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unitLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    marginBottom: 6,
  },
  unitsPillsRow: {
    flexDirection: 'row',
    gap: 4,
  },
  unitPill: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  unitPillActive: {
    backgroundColor: colors.primary,
  },
  unitPillText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  unitPillTextActive: {
    color: colors.white,
  },
  rowTwoCols: {
    flexDirection: 'row',
    gap: 12,
  },
  col: {
    flex: 1,
  },
  safetyCard: {
    backgroundColor: '#FAF4EB',
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginTop: 14,
  },
  safetyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  safetyTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 1.0,
  },
  safetyQuestion: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  safetyToggleRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 10,
  },
  safetyOptionBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
  },
  safetyOptionBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  safetyOptionBtnDanger: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },
  safetyOptionText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textSecondary,
  },
  safetyOptionTextActive: {
    color: '#065F46',
    fontWeight: '800',
  },
  safetyOptionTextDanger: {
    color: '#DC2626',
    fontWeight: '800',
  },
  safetyNotice: {
    fontSize: 11,
    color: colors.textSecondary,
    lineHeight: 16,
  },
});
