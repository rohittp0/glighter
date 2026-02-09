import { getApiKey } from './maptiler';

interface GeocodingResult {
  countryCode: string;
  countryName: string;
}

export async function reverseGeocode(
  lng: number,
  lat: number
): Promise<GeocodingResult | null> {
  const apiKey = getApiKey();
  const url = `https://api.maptiler.com/geocoding/${lng},${lat}.json?key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Find country feature
    const countryFeature = data.features?.find(
      (f: any) => f.place_type?.includes('country')
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
