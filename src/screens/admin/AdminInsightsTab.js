import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { insightsService } from '../../services/insights/insightsService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminInsightsTab = () => {
  const insights = insightsService.getInsights();

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>FOODSHAREAI INTELLIGENCE ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Operational <Text style={styles.italicSerif}>AI Insights.</Text>
        </Text>
        <Text style={styles.subtitle}>
          High-level platform observations and recommended administrative actions.
        </Text>
      </View>

      {/* Insights List */}
      <View style={styles.list}>
        {insights.map((ins) => {
          const isCritical = ins.severity === 'Critical';
          const isHigh = ins.severity === 'High';

          return (
            <View key={ins.id} style={styles.insightCard}>
              <View style={styles.cardHeader}>
                <View
                  style={[
                    styles.severityPill,
                    isCritical
                      ? styles.criticalPill
                      : isHigh
                      ? styles.highPill
                      : styles.normalPill,
                  ]}
                >
                  <Ionicons
                    name={isCritical ? 'alert-circle' : 'information-circle'}
                    size={12}
                    color={isCritical ? '#DC2626' : isHigh ? colors.accent : colors.gold}
                  />
                  <Text
                    style={[
                      styles.severityText,
                      isCritical
                        ? styles.criticalText
                        : isHigh
                        ? styles.highText
                        : styles.normalText,
                    ]}
                  >
                    {ins.severity.toUpperCase()} PRIORITY
                  </Text>
                </View>

                <Text style={styles.timeText}>{ins.timestamp}</Text>
              </View>

              <Text style={styles.insTitle}>{ins.title}</Text>
              <Text style={styles.insSub}>{ins.description}</Text>

              <View style={styles.divider} />

              <TouchableOpacity activeOpacity={0.8} style={styles.actionBtn}>
                <Ionicons name="flash-outline" size={14} color={colors.primary} />
                <Text style={styles.actionText}>{ins.actionText} →</Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  titleSection: {
    marginBottom: 16,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: 'rgba(201, 169, 110, 0.3)',
    marginBottom: 8,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
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
  list: {
    gap: 12,
  },
  insightCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  severityPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  criticalPill: {
    backgroundColor: '#FEE2E2',
  },
  highPill: {
    backgroundColor: 'rgba(217, 143, 92, 0.15)',
  },
  normalPill: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
  },
  severityText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
  criticalText: {
    color: '#DC2626',
  },
  highText: {
    color: colors.accent,
  },
  normalText: {
    color: colors.gold,
  },
  timeText: {
    fontSize: 11,
    color: colors.textMuted,
  },
  insTitle: {
    fontFamily: 'Poppins',
    fontSize: 16,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  insSub: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  actionText: {
    fontSize: 12,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.primary,
  },
});
