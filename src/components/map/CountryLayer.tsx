import { useEffect, useRef } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { useAnimationStore } from '../../store/useAnimationStore';
import countriesDataUrl from '../../assets/data/countries-110m.geojson?url';

interface CountryLayerProps {
  map: MapLibreMap | null;
}

export function CountryLayer({ map }: CountryLayerProps) {
  const currentCountryCode = useAnimationStore(state => state.currentCountryCode);
  const config = useAnimationStore(state => state.config);
  const isLayerAddedRef = useRef(false);

  // Add source and layer
  useEffect(() => {
    if (!map || isLayerAddedRef.current) return;

    if (!map.getSource('countries')) {
      map.addSource('countries', {
        type: 'geojson',
        data: countriesDataUrl,
      });
    }

    if (!map.getLayer('country-highlight')) {
      map.addLayer({
        id: 'country-highlight',
        type: 'fill',
        source: 'countries',
        paint: {
          'fill-color': config?.highlightColor ?? '#0ea5e9',
          'fill-opacity': 0,
        },
      });
    }

    isLayerAddedRef.current = true;
  }, [map, config?.highlightColor]);

  // Update highlight color and opacity
  useEffect(() => {
    if (!map || !isLayerAddedRef.current || !map.getLayer('country-highlight')) return;

    map.setPaintProperty('country-highlight', 'fill-color', config?.highlightColor ?? '#0ea5e9');

    map.setPaintProperty('country-highlight', 'fill-opacity', [
      'case',
      ['==', ['get', 'ISO_A2'], currentCountryCode || ''],
      config?.highlightOpacity ?? 0.4,
      0
    ]);
  }, [map, currentCountryCode, config?.highlightColor, config?.highlightOpacity]);

  return null;
}
