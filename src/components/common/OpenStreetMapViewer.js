/**
 * FoodShareAI - OpenStreetMap Interactive Tile Viewer & Route Visualizer
 *
 * Renders standard OpenStreetMap cartographic tiles for any (latitude, longitude) coordinate
 * or multi-stop delivery routes.
 * Complies with OpenStreetMap Tile Usage Policy:
 * - Direct tile requests with proper user agent
 * - Attribution banner "© OpenStreetMap contributors"
 * - Zero Google Maps API keys or external paid dependencies
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Polyline } from 'react-native-svg';
import { colors } from '../../theme/colors';

/**
 * Computes standard Slippy Map tile indices for latitude, longitude, and zoom level
 */
const latLngToTile = (lat, lng, zoom) => {
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const latRad = (lat * Math.PI) / 180;
  const y = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { x, y, z: zoom };
};

/**
 * Individual Map Tile with automatic mirror fallback
 */
const MapTileItem = ({ tileX, tileY, zoom }) => {
  const [useFallback, setUseFallback] = useState(false);

  // Primary: OpenStreetMap community mirror (no API key required)
  // Fallback: Wikimedia OpenStreetMap mirror (no API key required)
  const tileUrl = useFallback
    ? `https://maps.wikimedia.org/osm-intl/${zoom}/${tileX}/${tileY}.png`
    : `https://tile.openstreetmap.de/${zoom}/${tileX}/${tileY}.png`;

  return (
    <Image
      key={`${tileX}_${tileY}_${useFallback}`}
      source={{
        uri: tileUrl,
        headers: {
          'User-Agent': 'FoodShareAI-MobileApp/1.0 (https://foodshareai.org; contact@foodshareai.org)',
          Referer: 'https://foodshareai.org',
        },
      }}
      onError={() => {
        if (!useFallback) setUseFallback(true);
      }}
      style={styles.tileImg}
      resizeMode="cover"
    />
  );
};

export const OpenStreetMapViewer = ({
  latitude = 17.43,
  longitude = 78.4,
  zoom = 14,
  height = 210,
  title,
  routeCoordinates = null,
  stops = null,
  isDemo = false,
  demoLabel = 'Demo Route — Sample Route',
}) => {
  const [containerWidth, setContainerWidth] = useState(350);

  // Normalize route points from either [[lng, lat], ...] or [{latitude, longitude}, ...]
  const normalizedRoutePoints = React.useMemo(() => {
    if (!Array.isArray(routeCoordinates) || routeCoordinates.length === 0) {
      return [];
    }
    return routeCoordinates
      .map((pt) => {
        if (Array.isArray(pt) && pt.length >= 2) {
          return { latitude: Number(pt[1]), longitude: Number(pt[0]) };
        }
        if (pt && typeof pt === 'object' && pt.latitude !== undefined && pt.longitude !== undefined) {
          return { latitude: Number(pt.latitude), longitude: Number(pt.longitude) };
        }
        return null;
      })
      .filter((pt) => pt && !isNaN(pt.latitude) && !isNaN(pt.longitude));
  }, [routeCoordinates]);

  // Normalize stops
  const normalizedStops = React.useMemo(() => {
    if (!Array.isArray(stops) || stops.length === 0) {
      return [];
    }
    return stops
      .map((s, idx) => {
        let lat = s.latitude;
        let lng = s.longitude;
        if ((lat === undefined || lng === undefined) && Array.isArray(s.coordinates) && s.coordinates.length >= 2) {
          lng = s.coordinates[0];
          lat = s.coordinates[1];
        }
        if (isNaN(lat) || isNaN(lng)) return null;
        return {
          ...s,
          index: idx,
          latitude: Number(lat),
          longitude: Number(lng),
          name: s.name || (idx === 0 ? 'Start' : `Stop ${idx}`),
          type: s.type || (idx === 0 ? 'start' : idx === 1 ? 'stop1' : 'stop2'),
        };
      })
      .filter(Boolean);
  }, [stops]);

  // Determine map center and effective zoom
  const { validLat, validLng, effectiveZoom } = React.useMemo(() => {
    const allLats = [];
    const allLngs = [];

    if (normalizedStops.length > 0) {
      normalizedStops.forEach((s) => {
        allLats.push(s.latitude);
        allLngs.push(s.longitude);
      });
    } else if (normalizedRoutePoints.length > 0) {
      normalizedRoutePoints.forEach((p) => {
        allLats.push(p.latitude);
        allLngs.push(p.longitude);
      });
    }

    if (allLats.length > 0) {
      const avgLat = allLats.reduce((a, b) => a + b, 0) / allLats.length;
      const avgLng = allLngs.reduce((a, b) => a + b, 0) / allLngs.length;
      return {
        validLat: avgLat,
        validLng: avgLng,
        effectiveZoom: zoom || 13,
      };
    }

    const fallbackLat = typeof latitude === 'number' && !isNaN(latitude) ? latitude : 17.43;
    const fallbackLng = typeof longitude === 'number' && !isNaN(longitude) ? longitude : 78.4;
    return {
      validLat: fallbackLat,
      validLng: fallbackLng,
      effectiveZoom: zoom || 14,
    };
  }, [normalizedStops, normalizedRoutePoints, latitude, longitude, zoom]);

  const centerTile = latLngToTile(validLat, validLng, effectiveZoom);

  // Generate 3x3 tile grid around center tile
  const tiles = [];
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      tiles.push({
        tileX: centerTile.x + dx,
        tileY: centerTile.y + dy,
        key: `${centerTile.x + dx}_${centerTile.y + dy}`,
      });
    }
  }

  // Web Mercator Slippy Map projection to container pixel coordinates
  const originPixelX = (centerTile.x - 1) * 256;
  const originPixelY = (centerTile.y - 1) * 256;
  const nTiles = Math.pow(2, effectiveZoom);

  const projectToScreen = (lat, lng) => {
    const gx = ((lng + 180) / 360) * 256 * nTiles;
    const latRad = (lat * Math.PI) / 180;
    const gy = ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * 256 * nTiles;
    const gridX = gx - originPixelX;
    const gridY = gy - originPixelY;
    const screenX = containerWidth / 2 + (gridX - 384);
    const screenY = height / 2 + (gridY - 384);
    return { x: screenX, y: screenY };
  };

  // Convert normalizedRoutePoints to SVG Polyline string
  const svgPoints = React.useMemo(() => {
    if (normalizedRoutePoints.length < 2) return '';
    return normalizedRoutePoints
      .map((p) => {
        const pt = projectToScreen(p.latitude, p.longitude);
        return `${Math.round(pt.x)},${Math.round(pt.y)}`;
      })
      .join(' ');
  }, [normalizedRoutePoints, containerWidth, height, effectiveZoom, validLat, validLng]);

  const hasRouteOrStops = normalizedStops.length > 0 || normalizedRoutePoints.length > 0;

  return (
    <View
      style={[styles.container, { height }]}
      onLayout={(e) => {
        const w = e.nativeEvent.layout.width;
        if (w > 0 && Math.abs(w - containerWidth) > 2) {
          setContainerWidth(w);
        }
      }}
    >
      {/* 3x3 Tile Grid Canvas */}
      <View style={styles.tileCanvas}>
        <View style={styles.gridContainer}>
          {tiles.map((tile) => (
            <MapTileItem
              key={tile.key}
              tileX={tile.tileX}
              tileY={tile.tileY}
              zoom={effectiveZoom}
            />
          ))}
        </View>
      </View>

      {/* Visible Route Polyline Connecting Stops */}
      {svgPoints !== '' && (
        <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
          <Svg width={containerWidth} height={height}>
            {/* Background shadow stroke */}
            <Polyline
              points={svgPoints}
              stroke="rgba(0, 0, 0, 0.2)"
              strokeWidth={6}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {/* Main route path line (Amber dashed for Demo, Blue solid for Real) */}
            <Polyline
              points={svgPoints}
              stroke={isDemo ? '#D97706' : '#2563EB'}
              strokeWidth={3.5}
              strokeDasharray={isDemo ? '6,4' : undefined}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </Svg>
        </View>
      )}

      {/* Stop Markers Pins on the Map */}
      {normalizedStops.length > 0 ? (
        normalizedStops.map((s, idx) => {
          const pt = projectToScreen(s.latitude, s.longitude);
          const isStart = s.type === 'start' || idx === 0;
          const isStop1 = s.type === 'stop1' || idx === 1;
          const bgCol = isStart ? '#10B981' : isStop1 ? '#2563EB' : '#D97706';
          const pinText = isStart ? 'Start' : String(idx);

          return (
            <View
              key={`stop_marker_${s.name}_${idx}`}
              style={[
                styles.stopMarkerWrapper,
                {
                  left: pt.x - 14,
                  top: pt.y - 30,
                },
              ]}
              pointerEvents="none"
            >
              <View style={[styles.stopBubble, { backgroundColor: bgCol }]}>
                {isStart ? (
                  <Ionicons name="navigate" size={11} color="#FFFFFF" />
                ) : (
                  <Text style={styles.stopNumText}>{pinText}</Text>
                )}
              </View>
              <View style={[styles.stopPointer, { borderTopColor: bgCol }]} />
              <View style={styles.stopShadow} />
            </View>
          );
        })
      ) : !hasRouteOrStops ? (
        /* Default Center Marker Pin when used as single address picker */
        <View style={styles.markerContainer} pointerEvents="none">
          <View style={styles.markerBubble}>
            <Ionicons name="location" size={26} color="#DC2626" />
          </View>
          <View style={styles.markerShadow} />
        </View>
      ) : null}

      {/* Top Banner Tag: Prominent Demo Route or Optimized Route */}
      {hasRouteOrStops && (
        <View
          style={[
            styles.routeBadgeOverlay,
            isDemo ? styles.demoBadgeOverlay : styles.optimizedBadgeOverlay,
          ]}
          pointerEvents="none"
        >
          <Ionicons
            name={isDemo ? 'alert-circle' : 'flash'}
            size={12}
            color={isDemo ? '#B45309' : '#065F46'}
          />
          <Text style={[styles.routeBadgeText, isDemo ? styles.demoBadgeText : styles.optimizedBadgeText]}>
            {isDemo ? (demoLabel || 'Demo Route — Sample Route') : '⚡ A* OPTIMIZED ROUTE'}
          </Text>
        </View>
      )}

      {/* Coordinate Chip */}
      <View style={styles.coordChip} pointerEvents="none">
        <Ionicons name="navigate" size={11} color={colors.primary} />
        <Text style={styles.coordText}>
          {validLat.toFixed(4)}, {validLng.toFixed(4)}
        </Text>
      </View>

      {/* OpenStreetMap Attribution Footer */}
      <View style={styles.attributionBar} pointerEvents="none">
        <Text style={styles.attributionText}>
          Map data © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#E2E8F0',
    borderWidth: 1.5,
    borderColor: colors.border,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileCanvas: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridContainer: {
    width: 768, // 3 * 256
    height: 768,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tileImg: {
    width: 256,
    height: 256,
    backgroundColor: '#CBD5E1',
  },
  markerContainer: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    marginTop: -16,
  },
  markerBubble: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 5,
    elevation: 6,
  },
  markerShadow: {
    width: 12,
    height: 4,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.25)',
    marginTop: -4,
  },
  // Stop Markers
  stopMarkerWrapper: {
    position: 'absolute',
    alignItems: 'center',
    zIndex: 15,
  },
  stopBubble: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  stopNumText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontFamily: 'Poppins',
    fontWeight: '800',
  },
  stopPointer: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    marginTop: -1,
  },
  stopShadow: {
    width: 10,
    height: 3,
    borderRadius: 5,
    backgroundColor: 'rgba(0,0,0,0.2)',
    marginTop: 1,
  },
  // Route Badge Overlay (top center)
  routeBadgeOverlay: {
    position: 'absolute',
    top: 10,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    zIndex: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  demoBadgeOverlay: {
    backgroundColor: '#FEF3C7',
    borderColor: '#FCD34D',
  },
  demoBadgeText: {
    color: '#92400E',
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  optimizedBadgeOverlay: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
  },
  optimizedBadgeText: {
    color: '#065F46',
    fontSize: 10,
    fontFamily: 'Poppins',
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  coordChip: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    zIndex: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  coordText: {
    fontSize: 10,
    fontWeight: '700',
    color: colors.primary,
    fontFamily: 'Poppins',
  },
  attributionBar: {
    position: 'absolute',
    bottom: 4,
    right: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    zIndex: 5,
  },
  attributionText: {
    fontSize: 8,
    color: '#475569',
    fontWeight: '500',
  },
});
