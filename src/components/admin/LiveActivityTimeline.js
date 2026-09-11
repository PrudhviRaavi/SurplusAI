import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';

const defaultFeed = [
  {
    id: 'a1',
    title: 'New Surplus Donation Posted',
    desc: 'Royal Spice Palace posted 25 meals of Vegetable Rice.',
    time: '2 min ago',
    type: 'Donation',
    icon: 'restaurant-outline',
    color: colors.primary,
  },
  {
    id: 'a2',
    title: 'NGO Registration Verified',
    desc: 'Hope Community Kitchen approved for Jubilee Hills zone.',
    time: '14 min ago',
    type: 'Registration',
    icon: 'checkmark-circle-outline',
    color: '#10B981',
  },
  {
    id: 'a3',
    title: 'Volunteer Dispatch En Route',
    message: 'Rajesh accepted pickup for 40 loaves from Artisan Bakery.',
    time: '25 min ago',
    type: 'Volunteer',
    icon: 'bicycle-outline',
    color: colors.gold,
  },
  {
    id: 'a4',
    title: 'Claim Completed & Verified',
    desc: 'City Care Shelter verified delivery of 30 meals.',
    time: '42 min ago',
    type: 'Claim',
    icon: 'cube-outline',
    color: colors.accent,
  },
];

export const LiveActivityTimeline = ({ activities = defaultFeed }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionHeader}>LIVE ECOSYSTEM ACTIVITY TIMELINE</Text>

      <View style={styles.timelineList}>
        {activities.map((item, idx) => (
          <View key={item.id} style={styles.timelineItem}>
            <View style={styles.leftCol}>
              <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
                <Ionicons name={item.icon} size={18} color={item.color} />
              </View>
              {idx < activities.length - 1 && <View style={styles.verticalLine} />}
            </View>

            <View style={styles.contentCard}>
              <View style={styles.itemHeader}>
                <Text style={styles.itemTitle}>{item.title}</Text>
                <Text style={styles.timeText}>{item.time}</Text>
              </View>
              <Text style={styles.itemDesc}>{item.desc || item.message}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  timelineList: {
    gap: 0,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: 12,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: colors.border,
    marginTop: 4,
  },
  contentCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 14,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  itemTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  itemDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    lineHeight: 17,
  },
});
