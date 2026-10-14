import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryInput } from '../common/LuxuryInput';
import { LuxuryButton } from '../common/LuxuryButton';
import { MultiSelectPills } from '../common/MultiSelectPills';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const categoryOptions = [
  'Cooked meals',
  'Fruits & vegetables',
  'Bakery items',
  'Packaged food',
  'Dairy',
  'Beverages',
  'Other',
];

const APP_CATEGORY_TO_DISPLAY = {
  COOKED_MEALS: 'Cooked meals',
  FRUITS_VEGETABLES: 'Fruits & vegetables',
  BAKERY: 'Bakery items',
  PACKAGED_FOOD: 'Packaged food',
  DAIRY: 'Dairy',
  BEVERAGES: 'Beverages',
  OTHER: 'Other',
};

const DISPLAY_TO_APP_CATEGORY = {
  'Cooked meals': 'COOKED_MEALS',
  'Fruits & vegetables': 'FRUITS_VEGETABLES',
  'Bakery items': 'BAKERY',
  'Packaged food': 'PACKAGED_FOOD',
  'Dairy': 'DAIRY',
  'Beverages': 'BEVERAGES',
  'Other': 'OTHER',
};

const unitOptions = ['servings', 'meals', 'pieces', 'kg', 'litres'];

export const AIAnalysisResultScreen = ({ analysisResult, onConfirmDetails, onEditManually }) => {
  const result = analysisResult || {
    detectedFood: 'Vegetable Biryani',
    detectedItems: ['Vegetable Biryani', 'Basmati Rice', 'Mixed Vegetables'],
    confidence: '94%',
    category: 'Cooked meals',
    freshnessLabel: 'Good',
    freshnessScore: 86,
    estimatedQuantity: '20–25',
    estimatedQuantityNum: 25,
    quantityUnit: 'servings',
    quantityConfidence: '82%',
    estimatedConsumptionWindow: '4–6 hours',
  };

  const initialDisplayCategory =
    APP_CATEGORY_TO_DISPLAY[result.category] || result.category || 'Cooked meals';

  // Donor Override Editable States
  const [foodName, setFoodName] = useState(result.detectedFood || 'Surplus Food');
  const [selectedCategory, setSelectedCategory] = useState([initialDisplayCategory]);
  const [quantityVal, setQuantityVal] = useState(String(result.estimatedQuantityNum || '25'));
  const [selectedUnit, setSelectedUnit] = useState(result.quantityUnit || 'servings');

  const handleConfirm = () => {
    if (onConfirmDetails) {
      const chosenDisplay = selectedCategory[0] || 'Cooked meals';
      const canonicalCategory = DISPLAY_TO_APP_CATEGORY[chosenDisplay] || 'COOKED_MEALS';
      onConfirmDetails({
        foodName,
        category: canonicalCategory,
        displayCategory: chosenDisplay,
        quantity: `${quantityVal} ${selectedUnit}`,
        freshnessScore: result.freshnessScore,
        freshnessLabel: result.freshnessLabel,
        estimatedConsumptionWindow: result.estimatedConsumptionWindow,
        aiConfidence: result.confidence,
      });
    }
  };

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <View style={styles.titleSection}>
        <View style={styles.aiBadge}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiBadgeText}>AI ANALYSIS COMPLETE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Here's what <Text style={styles.italicSerif}>we found.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Our visual ML models detected the food items below. Review and modify any value before proceeding.
        </Text>
      </View>

      {/* 1. Food Detection & Multi-Item Tags */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTag}>FOOD DETECTION MODEL</Text>
          <View style={styles.confidenceTag}>
            <Text style={styles.confidenceText}>{result.confidence} Confidence</Text>
          </View>
        </View>

        <Text style={styles.fieldSubLabel}>DETECTED DISHES</Text>
        <View style={styles.itemsPillsRow}>
          {Array.isArray(result.detectedItems) && result.detectedItems.length > 0 ? (
            result.detectedItems.map((item, idx) => (
              <View key={idx} style={styles.itemPill}>
                <Ionicons name="pricetag-outline" size={12} color={colors.primary} />
                <Text style={styles.itemPillText}>{item}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.safetyDisclaimer}>No specific food items detected.</Text>
          )}
        </View>

        <LuxuryInput
          label="Confirmed Food Name"
          value={foodName}
          onChangeText={setFoodName}
          placeholder="e.g. Vegetable Biryani"
          iconName="restaurant-outline"
          style={{ marginTop: 12 }}
        />
      </View>

      {/* 2. Food Classification Category Selector */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardHeaderTag}>CLASSIFICATION MODEL</Text>
        <Text style={styles.fieldSubLabel}>FOOD CATEGORY</Text>
        <MultiSelectPills
          options={categoryOptions}
          selectedValues={selectedCategory}
          onToggle={(cat) => setSelectedCategory([cat])}
        />
      </View>

      {/* 3. Freshness Evaluation Card */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTag}>
            {result.isFreshnessLoaded ? 'TRAINED ML FRESHNESS MODEL' : 'FOOD FRESHNESS ESTIMATION'}
          </Text>
          <View style={[
            styles.freshnessBadgeBubble,
            result.isFreshnessLoaded ? styles.modelLoadedBadge : styles.rulesEstimateBadge,
          ]}>
            <Text style={styles.freshnessBadgeText}>
              {result.isFreshnessLoaded ? 'TRAINED ML MODEL' : 'RULES-BASED ESTIMATE'}
            </Text>
          </View>
        </View>

        <Text style={[styles.freshnessLabelTag, { color: result.freshnessScore && result.freshnessScore < 50 ? '#DC2626' : '#10B981', marginTop: 6 }]}>
          {result.freshnessLabel || 'Inspection Required'}
        </Text>

        <View style={styles.freshnessGaugeRow}>
          <View style={styles.scoreCircle}>
            {result.freshnessScore != null ? (
              <>
                <Text style={styles.scoreNum}>{result.freshnessScore}</Text>
                <Text style={styles.scoreMax}>/ 100</Text>
              </>
            ) : (
              <Ionicons name="clipboard-outline" size={24} color={colors.primary} />
            )}
          </View>

          <View style={styles.scoreTextCol}>
            <Text style={styles.freshnessTitle}>
              {result.isFreshnessLoaded ? 'ML Model Confidence' : 'Food Safety Estimate'}
            </Text>
            <Text style={styles.freshnessSub}>
              {result.freshnessExplanation ||
                (result.isFreshnessLoaded
                  ? 'Inferred by custom computer vision classifier.'
                  : 'Based on food category, elapsed time, and storage standards.')}
            </Text>
          </View>
        </View>

        {/* Factors Breakdown */}
        {result.freshnessFactors && result.freshnessFactors.length > 0 && (
          <View style={styles.factorsList}>
            {result.freshnessFactors.map((factor, idx) => (
              <View key={idx} style={styles.factorChip}>
                <Text style={styles.factorName}>{factor.name}:</Text>
                <Text style={styles.factorVal}>{factor.value}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.safetyDisclaimer}>
          ⚠️ {result.disclaimer || 'Never infer food safety from appearance alone. Always verify texture, aroma, and temperature before consumption.'}
        </Text>
      </View>

      {/* 4. Safe Consumption Estimate Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardHeaderTag}>SAFE CONSUMPTION WINDOW</Text>
        <Text style={styles.fieldSubLabel}>RECOMMENDED CONSUMPTION PERIOD</Text>
        
        <View style={styles.windowBox}>
          <Ionicons name="hourglass-outline" size={24} color={colors.primary} />
          <View style={styles.windowTextCol}>
            <Text style={styles.windowVal}>
              {result.estimatedConsumptionWindow
                ? `Window: ${result.estimatedConsumptionWindow}`
                : 'Inspect food before consumption'}
            </Text>
            <Text style={styles.windowSub}>Recommended storage: Refrigerated at &lt; 5°C or thermal</Text>
          </View>
        </View>

        <Text style={styles.safetyDisclaimer}>
          ℹ️ Operational food safety estimate. Follow appropriate municipal food recovery standards.
        </Text>
      </View>

      {/* 5. Quantity Estimation Card */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTag}>QUANTITY ESTIMATION MODEL</Text>
          <Text style={styles.confidenceText}>{result.quantityConfidence || '82%'} Confidence</Text>
        </View>

        <View style={styles.quantityRow}>
          <View style={{ flex: 1 }}>
            <LuxuryInput
              label="Quantity Number"
              value={quantityVal}
              onChangeText={setQuantityVal}
              keyboardType="numeric"
              placeholder="25"
            />
          </View>

          <View style={{ width: 140, marginLeft: 10 }}>
            <Text style={styles.fieldSubLabel}>UNIT</Text>
            <View style={styles.unitPillsRow}>
              {unitOptions.slice(0, 3).map((unit) => (
                <TouchableOpacity
                  key={unit}
                  onPress={() => setSelectedUnit(unit)}
                  style={[
                    styles.unitPill,
                    selectedUnit === unit && styles.unitPillActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.unitPillText,
                      selectedUnit === unit && styles.unitPillTextActive,
                    ]}
                  >
                    {unit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* Confirmation Action Buttons */}
      <View style={styles.actionContainer}>
        <Text style={styles.reviewNotice}>Review your information before continuing.</Text>
        <LuxuryButton
          title="Use These Details →"
          onPress={handleConfirm}
          variant="primary"
          size="large"
          style={{ marginBottom: 10 }}
        />
        <LuxuryButton
          title="Edit Manually"
          onPress={onEditManually}
          variant="outline"
          size="medium"
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
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
    alignSelf: 'flex-start',
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
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 16,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cardHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  confidenceTag: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  confidenceText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  fieldSubLabel: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  itemsPillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  itemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: colors.border,
  },
  itemPillText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  freshnessLabelTag: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
  freshnessGaugeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 6,
  },
  scoreCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#10B981',
  },
  scoreNum: {
    fontSize: 18,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#10B981',
  },
  scoreMax: {
    fontSize: 8,
    color: colors.textMuted,
    marginTop: -4,
  },
  scoreTextCol: {
    flex: 1,
  },
  freshnessTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  freshnessSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  safetyDisclaimer: {
    fontSize: 11,
    color: colors.textMuted,
    lineHeight: 16,
    marginTop: 8,
  },
  windowBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAF4EB',
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 12,
    marginVertical: 4,
  },
  windowTextCol: {
    flex: 1,
  },
  windowVal: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  windowSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  unitPillsRow: {
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
  actionContainer: {
    marginTop: 10,
    alignItems: 'center',
  },
  reviewNotice: {
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 10,
  },
  freshnessBadgeBubble: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  modelLoadedBadge: {
    backgroundColor: '#D1FAE5',
  },
  rulesEstimateBadge: {
    backgroundColor: '#FEF3C7',
  },
  freshnessBadgeText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#92400E',
  },
  factorsList: {
    marginTop: 8,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  factorChip: {
    flexDirection: 'row',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  factorName: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  factorVal: {
    fontSize: 10,
    fontFamily: 'Poppins',
    color: colors.textSecondary,
  },
});
