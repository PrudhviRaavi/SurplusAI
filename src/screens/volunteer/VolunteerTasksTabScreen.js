import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { MultiSelectPills } from '../../components/common/MultiSelectPills';
import { NearbyTasksList } from '../../components/volunteer/NearbyTasksList';
import { ActiveDeliveryCard } from '../../components/volunteer/ActiveDeliveryCard';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { volunteerApiService } from '../../services/api/volunteerApiService';
import { socketClient } from '../../services/api/socketClient';

const filterPills = ['All Opportunities', 'Under 3 km', 'Under 5 km', 'Cooked meals', 'Bakery'];

export const VolunteerTasksTabScreen = ({ onAcceptTask, onViewRoute }) => {
  const [selectedFilter, setSelectedFilter] = useState(['All Opportunities']);
  const [liveTasks, setLiveTasks] = useState([]);

  useEffect(() => {
    let isMounted = true;
    const fetchTasks = async () => {
      try {
        const activeFilter = selectedFilter[0] || 'All Opportunities';
        const params = {};
        if (activeFilter === 'Under 3 km') params.radius = 3;
        if (activeFilter === 'Under 5 km') params.radius = 5;

        const res = await volunteerApiService.getAvailableTasks(params);
        const taskArray = res?.tasks || res?.data?.tasks || (Array.isArray(res) ? res : []);

        if (isMounted) {
          const mapped = taskArray.map((t) => ({
            id: t.id || t._id,
            pickupName: t.donor?.organizationName || 'Donor Location',
            dropoffName: t.ngo?.organizationName || 'NGO Community Center',
            distance: `${t.distanceToPickupKm || 2.4} km`,
            quantity: t.quantity || '25 meals',
            estTime: `${t.estimatedDurationMins || 18} min`,
            foodCategory: t.foodCategory || 'Cooked meals',
            icon: '🍱',
            rawTask: t,
          }));
          setLiveTasks(mapped);
        }
      } catch (err) {
        // Fallback to store
      }
    };

    fetchTasks();

    // 10-second automatic polling fallback
    const intervalId = setInterval(fetchTasks, 10000);

    // Real-time updates via Socket.IO
    const unsubTask = typeof socketClient?.onTaskChange === 'function'
      ? socketClient.onTaskChange(() => {
          fetchTasks();
        })
      : null;
    const unsubDonation = typeof socketClient?.onDonationChange === 'function'
      ? socketClient.onDonationChange(() => {
          fetchTasks();
        })
      : null;

    return () => {
      isMounted = false;
      clearInterval(intervalId);
      if (typeof unsubTask === 'function') unsubTask();
      if (typeof unsubDonation === 'function') unsubDonation();
    };
  }, [selectedFilter]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.titleSection}>
          <Text style={styles.subTag}>AVAILABLE DISPATCHES</Text>
          <Text style={styles.mainTitle}>
            Pickup <Text style={styles.italicSerif}>Opportunities.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Select nearby food rescue dispatches and transport meals to local community receivers.
          </Text>
        </View>

        <MultiSelectPills
          options={filterPills}
          selectedValues={selectedFilter}
          onToggle={(val) => setSelectedFilter([val])}
        />

        {/* Current Active Task if any */}
        <ActiveDeliveryCard onViewRoute={onViewRoute} />

        {/* Opportunities List */}
        <NearbyTasksList
          tasks={liveTasks.length > 0 ? liveTasks : undefined}
          onAcceptTask={onAcceptTask}
        />
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
    marginBottom: 14,
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
});
