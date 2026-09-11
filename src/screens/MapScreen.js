import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, StatusBar } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { useThemeStore } from '../store/useThemeStore';

export const MapScreen = () => {
  const { isDarkMode } = useThemeStore();
  const themeColors = isDarkMode ? colors.dark : colors.light;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: themeColors.background }]}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.header}>
        <Text style={[styles.title, { color: themeColors.textPrimary }]}>Live AI Redistribution Map</Text>
        <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>Real-time active donor pickups & verified NGO nodes</Text>
      </View>

      <View style={[styles.mapBox, { borderColor: themeColors.border }]}>
        <LinearGradient
          colors={['#030712', '#0B1220', '#050816']}
          style={StyleSheet.absoluteFillObject}
        />

        {/* Heatmap Rings */}
        <View style={styles.heatCircle1} />
        <View style={styles.heatCircle2} />

        {/* Floating Controls */}
        <View style={styles.floatingControls}>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="layers-sharp" size={18} color={colors.glowGreen} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.controlBtn}>
            <Ionicons name="locate-sharp" size={18} color={colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.infoPill}>
          <Ionicons name="sparkles" size={14} color={colors.glowGreen} />
          <Text style={styles.infoText}>14 Active Donors • 8 NGO Vans en route</Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 16, paddingBottom: 12 },
  title: { fontFamily: fontFamily.headingBold, fontSize: 22 },
  subtitle: { fontFamily: fontFamily.bodyRegular, fontSize: 13, marginTop: 2 },
  mapBox: { flex: 1, marginHorizontal: 20, marginBottom: 90, borderRadius: 24, borderWidth: 1, overflow: 'hidden', position: 'relative' },
  heatCircle1: { position: 'absolute', top: '30%', left: '20%', width: 180, height: 180, borderRadius: 90, backgroundColor: 'rgba(34, 197, 94, 0.15)' },
  heatCircle2: { position: 'absolute', bottom: '25%', right: '15%', width: 140, height: 140, borderRadius: 70, backgroundColor: 'rgba(37, 99, 235, 0.15)' },
  floatingControls: { position: 'absolute', top: 16, right: 16, gap: 10 },
  controlBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(15, 23, 42, 0.85)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.1)' },
  infoPill: { position: 'absolute', bottom: 16, left: 16, right: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, backgroundColor: 'rgba(15, 23, 42, 0.9)', paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: 'rgba(34, 197, 94, 0.3)' },
  infoText: { fontFamily: fontFamily.bodySemiBold, fontSize: 12, color: colors.white },
});
