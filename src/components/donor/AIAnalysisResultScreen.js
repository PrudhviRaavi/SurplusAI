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

  // Donor Override Editable States
  const [foodName, setFoodName] = useState(result.detectedFood);
  const [selectedCategory, setSelectedCategory] = useState([result.category || 'Cooked meals']);
  const [quantityVal, setQuantityVal] = useState(String(result.estimatedQuantityNum || '25'));
  const [selectedUnit, setSelectedUnit] = useState(result.quantityUnit || 'servings');

  const handleConfirm = () => {
    if (onConfirmDetails) {
      onConfirmDetails({
        foodName,
        category: selectedCategory[0] || 'Cooked meals',
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
          {result.detectedItems.map((item, idx) => (
            <View key={idx} style={styles.itemPill}>
              <Ionicons name="pricetag-outline" size={12} color={colors.primary} />
              <Text style={styles.itemPillText}>{item}</Text>
            </View>
          ))}
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

      {/* 3. Freshness Prediction Card */}
      <View style={styles.sectionCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTag}>FRESHNESS PREDICTION MODEL</Text>
          <Text style={[styles.freshnessLabelTag, { color: '#10B981' }]}>
            {result.freshnessLabel}
          </Text>
        </View>

        <View style={styles.freshnessGaugeRow}>
          <View style={styles.scoreCircle}>
            <Text style={styles.scoreNum}>{result.freshnessScore}</Text>
            <Text style={styles.scoreMax}>/ 100</Text>
          </View>

          <View style={styles.scoreTextCol}>
            <Text style={styles.freshnessTitle}>Estimated Freshness Score</Text>
            <Text style={styles.freshnessSub}>
              Based on detected food type and visual appearance.
            </Text>
          </View>
        </View>

        <Text style={styles.safetyDisclaimer}>
          ⚠️ Estimated freshness AI prediction. Please verify food safety before donation.
        </Text>
      </View>

      {/* 4. Safe Consumption Estimate Card */}
      <View style={styles.sectionCard}>
        <Text style={styles.cardHeaderTag}>SAFE CONSUMPTION MODEL</Text>
        <Text style={styles.fieldSubLabel}>ESTIMATED CONSUMPTION WINDOW</Text>
        
        <View style={styles.windowBox}>
          <Ionicons name="hourglass-outline" size={24} color={colors.primary} />
          <View style={styles.windowTextCol}>
            <Text style={styles.windowVal}>Best used within {result.estimatedConsumptionWindow}</Text>
            <Text style={styles.windowSub}>Recommended storage: Refrigerated at &lt; 5°C</Text>
          </View>
        </View>

        <Text style={styles.safetyDisclaimer}>
          ℹ️ AI-generated estimate. Always follow appropriate municipal food safety practices.
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
});
