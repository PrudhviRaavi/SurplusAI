import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { demandPredictionService } from '../../services/prediction/demandPredictionService';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const AdminForecastTab = () => {
  const [selectedCategory, setSelectedCategory] = useState('Cooked Meals');
  const [forecast, setForecast] = useState({
    todaySupply: 1240,
    todayDemand: 1680,
    gapMeals: 440,
    forecast24h: 470,
    forecast7d: 3120,
    forecast30d: 12800,
    categoryBreakdown: [
      { category: 'Cooked Meals', supply: 1240, demand: 1680, gap: 440, status: 'Deficit' },
      { category: 'Bakery Items', supply: 640, demand: 420, gap: -220, status: 'Surplus' },
      { category: 'Fruits & Produce', supply: 510, demand: 720, gap: 210, status: 'Deficit' },
      { category: 'Dairy & Beverages', supply: 320, demand: 310, gap: -10, status: 'Balanced' },
    ],
  });

  useEffect(() => {
    let isMounted = true;
    const fetchForecast = async () => {
      const data = await demandPredictionService.getForecast(selectedCategory);
      if (isMounted && data) {
        setForecast(data);
      }
    };
    fetchForecast();
    return () => { isMounted = false; };
  }, [selectedCategory]);

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Title Header */}
      <View style={styles.titleSection}>
        <View style={styles.badgeRow}>
          <Ionicons name="trending-up" size={14} color={colors.gold} />
          <Text style={styles.badgeText}>PREDICTIVE DEMAND ENGINE</Text>
        </View>

        <Text style={styles.mainTitle}>
          Supply vs Demand <Text style={styles.italicSerif}>Forecast.</Text>
        </Text>
        <Text style={styles.subtitle}>
          24h, 7-day, and 30-day demand predictions by food category.
        </Text>
      </View>

      {/* Forecast Overview Card */}
      <View style={styles.overviewCard}>
        <View style={styles.cardHeaderRow}>
          <Text style={styles.cardHeaderTag}>COOKED MEALS SUPPLY vs DEMAND GAP</Text>
          <View style={styles.deficitPill}>
            <Text style={styles.deficitText}>DEFICIT: -440 MEALS</Text>
          </View>
        </View>

        <View style={styles.gapGrid}>
          <View style={styles.gapBox}>
            <Text style={styles.gapLabel}>SUPPLY TODAY</Text>
            <Text style={styles.gapVal}>{forecast.todaySupply}</Text>
          </View>

          <View style={styles.gapBox}>
            <Text style={styles.gapLabel}>DEMAND TODAY</Text>
            <Text style={[styles.gapVal, { color: colors.gold }]}>{forecast.todayDemand}</Text>
          </View>

          <View style={styles.gapBox}>
            <Text style={styles.gapLabel}>DEFICIT GAP</Text>
            <Text style={[styles.gapVal, { color: colors.accent }]}>-{forecast.gapMeals}</Text>
          </View>
        </View>
      </View>

      {/* Timeline Forecast Grid */}
      <View style={styles.forecastGrid}>
        <View style={styles.forecastBox}>
          <Text style={styles.forecastTime}>NEXT 24 HOURS</Text>
          <Text style={styles.forecastVal}>{forecast.forecast24h} meals</Text>
          <Text style={styles.forecastSub}>+12% expected demand</Text>
        </View>

        <View style={styles.forecastBox}>
          <Text style={styles.forecastTime}>NEXT 7 DAYS</Text>
          <Text style={styles.forecastVal}>{forecast.forecast7d} meals</Text>
          <Text style={styles.forecastSub}>Peak expected Friday</Text>
        </View>

        <View style={styles.forecastBox}>
          <Text style={styles.forecastTime}>NEXT 30 DAYS</Text>
          <Text style={styles.forecastVal}>{forecast.forecast30d} meals</Text>
          <Text style={styles.forecastSub}>Monthly demand forecast</Text>
        </View>
      </View>

      {/* Category Breakdown Table */}
      <View style={styles.tableCard}>
        <Text style={styles.cardHeaderTag}>CATEGORY BALANCE MATRIX</Text>
        {forecast.categoryBreakdown.map((item) => (
          <View key={item.category} style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.catName}>{item.category}</Text>
              <Text style={styles.catSub}>Supply: {item.supply} · Demand: {item.demand}</Text>
            </View>
            <View
              style={[
                styles.statusTag,
                item.status === 'Deficit'
                  ? styles.deficitTag
                  : item.status === 'Surplus'
                  ? styles.surplusTag
                  : styles.balancedTag,
              ]}
            >
              <Text style={styles.statusTagText}>{item.status.toUpperCase()}</Text>
            </View>
          </View>
        ))}
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
    marginBottom: 14,
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
  overviewCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
    marginBottom: 14,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  cardHeaderTag: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  deficitPill: {
    backgroundColor: 'rgba(217, 143, 92, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
  },
  deficitText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.accent,
  },
  gapGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gapBox: {
    flex: 1,
  },
  gapLabel: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textMuted,
    letterSpacing: 0.8,
  },
  gapVal: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  forecastGrid: {
    gap: 10,
    marginBottom: 14,
  },
  forecastBox: {
    backgroundColor: '#FAF4EB',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  forecastTime: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 1.0,
  },
  forecastVal: {
    fontFamily: 'Poppins',
    fontSize: 20,
    fontWeight: '800',
    color: colors.textPrimary,
    marginTop: 2,
  },
  forecastSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 2,
  },
  tableCard: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: colors.border,
  },
  tableCol: {
    flex: 1,
  },
  catName: {
    fontFamily: 'Poppins',
    fontSize: 14,
    fontWeight: '800',
    color: colors.textPrimary,
  },
  catSub: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  statusTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  deficitTag: {
    backgroundColor: 'rgba(217, 143, 92, 0.15)',
  },
  surplusTag: {
    backgroundColor: '#ECFDF5',
  },
  balancedTag: {
    backgroundColor: 'rgba(201, 169, 110, 0.15)',
  },
  statusTagText: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.textPrimary,
  },
});
