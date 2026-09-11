import React from 'react';
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
import { LuxuryCard } from '../components/common/LuxuryCard';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

export const AdminDashboardScreen = ({ onLogout }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Top Header */}
        <View style={styles.topHeader}>
          <View style={styles.brandRow}>
            <View style={styles.adminDot} />
            <Text style={styles.brandTitle}>FoodShareAI</Text>
            <View style={styles.adminTag}>
              <Text style={styles.adminTagText}>ADMIN</Text>
            </View>
          </View>

          <TouchableOpacity onPress={onLogout} style={styles.logoutBtn}>
            <Ionicons name="log-out-outline" size={18} color={colors.primary} />
            <Text style={styles.logoutText}>Exit Admin</Text>
          </TouchableOpacity>
        </View>

        {/* Dashboard Title */}
        <View style={styles.headlineBox}>
          <Text style={styles.welcomeSub}>SYSTEM GOVERNANCE & OVERVIEW</Text>
          <Text style={styles.title}>
            Command <Text style={styles.italicSerif}>Center.</Text>
          </Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>1,248</Text>
            <Text style={styles.statLabel}>Active Donors</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>342</Text>
            <Text style={styles.statLabel}>Verified NGOs</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statNumber}>890</Text>
            <Text style={styles.statLabel}>Volunteers</Text>
          </View>

          <View style={styles.statCard}>
            <Text style={[styles.statNumber, { color: colors.accent }]}>12</Text>
            <Text style={styles.statLabel}>Pending NGO Checks</Text>
          </View>
        </View>

        {/* Action Sections */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PENDING ORGANIZATIONAL VERIFICATIONS</Text>

          <LuxuryCard style={styles.actionCard}>
            <View style={styles.cardRow}>
              <View style={styles.ngoBadge}>
                <Text style={styles.ngoBadgeText}>NGO</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemTitle}>Hope Community Foundation</Text>
                <Text style={styles.itemSub}>Reg: NGO-8842-HYD · Jubilee Hills</Text>
              </View>
              <View style={styles.verifyBtnGroup}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.approveBtnText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LuxuryCard>

          <LuxuryCard style={styles.actionCard}>
            <View style={styles.cardRow}>
              <View style={[styles.ngoBadge, { backgroundColor: 'rgba(217, 143, 92, 0.12)' }]}>
                <Text style={[styles.ngoBadgeText, { color: colors.accent }]}>SHELTER</Text>
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.itemTitle}>City Care Orphanage Trust</Text>
                <Text style={styles.itemSub}>Reg: TR-9912-SEC · Secunderabad</Text>
              </View>
              <View style={styles.verifyBtnGroup}>
                <TouchableOpacity style={styles.approveBtn}>
                  <Text style={styles.approveBtnText}>Approve</Text>
                </TouchableOpacity>
              </View>
            </View>
          </LuxuryCard>
        </View>

        {/* System Health */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>SYSTEM HEALTH & AI MATCHING ENGINE</Text>

          <View style={styles.healthBox}>
            <View style={styles.healthRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.healthText}>AI Computer Vision API</Text>
              <Text style={styles.healthStatus}>OPERATIONAL</Text>
            </View>
            <View style={styles.healthRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.healthText}>Smart Proximity Dispatcher</Text>
              <Text style={styles.healthStatus}>OPERATIONAL</Text>
            </View>
            <View style={styles.healthRow}>
              <Ionicons name="checkmark-circle" size={20} color="#10B981" />
              <Text style={styles.healthText}>Safety Shelf-Life Engine</Text>
              <Text style={styles.healthStatus}>OPERATIONAL</Text>
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
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  adminDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.gold,
    marginRight: 8,
  },
  brandTitle: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  adminTag: {
    backgroundColor: 'rgba(201, 169, 110, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 8,
  },
  adminTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 14,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logoutText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
    marginLeft: 4,
  },
  headlineBox: {
    marginBottom: 20,
  },
  welcomeSub: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  title: {
    fontFamily: 'Poppins',
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: '48.5%',
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 12,
  },
  statNumber: {
    fontFamily: 'Poppins',
    fontSize: 24,
    fontWeight: '800',
    color: colors.primary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  section: {
    marginVertical: 12,
  },
  sectionTitle: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 1.0,
    marginBottom: 10,
  },
  actionCard: {
    padding: 16,
    borderRadius: 22,
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ngoBadge: {
    backgroundColor: 'rgba(75, 99, 85, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 12,
  },
  ngoBadgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  cardInfo: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 14,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  itemSub: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  verifyBtnGroup: {
    marginLeft: 8,
  },
  approveBtn: {
    backgroundColor: colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  approveBtnText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
  healthBox: {
    backgroundColor: colors.surface,
    borderRadius: 22,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  healthRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  healthText: {
    flex: 1,
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    marginLeft: 10,
  },
  healthStatus: {
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#10B981',
    letterSpacing: 0.6,
  },
});
