import type { Marker } from '../types/marker.types';
import type { AnimationWaypoint, AnimationConfig } from '../types/animation.types';

export function calculateOppositePosition(position: [number, number]): [number, number] {
  const [lng, lat] = position;
  const oppositeLng = lng > 0 ? lng - 180 : lng + 180;
  const oppositeLat = -lat;
  return [
    ((oppositeLng + 180) % 360) - 180,
    Math.max(-85, Math.min(85, oppositeLat))
  ];
}

export function calculateBounds(positions: [number, number][]): {
  center: [number, number];
  zoom: number;
} {
  if (positions.length === 0) return { center: [0, 0], zoom: 2 };

  const lngs = positions.map(p => p[0]);
  const lats = positions.map(p => p[1]);

  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);

  const center: [number, number] = [
    (minLng + maxLng) / 2,
    (minLat + maxLat) / 2,
  ];

  // Calculate zoom based on bounds (simplified)
  const latDiff = maxLat - minLat;
  const lngDiff = maxLng - minLng;
  const maxDiff = Math.max(latDiff, lngDiff);
  const zoom = Math.max(1, Math.min(10, 8 - Math.log2(maxDiff)));

  return { center, zoom };
}

export function generateAnimationConfig(markers: Marker[]): AnimationConfig {
  if (markers.length === 0) {
    return {
      waypoints: [],
      highlightColor: '#FF6B35',
      highlightOpacity: 0.4,
    };
  }

  const waypoints: AnimationWaypoint[] = [];

  // Starting position (opposite from first marker)
  const startPosition = calculateOppositePosition(markers[0].position);
  waypoints.push({
    center: startPosition,
    zoom: 2,
    bearing: 0,
    pitch: 0,
    duration: 0,
  });

  // Waypoint for each marker
  markers.forEach((marker) => {
    waypoints.push({
      center: marker.position,
      zoom: 5,
      bearing: 0,
      pitch: 30,
      duration: 2000,
      countryCode: marker.countryCode,
    });
  });

  // Final zoom-out
  const bounds = calculateBounds(markers.map(m => m.position));
  waypoints.push({
    center: bounds.center,
    zoom: bounds.zoom,
    bearing: 0,
    pitch: 0,
    duration: 3000,
  });

  return {
    waypoints,
    highlightColor: '#FF6B35',
    highlightOpacity: 0.4,
  };
}
