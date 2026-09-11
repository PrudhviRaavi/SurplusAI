import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const stages = ['Posted', 'Matched', 'Claimed', 'Pickup', 'Delivered'];

export const ActiveDonationCard = ({
  foodName = 'Vegetable Rice',
  quantity = '25 meals',
  currentStageIndex = 1, // Matched
  matchedNgo = 'Hope Community Kitchen',
  distance = '2.4 km',
  etaText = 'Volunteer arriving in 12 min',
  onPressDetails,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPressDetails}
      style={styles.cardContainer}
    >
      <View style={styles.headerRow}>
        <View style={styles.activeTag}>
          <View style={styles.pulseDot} />
          <Text style={styles.activeTagText}>ACTIVE DONATION</Text>
        </View>

        <Text style={styles.etaText}>{etaText}</Text>
      </View>

      {/* Main Info */}
      <View style={styles.infoRow}>
        <View style={styles.foodIconBubble}>
          <Text style={styles.foodEmoji}>🍱</Text>
        </View>

        <View style={styles.textWrapper}>
          <Text style={styles.foodName}>{foodName}</Text>
          <Text style={styles.ngoMatchSub}>
            Matched with <Text style={styles.ngoName}>{matchedNgo}</Text> ({distance})
          </Text>
        </View>

        <View style={styles.quantityBadge}>
          <Text style={styles.quantityText}>{quantity}</Text>
        </View>
      </View>

      {/* Stage Progress Bar */}
      <View style={styles.stageProgressSection}>
        <View style={styles.stageTrack}>
          {stages.map((stageName, idx) => {
            const isCompleted = idx < currentStageIndex;
            const isCurrent = idx === currentStageIndex;

            return (
              <React.Fragment key={stageName}>
                <View
                  style={[
                    styles.stageDot,
                    isCompleted && styles.stageDotCompleted,
                    isCurrent && styles.stageDotCurrent,
                  ]}
                >
                  {isCompleted && (
                    <Ionicons name="checkmark" size={10} color={colors.white} />
                  )}
                  {isCurrent && <View style={styles.innerDot} />}
                </View>

                {idx < stages.length - 1 && (
                  <View
                    style={[
                      styles.stageLine,
                      idx < currentStageIndex && styles.stageLineCompleted,
                    ]}
                  />
                )}
              </React.Fragment>
            );
          })}
        </View>

        <View style={styles.stageLabelsRow}>
          {stages.map((stageName, idx) => {
            const isCurrent = idx === currentStageIndex;
            return (
              <Text
                key={stageName}
                style={[
                  styles.stageLabelText,
                  isCurrent && styles.stageLabelTextCurrent,
                ]}
              >
                {stageName}
              </Text>
            );
          })}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  activeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  pulseDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
    marginRight: 6,
  },
  activeTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.8,
  },
  etaText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodIconBubble: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#FAF4EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  foodEmoji: {
    fontSize: 24,
  },
  textWrapper: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  ngoMatchSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  ngoName: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  quantityBadge: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(75, 99, 85, 0.15)',
  },
  quantityText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  stageProgressSection: {
    marginTop: 4,
  },
  stageTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  stageDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  stageDotCompleted: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  stageDotCurrent: {
    borderColor: colors.primary,
    backgroundColor: colors.surface,
    borderWidth: 2,
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  stageLine: {
    flex: 1,
    height: 2,
    backgroundColor: colors.border,
    marginHorizontal: 2,
  },
  stageLineCompleted: {
    backgroundColor: colors.primary,
  },
  stageLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  stageLabelText: {
    fontSize: 10,
    fontWeight: '500',
    color: colors.textMuted,
  },
  stageLabelTextCurrent: {
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
});
