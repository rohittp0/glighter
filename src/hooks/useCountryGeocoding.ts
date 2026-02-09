import { useEffect, useState } from 'react';
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import { point } from '@turf/helpers';
import { useMarkerStore } from '../store/useMarkerStore';
import countriesDataUrl from '../assets/data/countries-110m.geojson?url';

interface CountryFeature {
  type: 'Feature';
  properties: {
    ISO_A2: string;
    NAME: string;
    ADMIN: string;
  };
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  } | {
    type: 'MultiPolygon';
    coordinates: number[][][][];
  };
}

interface GeoJSONFeatureCollection {
  type: 'FeatureCollection';
  features: CountryFeature[];
}

// Cache the loaded GeoJSON data
let countriesDataCache: GeoJSONFeatureCollection | null = null;

/**
 * Load the countries GeoJSON data (cached after first load)
 */
async function loadCountriesData(): Promise<GeoJSONFeatureCollection> {
  if (countriesDataCache) {
    return countriesDataCache;
  }

  const response = await fetch(countriesDataUrl);
  const data = await response.json();
  countriesDataCache = data as GeoJSONFeatureCollection;
  return countriesDataCache;
}

/**
 * Find which country contains the given coordinates using point-in-polygon check
 */
function findCountryForPoint(
  lng: number,
  lat: number,
  countriesData: GeoJSONFeatureCollection
): { code: string; name: string } | null {
  const pt = point([lng, lat]);

  if (!countriesData.features || !Array.isArray(countriesData.features)) {
    console.error('Invalid GeoJSON data structure');
    return null;
  }

  for (const feature of countriesData.features) {
    try {
      if (booleanPointInPolygon(pt, feature)) {
        const code = feature.properties.ISO_A2;
        const name = feature.properties.NAME || feature.properties.ADMIN;

        // Skip invalid codes (some territories have -99 or empty codes)
        if (code && code !== '-99' && code.length === 2) {
          return { code, name };
        }
      }
    } catch (error) {
      // Skip features with invalid geometries
      console.warn('Error checking country polygon:', error);
    }
  }

  return null; // Point is not in any country (e.g., ocean)
}

export function useCountryGeocoding() {
  const markers = useMarkerStore(state => state.markers);
  const updateMarkerCountry = useMarkerStore(state => state.updateMarkerCountry);
  const [countriesData, setCountriesData] = useState<GeoJSONFeatureCollection | null>(null);

  // Load countries data on mount
  useEffect(() => {
    loadCountriesData().then(setCountriesData).catch(console.error);
  }, []);

  // Geocode markers when data is ready
  useEffect(() => {
    if (!countriesData) return;

    markers.forEach((marker) => {
      // Skip if already geocoded
      if (marker.countryCode) return;

      // Perform point-in-polygon check
      const country = findCountryForPoint(marker.position[0], marker.position[1], countriesData);

      if (country) {
        updateMarkerCountry(marker.id, country.code, country.name);
        console.log(`Geocoded marker ${marker.order}: ${country.name} (${country.code})`);
      } else {
        console.log(`Marker ${marker.order} is not in any country (likely ocean)`);
      }
    });
  }, [markers, updateMarkerCountry, countriesData]);
}
