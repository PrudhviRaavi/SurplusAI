import React, { useState, useEffect } from 'react';
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
import { useAppStore } from '../../store/useAppStore';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { volunteerApiService } from '../../services/api/volunteerApiService';

export const VolunteerProfileScreen = ({ onLogout }) => {
  const { formData } = useAppStore();
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        const res = await volunteerApiService.getProfile();
        if (res?.data && isMounted) {
          setProfileData(res.data);
        }
      } catch (err) {
        // Fallback to store
      }
    };
    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  const userName = profileData?.profile?.fullName || profileData?.user?.fullName || formData.volFullName || formData.fullName || 'Prudhvi Raavi';
  const phone = profileData?.profile?.phone || profileData?.user?.phone || formData.volPhone || formData.phone || '+91 98765 43210';
  const email = profileData?.user?.email || formData.volEmail || formData.email || 'prudhvi@foodshareai.org';
  const transport = profileData?.profile?.transportation ? profileData.profile.transportation.replace(/_/g, ' ').toLowerCase() : (formData.volTransport || 'Two-wheeler');
  const radius = profileData?.profile?.preferredTravelRadius ? `${profileData.profile.preferredTravelRadius} km` : (formData.volTravelRadius || '15 km');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Header */}
        <View style={styles.profileHeaderCard}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarText}>{userName.charAt(0).toUpperCase()}</Text>
          </View>

          <View style={styles.heroBadge}>
            <Ionicons name="sparkles" size={14} color={colors.gold} />
            <Text style={styles.heroBadgeText}>COMMUNITY HERO LEVEL 4</Text>
          </View>

          <Text style={styles.nameText}>{userName}</Text>
          <Text style={styles.contactText}>{phone} · {email}</Text>

          <View style={styles.logisticsRow}>
            <View style={styles.logisticsTag}>
              <Ionicons name="bicycle-outline" size={14} color={colors.primary} />
              <Text style={styles.logisticsTagText}>{transport}</Text>
            </View>

            <View style={styles.logisticsTag}>
              <Ionicons name="map-outline" size={14} color={colors.primary} />
              <Text style={styles.logisticsTagText}>{radius} radius</Text>
            </View>
          </View>
        </View>

        {/* Settings Section */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>VOLUNTEER PREFERENCES</Text>

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="options-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Edit Availability Schedule</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="navigate-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Travel Radius & Transportation</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="shield-checkmark-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Identity Verification Status</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>

          <View style={styles.rowDivider} />

          <TouchableOpacity style={styles.settingsRow}>
            <Ionicons name="notifications-outline" size={20} color={colors.primary} />
            <Text style={styles.settingsText}>Task Alert Notifications</Text>
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onLogout}
          style={styles.logoutBtn}
        >
          <Ionicons name="log-out-outline" size={18} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out of Volunteer Workspace</Text>
        </TouchableOpacity>
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
  profileHeaderCard: {
    backgroundColor: colors.surface,
    borderRadius: 30,
    padding: 24,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarLarge: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    borderWidth: 2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: {
    fontFamily: 'Poppins',
    fontSize: 32,
    fontWeight: '800',
    color: colors.primary,
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 10,
  },
  heroBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  nameText: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  contactText: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  logisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 12,
  },
  logisticsTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(75, 99, 85, 0.08)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  logisticsTagText: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
  sectionCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
    marginBottom: 12,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingsText: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 12,
  },
  rowDivider: {
    height: 1,
    backgroundColor: colors.border,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF2F2',
    paddingVertical: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: '#FCA5A5',
    gap: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: '#DC2626',
  },
});
