import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const DEFAULT_FOOD_IMG =
  'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800&auto=format&fit=crop';

export const DeliveryProofCard = ({
  pickupPhoto,
  deliveryPhoto,
  pickupTime = '6:18 PM',
  deliveryTime = '6:42 PM',
  donorName = 'Green Leaf Restaurant',
  ngoName = 'Hope Community Kitchen',
  volunteerName = 'Arjun Kumar',
  foodName = 'Vegetable Biryani',
  quantity = '25 meals',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Ionicons name="shield-checkmark-sharp" size={16} color="#10B981" />
        <Text style={styles.headerTitle}>PROOF OF DELIVERY RECORD</Text>
      </View>

      <Text style={styles.foodTitle}>{foodName} ({quantity})</Text>

      <View style={styles.routeBox}>
        <Text style={styles.routeText}>
          <Text style={styles.boldText}>{donorName}</Text> → <Text style={styles.boldText}>{ngoName}</Text>
        </Text>
        <Text style={styles.volText}>Handled by <Text style={styles.boldText}>{volunteerName}</Text></Text>
      </View>

      {/* Proof Photos Grid */}
      <View style={styles.photosGrid}>
        <View style={styles.photoCol}>
          <Text style={styles.photoLabel}>PICKUP PHOTO ({pickupTime})</Text>
          <View style={styles.imgFrame}>
            <Image source={{ uri: pickupPhoto || DEFAULT_FOOD_IMG }} style={styles.img} resizeMode="cover" />
          </View>
        </View>

        <View style={styles.photoCol}>
          <Text style={styles.photoLabel}>DELIVERY PHOTO ({deliveryTime})</Text>
          <View style={styles.imgFrame}>
            <Image source={{ uri: deliveryPhoto || DEFAULT_FOOD_IMG }} style={styles.img} resizeMode="cover" />
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    width: '100%',
    marginVertical: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  foodTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  routeBox: {
    marginTop: 4,
    marginBottom: 12,
  },
  routeText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  volText: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
  boldText: {
    fontWeight: '700',
    color: colors.textPrimary,
  },
  photosGrid: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 6,
  },
  photoCol: {
    flex: 1,
  },
  photoLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  imgFrame: {
    height: 100,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },
  img: {
    width: '100%',
    height: '100%',
  },
});
