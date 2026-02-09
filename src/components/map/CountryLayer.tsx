import { useEffect, useState } from 'react';
import type { Map as MapLibreMap } from 'maplibre-gl';
import { useAnimationStore } from '../../store/useAnimationStore';
import countriesDataUrl from '../../assets/data/countries-110m.geojson?url';

interface CountryLayerProps {
  map: MapLibreMap | null;
}

export function CountryLayer({ map }: CountryLayerProps) {
  const currentCountryCode = useAnimationStore(state => state.currentCountryCode);
  const [isLayerAdded, setIsLayerAdded] = useState(false);

  // Add source and layer
  useEffect(() => {
    if (!map || isLayerAdded) return;

    map.addSource('countries', {
      type: 'geojson',
      data: countriesDataUrl,
    });

    map.addLayer({
      id: 'country-highlight',
      type: 'fill',
      source: 'countries',
      paint: {
        'fill-color': '#FF6B35',
        'fill-opacity': 0,
      },
    });

    setIsLayerAdded(true);
  }, [map, isLayerAdded]);

  // Update highlight
  useEffect(() => {
    if (!map || !isLayerAdded) return;

    map.setPaintProperty('country-highlight', 'fill-opacity', [
      'case',
      ['==', ['get', 'ISO_A2'], currentCountryCode || ''],
      0.4,
      0
    ]);
  }, [map, currentCountryCode, isLayerAdded]);

  return null;
}
