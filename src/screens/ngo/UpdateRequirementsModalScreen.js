import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LuxuryButton } from '../../components/common/LuxuryButton';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const categories = ['Cooked meals', 'Fruits & vegetables', 'Bakery items', 'Packaged food', 'Dairy', 'Beverages'];

export const UpdateRequirementsModalScreen = ({ onClose, onSaveRequirements }) => {
  const [selectedNeeds, setSelectedNeeds] = useState(['Cooked meals', 'Bakery items']);

  const handleSave = () => {
    if (onSaveRequirements) onSaveRequirements(selectedNeeds);
    onClose();
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <View style={styles.topHeader}>
        <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
          <Ionicons name="close" size={20} color={colors.primary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>UPDATE FOOD REQUIREMENTS</Text>
        <View style={{ width: 34 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>SMART MATCH PREFERENCES</Text>
          <Text style={styles.mainTitle}>
            Organization <Text style={styles.italicSerif}>Needs.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Select the food categories your shelter or community kitchen currently requires. Our AI engine will prioritize matching these donations to you.
          </Text>
        </View>

        <Text style={styles.fieldLabel}>FOOD CATEGORIES NEEDED</Text>
        <MultiSelectPills
          options={categories}
          selectedValues={selectedNeeds}
          onToggle={(cat) => {
            const updated = selectedNeeds.includes(cat)
              ? selectedNeeds.filter((c) => c !== cat)
              : [...selectedNeeds, cat];
            setSelectedNeeds(updated);
          }}
        />
      </ScrollView>

      <View style={styles.bottomBar}>
        <LuxuryButton
          title="Save Requirements →"
          onPress={handleSave}
          variant="primary"
          size="large"
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.border,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 110,
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
  fieldLabel: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 8,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(254, 247, 235, 0.95)',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 24,
    borderTopWidth: 1,
    borderColor: colors.border,
  },
});
