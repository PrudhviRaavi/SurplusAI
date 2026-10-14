import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

export const DonationReviewCard = ({ donationData, onEditField }) => {
  const data = donationData || {
    foodName: 'Fresh Vegetable Biryani',
    category: 'Cooked meals',
    quantity: '25 meals',
    prepTime: 'Today, 1:00 PM',
    bestBefore: 'Today, 6:00 PM',
    storageCondition: 'Refrigerated',
    pickupAddress: '124 Luxury Boulevard, Jubilee Hills, Hyderabad',
    pickupWindow: 'Today, 6:00 PM - 8:00 PM',
    notes: 'Packaged in individual hygienic foil boxes.',
    isFoodSafe: true,
  };

  return (
    <View style={styles.cardContainer}>
      {/* Top Header */}
      <View style={styles.cardHeader}>
        <View style={styles.titleGroup}>
          <Ionicons name="document-text-outline" size={18} color={colors.primary} />
          <Text style={styles.sectionHeader}>DONATION SUMMARY</Text>
        </View>

        <TouchableOpacity onPress={onEditField} activeOpacity={0.7}>
          <Text style={styles.editLink}>Edit details ✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Photo & Food Title */}
      <View style={styles.photoRow}>
        {data.image ? (
          <Image
            source={{ uri: data.image }}
            style={styles.foodThumb}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.foodThumb, styles.emptyThumb]}>
            <Ionicons name="restaurant-outline" size={24} color={colors.primary} />
          </View>
        )}

        <View style={styles.titleCol}>
          <Text style={styles.foodName}>{data.foodName}</Text>

          <View style={styles.categoryPill}>
            <Text style={styles.categoryText}>{data.category}</Text>
          </View>

          <Text style={styles.quantityText}>
            Quantity: <Text style={styles.quantityVal}>{data.quantity}</Text>
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Safety & Freshness Row */}
      <View style={styles.metaRow}>
        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>FRESHNESS SCORE</Text>
          <Text style={[styles.metaVal, { color: '#10B981' }]}>94% (Good)</Text>
        </View>

        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>STORAGE CONDITION</Text>
          <Text style={styles.metaVal}>{data.storageCondition || 'Refrigerated'}</Text>
        </View>

        <View style={styles.metaBox}>
          <Text style={styles.metaLabel}>SAFETY VERIFIED</Text>
          <Text style={[styles.metaVal, { color: '#10B981' }]}>
            {data.isFoodSafe ? 'Safe ✓' : 'Pending'}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      {/* Pickup Details */}
      <View style={styles.locationBlock}>
        <Text style={styles.blockLabel}>PICKUP LOCATION</Text>
        <Text style={styles.blockVal}>{data.pickupAddress}</Text>

        <Text style={[styles.blockLabel, { marginTop: 10 }]}>PICKUP WINDOW</Text>
        <Text style={[styles.blockVal, { color: colors.primary }]}>
          {data.pickupWindow || 'Today, 6:00 PM - 8:00 PM'}
        </Text>

        {data.notes ? (
          <>
            <Text style={[styles.blockLabel, { marginTop: 10 }]}>SPECIAL NOTES</Text>
            <Text style={styles.blockVal}>{data.notes}</Text>
          </>
        ) : null}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: colors.surface,
    borderRadius: 26,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionHeader: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  editLink: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  photoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  foodThumb: {
    width: 64,
    height: 64,
    borderRadius: 16,
    marginRight: 14,
    borderWidth: 1,
    borderColor: colors.border,
  },
  emptyThumb: {
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleCol: {
    flex: 1,
  },
  foodName: {
    fontFamily: 'Poppins',
    fontSize: 17,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: '#FAF4EB',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginVertical: 4,
  },
  categoryText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  quantityText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  quantityVal: {
    fontWeight: '800',
    color: colors.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaBox: {
    flex: 1,
  },
  metaLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.6,
  },
  metaVal: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
    marginTop: 2,
  },
  locationBlock: {
    marginTop: 2,
  },
  blockLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  blockVal: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    marginTop: 2,
    lineHeight: 18,
  },
});
