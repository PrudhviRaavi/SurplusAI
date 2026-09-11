import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity, StatusBar } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const NotificationsScreen = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  const alerts = [
    { id: '1', title: 'New Match Found', desc: '45 kg Biryani matched with Hope Shelter NGO (1.2 km).', time: '2m ago', icon: 'checkmark-circle-sharp', color: colors.glowGreen },
    { id: '2', title: 'Driver Dispatched', desc: 'Volunteer Alex is on route for pickup. ETA 7 mins.', time: '12m ago', icon: 'car-sport-sharp', color: colors.accent },
    { id: '3', title: 'Surplus Demand Alert', desc: 'High demand predicted in Sector 4 between 8 PM - 10 PM.', time: '45m ago', icon: 'trending-up-sharp', color: '#F59E0B' },
    { id: '4', title: 'Pickup Completed', desc: 'St. Mary Kitchen confirmed receipt of 60 meals.', time: '2h ago', icon: 'ribbon-sharp', color: colors.secondary },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>AI Alerts Feed</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Real-time automated dispatches & route updates</Text>
      </View>

      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity activeOpacity={0.8} style={[styles.alertCard, { backgroundColor: themeColors.surface, borderColor: themeColors.border }]}>
            <View style={[styles.iconBox, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={20} color={item.color} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.topRow}>
                <Text style={[styles.cardTitle, { color: themeColors.textPrimary }]}>{item.title}</Text>
                <Text style={[styles.timeText, { color: themeColors.textMuted }]}>{item.time}</Text>
              </View>
              <Text style={[styles.cardDesc, { color: themeColors.textSecondary }]}>{item.desc}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 16 },
  title: { fontFamily: fontFamily.headingBold, fontSize: 22 },
  subtitle: { fontFamily: fontFamily.bodyRegular, fontSize: 13, marginTop: 2 },
  listContainer: { paddingHorizontal: 20, paddingBottom: 100, gap: 12 },
  alertCard: { flexDirection: 'row', gap: 12, padding: 14, borderRadius: 16, borderWidth: 1, alignItems: 'center' },
  iconBox: { width: 40, height: 40, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  topRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  cardTitle: { fontFamily: fontFamily.headingSemiBold, fontSize: 14 },
  timeText: { fontFamily: fontFamily.caption, fontSize: 10 },
  cardDesc: { fontFamily: fontFamily.bodySmall, fontSize: 12, lineHeight: 16 },
});
