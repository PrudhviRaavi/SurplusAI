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
import { ReusableFilterBar } from '../../components/common/ReusableFilterBar';
import { notificationService } from '../../services/notification/notificationService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const NotificationCenterScreen = ({ onBack, onNavigateNotif }) => {
  const [filterCategory, setFilterCategory] = useState('All');
  const [notifList, setNotifList] = useState(
    notificationService.getNotifications(filterCategory)
  );

  useEffect(() => {
    let isMounted = true;
    const loadLiveNotifications = async () => {
      try {
        const liveItems = await notificationService.fetchNotifications(filterCategory);
        if (isMounted && liveItems) {
          setNotifList(liveItems);
        }
      } catch (err) {
        // graceful offline fallback
      }
    };

    loadLiveNotifications();
    return () => {
      isMounted = false;
    };
  }, [filterCategory]);

  const handleSelectFilter = (category) => {
    setFilterCategory(category);
    setNotifList(notificationService.getNotifications(category));
  };

  const handleMarkAllRead = async () => {
    const updated = await notificationService.markAllAsRead();
    setNotifList(updated);
  };

  const handleNotifPress = async (n) => {
    const updated = await notificationService.markAsRead(n.id);
    setNotifList(notificationService.getNotifications(filterCategory));
    if (onNavigateNotif) onNavigateNotif(n);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        {onBack && (
          <TouchableOpacity onPress={onBack} style={styles.iconBtn} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={22} color={colors.primary} />
          </TouchableOpacity>
        )}

        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>

        <TouchableOpacity onPress={handleMarkAllRead} activeOpacity={0.7}>
          <Text style={styles.markReadText}>Mark Read</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Title Header */}
        <View style={styles.titleSection}>
          <Text style={styles.mainTitle}>
            Platform <Text style={styles.italicSerif}>Updates.</Text>
          </Text>
          <Text style={styles.subtitle}>
            Stay informed on donation claims, dispatch assignments, and impact milestones.
          </Text>
        </View>

        {/* Category Filter Bar */}
        <ReusableFilterBar
          options={['All', 'Donations', 'Deliveries', 'Impact', 'System']}
          activeOption={filterCategory}
          onSelectOption={handleSelectFilter}
        />

        {/* Notifications List or Empty State */}
        {notifList.length === 0 ? (
          <View style={styles.emptyCard}>
            <Ionicons name="checkmark-done-circle-outline" size={40} color={colors.gold} />
            <Text style={styles.emptyTitle}>You're all caught up.</Text>
            <Text style={styles.emptySub}>New updates will appear here as activity occurs.</Text>
          </View>
        ) : (
          <View style={styles.notifList}>
            {notifList.map((n) => (
              <TouchableOpacity
                key={n.id}
                activeOpacity={0.8}
                onPress={() => handleNotifPress(n)}
                style={[styles.notifCard, !n.read && styles.unreadNotifCard]}
              >
                <View style={styles.iconBox}>
                  <Ionicons
                    name={
                      n.category === 'Donations'
                        ? 'fast-food'
                        : n.category === 'Deliveries'
                        ? 'bicycle'
                        : n.category === 'Impact'
                        ? 'trophy'
                        : 'notifications'
                    }
                    size={20}
                    color={colors.primary}
                  />
                </View>

                <View style={styles.notifCol}>
                  <View style={styles.notifHeaderRow}>
                    <Text style={styles.notifTitle}>{n.title}</Text>
                    {!n.read && <View style={styles.unreadDot} />}
                  </View>
                  <Text style={styles.notifDesc}>{n.description}</Text>
                  <Text style={styles.notifTime}>{n.timestamp}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
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
    backgroundColor: colors.background,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  markReadText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 10,
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
    color: colors.textSecondary,
    marginTop: 4,
  },
  notifList: {
    gap: 10,
    marginTop: 12,
  },
  notifCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  unreadNotifCard: {
    backgroundColor: '#FAF4EB',
    borderColor: colors.gold,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  notifCol: {
    flex: 1,
  },
  notifHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifTitle: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  notifDesc: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 2,
    lineHeight: 17,
  },
  notifTime: {
    fontSize: 10,
    color: colors.textMuted,
    marginTop: 6,
  },
  emptyCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 30,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginTop: 20,
  },
  emptyTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 10,
  },
  emptySub: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: 4,
  },
});
