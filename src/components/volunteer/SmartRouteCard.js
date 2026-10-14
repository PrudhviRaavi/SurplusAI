import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';

export const SmartRouteCard = ({
  routeData = null,
  timeSavedText = 'Save approximately 6 minutes',
  distanceText = '2.1 km shortest path',
  onUseRoute,
}) => {
  const isDemo = routeData ? !!routeData.isDemo : false;
  const stops = routeData?.stops || null;

  const durationLabel = routeData?.estimatedDurationMinutes
    ? `~${routeData.estimatedDurationMinutes} mins total duration`
    : timeSavedText;

  const distanceLabel = routeData?.distanceKm
    ? `${routeData.distanceKm} km multi-stop path`
    : distanceText;

  return (
    <View style={[styles.card, isDemo && styles.cardDemo]}>
      {/* Top Header Tag & Pill */}
      <View style={styles.topRow}>
        <View style={[styles.aiTag, isDemo && styles.aiTagDemo]}>
          <Ionicons
            name={isDemo ? 'alert-circle-outline' : 'hardware-chip-outline'}
            size={12}
            color={isDemo ? '#B45309' : colors.gold}
          />
          <Text style={[styles.aiTagText, isDemo && styles.aiTagTextDemo]}>
            {isDemo ? (routeData?.demoLabel || 'DEMO ROUTE — SAMPLE ROUTE') : 'AI ROUTE OPTIMIZATION (A*)'}
          </Text>
        </View>

        <View style={[styles.savedPill, isDemo && styles.savedPillDemo]}>
          <Text style={[styles.savedPillText, isDemo && styles.savedPillTextDemo]}>
            {isDemo ? 'SAMPLE ROUTE' : 'OPTIMIZED'}
          </Text>
        </View>
      </View>

      <Text style={styles.titleHeader}>
        {isDemo ? 'Multi-Stop ' : 'Intelligent '}
        <Text style={styles.italicSerif}>Dispatch Route.</Text>
      </Text>

      {/* Metrics Row */}
      <View style={styles.metricsRow}>
        <Text style={[styles.timeSavedHighlight, isDemo && styles.timeSavedHighlightDemo]}>
          {durationLabel}
        </Text>
        <Text style={styles.metricDistance}> · {distanceLabel}</Text>
      </View>

      <Text style={styles.subDetail}>
        {isDemo
          ? 'Demo Route — Sample Route visualization connecting the 2 delivery requests available on the dashboard.'
          : 'A* shortest-path algorithm optimized to avoid peak urban traffic bottlenecks.'}
      </Text>

      {/* Structured Stops List: Start -> Stop 1 -> Stop 2 */}
      {stops && stops.length >= 2 && (
        <View style={styles.stopsTimelineContainer}>
          <Text style={styles.stopsSectionTitle}>ROUTE STOPS (TURN-BY-TURN DISPATCH)</Text>

          {stops.map((stop, idx) => {
            const isStart = stop.type === 'start' || idx === 0;
            const isStop1 = stop.type === 'stop1' || idx === 1;
            const isLast = idx === stops.length - 1;

            const dotCol = isStart ? '#10B981' : isStop1 ? '#2563EB' : '#D97706';
            const badgeLabel = isStart
              ? 'START LOCATION'
              : idx === 1
              ? 'STOP 1: FIRST REQUEST'
              : 'STOP 2: SECOND REQUEST';

            return (
              <View key={`card_stop_${stop.name}_${idx}`} style={styles.stopTimelineRow}>
                {/* Vertical Connector and Dot */}
                <View style={styles.timelineLeftCol}>
                  <View style={[styles.timelineDot, { backgroundColor: dotCol }]}>
                    {isStart ? (
                      <Ionicons name="navigate" size={9} color="#FFFFFF" />
                    ) : (
                      <Text style={styles.timelineNum}>{idx}</Text>
                    )}
                  </View>
                  {!isLast && <View style={styles.timelineConnector} />}
                </View>

                {/* Stop Content */}
                <View style={styles.stopContentCol}>
                  <Text style={[styles.stopTypeTag, { color: dotCol }]}>{badgeLabel}</Text>
                  <Text style={styles.stopNameText} numberOfLines={1}>
                    {stop.name}
                  </Text>
                  <Text style={styles.stopAddressText} numberOfLines={1}>
                    {stop.address} {stop.quantity ? `· ${stop.quantity}` : ''}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Action Button */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={onUseRoute}
        style={[styles.useRouteBtn, isDemo && styles.useRouteBtnDemo]}
      >
        <Ionicons name="navigate-outline" size={16} color={colors.white} />
        <Text style={styles.useRouteText}>
          {isDemo ? 'View Route Guidance →' : 'Use Optimized Route →'}
        </Text>
      </TouchableOpacity>
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
  cardDemo: {
    borderColor: '#FCD34D',
    backgroundColor: '#FFFEFA',
  },
  topRow: {
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
  aiTagDemo: {
    backgroundColor: '#FEF3C7',
  },
  aiTagText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
  },
  aiTagTextDemo: {
    color: '#92400E',
  },
  savedPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  savedPillDemo: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FDE68A',
  },
  savedPillText: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: '#065F46',
  },
  savedPillTextDemo: {
    color: '#92400E',
  },
  titleHeader: {
    fontFamily: 'Poppins',
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  italicSerif: {
    fontFamily: typography.fontFamily.serif,
    fontStyle: 'italic',
    color: colors.primary,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  timeSavedHighlight: {
    fontFamily: 'Poppins',
    fontSize: 15,
    fontWeight: '700',
    color: colors.primary,
  },
  timeSavedHighlightDemo: {
    color: '#B45309',
  },
  metricDistance: {
    fontFamily: 'Poppins',
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  subDetail: {
    fontSize: 12,
    fontWeight: '400',
    color: colors.textSecondary,
    lineHeight: 17,
    marginBottom: 16,
  },
  // Stops Timeline
  stopsTimelineContainer: {
    backgroundColor: '#F8FAFC',
    borderRadius: 18,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stopsSectionTitle: {
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    color: colors.gold,
    letterSpacing: 0.8,
    marginBottom: 10,
  },
  stopTimelineRow: {
    flexDirection: 'row',
    minHeight: 46,
  },
  timelineLeftCol: {
    width: 24,
    alignItems: 'center',
  },
  timelineDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  timelineNum: {
    color: '#FFFFFF',
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
  timelineConnector: {
    width: 2,
    flex: 1,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  stopContentCol: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: 8,
  },
  stopTypeTag: {
    fontSize: 9,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.6,
  },
  stopNameText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.textPrimary,
  },
  stopAddressText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginTop: 1,
  },
  // Button
  useRouteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 6,
  },
  useRouteBtnDemo: {
    backgroundColor: '#1E293B',
  },
  useRouteText: {
    fontSize: 13,
    fontFamily: 'Poppins',
    fontWeight: '700',
    color: colors.white,
  },
});
