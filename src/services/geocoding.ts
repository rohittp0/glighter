import { getApiKey } from './maptiler';

interface GeocodingResult {
  countryCode: string;
  countryName: string;
}

interface MapTilerFeature {
  place_type?: string[];
  properties?: {
    short_code?: string;
  };
  text?: string;
}

interface MapTilerResponse {
  features?: MapTilerFeature[];
}

export async function reverseGeocode(
  lng: number,
  lat: number
): Promise<GeocodingResult | null> {
  const apiKey = getApiKey();
  const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json() as MapTilerResponse;

    // Find country feature
    const countryFeature = data.features?.find(
      (feature) => feature.place_type?.includes('country')
    );

    if (!countryFeature) return null;

    return {
      countryCode: countryFeature.properties?.short_code?.toUpperCase() || '',
      countryName: countryFeature.text || '',
    };
  } catch (error) {
    console.error('Geocoding failed:', error);
    return null;
  }
}
