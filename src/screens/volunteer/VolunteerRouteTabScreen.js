import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { OpenStreetMapViewer } from '../../components/common/OpenStreetMapViewer';
import { SmartRouteCard } from '../../components/volunteer/SmartRouteCard';
import { defaultTasks } from '../../components/volunteer/NearbyTasksList';
import { volunteerRouteService } from '../../services/routes/volunteerRouteService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const VolunteerRouteTabScreen = ({ routeData: propRouteData = null, tasks = null }) => {
  const [routeData, setRouteData] = useState(() => propRouteData || volunteerRouteService.buildDemoRoute(tasks || defaultTasks));

  useEffect(() => {
    if (propRouteData) {
      setRouteData(propRouteData);
      return;
    }

    let isMounted = true;
    const fetchRoute = async () => {
      try {
        const res = await volunteerRouteService.getOptimizedRouteForTasks(tasks || defaultTasks);
        if (isMounted && res) {
          setRouteData(res);
        }
      } catch (err) {
        if (isMounted) {
          setRouteData(volunteerRouteService.buildDemoRoute(tasks || defaultTasks));
        }
      }
    };
    fetchRoute();
    return () => {
      isMounted = false;
    };
  }, [propRouteData, tasks]);

  const activeRoute = routeData || volunteerRouteService.buildDemoRoute(defaultTasks);
  const stops = activeRoute?.stops || [];
  const stop1Name = stops[1]?.name || 'Green Leaf Restaurant';
  const stop1Qty = stops[1]?.quantity || '25 packaged meals';
  const stop2Name = stops[2]?.name || 'Artisan Bakery Hub';
  const stop2Qty = stops[2]?.quantity || '40 loaves';

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>
            {activeRoute?.isDemo ? 'SAMPLE ROUTE GUIDANCE' : 'LIVE NAVIGATION'}
          </Text>
          <Text style={styles.mainTitle}>
            Delivery <Text style={styles.italicSerif}>Route.</Text>
          </Text>
          <Text style={styles.subtitle}>
            {activeRoute?.isDemo
              ? 'Demo Route — Sample Route visualization connecting the 2 available requests.'
              : 'Optimized turn-by-turn guidance connecting donor pickups to community drop-offs.'}
          </Text>
        </View>

        {/* AI Smart Route Card */}
        <SmartRouteCard routeData={activeRoute} />

        {/* OpenStreetMap Multi-Stop Route Map */}
        <View style={styles.mapContainer}>
          <Text style={styles.sectionHeader}>
            {activeRoute?.isDemo ? 'SAMPLE OPENSTREETMAP DISPATCH ROUTE (DEMO)' : 'LIVE OPENSTREETMAP DISPATCH ROUTE'}
          </Text>
          <OpenStreetMapViewer
            routeCoordinates={activeRoute?.route?.coordinates}
            stops={activeRoute?.stops}
            isDemo={activeRoute?.isDemo}
            demoLabel={activeRoute?.demoLabel}
            height={240}
          />
        </View>

        {/* Route Steps / Turn-by-Turn Guidance */}
        <View style={styles.stepsCard}>
          <Text style={styles.stepsTitle}>TURN-BY-TURN DISPATCH STOPS</Text>

          <View style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: '#10B981' }]}>
              <Ionicons name="navigate" size={12} color="#FFFFFF" />
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Start from {stops[0]?.name || 'Volunteer Current Location'}</Text>
              <Text style={styles.stepSub}>{stops[0]?.address || 'Jubilee Hills Hub'} · Depart on bike</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: '#2563EB' }]}>
              <Text style={styles.stepNumText}>1</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Stop 1: {stop1Name}</Text>
              <Text style={styles.stepSub}>Collect {stop1Qty}</Text>
            </View>
          </View>

          <View style={styles.stepRow}>
            <View style={[styles.stepNum, { backgroundColor: '#D97706' }]}>
              <Text style={styles.stepNumText}>2</Text>
            </View>
            <View style={styles.stepInfo}>
              <Text style={styles.stepText}>Stop 2: {stop2Name}</Text>
              <Text style={styles.stepSub}>Collect {stop2Qty}</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
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
  mapContainer: {
    marginBottom: 20,
  },
  sectionHeader: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 10,
  },
  stepsCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  stepsTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
    gap: 12,
  },
  stepNum: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
  },
  stepNumText: {
    color: colors.white,
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 12,
  },
  stepInfo: {
    flex: 1,
  },
  stepText: {
    fontFamily: 'Poppins',
    fontWeight: '700',
    fontSize: 13,
    color: colors.textPrimary,
  },
  stepSub: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
