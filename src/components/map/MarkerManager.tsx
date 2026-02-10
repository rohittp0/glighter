import { useEffect, useRef } from 'react';
import maplibregl, { Map as MapLibreMap, Marker as MapLibreMarker } from 'maplibre-gl';
import { useMarkerStore } from '../../store/useMarkerStore';

interface MarkerManagerProps {
  map: MapLibreMap | null;
}

export function MarkerManager({ map }: MarkerManagerProps) {
  const markers = useMarkerStore(state => state.markers);
  const updateMarkerPosition = useMarkerStore(state => state.updateMarkerPosition);
  const markerInstancesRef = useRef(new Map<string, MapLibreMarker>());

  useEffect(() => {
    if (!map) return;

    // Remove deleted markers
    markerInstancesRef.current.forEach((instance, id) => {
      if (!markers.find(m => m.id === id)) {
        instance.remove();
        markerInstancesRef.current.delete(id);
      }
    });

    // Add/update markers
    markers.forEach((marker) => {
      let instance = markerInstancesRef.current.get(marker.id);

      if (!instance) {
        // Create marker element
        const el = document.createElement('div');
        el.className = 'custom-marker';
        el.textContent = marker.order.toString();
        el.style.cssText = `
          width: 42px;
          height: 42px;
          border-radius: 50%;
          background: linear-gradient(145deg, #1d4ed8, #06b6d4);
          border: 2px solid rgba(255,255,255,0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 15px;
          color: white;
          cursor: grab;
          box-shadow: 0 8px 18px rgba(9,50,114,0.42);
        `;

        instance = new maplibregl.Marker({
          element: el,
          draggable: true
        })
          .setLngLat(marker.position)
          .addTo(map);

        instance.on('dragend', () => {
          const lngLat = instance!.getLngLat();
          updateMarkerPosition(marker.id, [lngLat.lng, lngLat.lat]);
        });

        markerInstancesRef.current.set(marker.id, instance);
      } else {
        const markerElement = instance.getElement();
        markerElement.textContent = marker.order.toString();

        // Update position if changed
        const current = instance.getLngLat();
        if (current.lng !== marker.position[0] || current.lat !== marker.position[1]) {
          instance.setLngLat(marker.position);
        }
      }
    });
  }, [map, markers, updateMarkerPosition]);

  return null;
}
