import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

const mockInsights = [
  {
    id: 'i1',
    text: 'Demand for cooked meals is increasing by 34% in Jubilee Hills area.',
    tag: 'DEMAND SURGE',
    color: colors.gold,
    icon: 'trending-up-outline',
  },
  {
    id: 'i2',
    text: '12 surplus postings may require faster volunteer dispatch to prevent expiration.',
    tag: 'EXPIRATION RISK',
    color: colors.accent,
    icon: 'alert-circle-outline',
  },
  {
    id: 'i3',
    text: 'Duplicate donation posting detected in Secunderabad zone.',
    tag: 'ANOMALY DETECTED',
    color: '#EF4444',
    icon: 'shield-alert-outline',
  },
  {
    id: 'i4',
    text: 'High demand expected tomorrow due to upcoming festival weekend.',
    tag: 'PREDICTIVE DEMAND',
    color: colors.primary,
    icon: 'sparkles-outline',
  },
];

export const AIInsightsCard = () => {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <View style={styles.aiTag}>
          <Ionicons name="sparkles" size={14} color={colors.gold} />
          <Text style={styles.aiTagText}>PLATFORM AI INTELLIGENCE</Text>
        </View>

        <Text style={styles.liveBadge}>LIVE INSIGHTS</Text>
      </View>

      <Text style={styles.mainTitle}>
        Platform AI <Text style={styles.italicSerif}>Insights.</Text>
      </Text>

      <View style={styles.insightsList}>
        {mockInsights.map((item) => (
          <View key={item.id} style={styles.insightItem}>
            <View style={[styles.iconCircle, { backgroundColor: `${item.color}15` }]}>
              <Ionicons name={item.icon} size={18} color={item.color} />
            </View>

            <View style={styles.textCol}>
              <Text style={[styles.itemTag, { color: item.color }]}>{item.tag}</Text>
              <Text style={styles.itemText}>{item.text}</Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 28,
    padding: 20,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 20,
    shadowColor: colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  aiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 4,
  },
  aiTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  liveBadge: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.primary,
  },
  mainTitle: {
    fontFamily: 'Poppins',
    fontSize: 22,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.4,
    marginBottom: 14,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  insightsList: {
    gap: 10,
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FAF4EB',
    padding: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textCol: {
    flex: 1,
  },
  itemTag: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.8,
    marginBottom: 2,
  },
  itemText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '600',
    color: colors.textPrimary,
    lineHeight: 18,
  },
});
